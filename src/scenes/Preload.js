export default class Preload extends Phaser.Scene {
    constructor(){ super('preload') }
    preload(){
        this.load.image('bg', '/assets/bg/bg_still.png')
        this.load.spritesheet('player_run', '/assets/player/player.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('player_jump', '/assets/player/player_jump.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('player_slide', '/assets/player/player_slide.png', {frameWidth: 64, frameHeight: 64})
        this.load.image('rock', '/assets/obstacles/rock.png')
        this.load.image('tree', '/assets/obstacles/tree.png')
    }

    create(){
        this.scene.start("game")
    }
}