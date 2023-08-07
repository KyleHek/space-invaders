export default class Invader {
    constructor({context, canvas, position}) {
        this.context = context
        this.canvas = canvas
        this.velocity = {
            x: 0,
            y: 0
        }
        const originalImage = new Image();
        originalImage.src = './images/invader.png';
        this.originalImage = originalImage;
        const alternateImage = new Image();
        alternateImage.src = './images/invaderShoot.png';
        this.alternateImage = alternateImage;
        originalImage.onload = () => {
            const scale = .08
            this.image = originalImage
            this.width = originalImage.width * scale
            this.height = originalImage.height * scale
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
    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    changeImage() {
        this.image = this.alternateImage;
    }
    revertImage() {
        this.image = this.originalImage;
    }
}