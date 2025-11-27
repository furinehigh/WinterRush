export default class UI extends Phaser.Scene {
    constructor() { super('ui') }

    create() {
        this.score = 0
        this.distance = 0
        this.timeElapsed = 0
        this.paused = false

        const { width } = this.scale

        this.scoreText = this.add.text(10, 10, "Score: 0", { font: "20px Arial", fill: "#fff" }).setDepth(1000)
        this.distText = this.add.text(10, 34, "Distance: 0m", { font: "20px Arial", fill: "#fff" }).setDepth(1000)
        this.timeText = this.add.text(width - 150, 10, "Time: 0s", { font: "18px Arial", fill: "#fff" }).setDepth(1000)

        // FIXED
        this.pauseBtn = this.add.text(width - 150, 36, "Pause", { 
            font: "16px Arial", backgroundColor: "#222", padding: 6 
        })
        .setInteractive({ useHandCursor: true })
        .setDepth(1000)
        .on("pointerdown", () => this.togglePause())

        // FIXED camera reference
        this.centerText = this.add.text(this.cameras.main.centerX, 120, "", { 
            font: "28px Arial", fill: "#fff" 
        })
        .setOrigin(0.5)
        .setDepth(1000)

        // not using events for now — your Game.js doesn't emit any
        // simpler + fully working

        // timer
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.paused) {
                    this.timeElapsed++
                    this.timeText.setText(`Time: ${this.timeElapsed}s`)
                }
            }
        })
    }

    togglePause() {
        const game = this.scene.get("game")
        if (!game) return

        this.paused = !this.paused
        if (this.paused) {
            this.pauseBtn.setText("Resume")
            game.scene.pause()
            this.showCenterText("Paused", 800)
        } else {
            this.pauseBtn.setText("Pause")
            game.scene.resume()
        }
    }

    showCenterText(msg, duration = 800) {
        this.centerText.setText(msg)
        this.centerText.alpha = 1
        this.tweens.add({
            targets: this.centerText,
            alpha: 0,
            delay: duration - 400,
            duration: 400
        })
    }
}
