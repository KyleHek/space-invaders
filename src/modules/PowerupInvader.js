export default class PowerupInvader {
    constructor({context, canvas, position, velocity}) {
        this.context = context
        this.canvas = canvas
        this.position = position
        this.velocity = velocity
        const image = new Image()
        image.src = './assets/images/invader2.png'
        image.onload = () => {
            const scale = .1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            } 
        }
    }
    draw() {
        this.context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}