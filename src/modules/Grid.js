import Invader from "./Invader.js";
let INTITIAL_VELOCITY = 2
let VELOCITY_INCREASE = 0.5
export default class Grid {
    constructor({context, canvas}) {
        this.context = context
        this.canvas = canvas
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: INTITIAL_VELOCITY,
            y: 0
        }
        this.invaders =[]
        const columns = Math.floor(Math.random() * 5 + 8)
        const rows = Math.floor(Math.random() * 4 + 2)
        this.width = columns * 45
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    context,
                    canvas,
                    position: {
                    x: x * 45,
                    y: y * 35 + 70
                }}))
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if (this.position.x + this.width >= this.canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 35
        }
    }
    newGrid(grids) {
        let grid = new Grid({
            context: this.context,
            canvas: this.canvas
        })
        grids.push(grid)
        INTITIAL_VELOCITY += VELOCITY_INCREASE
    }
    reset() {
        INTITIAL_VELOCITY = 2
    }
}