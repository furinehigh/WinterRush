export default class StartScene extends Phaser.Scene {
    constructor() { super('start') }

    create() {
        const { width, height } = this.scale

        this.add.text(width / 2, 120, "WinterRush", {
            font: "48px Arial",
            fill: "#fff"
        }).setOrigin(0.5)

        const topScore = localStorage.getItem("top_score") || 0
        this.add.text(width / 2, 190, `Top Score: ${topScore}`, {
            font: "28px Arial",
            fill: "#ff0"
        }).setOrigin(0.5)

        const playBtn = this.add.text(width / 2, 300, "PLAY", {
            font: "40px Arial",
            fill: "#00f",
            backgroundColor: "#fff",
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

        playBtn.on("pointerdown", () => {
            this.scene.start("game")
            this.scene.launch("ui")
        })

        const historyBtn = this.add.text(width / 2, 380, "History", {
            font: "28px Arial",
            fill: "#fff"
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

        historyBtn.on("pointerdown", () => this.scene.start("history"))
    }
}
