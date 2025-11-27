export default class UI extends Phaser.Scene {
    constructor(){super('ui')}

    create(){
        this.score = 0 
        this.distance = 0 
        this.timeElapsed = 0
        this.paused = false
        this.muted = false

        const {width} = this.scale

        this.scoreText = this.add.text(10, 10, `Score: 0`, {font: `20px Arial`, fill: `#fff`}).setDepth(1000)
        this.distText = this.add.text(10, 34, `Distance: 0m`, {font: `20px Arial`, fill: '#fff'}).setDepth(1000)
        this.timeText = this.add.text(width - 150, 10, `Time: 0s`, {font: '18px Arial', fill: '#fff'}).setDepth(1000)

        this.pauseBtn = this.add.text(width - 150, 36, 'Pause', {font: '16px Arial', backgroundColor: '#222', padding: 6})
            .setInterective({useHandCursor: true}).setDepth(1000)
        this.pauseBtn.on('pointerdown', ()=> this.toggleMute())

        this.centerText = this.add.text(this.camera.main.centerX, 120, '', {font: '28px', fill: '#fff'})
            .setOrigin(0.5).setDepth(1000)

        const gameScene = this.scene.get('game')
        gameScene.events.on('score:add', this.onScoreAdd, this)
        gameScene.events.on('distance:update', this.onDistanceUpdate, this)
        gameScene.events.on('player:hit', this.onPlayerHit, this)
        gameScene.events.on('game:over', this.onGameOver, this)


        this.createKeyboardRelay()
        this.createMobileControls()

        this.time.addEvent({delay: 1000, loop: true, callback: () => {
            if (!this.paused){
                this.timeElapsed++
                this.timeText.setText(`Time: ${this.timeElapsed}s`)
            }
        }})



    }

    onScoreAdd(amount){
        this.score +=amount
        this.scoreText.setText(`Score: ${this.score}`)
    }

    onDistanceUpdate(m){
        this.distance = Math.floor(m)
        this.distText.setText(`Distance: ${this.distance}m`)
    }

    onPlayerHit(){
        this.showCenterText('Ouch!', 600)
    }

    onGameOver(){
        this.showCenterText(`Game Over/nScore: ${this.score}`, 3000)
    }

    showCenterText(txt, duration=10000){
        this.centerText.setText(txt)
        this.centerText.alpha = 1
        this.tweens.add({targets: this.centerText, alpha: 0, delay: duration-400,duration: 400})
    }

    createKeyboardRelay(){
        this.input.keyboard.on('keydown', e=>{
            const gameScene = this.scene.get('game')
            if (!gameScene) return
            
            if (e.code == 'ArrowUp' || e.code == 'Space') gameScene.events.emit('ui:jump')
            if (e.code == 'ArrowLeft') gameScene.events.emit('ui:left:down')
            if (e.code == 'ArrowRight') gameScene.events.emit('ui:right:down')
            if (e.code == 'ArrowDown') gameScene.events.emit('ui:down:start')

            if (e.code == 'KeyP') this.togglePause()
        })

        this.input.keyboard.on('keyup', e=> {
            const gameScene = this.scene.get('game')
            if (!gameScene) return

            if (e.code === 'ArrowLeft') gameScene.events.emit('ui:left:up')
            if (e.code === 'ArrowRight') gameScene.events.emit('ui:right:up')
            if (e.code === 'ArrowDown') gameScene.events.emit('ui:down:stop')
        })
    }

    createMobileControls(){
        if (!this.sys.game.device.input.touch) return

        const padY = this.scale.height - 100

        this.leftBtn = this.add.rectangle(80, padY, 120, 80, 0x000000, 0.25).setOrigin(0.5).setDepth(1000)
            .setInterective().on('pointerdown', () => this.scene.get('game').events.emit('ui:left:down'))
            .on('pointerup', () => this.scene.get('game').events.emit('ui:left:up'))
            .on('pointerout', () => this.scene.get('game').events.emit('ui:left:up'))
        this.add.text(80, padY, '◀', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5).setDepth(1001)

        this.jumbBtn = this.add.rectangle(this.scale.width - 140, padY, )
    }
}