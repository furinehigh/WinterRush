export default class UI extends Phaser.Scene {
    constructor(){super('ui')}

    create(){
        this.score = 0 
        this.distance = 0 
        this.timeElapsed = 0
        this.paused = false
        this.muted = false

        const {width} = this.scale

        this.scoreText = this.add.text(10, 10, `Score: 0`, {font: `20px Arial`, fill: `#fff`}).setDepth(1000)
        this.distText = this.add.text(10, 34, `Distance: 0m`, {font: `20px Arial`, fill: '#fff'}).setDepth(1000)
        this.timeText = this.add.text(width - 150, 10, `Time: 0s`, {font: '18px Arial', fill: '#fff'}).setDepth(1000)

        this.pauseBtn = this.add.text(width - 150, 36, 'Pause', {font: '16px Arial', backgroundColor: '#222', padding: 6})
            .setInterective()

    }
}