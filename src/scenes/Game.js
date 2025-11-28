export default class Game extends Phaser.Scene {
    constructor() {
        super('game')
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg')
            .setOrigin(0)
            .setScrollFactor(0)

        const tex = this.textures.get('bg').getSourceImage()
        this.bg.tileScaleX = this.scale.width / tex.width
        this.bg.tileScaleY = this.scale.height / tex.height

        this.scale.on('resize', (size) => {
            if (!size) return

            this.bg.setSize(size.width, size.height)

            const tex = this.textures.get('bg').getSourceImage()
            this.bg.tileScaleX = size.width / tex.width
            this.bg.tileScaleY = size.height / tex.height
        })

        // player
        this.player = this.physics.add.sprite(200, 300, 'player_run')
        this.player.setScale(1)
        this.player.setCollideWorldBounds(true)
        this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.6)
        this.player.body.setOffset(
            (this.player.width - this.player.body.width) / 2,
            (this.player.height - this.player.body.height) / 2
        )

        this.createAnimations()
        this.cursors = this.input.keyboard.createCursorKeys()

        // walls
        this.topWall = this.add.rectangle(450, 150, 900, 20)
        this.bottomWall = this.add.rectangle(450, 700, 900, 20)
        this.physics.add.existing(this.topWall, true)
        this.physics.add.existing(this.bottomWall, true)
        this.physics.add.collider(this.player, this.topWall)
        this.physics.add.collider(this.player, this.bottomWall)

        // obstacles
        this.obstacles = this.physics.add.group()
        this.groundSpeed = 2

        this.time.addEvent({
            delay: 1400,
            loop: true,
            callback: () => this.spawnObstacle()
        })

        this.physics.add.collider(this.player, this.obstacles, () => this.gameOver())

        // score system
        this.score = 0
        this.distance = 0
        this.timeElapsed = 0

        // send time to UI every second
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeElapsed++
                this.events.emit("ui:update-time", this.timeElapsed)
            }
        })

        // auto speed increase
        this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                this.groundSpeed += 1
            }
        })
    }

    update() {
        const speed = this.groundSpeed * this.bg.tileScaleX
        this.bg.tilePositionX += speed

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
            obj.x -= speed
            if (obj.x < -200) obj.destroy()
        })


    }

    spawnObstacle() {
        const types = ['tree', 'rock']
        const type = Phaser.Math.RND.pick(types)
        const y = Phaser.Math.Between(220, 640)

        const startX = this.scale.width + 100

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
        this.scene.start('gameover', {
            score: this.score,
            distance: this.distance,
            time: this.timeElapsed
        })
    }
}
