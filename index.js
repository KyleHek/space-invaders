import Player from "./Player.js";
import Projectile from "./Projectile.js";
import Grid from "./Grid.js";
import Invader from "./Invader.js";
import InvaderProjectile from "./InvaderProjectile.js";
import PowerupInvader from "./PowerupInvader.js";
import Particle from "./Particle.js";

const canvas = document.querySelector('canvas');
const startGameElem = document.getElementById('start-game');
const gameScore = document.getElementById('game-score-visible');
const scoreElement = document.getElementById('game-score');
const gameOverElement = document.getElementById('game-over-element')
const gameOverScore = document.getElementById('game-over-score')
const restartButton = document.getElementById('restart');

const backgroundMusic = new Audio('./audio/backgroundMusic.mp3');
const startSound = new Audio('./audio/start.mp3');
const shootSound = new Audio('./audio/shoot.wav');
const invaderShootSound = new Audio('./audio/invaderShoot.wav');
const enemyDeathSound = new Audio('./audio/enemyDeath.wav');
const explodeSound = new Audio('./audio/bomb.mp3');
const gameOverSound = new Audio('./audio/gameOver.mp3');
const powerupSound = new Audio('./audio/bonus.mp3');
let musicVolume = document.getElementById('music');
musicVolume.addEventListener("change", function(e) {
    backgroundMusic.volume = e.currentTarget.value / e.currentTarget.max;
});
let effectVolume = document.getElementById('effect');
effectVolume.addEventListener("change", function(e) {
    const volume = e.currentTarget.value / e.currentTarget.max;
    startSound.volume = volume;
    shootSound.volume = volume;
    invaderShootSound.volume = volume;
    enemyDeathSound.volume = volume;
    explodeSound.volume = volume;
    gameOverSound.volume = volume;
    powerupSound.volume = volume;
});

const context = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

let player = new Player(context, canvas)
let projectiles = []
let powerups = []
let grid = new Grid({
    context,
    canvas
})
let grids = [grid]
let invaderProjectiles = []
let particles = []
let keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}
let frames = 0
let game = {
    over: false,
    active: true
}
let score = 0
let powerUpDuration = 5000;
function init() {
    player = new Player(context, canvas)
    projectiles = []
    powerups = []
    grid.reset()
    grid = new Grid({context, canvas})
    grids = [grid]
    invaderProjectiles = []
    particles = []
    score = 0
    player.opacity = 1
    game.over = false
    game.active = true
}

function createParticles({object, color}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            context,
            canvas,
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#ab7fe9'
        }))
    }
}
function invaderShoot(object, invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile({
        context,
        canvas,
        position: {
            x: object.position.x + object.width / 2,
            y: object.position.y + object.height
        },
        velocity: {
            x: 0,
            y: 5
        }
    })
    );
    invaderShootSound.play()
}
function shootProjectile() {
    projectiles.push(
      new Projectile({
        context,
        canvas,
        position: {
          x: player.position.x + player.width / 2 - 2,
          y: player.position.y - player.height / 2 + 20,
        },
        velocity: {
          x: 0,
          y: -5,
        },
      })
    );
    shootSound.currentTime = 0;
    shootSound.play();
};
function activatePowerUp() {
    const shootingInterval = setInterval(shootProjectile, 100)
    setTimeout(() => {
        clearInterval(shootingInterval)
    }, powerUpDuration);
}

