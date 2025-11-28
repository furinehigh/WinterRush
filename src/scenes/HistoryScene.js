export default class HistoryScene extends Phaser.Scene {
    constructor() {super('history')}

    create(){
        const {width} = this.scale

        this.add.text(width / 2, 80, 'History', {
            font: '40px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5)

        const list = JSON.parse(localStorage.getItem('history' || '[]'))

        let yStart = 150

        list.forEach((item, i) => {
            this.add.text(40, yStart + i * 40, `${i+1}, Score: ${item.score} | Dist: ${item.distance}m | Time: ${item.time}s | ${item.date}`),
            {
                font: '20px SnowtopCaps',
                fill: '#ddd'
            }
        })

        const backBtn = this.add.text(width / 2, 450, 'Back', {
            font: '28px SnowtopCaps',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive()

        backBtn.on('pointerdown', () => this.scene.start('start'))
    }
}