const MAX_BUTTERFLIES = 25
const TURN_FREQUENCY = 500
const UPDATE_FREQUENCY = 20
// const UPDATE_FREQUENCY = Math.floor(1000 / 60)
const DIRECTION_CHANGE_CHANCE = .01
const MIN_SPEED = UPDATE_FREQUENCY / 16
const SPEED_VARIANCE = 2
const BUTTERFLY_COLORS = [
  'green',
  'red',
  'blue',
  'orange',
  'yellow'
]
const MARGIN = 1
const MAX_WIDTH = Math.floor(window.innerWidth * MARGIN)
const MAX_HEIGHT = Math.floor(window.innerHeight * MARGIN)
const CENTER = [MAX_WIDTH / 2, MAX_HEIGHT / 2]

let trails = []

console.log(MAX_WIDTH)
console.log(MAX_HEIGHT)

function Butterfly(id, xPos, yPos, direction, color, speed) {
  this.id = id
  this.xPos = xPos
  this.yPos = yPos
  this.direction = direction
  this.color = color
  this.speed = speed
  this.turn_direction = (Math.floor(Math.random() * 2) - .5) * 2
  this.turn_sharpness = direction_sharpness()
  this.direction_fix = false
  // this.direction_fix_count = 0
}

let butterflies = []

function make_butterflies(num_butterflies) {
  for(let i = 0; i < MAX_BUTTERFLIES; i++) {
    let xPos = CENTER[0]
    let yPos = CENTER[1]
    let direction = Math.floor(Math.random() * 360)
    let color = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)]
    let speed = (Math.random() * SPEED_VARIANCE) + MIN_SPEED
  
    butterflies.push(new Butterfly(i, xPos, yPos, direction, color, speed))
  
    let element = document.createElement('img')
    document.body.appendChild(element)
    element.className = 'butterfly'
    element.setAttribute("id", "butterfly_" + i)
    element.setAttribute("src", "images/butterfly_" + color + ".png")
    element.style.transform = "rotate(" + direction + "deg)"
    element.style.left = xPos + 'px'
    element.style.top = yPos + 'px'
  }
}


// console.log(butterflies)

function move_butterflies() {
  for(let i = 0; i < butterflies.length; i++) {
    let element = document.getElementById('butterfly_' + butterflies[i].id)
    if(butterflies[i].direction > 360) {
      butterflies[i].direction = butterflies[i].direction - 360
    }
    if(butterflies[i].direction < 0) {
      butterflies[i].direction = butterflies[i].direction + 360
    }

    if(butterflies[i].xPos > MAX_WIDTH - 50
      || butterflies[i].yPos + 150 > MAX_HEIGHT
      || butterflies[i].xPos < 0 
      || butterflies[i].yPos - 100 < 0) {
        return_to_center(butterflies[i])
    } else {
      butterflies[i].direction_fix = null
      butterflies[i].speed = (Math.random() * SPEED_VARIANCE) + MIN_SPEED
    }

    let rad = (butterflies[i].direction) * (Math.PI / 180)

    butterflies[i].turn_sharpness = butterflies[i].turn_sharpness ^ 1.7

    butterflies[i].direction += butterflies[i].turn_sharpness * butterflies[i].turn_direction

    butterflies[i].xPos += Math.sin(rad) * butterflies[i].speed 
    butterflies[i].yPos += Math.cos(rad) * butterflies[i].speed * -1

    element.style.transform = "rotate(" + butterflies[i].direction + "deg)"
    element.style.left = butterflies[i].xPos + 'px'
    element.style.top = butterflies[i].yPos + 'px'

    regular_turn(butterflies[i])    
    create_trails(butterflies[i])
  }
}

function direction_sharpness() {
  return Math.random() * 2
}

function regular_turn(butterfly) {
  if(Math.random() < DIRECTION_CHANGE_CHANCE) {
    butterfly.turn_direction = (Math.floor(Math.random() * 2) - .5) * 2
    butterfly.turn_sharpness = direction_sharpness()
    flap_once(butterfly)
  }
  butterfly.direction += butterfly.turn_sharpness * butterfly.turn_direction
}

function create_trails(butterfly) {

}

function flap_once(butterfly, times) {
  let element = document.getElementById("butterfly_" + butterfly.id)
  element.setAttribute("src", "images/butterfly_" + butterfly.color + "_flap.png")

  for(let i = 0; i < (Math.random() * 6); i++) {
    let delay = Math.max(Math.random() * 250, 100)
    setTimeout(function() {
      element.setAttribute("src", "images/butterfly_" + butterfly.color + "_flap.png")
    }, (i * delay))
    setTimeout(function() {
      element.setAttribute("src", "images/butterfly_" + butterfly.color + ".png")
    }, (i * delay) + 100)
  }
}

function return_to_center(butterfly) {
  if(!butterfly.direction_fix) {
    // hits lower right corner
    if(CENTER[0] < butterfly.xPos && CENTER[1] > butterfly.yPos) {
      butterfly.direction_fix = 335
    }

    // hits upper right corner
    if(CENTER[0] < butterfly.xPos && CENTER[1] < butterfly.yPos) {
      butterfly.direction_fix = 215
    }

    //hits upper left corner
    if(CENTER[0] > butterfly.xPos && CENTER[1] > butterfly.yPos) {
      butterfly.direction_fix = 135
    }

    //hits lower left corner
    if(CENTER[0] > butterfly.xPos && CENTER[1] < butterfly.yPos) {
      butterfly.direction_fix = 45
    }

    flap_once(butterfly)
  }

  if(butterfly.direction_fix) {
    butterfly.direction += 10
  }

  if(butterfly.direction_fix 
    && Math.abs(butterfly.direction - butterfly.direction_fix) < 10) {
    butterfly.direction_fix = null
  }
}

make_butterflies(MAX_BUTTERFLIES)
let move_interval = setInterval(move_butterflies, UPDATE_FREQUENCY)