function animate() {
    if (!game.active) {
        return
    }
    requestAnimationFrame(animate)
    backgroundMusic.play()
    context.fillStyle = 'transparent'
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillRect(0, 0, canvas.width, canvas.height)
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.height <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })
    player.update()
    powerups.forEach((powerup, index) => {
        powerup.update()
        if (powerup.position.x + powerup.width >= canvas.width + 150) {
            setTimeout(() => {
                powerups.splice(index, 1)
            }, 0)
        } else {
            powerup.update()
        }
        projectiles.forEach((projectile, j) => {
            if (
                projectile.position.x + projectile.width / 2 > powerup.position.x &&
                projectile.position.x < powerup.position.x + powerup.width &&
                projectile.position.y + projectile.height > powerup.position.y &&
                projectile.position.y < powerup.position.y + powerup.height
                ) {
                    setTimeout(() => {
                        powerups.splice(index, 1)
                        projectiles.splice(j, 1)
                        powerupSound.play()
                        createParticles({
                            object: powerup,
                            color: 'red'
                        })
                        activatePowerUp()
                    }, 0)
            }            
        }) 
    })
    if (frames % 2000 === 0) {
        powerups.push(new PowerupInvader({
            context,
            canvas,
            position: {
                x: canvas.width - canvas.width - 150,
                y: canvas.height - canvas.height
            },
            velocity: {
                x: 2,
                y: 0
            }
        }))
    }
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1) 
            }, 0)
        } else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }   
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width) {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    explodeSound.play() 
                    player.opacity = 0
                    game.over = true
                }, 0)
                setTimeout(() => {
                    backgroundMusic.pause()
                    gameOverSound.play()
                    gameOverElement.style.display = 'block'
                    gameOverScore.innerHTML = score
                    game.active = false
                }, 2000)
                createParticles({
                    object: player,
                    color: 'white'
                })
        } 
    })
    grids.forEach((grid) => {
        grid.update()
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            const randomIndex = Math.floor(Math.random() * grid.invaders.length);
            const randomInvader = grid.invaders[randomIndex];
            randomInvader.changeImage();
            setTimeout(() => {
                invaderShoot(randomInvader, invaderProjectiles);
                randomInvader.revertImage();
            }, 300);
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({
                velocity: grid.velocity
            }) 
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.x + projectile.width / 2 > invader.position.x &&
                    projectile.position.x < invader.position.x + invader.width &&
                    projectile.position.y + projectile.height > invader.position.y &&
                    projectile.position.y < invader.position.y + invader.height
                    ) {
                        setTimeout(() => {
                            const invaderFound = grid.invaders.find(
                                (invader2) => invader2 === invader
                            )
                            const projectileFound = projectiles.find(
                                (projectile2) => projectile2 === projectile
                            )
                            if (invaderFound && projectileFound) {
                                score += 100
                                scoreElement.innerHTML = score
                                createParticles({
                                    object: invader,
                                })
                                grid.invaders.splice(i, 1)
                                projectiles.splice(j, 1)
                            }
                            enemyDeathSound.currentTime = 0;
                            enemyDeathSound.play()
                            let invadersRemaining = grid.invaders.length;
                            if (invadersRemaining <= 0) {
                                grid.newGrid(grids)
                            }
                        }, 0)                        
                }  
                if (invader.position.y + invader.height >= player.position.y &&
                    invader.position.x + invader.width >= player.position.x &&
                    invader.position.x <= player.position.x + player.width) {
                        setTimeout(() => {
                            player.opacity = 0
                            explodeSound.play()
                            game.over = true
                            createParticles({
                                object: player,
                                color: 'white'
                            }) 
                        }, 0)
                        setTimeout(() => {
                            backgroundMusic.pause()
                            gameOverSound.play()
                            gameOverElement.style.display = 'block'
                            gameOverScore.innerHTML = score
                            game.active = false
                        }, 1000)  
                }                    
            })       
        }) 
    })
    const speed = 10
    if (keys.a.pressed && player.position.x >= 10) {
        player.velocity.x = -speed
        player.rotatation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width - 10) {
        player.velocity.x = speed
        player.rotatation = 0.15
    } else if (keys.ArrowLeft.pressed && player.position.x >= 10) {
        player.velocity.x = -speed
        player.rotatation = -0.15
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width - 10) {
        player.velocity.x = speed
        player.rotatation = 0.15
    } else {
        player.velocity.x = 0
        player.rotatation = 0
    }
    frames++
}

restartButton.addEventListener('click', () => {
    gameOverElement.style.display = 'none'
    scoreElement.innerHTML = 0
    startSound.play()
    init()
    animate()
})
function handleStart() {
    startGameElem.style.display = 'none'
    gameScore.style.display = 'block'
    animate()
    startSound.play()
}

window.addEventListener('keypress', handleStart, { once: true})
addEventListener('keydown', ({ key }) => {
  if (game.over) return;
  switch (key) {
    case 'a':
      keys.a.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    case ' ':
      if (!keys.space.pressed) {
        keys.space.pressed = true;
        shootProjectile();
      }
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      break;
  }
});
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
  }
});
backgroundMusic.addEventListener('ended', function() {
    if (game.over = true) return
    this.currentTime = 0
    this.play()
})