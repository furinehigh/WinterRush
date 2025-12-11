import Preload from './scenes/Preload.js'
import StartScene from './scenes/StartScene.js'
import GameScene from './scenes/GameScene.js'
import GameOverScene from './scenes/GameOverScene.js'
import HistoryScene from './scenes/HistoryScene.js'
import UIScene from './scenes/UIScene.js'

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280
    },
    physics: { default: 'arcade', arcade: { debug: false }},
    scene: [Preload, StartScene, GameScene, UIScene, GameOverScene]
}

new Phaser.Game(config)