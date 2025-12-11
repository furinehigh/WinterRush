export default class UI extends Phaser.Scene {
    constructor() { super('ui') }

    create() {
        this.scoreText = this.add.text(20, 20, '0', {
            fontFamily: 'SnowtopCaps, Arial',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 4
        })

        this.scoreText.y = -50

        this.tweens.add({
            targets: this.scoreText,
            y: 20,
            duration: 500,
            ease: 'Back.easeOut'
        })

        const game = this.scene.get('game')

        game.events.on('updateScore', (score) => {
            this.scoreText.setText(score)

            this.tweens.add({
                targets: this.scoreText,
                scale: 1.2,
                duration: 100, 
                yoyo: true
            })
        })
    }


}
