export default class Particle {
    constructor({context, canvas, position, velocity, radius, color}){
        this.context = context
        this.canvas = canvas
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
    }
    draw() {
        this.context.save()
        this.context.globalAlpha = this.opacity
        this.context.beginPath()
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        this.context.fillStyle = this.color
        this.context.fill()
        this.context.closePath()
        this.context.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01
    }
}