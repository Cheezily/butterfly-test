const MAX_BUTTERFLIES = 5
const TURN_FREQUENCY = 500
const UPDATE_FREQUENCY = 1
const DIRECTION_CHANGE_CHANCE = .01
const BUTTERFLY_COLORS = [
  'white',
  'grey',
  'blue',
  'orange'
]
const MARGIN = 1
const MAX_WIDTH = Math.floor(window.innerWidth * MARGIN)
const MAX_HEIGHT = Math.floor(window.innerHeight * MARGIN)
const CENTER = [MAX_WIDTH / 2, MAX_HEIGHT / 2]

let trails = []

console.log(MAX_WIDTH)
console.log(MAX_HEIGHT)

function Butterfly(xPos, yPos, direction, color, speed) {
  this.xPos = xPos
  this.yPos = yPos
  this.direction = direction
  this.color = color
  this.speed = speed
  this.turn_direction = (Math.floor(Math.random() * 2) - .5) * 2
  this.turn_sharpness = Math.random() * 1.5
  this.direction_fix = false
}

let butterflies = []

function make_butterflies(num_butterflies) {
  for(let i = 0; i < MAX_BUTTERFLIES; i++) {
    let xPos = Math.floor(Math.random() * MAX_WIDTH *.7)
    let yPos = Math.floor(Math.random() * MAX_HEIGHT * .7)
    let direction = Math.floor(Math.random() * 360)
    let color = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)]
    let speed = Math.random() + 1
  
    butterflies.push(new Butterfly(xPos, yPos, direction, color, speed))
  
    let element = document.createElement('img')
    document.body.appendChild(element)
    element.className = 'butterfly'
    element.setAttribute("id", "butterfly_" + i)
    element.setAttribute("src", "images/arrow_" + color + ".png")
    element.style.transform = "rotate(" + direction + "deg)"
    element.style.left = xPos + 'px'
    element.style.top = yPos + 'px'
  }
}


console.log(butterflies)

function move_butterflies() {
  for(let i = 0; i < butterflies.length; i++) {
    let element = document.getElementById('butterfly_' + i)
    if(butterflies[i].direction > 360) {
      butterflies[i].direction = butterflies[i].direction - 360
    }
    if(butterflies[i].direction < 0) {
      butterflies[i].direction = butterflies[i].direction + 360
    }

    if(butterflies[i].xPos > MAX_WIDTH 
      || butterflies[i].yPos + 180 > MAX_HEIGHT
      || butterflies[i].xPos - 1 < 0 
      || butterflies[i].yPos - 1 < 0) {
        return_to_center(butterflies[i])
    } else {
      butterflies[i].direction_fix = null
    }

    let rad = (butterflies[i].direction) * (Math.PI / 180)

    butterflies[i].xPos += Math.sin(rad) * butterflies[i].speed 
    butterflies[i].yPos += Math.cos(rad) * butterflies[i].speed * -1

    element.style.transform = "rotate(" + butterflies[i].direction + "deg)"
    element.style.left = butterflies[i].xPos + 'px'
    element.style.top = butterflies[i].yPos + 'px'

    regular_turn(butterflies[i])
    create_trails(butterflies[i])
  }
}

function regular_turn(butterfly) {
  if(Math.random() < DIRECTION_CHANGE_CHANCE) {
    butterfly.turn_direction = (Math.floor(Math.random() * 2) - .5) * 2
    butterfly.turn_sharpness = Math.random() * .1
  }
  butterfly.turn_sharpness = butterfly.turn_sharpness ^ 1.1
  butterfly.direction += butterfly.turn_sharpness * butterfly.turn_direction
}

function create_trails(butterfly) {

}

function return_to_center(butterfly) {
  if(!butterfly.direction_fix) {
    if(CENTER[0] < butterfly.xPos && CENTER[1] > butterfly.yPos) {
      butterfly.direction_fix = 270 - Math.floor(Math.random() * 90)
    }

    if(CENTER[0] < butterfly.xPos && CENTER[1] < butterfly.yPos) {
      butterfly.direction_fix = 360 - Math.floor(Math.random() * 90)
    }

    if(CENTER[0] > butterfly.xPos && CENTER[1] > butterfly.yPos) {
      butterfly.direction_fix = 180 - Math.floor(Math.random() * 90)
    }

    if(CENTER[0] > butterfly.xPos && CENTER[1] < butterfly.yPos) {
      butterfly.direction_fix = 90 - Math.floor(Math.random() * 90)
    }
  }

  if(butterfly.direction_fix) {
    butterfly.direction = butterfly.direction + butterfly.speed
  }

  if(butterfly.direction_fix 
    && Math.abs(butterfly.direction - butterfly.direction_fix) - butterfly.speed * 1.3) {
    butterfly.direction_fix = null
  }
}

make_butterflies(MAX_BUTTERFLIES)
let move_interval = setInterval(move_butterflies, UPDATE_FREQUENCY)