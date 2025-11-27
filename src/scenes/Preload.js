export default class Preload extends Phaser.Scene {
    constructor(){ super('preload') }
    preload(){
        this.load.image('bg', '/assets/bg/snow_mountain.png')
        this.load.spritesheet('player', '/assets/player/skater.png', {frameWidth: 64, frameHeight: 64})
        this.load.image('tree', '/assets/obstacles/tree.png')
        this.load.image('rock', '/assets/obstacles/rock.png')
    }

    create(){
        this.scene.start("game")
    }
}