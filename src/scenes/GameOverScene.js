export default class GameOverScene extends Phaser.Scene {
    constructor() {super('gameover')}

    init(data){
        this.score = data.score
        
    }

    create() {
        const {width, height} = this.scale

        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.7)

        this.add.text(width/2, height * 0.3, 'WIPEOUT!', {
            fontFamily: 'SnowtopCaps', fontSize: '64px', color: '#ff4444'
        }).setOrigin(0.5)

        this.add.text(width/2, height * 0.45, `Score: ${this.score}`, {
            fontSize: '40px', color: '#fff'
        }).setOrigin(0.5)

        const restartBtn = this.add.text(width/2, height * 0.6, "TRY AGAIN", {
            fontSize: '32px', color: '#bfefff', backgroundColor: '#333', padding: 15
        }).setOrigin(0.5).setInteractive({useHandCursor: true})

        restartBtn.on('pointerdown', () => this.scene.start('game'))
    }

    
}