export default class Preload extends Phaser.Scene {
    constructor() { super('preload') }

    preload() {
        // background
        this.load.image('bg', 'assets/bg/bg_still.jpg')

        this.load.spritesheet('player_run', 'assets/player/player.png', {
            frameWidth: 50,
            frameHeight: 64
        })

        this.load.spritesheet('player_jump', 'assets/player/player_jump.png', {
            frameWidth: 50,
            frameHeight: 64
        })

        this.load.spritesheet('player_slide', 'assets/player/player_slide.png', {
            frameWidth: 50,
            frameHeight: 64
        })

        // obstacles
        this.load.image('tree', 'assets/obstacles/tree.png')
        this.load.image('rock', 'assets/obstacles/rock.png')
    }

    create() {
        document.fonts.ready.then(() => {
            this.scene.start('start')
        })
    }
}
