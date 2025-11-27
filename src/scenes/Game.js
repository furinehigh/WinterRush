export default class Game extends Phaser.Scene {
    constructor() { super('game') }

    create() {
        this.bg = this.add.tileSprite(450, 250, 900, 500, 'bg')

        this.player = this.physics.add.sprite(200, 300, 'player_run')
        this.player.setScale(1)
        this.player.setCollideWorldBounds(true)

        this.createAnimations()
        this.cursors = this.input.keyboard.createCursorKeys()

        this.topWall = this.add.rectangle(450, 10, 900, 20)
        this.bottomWall = this.add.rectangle(450, 480, 900, 20)
        this.physics.add.existing(this.topWall, true)
        this.physics.add.existing(this.bottomWall, true)
        this.physics.add.collider(this.player, this.topWall)
        this.physics.add.collider(this.player, this.bottomWall)
        
        this.obstacles = this.physics.add.group()

        this.obstacleSpeed = 250
        
        this.time.addEvent({
            delay: 1400, loop: true,
            callback: () => this.spawnObstacle()
        })

        this.physics.add.collider(this.player, this.obstacles, () => this.gameOver())

        this.score = 0
        this.distance = 0
        this.timeElapsed = 0
        
        this.scoreText = this.add.text(20, 20, "Score: 0", {font: '20px Arial', fill: '#fff'}).setDepth(999)

        this.distText = this.add.text(20, 48, "Distance: 0m", {font: '18px Arial', fill: '#fff'}).setDepth(999)

        this.timeText = this.add.text(780, 20, 'Time: 0s', {font: '18px Arial', fill: '#fff'}).setDepth(999)

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeElapsed++
                this.timeText.setText("Time: " + this.timeElapsed + 's')
            }
        })

        this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                this.obstacleSpeed += 40
            }
        })
    }

    update() {
        this.bg.titlePositionX += 2

        if (this.cursors.up.isDown) this.player.setVelocityY(-260)
        else if (this.cursors.down.isDown) this.player.setVelocityY(260)
        else this.player.setVelocityY(0)

        // slide
        if (this.cursor.down.isDown) {
            this.player.play('slide', true)
        } else if (!this.player.body.blocked.down) {
            this.player.play('jump', true)
        } else {
            this.player.play('run', true)
        }

        this.score++
        this.distance += 0.5

        this.scoreText.setText('Score: ' + this.score)
        this.distText.setText('Distance: ' + Math.floor(this.distance) + 'm')
    }

    spawnObstacle() {
        const types = ['tree', 'rock']
        const type = types[Math.floor(Math.random() * types.length)]
        const y = Phaser.Math.Between(120, 420)

        let obj = this.obstacles.create(980, y, type)
        obj.setVelocityX(-280)
        obj.setImmovable(true)
        obj.body.allowGravity = false

        obj.setScale(0.6)

        this.time.delayedCall(6000, ()=>obj.destroy())
    }

    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({ key: 'jumps', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 3 }), frameRate: 10 })
        this.anims.create({ key: 'slide', frames: this.anims.generateFrameNumbers('player_slide', { start: 0, end: 1 }), frameRate: 10 })
    }

    gameOver() {
        this.scene.restart()
    }
}