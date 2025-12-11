export default class StartScene extends Phaser.Scene {
    constructor() { super('start') }

    create() {
        const { width, height } = this.scale

        this.add.image(width /2, height/2, 'bg_sky').setDisplaySize(width, height)
        

        const title = this.add.text(width/2, height * 0.3, "WINTER\nRUSH", {
            fontFamily: 'SnowtopCaps', fontSize: '80px',
            align: 'center', color: '#bfefff', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5)

        this.tweens.add({
            targets: title,
            y: title.y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })


        const playBtn = this.add.container(width/2, height * 0.6)

        const btnBg = this.add.rectangle(0, 0, 200, 80, 0xffffff).setInteractive({useHandCursor: true})

        const btnText = this.add.text(0, 0, "PLAY", {
            fontSize: '40px', color: '#000', fontFamily: 'SnowtopCaps'
        }).setOrigin(0.5)

        playBtn.add([btnBg, btnText])

        btnBg.on('pointerover', () => {
            playBtn.setScale(1.1)
        })
        btnBg.on('pointerout', () => {
            playBtn.setScale(1.0)
        })
        btnBg.on('pointerdown', () => {
            this.scene.start('game')
        })
    }
}
