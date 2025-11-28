export default class GameOverScene extends Phaser.Scene {
    constructor() {super('gameover')}

    init(data){
        this.score = data.score
        this.distance = data.distance
        this.timeElapsed = data.time
        this.bgOffset = data.bgOffset || 0
    }

    create() {
        const {width, height} = this.scale

        this.bg = this.add.tileSprite(0,0,width, height, 'bg')
            .setOrigin(0)

        const tex = this.textures.get('bg').getSourceImage()
        this.bg.tileScaleX = width / tex.width
        this.bg.tileScaleY = height / tex.height

        this.bg.tilePositionX = this.bgOffset
        
        this.saveHistory()

        const top = parseInt(localStorage.getItem('top_score') || 0)

        if (this.score > top) {
            localStorage.setItem('top_score', this.score)
        }

        this.add.text(width / 2, 120, 'Game Over', {
            font: '50px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5)

        this.add.text(width/2, 200, `Score: ${this.score}`, {
            font: '30px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5)

        this.add.text(width / 2, 240, `Distance: ${Math.floor(this.distance)}m`, {
            font: '26px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5)

        this.add.text(width/2, 280, `Time: ${this.timeElapsed}s`, {
            font: '26px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5)

        const restartBtn = this.add.text(width / 2, 350, 'Play Again', {
            font: '32px SnowtopCaps',
            fill: '#00f',
            backgroundColor: '#fff',
            padding: 10
        }).setOrigin(0.5).setInteractive({useHandCrusor: true})

        const homeBtn = this.add.text(width/2, 420, 'Menu', {
            font: '28px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive()

        homeBtn.on('pointerdown', () => this.scene.start('start'))
    }

    saveHistory(){
        let list = JSON.parse(localStorage.getItem('history') || '[]')

        list.unshift({
            score: this.score,
            distance: Math.floor(this.distance),
            time: this.timeElapsed,
            date: new Date().toLocaleString()
        })

        if (list.lenght > 10) list.lenght = 10

        localStorage.setItem('history', JSON.stringify(list))
    }
}