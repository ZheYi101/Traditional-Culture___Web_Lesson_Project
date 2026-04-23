const boatImageUrl = new URL('../assets/boat.png', import.meta.url).href
const stoneImageUrl = new URL('../assets/stone.png', import.meta.url).href

const BOAT_X = 80
const BOAT_WIDTH = 300
const BOAT_HEIGHT = 150
const OBSTACLE_WIDTH = 100
const OBSTACLE_HEIGHT = 80
const BOAT_COLLISION_TOLERANCE = 10
const MAX_SPEED = 14
const ACCELERATION = 0.12
const BASE_GAP = 500
const OBSTACLE_CLEANUP_THRESHOLD = -50
const BOUNCE_SPEED = 0.05
const BOUNCE_AMPLITUDE = 3

class TcBoatDragonGame extends HTMLElement {
  constructor() {
    super()
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleStartClick = this.handleStartClick.bind(this)
    this.handleRestartClick = this.handleRestartClick.bind(this)
    this.handleRootClick = this.handleRootClick.bind(this)
    this.tick = this.tick.bind(this)

    this.boatImage = new Image()
    this.stoneImage = new Image()
    this.boatImageLoaded = false
    this.stoneImageLoaded = false

    this.animationFrameId = null
    this.ctx = null
    this.canvas = null
    this.scoreEl = null
    this.speedEl = null
    this.gameOverEl = null
    this.finalScoreEl = null
    this.restartBtn = null
    this.laneSelect = null
    this.startBtn = null
    this.gameOptionsEl = null
    this.uiLayerEl = null

    this.laneCount = 3
    this.laneY = []
    this.currentLane = 1
    this.gameStarted = false
    this.gameOver = false
    this.gamePaused = false
    this.obstacles = []
    this.score = 0
    this.currentSpeed = 4
    this.distanceSinceLastSpawn = 0
    this.lastLane = -1
    this.animationTime = 0
  }

  connectedCallback() {
    this.render()
    this.cacheDom()
    this.calculateLanes(this.laneCount)
    this.loadImages()
    this.bindEvents()
    this.updateUI()
  }

  disconnectedCallback() {
    this.unbindEvents()
    this.stopLoop()
  }

