export default class Preload extends Phaser.Scene {
    constructor() { super('preload') }

    preload() {
        // background
        this.load.setPath('assets/')

        this.load.image('bg_sky', 'bg/bg_sky.webp')
        this.load.image('ground', 'bg/ground_texture.jpg')

        this.load.spritesheet('player_ski', 'player/player_ski.png', {
            frameWidth: 200, frameHeight: 250
        })

        this.load.image('player_jump', 'player/player_jump.png')
        this.load.image('player_duck', 'player/player_duck.png')

        this.load.spritesheet('tree', 'obstacles/tree_shake.png', {
            frameWidth: 264, frameHeight: 350
        })
        this.load.image('rock', 'obstacles/rock.png')
        this.load.image('log', 'obstacles/log_horizontal.png')

        this.load.audio('bgm', 'audio/music_loop.mp3')
        this.load.audio('sfx_jump', 'audio/jump.mp3')
        this.load.audio('sfx_slide', 'audio/slide.mp3')
        this.load.audio('sfx_crash', 'audio/crash.mp3')

        const width = this.cameras.main.width
        const height = this.cameras.main.height
        const progressBar = this.add.graphics()
        const progressBox = this.add.graphics()

        progressBar.fillStyle(0x222222, 0.8)
        progressBox.fillRect(width/2 - 160, height/2, 320, 50)

        this.load.on('progress', (value) => {
            progressBar.clear()
            progressBar.fillStyle(0x00ffff)
            progressBar.fillRect(width/2 - 150, height/2 + 10, 300 * value, 30)
        })

        this.load.on('complete', () => {
            progressBar.destroy()
            progressBox.destroy()
            this.scene.start('start')
        })
    }

    create() {
        document.fonts.ready.then(() => {
            this.scene.start('start')
        })
    }
}
