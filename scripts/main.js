const MAX_BUTTERFLIES = 10
const TURN_FREQUENCY = 500
const UPDATE_FREQUENCY = 10

const MARGIN = 1
const MAX_WIDTH = Math.floor(window.innerWidth * MARGIN)
const MAX_HEIGHT = Math.floor(window.innerHeight * MARGIN)
const CENTER = [MAX_WIDTH, MAX_HEIGHT]

console.log(MAX_WIDTH)
console.log(MAX_HEIGHT)

function Butterfly(xPos, yPos, direction, color, speed) {
  this.xPos = xPos
  this.yPos = yPos
  this.direction = direction
  this.color = color
  this.speed = speed
  this.direction_fix = false
}

let butterflies = []

function make_butterflies(num_butterflies) {
  for(let i = 0; i < MAX_BUTTERFLIES; i++) {
    let xPos = Math.floor(Math.random() * MAX_WIDTH *.7)
    let yPos = Math.floor(Math.random() * MAX_HEIGHT * .7)
    let direction = Math.floor(Math.random() * 360)
    let color = "white"
    let speed = Math.random() * 2 + 3
  
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
    // console.log(butterflies[i].direction)
    if(butterflies[i].direction > 360) {
      butterflies[i].direction = butterflies[i].direction - 360
    }
    if(butterflies[i].direction < 0) {
      butterflies[i].direction = butterflies[i].direction + 360
    }

    if(butterflies[i].xPos + 250 > MAX_WIDTH || butterflies[i].yPos + 340 > MAX_HEIGHT
      || butterflies[i].xPos - 1 < 0 || butterflies[i].yPos - 1 < 0) {
        
        console.log('gone', butterflies[i].direction)

        if(!butterflies[i].direction_fix) {
          if(CENTER[0] < butterflies[i].xPos && CENTER[1] > butterflies[i].yPos) {
            butterflies[i].direction_fix = 270 - Math.floor(Math.random() * 90)
            console.log('lower left')
          }

          if(CENTER[0] < butterflies[i].xPos && CENTER[1] < butterflies[i].yPos) {
            butterflies[i].direction_fix = 360 - Math.floor(Math.random() * 90)
            console.log('upper left')
          }

          if(CENTER[0] < butterflies[i].xPos && CENTER[1] > butterflies[i].yPos) {
            butterflies[i].direction_fix = 180 - Math.floor(Math.random() * 90)
            console.log('upper right')
          }

          if(CENTER[0] < butterflies[i].xPos && CENTER[1] < butterflies[i].yPos) {
            butterflies[i].direction_fix = 90 - Math.floor(Math.random() * 90)
            console.log('lower right')
          }
        }

        if(butterflies[i].direction_fix) {
          butterflies[i].direction = butterflies[i].direction + 1
          console.log('turning')
        }

        if(butterflies[i].direction_fix 
          && Math.abs(butterflies[i].direction - butterflies[i].direction_fix) - 8) {
          butterflies[i].direction_fix = null
          console.log('cleared fix')
        }

    } else {
      butterflies[i].direction_fix = null
    }

    let rad = (butterflies[i].direction) * (Math.PI / 180)

    butterflies[i].xPos += Math.sin(rad) * butterflies[i].speed 
    butterflies[i].yPos += Math.cos(rad) * butterflies[i].speed * -1

    // element.style.transform = "rotate(" + butterflies[i].direction + "deg)"
    element.style.left = butterflies[i].xPos + 'px'
    element.style.top = butterflies[i].yPos + 'px'
    
    console.log(Math.floor(butterflies[i].xPos),
      Math.floor(butterflies[i].yPos), 
      butterflies[i].direction,
      rad.toFixed(2),
      butterflies[i].direction_fix)
  }
}

make_butterflies(MAX_BUTTERFLIES)
let move_interval = setInterval(move_butterflies, UPDATE_FREQUENCY)