  render() {
    this.innerHTML = `
      <div class="play-mini-game play-mini-game-dragon">
        <div class="play-mini-game-panel">
          <div class="play-mini-game-copy">
            <h2 class="play-mini-game-title">赛龙舟</h2>
            <p class="play-mini-game-text">W / S 键上下移动切换航道，P 键暂停，可随时返回大厅，躲开前方礁石，分数越高船速越快。</p>
          </div>

          <div class="play-dragon-options">
            <label class="play-mini-game-label" for="dragon-lane-select">选择航道数量</label>
            <select id="dragon-lane-select" class="play-mini-game-select">
              <option value="3">3 条航道</option>
              <option value="5">5 条航道</option>
            </select>
            <button class="play-mini-game-button play-mini-game-button-start" type="button" data-role="start">开始游戏</button>
          </div>
        </div>

        <div class="play-dragon-stage">
          <canvas class="play-dragon-canvas" width="1200" height="800"></canvas>
          <div class="play-dragon-ui is-hidden" data-role="ui-layer">
            <div class="play-dragon-status play-dragon-score">得分: 0</div>
            <div class="play-dragon-status play-dragon-speed">速度: 1.00x</div>
            <div class="play-dragon-game-over is-hidden" data-role="game-over">
              <h3>撞礁了</h3>
              <p data-role="final-score"></p>
              <div class="play-shooter-game-over-actions">
                <button class="play-mini-game-button play-mini-game-button-start" type="button" data-role="restart">重新开始</button>
                <button class="play-mini-game-button play-mini-game-button-exit" type="button" data-role="back">
                  返回大厅
                </button>
              </div>
            </div>
            <div class="play-mini-game-pause is-hidden" data-role="pause-overlay">
              <h3>已暂停</h3>
              <p>按 P 键继续游戏</p>
              <button class="play-mini-game-button play-mini-game-button-exit" type="button" data-role="back">
                返回大厅
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  cacheDom() {
    this.canvas = this.querySelector('.play-dragon-canvas')
    this.ctx = this.canvas?.getContext('2d')
    this.scoreEl = this.querySelector('.play-dragon-score')
    this.speedEl = this.querySelector('.play-dragon-speed')
    this.gameOverEl = this.querySelector('[data-role="game-over"]')
    this.finalScoreEl = this.querySelector('[data-role="final-score"]')
    this.pauseOverlayEl = this.querySelector('[data-role="pause-overlay"]')
    this.restartBtn = this.querySelector('[data-role="restart"]')
    this.laneSelect = this.querySelector('#dragon-lane-select')
    this.startBtn = this.querySelector('[data-role="start"]')
    this.gameOptionsEl = this.querySelector('.play-dragon-options')
    this.uiLayerEl = this.querySelector('[data-role="ui-layer"]')
  }

  bindEvents() {
    window.addEventListener('keydown', this.handleKeydown)
    this.startBtn?.addEventListener('click', this.handleStartClick)
    this.restartBtn?.addEventListener('click', this.handleRestartClick)
    this.addEventListener('click', this.handleRootClick)
  }

  unbindEvents() {
    window.removeEventListener('keydown', this.handleKeydown)
    this.startBtn?.removeEventListener('click', this.handleStartClick)
    this.restartBtn?.removeEventListener('click', this.handleRestartClick)
    this.removeEventListener('click', this.handleRootClick)
  }

  loadImages() {
    this.boatImage.onload = () => {
      this.boatImageLoaded = true
    }
    this.boatImage.src = boatImageUrl

    this.stoneImage.onload = () => {
      this.stoneImageLoaded = true
    }
    this.stoneImage.src = stoneImageUrl
  }

  calculateLanes(count) {
    this.laneCount = count
    this.laneY = []

    const margin = 100
    const availableHeight = this.canvas.height - margin * 2
    const spacing = availableHeight / (count - 1)

    for (let index = 0; index < count; index += 1) {
      this.laneY.push(margin + index * spacing)
    }

    this.currentLane = Math.floor(count / 2)
  }

  handleKeydown(event) {
    if (!this.isConnected || !this.gameStarted) {
      return
    }

    if (this.gameOver) {
      if (event.code === 'Space' || event.key === ' ') {
        this.restartGame()
        event.preventDefault()
      }
      return
    }

    if (event.key === 'p' || event.key === 'P') {
      this.togglePause()
      event.preventDefault()
      return
    }

    if (this.gamePaused) {
      return
    }

    if ((event.key === 'w' || event.key === 'W') && this.currentLane > 0) {
      this.currentLane -= 1
      event.preventDefault()
    }

    if (
      (event.key === 's' || event.key === 'S') &&
      this.currentLane < this.laneCount - 1
    ) {
      this.currentLane += 1
      event.preventDefault()
    }
  }

  handleStartClick() {
    const selectedLanes = Number.parseInt(this.laneSelect?.value ?? '3', 10)

    this.calculateLanes(selectedLanes)
    this.startGame()
  }

  handleRestartClick() {
    this.restartGame()
  }

  handleRootClick(event) {
    const actionButton = event.target.closest('[data-role]')

    if (!actionButton) {
      return
    }

    if (actionButton.dataset.role === 'back') {
      this.returnToMenu()
    }
  }

  startGame() {
    this.gameStarted = true
    this.gameOptionsEl?.classList.add('is-hidden')
    this.canvas.style.display = 'block'
    this.uiLayerEl?.classList.remove('is-hidden')
    this.restartGame()
    this.startLoop()
  }

  restartGame() {
    this.currentLane = Math.floor(this.laneCount / 2)
    this.obstacles = []
    this.score = 0
    this.gameOver = false
    this.gamePaused = false
    this.currentSpeed = 4
    this.distanceSinceLastSpawn = 0
    this.lastLane = -1
    this.animationTime = 0
    this.updateUI()
    this.gameOverEl?.classList.add('is-hidden')
    this.pauseOverlayEl?.classList.add('is-hidden')
    this.draw()
  }

  togglePause() {
    if (!this.gameStarted || this.gameOver) {
      return
    }

    this.gamePaused = !this.gamePaused
    this.pauseOverlayEl?.classList.toggle('is-hidden', !this.gamePaused)
  }

  returnToMenu() {
    this.stopLoop()
    this.gameStarted = false
    this.gameOver = false
    this.gamePaused = false
    this.obstacles = []
    this.score = 0
    this.currentSpeed = 4
    this.distanceSinceLastSpawn = 0
    this.lastLane = -1
    this.animationTime = 0
    this.canvas.style.display = 'none'
    this.gameOptionsEl?.classList.remove('is-hidden')
    this.uiLayerEl?.classList.add('is-hidden')
    this.gameOverEl?.classList.add('is-hidden')
    this.pauseOverlayEl?.classList.add('is-hidden')
    this.updateUI()
    this.draw()
  }

  startLoop() {
    if (this.animationFrameId !== null) {
      return
    }

    this.animationFrameId = window.requestAnimationFrame(this.tick)
  }

  stopLoop() {
    if (this.animationFrameId === null) {
      return
    }

    window.cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = null
  }

  tick() {
    this.update()
    this.draw()
    this.animationFrameId = window.requestAnimationFrame(this.tick)
  }

  update() {
    if (!this.gameStarted || this.gameOver || this.gamePaused) {
      return
    }

    this.animationTime += 1
    this.currentSpeed = Math.min(MAX_SPEED, 4 + this.score * ACCELERATION)
    this.distanceSinceLastSpawn += this.currentSpeed

    if (this.distanceSinceLastSpawn >= BASE_GAP) {
      this.distanceSinceLastSpawn -= BASE_GAP
      this.spawnObstacle()
    }

    for (let index = this.obstacles.length - 1; index >= 0; index -= 1) {
      const obstacle = this.obstacles[index]
      obstacle.x -= this.currentSpeed

      if (
        obstacle.lane === this.currentLane &&
        obstacle.x < BOAT_X + BOAT_WIDTH &&
        obstacle.x + OBSTACLE_WIDTH > BOAT_X + BOAT_COLLISION_TOLERANCE
      ) {
        this.triggerGameOver()
      }

      if (obstacle.x < OBSTACLE_CLEANUP_THRESHOLD) {
        this.obstacles.splice(index, 1)
        this.score += 1
        this.updateUI()
      }
    }
  }

  spawnObstacle() {
    let lane = Math.floor(Math.random() * this.laneCount)

    if (lane === this.lastLane) {
      lane = (lane + 1 + Math.floor(Math.random() * 2)) % this.laneCount
    }

    this.lastLane = lane
    this.obstacles.push({
      x: this.canvas.width,
      lane
    })
  }

  triggerGameOver() {
    this.gameOver = true

    if (this.finalScoreEl) {
      this.finalScoreEl.textContent = `最终得分: ${this.score}`
    }

    this.gameOverEl?.classList.remove('is-hidden')
  }

  updateUI() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `得分: ${this.score}`
    }

    if (this.speedEl) {
      this.speedEl.textContent = `速度: ${(this.currentSpeed / 4).toFixed(2)}x`
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) {
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.setLineDash([10, 15])
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    this.ctx.lineWidth = 2

    this.laneY.forEach((lane) => {
      this.ctx.beginPath()
      this.ctx.moveTo(0, lane)
      this.ctx.lineTo(this.canvas.width, lane)
      this.ctx.stroke()
    })

    this.ctx.setLineDash([])

    const baseBoatY = this.laneY[this.currentLane] - BOAT_HEIGHT / 2
    const bounceOffset =
      Math.sin(this.animationTime * BOUNCE_SPEED) * BOUNCE_AMPLITUDE
    const boatY = baseBoatY + bounceOffset

    if (this.boatImageLoaded) {
      this.ctx.drawImage(this.boatImage, BOAT_X, boatY, BOAT_WIDTH, BOAT_HEIGHT)
    } else {
      this.drawDragonBoat(BOAT_X, boatY, BOAT_WIDTH, BOAT_HEIGHT)
    }

    this.obstacles.forEach((obstacle) => {
      const rockY = this.laneY[obstacle.lane] - OBSTACLE_HEIGHT / 2

      if (this.stoneImageLoaded) {
        this.ctx.drawImage(
          this.stoneImage,
          obstacle.x,
          rockY,
          OBSTACLE_WIDTH,
          OBSTACLE_HEIGHT
        )
      } else {
        this.drawRock(obstacle.x, rockY, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
      }
    })
  }

  drawDragonBoat(x, y, width, height) {
    this.ctx.save()
    this.ctx.fillStyle = '#d69e2e'
    this.ctx.beginPath()
    this.ctx.moveTo(x, y + height * 0.3)
    this.ctx.lineTo(x + width * 0.1, y + height * 0.1)
    this.ctx.lineTo(x + width * 0.9, y + height * 0.1)
    this.ctx.lineTo(x + width, y + height * 0.3)
    this.ctx.lineTo(x + width, y + height * 0.7)
    this.ctx.lineTo(x + width * 0.9, y + height * 0.9)
    this.ctx.lineTo(x + width * 0.1, y + height * 0.9)
    this.ctx.lineTo(x, y + height * 0.7)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.strokeStyle = '#b7791f'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(x + width * 0.1, y + height * 0.1)
    this.ctx.lineTo(x + width * 0.9, y + height * 0.1)
    this.ctx.stroke()

    this.ctx.lineWidth = 1
    for (let index = 1; index <= 3; index += 1) {
      const offset = width * 0.1 + (width * 0.8 * index) / 4
      this.ctx.beginPath()
      this.ctx.moveTo(x + offset, y + height * 0.1)
      this.ctx.lineTo(x + offset, y + height * 0.9)
      this.ctx.stroke()
    }

    this.ctx.fillStyle = '#e53e3e'
    this.ctx.beginPath()
    this.ctx.moveTo(x + width, y + height * 0.3)
    this.ctx.lineTo(x + width + 30, y + height * 0.5)
    this.ctx.lineTo(x + width, y + height * 0.7)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.fillStyle = '#000000'
    this.ctx.beginPath()
    this.ctx.arc(x + width + 10, y + height * 0.5 - 5, 3, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.strokeStyle = '#d69e2e'
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.moveTo(x + width + 15, y + height * 0.4)
    this.ctx.lineTo(x + width + 25, y + height * 0.3)
    this.ctx.moveTo(x + width + 15, y + height * 0.6)
    this.ctx.lineTo(x + width + 25, y + height * 0.7)
    this.ctx.stroke()

    this.ctx.strokeStyle = '#e53e3e'
    this.ctx.lineWidth = 1.5
    this.ctx.beginPath()
    this.ctx.moveTo(x + width + 5, y + height * 0.45)
    this.ctx.lineTo(x + width + 20, y + height * 0.4)
    this.ctx.moveTo(x + width + 5, y + height * 0.55)
    this.ctx.lineTo(x + width + 20, y + height * 0.6)
    this.ctx.stroke()

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    const wave = Math.sin(Date.now() * 0.01) * 5
    this.ctx.beginPath()
    this.ctx.moveTo(x - 10, y + height * 0.3 + wave)
    this.ctx.lineTo(x - 20, y + height * 0.5)
    this.ctx.lineTo(x - 10, y + height * 0.7 + wave)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
  }

  drawRock(x, y, width, height) {
    this.ctx.save()
    this.ctx.fillStyle = '#6b7280'
    this.ctx.beginPath()
    this.ctx.moveTo(x + width / 2, y + height * 0.1)
    this.ctx.quadraticCurveTo(
      x + width * 0.8,
      y + height * 0.1,
      x + width * 0.9,
      y + height * 0.3
    )
    this.ctx.quadraticCurveTo(
      x + width * 0.95,
      y + height * 0.6,
      x + width * 0.8,
      y + height * 0.9
    )
    this.ctx.quadraticCurveTo(
      x + width * 0.4,
      y + height * 0.95,
      x + width * 0.2,
      y + height * 0.7
    )
    this.ctx.quadraticCurveTo(
      x + width * 0.1,
      y + height * 0.4,
      x + width / 2,
      y + height * 0.1
    )
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.strokeStyle = '#4b5563'
    this.ctx.lineWidth = 1.5
    this.ctx.beginPath()
    this.ctx.moveTo(x + width * 0.3, y + height * 0.2)
    this.ctx.quadraticCurveTo(
      x + width * 0.4,
      y + height * 0.4,
      x + width * 0.5,
      y + height * 0.6
    )
    this.ctx.moveTo(x + width * 0.6, y + height * 0.3)
    this.ctx.quadraticCurveTo(
      x + width * 0.7,
      y + height * 0.5,
      x + width * 0.65,
      y + height * 0.8
    )
    this.ctx.moveTo(x + width * 0.4, y + height * 0.7)
    this.ctx.quadraticCurveTo(
      x + width * 0.5,
      y + height * 0.8,
      x + width * 0.6,
      y + height * 0.75
    )
    this.ctx.stroke()

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    this.ctx.beginPath()
    this.ctx.ellipse(
      x + width * 0.3,
      y + height * 0.3,
      width * 0.15,
      height * 0.1,
      0.3,
      0,
      Math.PI * 2
    )
    this.ctx.fill()

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    this.ctx.beginPath()
    this.ctx.ellipse(
      x + width * 0.7,
      y + height * 0.7,
      width * 0.2,
      height * 0.15,
      -0.2,
      0,
      Math.PI * 2
    )
    this.ctx.fill()
    this.ctx.restore()
  }
}

if (!customElements.get('tc-boat-dragon-game')) {
  customElements.define('tc-boat-dragon-game', TcBoatDragonGame)
}
