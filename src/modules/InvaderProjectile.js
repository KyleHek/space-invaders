export default class InvaderProjectile {
    constructor({context, canvas, position, velocity}){
        this.context = context
        this.canvas = canvas
        this.position = position
        this.velocity = velocity
        this.width = 5
        this.height = 15
    }
    draw() {
        this.context.fillStyle = 'white'
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}