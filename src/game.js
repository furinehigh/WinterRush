import Preload from './scenes/Preload.js'
import Game from './scenes/Game.js'
import UI from './scenes/UI.js'
import StartScene from './scenes/StartScene.js'
import GameOverScene from './scenes/GameOverScene.js'
import HIstoryScene from './scenes/HistoryScene.js'

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    physics: {default: 'arcade', arcade: {debug: false}},
    scene: [StartScene, Preload, Game, GameOverScene, HIstoryScene, UI]
}

new Phaser.Game(config)