export default class Game extends Phaser.Scene {
    constructor() {
        super('game')
    }

    create() {
        
    }

    update() {
        this.bg1.x -= this.groundSpeed
        this.bg2.x -= this.groundSpeed

        // wrap around
        if (this.bg1.x + this.bg1.displayWidth <= 0) {
            this.bg1.x = this.bg2.x + this.bg2.displayWidth
        }
        if (this.bg2.x + this.bg2.displayWidth <= 0) {
            this.bg2.x = this.bg1.x + this.bg1.displayWidth
        }

        if (this.cursors.up.isDown) this.player.setVelocityY(-260)
        else if (this.cursors.down.isDown) this.player.setVelocityY(260)
        else this.player.setVelocityY(0)

        if (this.cursors.down.isDown) {
            this.player.play('slide', true)
        } else if (!this.player.body.blocked.down) {
            this.player.play('jump', true)
        } else {
            this.player.play('run', true)
        }

        // update score & distance
        this.score++
        this.distance += 0.5

        // emit updates to UI
        this.events.emit("ui:update-score", this.score)
        this.events.emit("ui:update-distance", Math.floor(this.distance))


        this.obstacles.getChildren().forEach(obj => {
            obj.x -= this.groundSpeed
            if (obj.x < -200) obj.destroy()
        })


    }

    spawnObstacle() {
        const types = ['tree', 'rock']
        const type = Phaser.Math.RND.pick(types)
        const y = Phaser.Math.Between(380, 680)

        const startX = this.scale.width + 50

        const obj = this.obstacles.create(startX, y, type)

        obj.body.allowGravity = false

        // the important part: not rigid, no pushback
        obj.body.moves = false

        obj.setScale(0.6)
    }



    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 3 }),
            frameRate: 10
        })

        this.anims.create({
            key: 'slide',
            frames: this.anims.generateFrameNumbers('player_slide', { start: 0, end: 1 }),
            frameRate: 10
        })
    }

    gameOver() {
        this.physics.world.colliders.destroy()

        const offset = this.bg?.tilePositionX || 0
        this.scene.start('gameover', {
            score: this.score,
            distance: this.distance,
            time: this.timeElapsed,
            bgOffset: offset
        })
    }
}
