export default class UI extends Phaser.Scene {
    constructor() { super('ui') }

    create() {
        const { width } = this.scale

        this.scoreText = this.add.text(10, 10, "Score: 0", { font: "20px Arial", fill: "#fff" }).setDepth(999)
        this.distText = this.add.text(10, 34, "Distance: 0m", { font: "20px Arial", fill: "#fff" }).setDepth(999)
        this.timeText = this.add.text(width - 150, 10, "Time: 0s", { font: "18px Arial", fill: "#fff" }).setDepth(999)

        this.pauseBtn = this.add.text(width - 150, 36, "Pause", {
            font: "16px Arial",
            backgroundColor: "#222",
            padding: 6
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.togglePause())

        // get game scene events
        const game = this.scene.get("game")

        game.events.on("ui:update-score", (score) => {
            this.scoreText.setText("Score: " + score)
        })

        game.events.on("ui:update-distance", (dist) => {
            this.distText.setText("Distance: " + dist + "m")
        })

        game.events.on("ui:update-time", (t) => {
            this.timeText.setText("Time: " + t + "s")
        })
    }

    togglePause() {
        const game = this.scene.get("game")
        if (!game) return

        this.paused = !this.paused

        if (this.paused) {
            game.scene.pause()
            this.pauseBtn.setText("Resume")
        } else {
            game.scene.resume()
            this.pauseBtn.setText("Pause")
        }
    }
}
