export default class Game extends Phaser.Scene {
    constructor() {
        super('game')
    }

    create() {
        this.cw = this.scale.width
        this.ch = this.scale.height

        this.sfxJump = this.sound.add('sfx_jump')
        this.sfxSlide = this.sound.add('sfx_slide')
        this.sfxCrash = this.sound.add('sfx_crash')

        this.add.image(this.cw /2 , 0, 'bg_sky').setOrigin(0.5, 0).setDisplaySize(this.cw, this.ch)

        this.ground = this.add.tileSprite(this.cw/2, this.ch, this.cw, this.ch, 'ground')

        this.ground.setOrigin(0.5, 1)

        this.playerY = this.ch * 0.8
        this.player = this.physics.add.sprite(this.cw / 2, this.playerY, 'player_ski')

        this.player.setDepth(1000)

        this.player.setColliderWorldBounds(true)

        this.player.body.setSize(40, 40)

        this.player.body.setOffset(44, 80)

        this.anims.create({key: 'ski', frames: this.anims.generateFrameNumbers('player_ski'), frameRate: 8, repeat: -1})
        this.anims.create({key: 'tree_sway', frames: this.anims.generateFrameNumbers('tree'), frameRate: 4, repeat: -1})

        this.player.play('ski')


        this.speed = 10

        this.score = 0
        this.isJumping = false
        this.isDucking = false
        this.gameOverFlag = false

        this.cursors = this.input.keyboard.createCursorKeys()

        this.obstacleGroup = this.add.group()

        this.time.addEvent({delay: 1200, callback: this.spawnObstacle, callbackScope: this, loop: true})

        this.time.addEvent({delay: 5000, callback: () => {this.speed += 2}, loop: true})

        this.scene.launch('ui')
    }

    update() {
        if (this.gameOverFlag) return;

        this.ground.tilePositionY -= this.speed

        const moveSpeed = 400

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-moveSpeed)
            this.player.setFlipX(true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(moveSpeed)
            this.player.setFlipX(false)
        } else {
            this.player.setVelocityX(0)
            this.player.setDragX(1000)
        }


        if (this.cursors.up.isDown && !this.isJumping && !this.isDucking){
            this.jump()
        } else if (this.cursors.down.isDown && !this.isJumping && !this.isDucking) {
            this.duck()
        }

        const horizonY = this.ch * 0.3
        const endY = this.ch + 100

        this.obstacleGroup.getChildren().forEach(obs => {
            obs.zProgress += (this.speed * 0.0005)

            const scale = Math.pow(obs.zProgress, 3)

            obs.setScale(scale)

            obs.x = (this.cw / 2) + (obs.laneOffset * scale * this.cw)

            obs.y = horizonY + (obs.zProgress * (this.ch - horizonY))

            obs.setDepth(obs.y)

            if (obs.zProgress > 0.85 && obs.zProgress < 1.1) {
                if (Math.abs(obs.x - this.player.x) < 50 * scale) {
                    this.checkCollisionType(obs)
                }
            }

            if (obs.zProgress > 1.2) {
                obs.destroy()

                this.score += 10
                
                this.events.emit('updateScore', this.score)
            }
        })

    }

    spawnObstacle() {
        if (this.gameOverFlag) return;

        const lane = Phaser.Math.RND.pick([-0.6, -0.3, 0, 0.3, 0.6])

        const types = ['tree', 'rock', 'log']

        const type = Phaser.Math.RND.pick(types)

        const obs = this.add.sprite(this.cw / 2, 0, type)

        this.physics.add.existing(obs, true)

        obs.type = type
        obs.laneOffset = lane

        obs.zProgress = 0.01
        obs.setScale(0)

        if (type === 'tree') obs.play('tree_sway')

        this.obstacleGroup.add(obs)
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
                this.player.y = this.playerY;
            }
        })
    }


    duck() {
        this.isDucking = true
        this.sfxSlide.play()

        this.player.setTexture('player_duck')

        this.time.delayedCall(800, () => {
            this.isDucking = false
            this.player.setTexture("player_ski")

        })
    }

    checkCollisionType(obs) {
        let hit = false

        if (obs.type === 'tree') {
            hit = true
        } else if (obs.type == 'rock'){
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

            this.scene.start('gamevoer', {score: this.score})
        })
    }


}
