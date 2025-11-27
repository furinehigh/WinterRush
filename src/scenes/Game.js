export default class Game extends Phaser.Scene {
    constructor(){super('game')}

    create(){
        this.bg = this.add.tileSprite(450,250,900,500, 'bg')

        this.player = this.physics.add.sprite(200, 300, 'player')
        this.player.setCollideWorldBounds(true)

        this.createAnimations()

        this.cursor = this.input.keyboard.createCursorKeys()

        this.obstacles = this.physics.add.group()

        this.time.addEvent({
            delay: 200, loop: true,
            callback: () => this.spawnObstacle()
        })

        this.physics.add.collider(this.player, this.obstacles, () => this.gameOver())
    }

    update(){
        this.bg.tilePositionY -= 3 // fake movement

        if (this.cursor.left.isDown) this.player.setVelocityX(-200)
        else if(this.cursor.right.isDown) this.player.setVelocityX(200)
        else this.player.setVelocityX(0)

        if (this.cursor.up.isDown && this.player.body.onFloor()){
            this.player.setVelocityY(-450)
            this.player.play('jump', true)
        }

        if (this.cursor.down.isDown) {
            this.player.play('slide', true)
            this.player.setScale(0.8)
        } else {
            this.player.setScale(1)
        }
    }

    spawnObstacle() {
        const types = ['tree', 'rock']
        const x = Phaser.Math.Between(100, 800)
        const type = types[Math.floor(Math.random()*types.length)]

        let obj = this.obstacles.create(x, -50, type)
        obj.setVelocityY(300)
        obj.setImmovable(true)
    }

    createAnimations(){
        this.anims.create({key: 'jumps', frames: this.anims.generateFrameNumbers('player', {start: 3, end: 5}), frameRate: 10})
        this.anims.create({key: 'slide', frames: [{key: 'player', frame: 6}], frameRate: 10})
    }

    gameOver(){
        this.scene.restart()
    }
}