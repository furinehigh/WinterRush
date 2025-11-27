import Preload from './scenes/Preload.js'
import Game from './scenes/Game.js'
import UI from './scenes/UI.js'

const config = {
    type: Phaser.AUTO,
    window: 900,
    height: 500,
    physics: {default: 'arcade', arcade: {gravity: {y: 1000}, degub: false}},
    scene: [Preload, Game, UI]
}

new Phaser.Game(config)