import Preload from './scenes/Preload.js'
import StartScene from './scenes/StartScene.js'
import Game from './scenes/Game.js'
import GameOverScene from './scenes/GameOverScene.js'
import HistoryScene from './scenes/HistoryScene.js'
import UI from './scenes/UI.js'

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    physics: { default: 'arcade', arcade: { debug: false }},
    scene: [Preload, StartScene, Game, GameOverScene, HistoryScene, UI]
}

new Phaser.Game(config)