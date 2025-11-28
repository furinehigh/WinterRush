export default class StartScene extends Phaser.Scene {
    constructor() { super('start') }

    create() {
        const { width, height } = this.scale

        this.bg = this.add.image(0, 0, 'bg')
            .setOrigin(0)
            .setDisplaySize(width, height)



        this.add.text(width / 2, 120, "WinterRush", {
            fontFamily: 'SnowtopCaps',
            fontSize: '15vw',
            fill: "#fff"
        }).setOrigin(0.5)

        const topScore = localStorage.getItem("top_score") || 0
        this.add.text(width / 2, 190, `Top Score: ${topScore}`, {
            font: "28px SnowtopCaps",
            fill: "#f0f"
        }).setOrigin(0.5)

        const playBtn = this.add.text(width / 2, 300, "PLAY", {
            font: "40px SnowtopCaps",
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
            font: "28px SnowtopCaps",
            fill: "#fff"
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        historyBtn.on("pointerdown", () => this.scene.start("history"))
    }
}
