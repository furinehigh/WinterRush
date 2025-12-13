export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game')
    }

    create() {
        const { width, height } = this.scale
        this.cw = width
        this.ch = height

        // --- 1. Audio ---
        this.sfxJump = this.sound.add('sfx_jump')
        this.sfxSlide = this.sound.add('sfx_slide')
        this.sfxCrash = this.sound.add('sfx_crash')

        // --- 2. The Horizon Line (Where Sky meets Ground) ---
        // Let's say the horizon is 35% down the screen
        this.horizonY = this.ch * 0.35

        // --- 3. Background (The Sky) ---
        // Stays at the top, behind everything
        this.sky = this.add.image(this.cw / 2, 0, 'bg_sky')
            .setOrigin(0.5, 0)
            .setDisplaySize(this.cw, this.horizonY + 10) // +10 overlap to prevent gaps
            .setDepth(0)

        // --- 4. The Ground (The Snowy Slope) ---
        // Starts at the horizon and goes down
        this.ground = this.add.tileSprite(this.cw / 2, this.ch, this.cw, this.ch - this.horizonY, 'ground')
            .setOrigin(0.5, 1) // Anchor at bottom center
            .setDepth(1)

        // --- 5. Groups ---
        // We separate "Obstacles" (things that kill you) from "Scenery" (trees on the side)
        this.obstacleGroup = this.add.group()
        this.sceneryGroup = this.add.group() // For side trees

        // --- 6. Player Setup ---
        this.playerY = this.ch * 0.85 // Player is near the bottom
        this.player = this.physics.add.sprite(this.cw / 2, this.playerY, 'player_ski')
        this.player.setDepth(100) // Ensure player is above ground but below UI
        this.player.setCollideWorldBounds(true)
        
        // Hitbox tuning (Make it smaller so you don't die unfairly)
        this.player.body.setSize(40, 40)
        this.player.body.setOffset(44, 80)

        // Animations
        this.anims.create({ key: 'ski', frames: this.anims.generateFrameNumbers('player_ski'), frameRate: 8, repeat: -1 })
        
        // Safety check for tree animation
        if (this.anims.exists('tree_sway')) {
            // Animation already exists, do nothing
        } else {
            const treeFrames = this.anims.generateFrameNumbers('tree');
            if (treeFrames && treeFrames.length > 0) {
                this.anims.create({ key: 'tree_sway', frames: treeFrames, frameRate: 4, repeat: -1 })
            }
        }

        this.player.play('ski')

        // --- 7. Variables ---
        this.speed = 10
        this.score = 0
        this.distance = 0
        this.isJumping = false
        this.isDucking = false
        this.gameOverFlag = false

        // --- 8. Inputs ---
        this.cursors = this.input.keyboard.createCursorKeys()

        // --- 9. Spawners ---
        // Spawn obstacles (Center lanes)
        this.time.addEvent({ delay: 1200, callback: this.spawnObstacle, callbackScope: this, loop: true })
        
        // Spawn scenery (Far left/right trees) - Faster rate for density
        this.time.addEvent({ delay: 400, callback: this.spawnScenery, callbackScope: this, loop: true })

        // Speed ramp up
        this.time.addEvent({ delay: 5000, callback: () => { this.speed += 1.5 }, loop: true })

        this.scene.launch('ui')
    }

    update() {
        if (this.gameOverFlag) return;

        // --- Scroll the Floor Texture ---
        // This gives the illusion of speed on the surface
        this.ground.tilePositionY -= this.speed

        // --- Player Controls ---
        const moveSpeed = 500
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-moveSpeed)
            this.player.setFlipX(true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(moveSpeed)
            this.player.setFlipX(false)
        } else {
            this.player.setVelocityX(0)
            this.player.setDragX(2000) // Snappy stop
        }

        if (this.cursors.up.isDown && !this.isJumping && !this.isDucking) {
            this.jump()
        } else if (this.cursors.down.isDown && !this.isJumping && !this.isDucking) {
            this.duck()
        }

        // --- Update 3D Objects ---
        this.update3DObject(this.obstacleGroup, true) // True = check collisions
        this.update3DObject(this.sceneryGroup, false) // False = just visual
    }

    /**
     * Generic function to handle 3D scaling and movement for both obstacles and scenery
     */
    update3DObject(group, checkCollision) {
        group.getChildren().forEach(obj => {
            // zProgress: 0 = Horizon, 1 = Player Position (approx), >1 = Behind Camera
            obj.zProgress += (this.speed * 0.0006)

            // --- SCALING LOGIC (Fixed) ---
            // Use a curve that starts slow and speeds up, but cap it.
            // Math.pow(x, 3) creates the "zooming in" effect.
            let rawScale = Math.pow(obj.zProgress, 3)
            
            // CAP THE SCALE: Prevent items from becoming bigger than the screen
            // If the original image is huge, rawScale 1 is huge. 
            // We multiply by 'obj.baseScale' to keep natural size relative.
            const currentScale = Math.min(rawScale * obj.baseScale, 1.5) 
            
            obj.setScale(currentScale)

            // --- POSITIONING LOGIC ---
            // x = Center + (Lane Offset * PerspectiveSpread * ScreenWidth)
            // As scale grows, the spread grows, making things move to the sides.
            obj.x = (this.cw / 2) + (obj.laneOffset * rawScale * this.cw)

            // y = Horizon + (Progress * Height of Slope)
            const slopeHeight = this.ch - this.horizonY
            obj.y = this.horizonY + (obj.zProgress * slopeHeight)

            // --- DEPTH SORTING ---
            // Things closer to the bottom (higher Y) should be drawn on top
            obj.setDepth(Math.floor(obj.y))

            // --- COLLISION ---
            if (checkCollision && obj.zProgress > 0.8 && obj.zProgress < 1.0) {
                // Determine Hit Distance based on current visual size
                const hitDist = 60 * currentScale
                if (Math.abs(obj.x - this.player.x) < hitDist) {
                    this.checkCollisionType(obj)
                }
            }

            // --- CLEANUP ---
            if (obj.zProgress > 1.3) { // Wait until it's fully off screen
                obj.destroy()
                if (checkCollision) {
                    this.score += 10
                    this.events.emit('updateScore', this.score)
                }
            }
        })
    }

    spawnObstacle() {
        if (this.gameOverFlag) return;

        // Playable Lanes: -0.5 (Left), 0 (Center), 0.5 (Right)
        const lane = Phaser.Math.RND.pick([-0.5, 0, 0.5])
        const types = ['tree', 'rock', 'log']
        const type = Phaser.Math.RND.pick(types)

        const obs = this.add.sprite(this.cw / 2, this.horizonY, type)
        
        // Initialize 3D properties
        obs.type = type
        obs.laneOffset = lane 
        obs.zProgress = 0.01 // Start at horizon
        
        // Base scale adjustment: 
        // If your source images are huge, reduce this number.
        // Trees are usually tall, Rocks small.
        if (type === 'tree') obs.baseScale = 0.8
        else if (type === 'rock') obs.baseScale = 0.5
        else obs.baseScale = 0.7

        obs.setScale(0)

        // Animation
        if (type === 'tree' && this.anims.exists('tree_sway')) {
            obs.play('tree_sway')
        }

        this.obstacleGroup.add(obs)
    }

    spawnScenery() {
        if (this.gameOverFlag) return;

        // Scenery Lanes: Way off to the side (-1.2 to -3.0 and 1.2 to 3.0)
        // This creates the "Forest Tunnel" effect
        const side = Phaser.Math.RND.pick([-1, 1]) // Left or Right
        const randomOffset = Phaser.Math.FloatBetween(1.2, 2.5) // How far to the side
        const finalLane = side * randomOffset

        const tree = this.add.sprite(this.cw / 2, this.horizonY, 'tree')
        
        tree.type = 'scenery'
        tree.laneOffset = finalLane
        tree.zProgress = 0.01
        tree.baseScale = Phaser.Math.FloatBetween(0.8, 1.2) // Varied sizes
        tree.setScale(0)
        
        // Darken side trees slightly to make the playable path pop
        tree.setTint(0xdddddd)

        if (this.anims.exists('tree_sway')) tree.play('tree_sway')

        this.sceneryGroup.add(tree)
    }

    jump() {
        this.isJumping = true
        this.sfxJump.play()
        this.player.setTexture('player_jump')

        this.tweens.add({
            targets: this.player,
            y: this.playerY - 150,
            duration: 400,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.isJumping = false
                this.player.setTexture('player_ski')
                this.player.y = this.playerY
            }
        })
    }

    duck() {
        this.isDucking = true
        this.sfxSlide.play()
        this.player.setTexture('player_duck')
        // Move hitbox down visually?
        this.player.y = this.playerY + 20 

        this.time.delayedCall(800, () => {
            this.isDucking = false
            this.player.setTexture("player_ski")
            this.player.y = this.playerY
        })
    }

    checkCollisionType(obs) {
        let hit = false

        if (obs.type === 'tree') {
            hit = true
        } else if (obs.type == 'rock') {
            if (!this.isJumping) hit = true
        } else if (obs.type == 'log') {
            if (!this.isDucking) hit = true
        }

        if (hit) this.doGameOver()
    }

    doGameOver() {
        if (this.gameOverFlag) return;
        this.gameOverFlag = true
        
        this.physics.pause()
        this.sfxCrash.play()
        this.player.setTint(0xff0000)
        this.cameras.main.shake(500, 0.05)

        this.time.delayedCall(1000, () => {
            this.scene.stop('ui')
            this.scene.start('gameover', { score: this.score })
        })
    }
}