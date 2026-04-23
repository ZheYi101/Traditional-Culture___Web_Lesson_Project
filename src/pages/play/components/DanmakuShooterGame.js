const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 360;
const PLAYER_COLOR = "#ffffff";
const PLAYER_MAX_LIVES = 3;
const PLAYER_INVULNERABLE_DURATION = 1200;
const PLAYER_TRIPLE_SHOT_DURATION = 3000;
const PLAYER_TRIPLE_SHOT_ANGLE_DEG = 35;
const HELL_PLAYER_SCALE = 1 / 3;
const DEFAULT_CANVAS_WIDTH = 960;
const DEFAULT_CANVAS_HEIGHT = 720;
const HELL_CANVAS_WIDTH = 1180;
const HELL_CANVAS_HEIGHT = 860;

const ENEMY_BASE_WIDTH = 80;
const ENEMY_BASE_HEIGHT = 20;
const ENEMY_WIDTH_SCALE_MIN = 0.5;
const ENEMY_WIDTH_SCALE_MAX = 1;
const ENEMY_VERTICAL_SPEED = 72;
const ENEMY_HORIZONTAL_SPEED_MIN = 70;
const ENEMY_HORIZONTAL_SPEED_MAX = 140;
const ENEMY_BASE_COLORS = ["#FF5252", "#448AFF", "#69F0AE", "#FFD740", "#FF80AB", "#B388FF"];
const ENEMY_SPAWN_PADDING = 24;

const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 20;
const PLAYER_BULLET_SPEED = 520;
const ENEMY_BULLET_SPEED = 300;
const PLAYER_BULLET_COLOR = "#18FFFF";
const BOUNCE_BULLET_MIN_ANGLE_DEG = 30;
const BOUNCE_BULLET_MAX_ANGLE_DEG = 60;

const POWER_UP_SIZE = 24;
const POWER_UP_FALL_SPEED = 150;
const SHIELD_DURATION = 8000;
const POWER_UP_DROP_CHANCE = 0.18;

const GAME_MODES = {
  easy: {
    minEnemies: 3,
    maxEnemies: 7,
    spawnCheckInterval: 1500,
    spawnGap: 180,
    bounceShooterRatio: 0.25,
    triangleShooterRatio: 0.08,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: DEFAULT_CANVAS_HEIGHT,
  },
  normal: {
    minEnemies: 5,
    maxEnemies: 9,
    spawnCheckInterval: 1500,
    spawnGap: 180,
    bounceShooterRatio: 0.25,
    triangleShooterRatio: 0.08,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: DEFAULT_CANVAS_HEIGHT,
  },
  hard: {
    minEnemies: 7,
    maxEnemies: 12,
    spawnCheckInterval: 1500,
    spawnGap: 180,
    bounceShooterRatio: 0.25,
    triangleShooterRatio: 0.08,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: DEFAULT_CANVAS_HEIGHT,
  },
  hell: {
    minEnemies: 12,
    maxEnemies: 12,
    spawnCheckInterval: 500,
    spawnGap: 0,
    bounceShooterRatio: 0.46,
    triangleShooterRatio: 0.24,
    canvasWidth: HELL_CANVAS_WIDTH,
    canvasHeight: HELL_CANVAS_HEIGHT,
    hellTargetTriangles: 2,
  },
};

const MODE_ORDER = ["easy", "normal", "hard", "hell"];
const PLAY_MODE_ORDER = ["basic", "full"];
const ENEMY_SHOOT_INTERVAL = 1000;
const TRIANGLE_ENEMY_SHOOT_INTERVAL = 650;
const PLAYER_SHOOT_INTERVAL = 200;

class TcDanmakuShooterGame extends HTMLElement {
  constructor() {
    super();
    this.handleWindowKeydown = this.handleWindowKeydown.bind(this);
    this.handleWindowKeyup = this.handleWindowKeyup.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleRestartClick = this.handleRestartClick.bind(this);
    this.handleBackToMenuClick = this.handleBackToMenuClick.bind(this);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    this.canvas = null;
    this.ctx = null;
    this.scoreEl = null;
    this.timeEl = null;
    this.livesEl = null;
    this.stageEl = null;
    this.gameOverEl = null;
    this.finalScoreEl = null;
    this.restartBtn = null;
    this.backToMenuBtn = null;
    this.startBtn = null;
    this.gameOptionsEl = null;
    this.uiLayerEl = null;
    this.playModeModalEl = null;

    this.currentModeKey = "normal";
    this.currentPlayModeKey = "basic";
    this.gameRunning = false;
    this.gameOver = false;
    this.gamePaused = false;
    this.playModeModalOpen = false;
    this.score = 0;
    this.playTime = 0;
    this.lastTime = 0;
    this.enemySpawnCheckTimer = 0;
    this.enemyBurstRemaining = 0;
    this.enemyBurstTimer = 0;
    this.waveCounter = 0;
    this.lastTriangleWave = -2;
    this.nextTriangleWaveGap = 1;

    this.player = {
      x: 0,
      y: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      color: PLAYER_COLOR,
      lastShotTime: -PLAYER_SHOOT_INTERVAL,
      lives: PLAYER_MAX_LIVES,
      invulnerableUntil: 0,
      shieldUntil: 0,
      tripleShotUntil: 0,
    };

    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.enemyShootTimers = {};
    this.powerUps = [];
    this.animationFrameId = null;

    this.keys = {
      a: false,
      d: false,
      w: false,
      s: false,
      space: false,
    };
  }

  connectedCallback() {
    this.render();
    this.cacheDom();
    this.applyModeLayout();
    this.syncModeButtons();
    this.syncPlayModeButtons();
    this.updateUI();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
    this.stopLoop();
  }

  render() {
    this.innerHTML = `
      <div class="play-mini-game play-mini-game-shooter">
        <div class="play-shooter-head">
          <h2 class="play-mini-game-title play-shooter-title">
            <span>D</span><span>a</span><span>n</span><span>m</span><span>a</span><span>k</span><span>u</span>
            <span class="play-shooter-space"> </span>
            <span>S</span><span>h</span><span>o</span><span>o</span><span>t</span><span>e</span><span>r</span>
          </h2>
        </div>

        <div class="play-mini-game-panel play-shooter-panel">
          <div class="play-shooter-options">
            <div class="play-shooter-mode-picker" aria-label="难度选择">
              <div class="play-shooter-mode-row">
                <button class="play-shooter-mode-btn mode-easy" data-mode="easy" type="button">简单</button>
                <button class="play-shooter-mode-btn mode-normal" data-mode="normal" type="button">中等</button>
                <button class="play-shooter-mode-btn mode-hard" data-mode="hard" type="button">困难</button>
              </div>
              <div class="play-shooter-mode-row play-shooter-mode-row-hell">
                <button class="play-shooter-mode-btn mode-hell" data-mode="hell" type="button">地狱</button>
              </div>
            </div>
            <p class="play-shooter-hint">点击开始后，再用 A / D 选择基础模式或全屏模式，空格确认。</p>
            <button class="play-mini-game-button play-mini-game-button-start play-shooter-start-button" type="button" data-role="start">
              开始游戏
            </button>
          </div>
        </div>

        <div class="play-shooter-stage">
          <canvas class="play-shooter-canvas" width="960" height="720"></canvas>
          <div class="play-shooter-ui is-hidden" data-role="ui-layer">
            <div class="play-shooter-lives" aria-label="生命值"></div>
            <div class="play-shooter-status play-shooter-score">得分: 0</div>
            <div class="play-shooter-status play-shooter-time">时间: 0s</div>
            <div class="play-shooter-game-over is-hidden" data-role="game-over">
              <h3>你被击中了</h3>
              <p data-role="final-score"></p>
              <div class="play-shooter-game-over-actions">
                <button class="play-mini-game-button play-mini-game-button-start" type="button" data-role="restart">重新开始</button>
                <button class="play-mini-game-button play-mini-game-button-exit" type="button" data-role="back-to-menu">
                  回到菜单
                </button>
              </div>
            </div>
            <div class="play-mini-game-pause is-hidden" data-role="pause-overlay">
              <h3>已暂停</h3>
              <p>按 P 键继续游戏</p>
              <button class="play-mini-game-button play-mini-game-button-exit" type="button" data-role="force-back">
                返回大厅
              </button>
            </div>
          </div>
        </div>

        <p class="play-shooter-rule-banner">A / D 左右移动，空格发射，P 键暂停。</p>

        <div class="play-shooter-modal is-hidden" data-role="play-mode-modal" aria-label="玩法模式弹窗">
          <div class="play-shooter-dialog">
            <h3>选择玩法模式</h3>
            <p>使用 A / D 切换，按空格确认</p>
            <div class="play-shooter-play-mode-picker">
              <button class="play-shooter-play-mode-btn" data-play-mode="basic" type="button">基础模式</button>
              <button class="play-shooter-play-mode-btn" data-play-mode="full" type="button">全屏模式</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  cacheDom() {
    this.canvas = this.querySelector(".play-shooter-canvas");
    this.ctx = this.canvas?.getContext("2d");
    this.scoreEl = this.querySelector(".play-shooter-score");
    this.timeEl = this.querySelector(".play-shooter-time");
    this.livesEl = this.querySelector(".play-shooter-lives");
    this.stageEl = this.querySelector(".play-shooter-stage");
    this.gameOverEl = this.querySelector('[data-role="game-over"]');
    this.finalScoreEl = this.querySelector('[data-role="final-score"]');
    this.pauseOverlayEl = this.querySelector('[data-role="pause-overlay"]');
    this.restartBtn = this.querySelector('[data-role="restart"]');
    this.backToMenuBtn = this.querySelector('[data-role="back-to-menu"]');
    this.startBtn = this.querySelector('[data-role="start"]');
    this.gameOptionsEl = this.querySelector(".play-shooter-options");
    this.uiLayerEl = this.querySelector('[data-role="ui-layer"]');
    this.playModeModalEl = this.querySelector('[data-role="play-mode-modal"]');
  }

  bindEvents() {
    window.addEventListener("keydown", this.handleWindowKeydown);
    window.addEventListener("keyup", this.handleWindowKeyup);
    this.startBtn?.addEventListener("click", this.handleStartClick);
    this.restartBtn?.addEventListener("click", this.handleRestartClick);
    this.backToMenuBtn?.addEventListener("click", this.handleBackToMenuClick);
    this.addEventListener("click", this.handleRootClick);
  }

  unbindEvents() {
    window.removeEventListener("keydown", this.handleWindowKeydown);
    window.removeEventListener("keyup", this.handleWindowKeyup);
    this.startBtn?.removeEventListener("click", this.handleStartClick);
    this.restartBtn?.removeEventListener("click", this.handleRestartClick);
    this.backToMenuBtn?.removeEventListener("click", this.handleBackToMenuClick);
    this.removeEventListener("click", this.handleRootClick);
  }

  handleRootClick(event) {
    const modeButton = event.target.closest("[data-mode]");
    const playModeButton = event.target.closest("[data-play-mode]");
    const roleButton = event.target.closest("[data-role]");

    if (roleButton?.dataset.role === "force-back") {
      this.returnToMenu();
      return;
    }

    if (modeButton && !this.gameRunning) {
      this.currentModeKey = modeButton.dataset.mode;
      this.syncModeButtons();
      return;
    }

    if (playModeButton && !this.gameRunning && this.playModeModalOpen) {
      this.currentPlayModeKey = playModeButton.dataset.playMode;
      this.syncPlayModeButtons();
      this.confirmPlayModeSelection();
    }
  }

  handleWindowKeydown(event) {
    if (!this.isConnected) {
      return;
    }

    const lowerKey = event.key.toLowerCase();

    if (!this.gameRunning && this.gameOptionsEl?.style.display !== "none") {
      if (this.playModeModalOpen) {
        if (lowerKey === "a" || lowerKey === "w") {
          this.cyclePlayMode(-1);
          event.preventDefault();
          return;
        }

        if (lowerKey === "d" || lowerKey === "s") {
          this.cyclePlayMode(1);
          event.preventDefault();
          return;
        }

        if (event.code === "Space" || event.key === " " || event.key === "Enter") {
          this.confirmPlayModeSelection();
          event.preventDefault();
          return;
        }
      }

      if (event.code === "Space" || event.key === " " || event.key === "Enter") {
        this.startGame();
        event.preventDefault();
        return;
      }

      if (lowerKey === "a") {
        this.cycleMode(-1);
        event.preventDefault();
        return;
      }

      if (lowerKey === "d") {
        this.cycleMode(1);
        event.preventDefault();
        return;
      }

      if (lowerKey === "w") {
        this.cycleMode(-1);
        event.preventDefault();
        return;
      }

      if (lowerKey === "s") {
        this.cycleMode(1);
        event.preventDefault();
        return;
      }
    }

    if (lowerKey === "p") {
      this.togglePause();
      event.preventDefault();
      return;
    }

    if (this.gamePaused) {
      return;
    }

    if (lowerKey === "a") this.keys.a = true;
    if (lowerKey === "d") this.keys.d = true;
    if (lowerKey === "w") this.keys.w = true;
    if (lowerKey === "s") this.keys.s = true;

    if (event.code === "Space" || event.key === " ") {
      this.keys.space = true;
      event.preventDefault();

      if (this.gameOver) {
        this.restartGame();
      }
    }
  }

  handleWindowKeyup(event) {
    const lowerKey = event.key.toLowerCase();

    if (lowerKey === "a") this.keys.a = false;
    if (lowerKey === "d") this.keys.d = false;
    if (lowerKey === "w") this.keys.w = false;
    if (lowerKey === "s") this.keys.s = false;
    if (event.code === "Space" || event.key === " ") this.keys.space = false;
  }

  handleStartClick() {
    this.startGame();
  }

  handleRestartClick() {
    this.restartGame();
  }

  handleBackToMenuClick() {
    this.returnToMenu();
  }

  getCurrentMode() {
    return GAME_MODES[this.currentModeKey];
  }

  cycleMode(direction) {
    const currentIndex = MODE_ORDER.indexOf(this.currentModeKey);
    const nextIndex = (currentIndex + direction + MODE_ORDER.length) % MODE_ORDER.length;
    this.currentModeKey = MODE_ORDER[nextIndex];
    this.syncModeButtons();
  }

  cyclePlayMode(direction) {
    const currentIndex = PLAY_MODE_ORDER.indexOf(this.currentPlayModeKey);
    const nextIndex = (currentIndex + direction + PLAY_MODE_ORDER.length) % PLAY_MODE_ORDER.length;
    this.currentPlayModeKey = PLAY_MODE_ORDER[nextIndex];
    this.syncPlayModeButtons();
  }

  syncModeButtons() {
    this.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === this.currentModeKey);
    });
  }

  syncPlayModeButtons() {
    this.querySelectorAll("[data-play-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.playMode === this.currentPlayModeKey);
    });
  }

  openPlayModeModal() {
    this.playModeModalOpen = true;
    this.playModeModalEl?.classList.remove("is-hidden");
    this.syncPlayModeButtons();
  }

  closePlayModeModal() {
    this.playModeModalOpen = false;
    this.playModeModalEl?.classList.add("is-hidden");
  }

  confirmPlayModeSelection() {
    if (!this.playModeModalOpen) {
      return;
    }

    this.startSelectedGame();
  }

  applyModeLayout() {
    const { canvasWidth, canvasHeight } = this.getCurrentMode();

    if (this.canvas) {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
    }

    if (this.stageEl) {
      this.stageEl.style.maxWidth = `${canvasWidth}px`;
    }

    if (this.uiLayerEl) {
      this.uiLayerEl.style.width = "100%";
      this.uiLayerEl.style.height = "100%";
    }
  }

  startGame() {
    if (this.gameRunning) {
      return;
    }

    this.openPlayModeModal();
  }

  startSelectedGame() {
    if (this.gameRunning) {
      return;
    }

    this.applyModeLayout();
    this.resetGameState();

    if (this.gameOptionsEl) {
      this.gameOptionsEl.style.display = "none";
    }

    this.canvas.style.display = "block";
    this.querySelector(".play-shooter-panel")?.classList.add("is-hidden");
    this.uiLayerEl?.classList.remove("is-hidden");
    this.closePlayModeModal();
    this.gameRunning = true;
    this.gamePaused = false;
    this.lastTime = performance.now();
    this.startLoop();
  }

  restartGame() {
    if (this.gameRunning) {
      return;
    }

    this.applyModeLayout();
    this.resetGameState();
    this.gameOverEl?.classList.add("is-hidden");
    this.gameRunning = true;
    this.gamePaused = false;
    this.pauseOverlayEl?.classList.add("is-hidden");
    this.lastTime = performance.now();
    this.startLoop();
  }

  returnToMenu() {
    this.gameRunning = false;
    this.gameOver = false;
    this.enemyBurstRemaining = 0;
    this.enemyBurstTimer = 0;
    this.enemySpawnCheckTimer = 0;

    this.stopLoop();
    this.canvas.style.display = "none";
    this.querySelector(".play-shooter-panel")?.classList.remove("is-hidden");
    this.uiLayerEl?.classList.add("is-hidden");
    this.gameOverEl?.classList.add("is-hidden");
    this.pauseOverlayEl?.classList.add("is-hidden");

    if (this.gameOptionsEl) {
      this.gameOptionsEl.style.display = "flex";
    }

    this.closePlayModeModal();
    this.applyModeLayout();
    this.syncModeButtons();
    this.syncPlayModeButtons();
    this.updateUI();
  }

  resetGameState() {
    const playerScale = this.currentModeKey === "hell" ? HELL_PLAYER_SCALE : 1;

    this.player.width = PLAYER_WIDTH * playerScale;
    this.player.height = PLAYER_HEIGHT * playerScale;
    this.player.x = this.canvas.width / 2 - this.player.width / 2;
    this.player.y = this.canvas.height - this.player.height - 10;
    this.player.lastShotTime = -PLAYER_SHOOT_INTERVAL;
    this.player.lives = PLAYER_MAX_LIVES;
    this.player.invulnerableUntil = 0;
    this.player.shieldUntil = 0;
    this.player.tripleShotUntil = 0;

    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.enemyShootTimers = {};
    this.powerUps = [];

    this.score = 0;
    this.playTime = 0;
    this.gameOver = false;
    this.gamePaused = false;
    this.enemySpawnCheckTimer = 0;
    this.enemyBurstRemaining = 0;
    this.enemyBurstTimer = 0;
    this.waveCounter = 0;
    this.lastTriangleWave = -2;
    this.nextTriangleWaveGap = 1 + Math.floor(Math.random() * 2);

    this.spawnEnemiesImmediately(this.getCurrentMode().minEnemies);
    this.updateUI();
  }

  togglePause() {
    if (!this.gameRunning || this.gameOver) {
      return;
    }

    this.gamePaused = !this.gamePaused;
    this.pauseOverlayEl?.classList.toggle("is-hidden", !this.gamePaused);
  }

  spawnEnemiesImmediately(count) {
    const { maxEnemies } = this.getCurrentMode();

    for (let index = 0; index < count && this.enemies.length < maxEnemies; index += 1) {
      this.createEnemy();
    }
  }

  getEnemyColor() {
    const activeColors = new Set(this.enemies.map((enemy) => enemy.color));
    const unusedColor = ENEMY_BASE_COLORS.find((color) => !activeColors.has(color));

    if (unusedColor) {
      return unusedColor;
    }

    const hue = (this.enemies.length * 53 + this.score * 7) % 360;
    return `hsl(${hue}, 85%, 62%)`;
  }

  createEnemy() {
    const mode = this.getCurrentMode();
    const widthScale =
      ENEMY_WIDTH_SCALE_MIN + Math.random() * (ENEMY_WIDTH_SCALE_MAX - ENEMY_WIDTH_SCALE_MIN);
    const width = ENEMY_BASE_WIDTH * widthScale;
    const height = ENEMY_BASE_HEIGHT;
    const spawnPosition = this.findEnemySpawnPosition(width, height);

    const shotPatternRoll = Math.random();
    let shotPattern = "straight";
    let shape = "rect";
    let shootInterval = ENEMY_SHOOT_INTERVAL;
    let shieldHitsRemaining = 0;

    const activeTriangleCount = this.enemies.filter((enemy) => enemy.shape === "triangle").length;
    const forceTriangleInHell =
      this.currentModeKey === "hell" && activeTriangleCount < mode.hellTargetTriangles;

    if (
      this.canSpawnTriangleEnemy() &&
      (forceTriangleInHell || shotPatternRoll < mode.triangleShooterRatio)
    ) {
      shotPattern = "spread";
      shape = "triangle";
      shootInterval = TRIANGLE_ENEMY_SHOOT_INTERVAL;
      shieldHitsRemaining = 1;
    } else if (
      (this.currentModeKey === "hell" && Math.random() < 0.5) ||
      (this.currentModeKey !== "hell" &&
        shotPatternRoll < mode.triangleShooterRatio + mode.bounceShooterRatio)
    ) {
      shotPattern = "bounce";
    }

    const enemy = {
      x: spawnPosition.x,
      y: spawnPosition.y,
      width,
      height,
      color: this.getEnemyColor(),
      id: `${Date.now()}-${Math.random()}`,
      horizontalDirection: Math.random() > 0.5 ? 1 : -1,
      horizontalSpeed:
        ENEMY_HORIZONTAL_SPEED_MIN +
        Math.random() * (ENEMY_HORIZONTAL_SPEED_MAX - ENEMY_HORIZONTAL_SPEED_MIN),
      directionChangeTimer: 0,
      directionChangeInterval: 1000 + Math.random() * 2000,
      trail: [],
      shotPattern,
      shape,
      shootInterval,
      shieldHitsRemaining,
    };

    this.enemies.push(enemy);
    this.enemyShootTimers[enemy.id] = 0;

    if (enemy.shape === "triangle" && this.currentModeKey !== "hell") {
      this.lastTriangleWave = this.waveCounter;
      this.nextTriangleWaveGap = 1 + Math.floor(Math.random() * 2);
    }
  }

  canSpawnTriangleEnemy() {
    if (this.currentModeKey === "hell") {
      return (
        this.enemies.filter((enemy) => enemy.shape === "triangle").length <
        this.getCurrentMode().hellTargetTriangles
      );
    }

    const hasActiveTriangle = this.enemies.some((enemy) => enemy.shape === "triangle");
    if (hasActiveTriangle) {
      return false;
    }

    return this.waveCounter - this.lastTriangleWave >= this.nextTriangleWaveGap;
  }

  findEnemySpawnPosition(width, height) {
    const spawnAreaHeight = Math.max(height * 4, this.canvas.height * 0.22);

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = {
        x: Math.random() * (this.canvas.width - width),
        y: -height - Math.random() * spawnAreaHeight,
        width,
        height,
      };

      const overlaps = this.enemies.some((enemy) =>
        this.checkAABBCollisionWithPadding(candidate, enemy, ENEMY_SPAWN_PADDING)
      );

      if (!overlaps) {
        return candidate;
      }
    }

    return {
      x: Math.random() * (this.canvas.width - width),
      y: -height - Math.random() * spawnAreaHeight,
    };
  }

  createPlayerBullet() {
    const bulletX = this.player.x + this.player.width / 2 - BULLET_WIDTH / 2;
    const bulletY = this.player.y - BULLET_HEIGHT;

    this.playerBullets.push({
      x: bulletX,
      y: bulletY,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT,
      color: PLAYER_BULLET_COLOR,
      vx: 0,
      vy: -PLAYER_BULLET_SPEED,
      alpha: 1,
    });

    if (performance.now() < this.player.tripleShotUntil) {
      const angleRad = (PLAYER_TRIPLE_SHOT_ANGLE_DEG * Math.PI) / 180;
      const horizontalVelocity = Math.sin(angleRad) * PLAYER_BULLET_SPEED;
      const verticalVelocity = Math.cos(angleRad) * PLAYER_BULLET_SPEED;

      this.playerBullets.push(
        {
          x: bulletX - 10,
          y: bulletY,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          color: PLAYER_BULLET_COLOR,
          vx: -horizontalVelocity,
          vy: -verticalVelocity,
          alpha: 1,
        },
        {
          x: bulletX + 10,
          y: bulletY,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          color: PLAYER_BULLET_COLOR,
          vx: horizontalVelocity,
          vy: -verticalVelocity,
          alpha: 1,
        }
      );
    }
  }

  createEnemyBullet(enemy) {
    if (enemy.shotPattern === "bounce") {
      const angleDeg =
        BOUNCE_BULLET_MIN_ANGLE_DEG +
        Math.random() * (BOUNCE_BULLET_MAX_ANGLE_DEG - BOUNCE_BULLET_MIN_ANGLE_DEG);
      const angleRad = (angleDeg * Math.PI) / 180;
      const horizontalVelocity = Math.cos(angleRad) * ENEMY_BULLET_SPEED;
      const verticalVelocity = Math.sin(angleRad) * ENEMY_BULLET_SPEED;
      const fireLeft = Math.random() > 0.5;

      this.enemyBullets.push({
        x: enemy.x + enemy.width / 2 - BULLET_WIDTH / 2,
        y: enemy.y + enemy.height,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        color: enemy.color,
        vx: fireLeft ? -horizontalVelocity : horizontalVelocity,
        vy: verticalVelocity,
        alpha: 1,
        isBouncy: true,
      });
      return;
    }

    if (enemy.shotPattern === "spread") {
      const angleDeg =
        BOUNCE_BULLET_MIN_ANGLE_DEG +
        Math.random() * (BOUNCE_BULLET_MAX_ANGLE_DEG - BOUNCE_BULLET_MIN_ANGLE_DEG);
      const angleRad = (angleDeg * Math.PI) / 180;
      const horizontalVelocity = Math.cos(angleRad) * ENEMY_BULLET_SPEED;
      const verticalVelocity = Math.sin(angleRad) * ENEMY_BULLET_SPEED;

      this.enemyBullets.push(
        {
          x: enemy.x + enemy.width * 0.28 - BULLET_WIDTH / 2,
          y: enemy.y + enemy.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          color: enemy.color,
          vx: -horizontalVelocity,
          vy: verticalVelocity,
          alpha: 1,
          isBouncy: false,
        },
        {
          x: enemy.x + enemy.width / 2 - BULLET_WIDTH / 2,
          y: enemy.y + enemy.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          color: enemy.color,
          vx: 0,
          vy: ENEMY_BULLET_SPEED,
          alpha: 1,
          isBouncy: false,
        },
        {
          x: enemy.x + enemy.width * 0.72 - BULLET_WIDTH / 2,
          y: enemy.y + enemy.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          color: enemy.color,
          vx: horizontalVelocity,
          vy: verticalVelocity,
          alpha: 1,
          isBouncy: false,
        }
      );
      return;
    }

    this.enemyBullets.push({
      x: enemy.x + enemy.width / 2 - BULLET_WIDTH / 2,
      y: enemy.y + enemy.height,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT,
      color: enemy.color,
      vx: 0,
      vy: ENEMY_BULLET_SPEED,
      alpha: 1,
      isBouncy: false,
    });
  }

  maybeSpawnPowerUp(enemy) {
    if (Math.random() > POWER_UP_DROP_CHANCE) {
      return;
    }

    const missingLives = this.player.lives < PLAYER_MAX_LIVES;
    const roll = Math.random();
    let type = "shield";

    if (missingLives && roll > 0.82) {
      type = "heal";
    } else if (roll > 0.55) {
      type = "tripleShot";
    }

    this.powerUps.push({
      type,
      x: enemy.x + enemy.width / 2 - POWER_UP_SIZE / 2,
      y: enemy.y + enemy.height / 2 - POWER_UP_SIZE / 2,
      width: POWER_UP_SIZE,
      height: POWER_UP_SIZE,
      speed: POWER_UP_FALL_SPEED,
      phase: Math.random() * Math.PI * 2,
    });
  }

  update(currentTime) {
    if (this.gameOver || this.gamePaused) {
      return;
    }

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;
    this.playTime += deltaTime;
    this.updateUI();
    this.updatePlayer(deltaTime, currentTime);
    this.updateEnemies(deltaTime);
    this.resolveEnemyOverlaps();
    this.updateBullets(deltaTime);
    this.updatePowerUps(deltaTime, currentTime);
    this.manageEnemies(deltaTime);
    this.checkCollisions(currentTime);
  }

  updatePlayer(deltaTime, currentTime) {
    if (this.keys.a) {
      this.player.x -= PLAYER_SPEED * deltaTime;
    }

    if (this.keys.d) {
      this.player.x += PLAYER_SPEED * deltaTime;
    }

    if (this.currentPlayModeKey === "full") {
      if (this.keys.w) {
        this.player.y -= PLAYER_SPEED * deltaTime;
      }

      if (this.keys.s) {
        this.player.y += PLAYER_SPEED * deltaTime;
      }
    }

    this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
    this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));

    if (this.keys.space && currentTime - this.player.lastShotTime >= PLAYER_SHOOT_INTERVAL) {
      this.createPlayerBullet();
      this.player.lastShotTime = currentTime;
    }
  }

  updateEnemies(deltaTime) {
    for (let index = this.enemies.length - 1; index >= 0; index -= 1) {
      const enemy = this.enemies[index];
      enemy.y += ENEMY_VERTICAL_SPEED * deltaTime;
      enemy.directionChangeTimer += deltaTime * 1000;

      if (enemy.directionChangeTimer >= enemy.directionChangeInterval) {
        enemy.horizontalDirection = Math.random() > 0.5 ? 1 : -1;
        enemy.directionChangeTimer = 0;
        enemy.directionChangeInterval = 1000 + Math.random() * 2000;
      }

      enemy.x += enemy.horizontalDirection * enemy.horizontalSpeed * deltaTime;

      if (enemy.x < 0) {
        enemy.x = 0;
        enemy.horizontalDirection = 1;
      } else if (enemy.x + enemy.width > this.canvas.width) {
        enemy.x = this.canvas.width - enemy.width;
        enemy.horizontalDirection = -1;
      }

      enemy.trail.unshift({
        x: enemy.x,
        y: enemy.y,
        alpha: 0.55,
      });
      enemy.trail = enemy.trail.slice(0, 5).map((trailPoint, trailIndex) => ({
        ...trailPoint,
        alpha: Math.max(0.08, 0.55 - trailIndex * 0.1),
      }));

      if (enemy.y > this.canvas.height) {
        this.removeEnemyAt(index);
        continue;
      }

      this.enemyShootTimers[enemy.id] += deltaTime * 1000;
      if (this.enemyShootTimers[enemy.id] >= enemy.shootInterval) {
        this.createEnemyBullet(enemy);
        this.enemyShootTimers[enemy.id] = 0;
      }
    }
  }

  resolveEnemyOverlaps() {
    for (let index = 0; index < this.enemies.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < this.enemies.length; nextIndex += 1) {
        const enemyA = this.enemies[index];
        const enemyB = this.enemies[nextIndex];

        if (!this.checkAABBCollision(enemyA, enemyB)) {
          continue;
        }

        const centerAX = enemyA.x + enemyA.width / 2;
        const centerBX = enemyB.x + enemyB.width / 2;
        const overlapX = Math.min(
          enemyA.x + enemyA.width - enemyB.x,
          enemyB.x + enemyB.width - enemyA.x
        );
        const pushDistance = Math.max(2, overlapX / 2 + 2);

        if (centerAX <= centerBX) {
          enemyA.x -= pushDistance;
          enemyB.x += pushDistance;
          enemyA.horizontalDirection = -1;
          enemyB.horizontalDirection = 1;
        } else {
          enemyA.x += pushDistance;
          enemyB.x -= pushDistance;
          enemyA.horizontalDirection = 1;
          enemyB.horizontalDirection = -1;
        }

        enemyA.x = Math.max(0, Math.min(this.canvas.width - enemyA.width, enemyA.x));
        enemyB.x = Math.max(0, Math.min(this.canvas.width - enemyB.width, enemyB.x));
      }
    }
  }

  updateBullets(deltaTime) {
    for (let index = this.playerBullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.playerBullets[index];
      bullet.x += bullet.vx * deltaTime;
      bullet.y += bullet.vy * deltaTime;
      bullet.alpha = Math.max(0.35, bullet.alpha - 0.03);

      if (
        bullet.y < -bullet.height ||
        bullet.x < -bullet.width ||
        bullet.x > this.canvas.width + bullet.width
      ) {
        this.playerBullets.splice(index, 1);
      }
    }

    for (let index = this.enemyBullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.enemyBullets[index];
      bullet.x += bullet.vx * deltaTime;
      bullet.y += bullet.vy * deltaTime;
      bullet.alpha = Math.max(0.35, bullet.alpha - 0.012);

      if (bullet.isBouncy) {
        if (bullet.x < 0) {
          bullet.x = 0;
          bullet.vx *= -1;
        } else if (bullet.x + bullet.width > this.canvas.width) {
          bullet.x = this.canvas.width - bullet.width;
          bullet.vx *= -1;
        }
      }

      if (bullet.y > this.canvas.height) {
        this.enemyBullets.splice(index, 1);
      }
    }
  }

  updatePowerUps(deltaTime, currentTime) {
    for (let index = this.powerUps.length - 1; index >= 0; index -= 1) {
      const powerUp = this.powerUps[index];
      powerUp.y += powerUp.speed * deltaTime;
      powerUp.x += Math.sin(currentTime / 260 + powerUp.phase) * 18 * deltaTime;

      if (powerUp.y > this.canvas.height) {
        this.powerUps.splice(index, 1);
        continue;
      }

      if (!this.checkAABBCollision(powerUp, this.player)) {
        continue;
      }

      this.applyPowerUp(powerUp, currentTime);
      this.powerUps.splice(index, 1);
    }
  }

  applyPowerUp(powerUp, currentTime) {
    if (powerUp.type === "shield") {
      this.player.shieldUntil = Math.max(this.player.shieldUntil, currentTime + SHIELD_DURATION);
      return;
    }

    if (powerUp.type === "heal") {
      this.player.lives = Math.min(PLAYER_MAX_LIVES, this.player.lives + 1);
      this.updateUI();
      return;
    }

    if (powerUp.type === "tripleShot") {
      this.player.tripleShotUntil = Math.max(
        this.player.tripleShotUntil,
        currentTime + PLAYER_TRIPLE_SHOT_DURATION
      );
    }
  }

  manageEnemies(deltaTime) {
    const { minEnemies, maxEnemies, spawnCheckInterval, spawnGap } = this.getCurrentMode();
    this.enemySpawnCheckTimer += deltaTime * 1000;

    if (this.enemySpawnCheckTimer >= spawnCheckInterval) {
      this.enemySpawnCheckTimer = 0;

      if (this.enemies.length < minEnemies) {
        this.waveCounter += 1;

        if (this.currentModeKey === "hell") {
          while (this.enemies.length < maxEnemies) {
            this.createEnemy();
          }

          this.enemyBurstRemaining = 0;
          return;
        }

        this.enemyBurstRemaining = maxEnemies - this.enemies.length;
        this.enemyBurstTimer = 0;
      }
    }

    if (this.enemyBurstRemaining <= 0) {
      return;
    }

    this.enemyBurstTimer += deltaTime * 1000;
    if (this.enemyBurstTimer >= spawnGap) {
      this.enemyBurstTimer = 0;

      if (this.enemies.length < maxEnemies) {
        this.createEnemy();
      }

      this.enemyBurstRemaining -= 1;
    }
  }

  checkCollisions(currentTime) {
    for (let bulletIndex = this.playerBullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
      const bullet = this.playerBullets[bulletIndex];

      for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
        const enemy = this.enemies[enemyIndex];

        if (!this.checkAABBCollision(bullet, enemy)) {
          continue;
        }

        this.playerBullets.splice(bulletIndex, 1);

        if (enemy.shieldHitsRemaining > 0) {
          enemy.shieldHitsRemaining -= 1;
        } else {
          this.maybeSpawnPowerUp(enemy);
          this.removeEnemyAt(enemyIndex);
          this.score += 10;
        }

        break;
      }
    }

    if (currentTime < this.player.invulnerableUntil) {
      return;
    }

    for (let index = this.enemyBullets.length - 1; index >= 0; index -= 1) {
      if (!this.checkAABBCollision(this.enemyBullets[index], this.player)) {
        continue;
      }

      this.enemyBullets.splice(index, 1);
      this.damagePlayer(currentTime);
      return;
    }

    for (let index = this.enemies.length - 1; index >= 0; index -= 1) {
      if (!this.checkAABBCollision(this.enemies[index], this.player)) {
        continue;
      }

      this.maybeSpawnPowerUp(this.enemies[index]);
      this.removeEnemyAt(index);
      this.damagePlayer(currentTime);
      return;
    }
  }

  damagePlayer(currentTime) {
    if (currentTime < this.player.shieldUntil) {
      this.player.shieldUntil = 0;
      this.player.invulnerableUntil = currentTime + 500;
      return;
    }

    this.player.lives -= 1;
    this.player.invulnerableUntil = currentTime + PLAYER_INVULNERABLE_DURATION;
    this.updateUI();

    if (this.player.lives <= 0) {
      this.triggerGameOver();
    }
  }

  removeEnemyAt(index) {
    const [enemy] = this.enemies.splice(index, 1);

    if (enemy) {
      delete this.enemyShootTimers[enemy.id];
    }
  }

  checkAABBCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  checkAABBCollisionWithPadding(rect1, rect2, padding) {
    return (
      rect1.x - padding < rect2.x + rect2.width &&
      rect1.x + rect1.width + padding > rect2.x &&
      rect1.y - padding < rect2.y + rect2.height &&
      rect1.y + rect1.height + padding > rect2.y
    );
  }

  triggerGameOver() {
    this.gameOver = true;
    this.gameRunning = false;
    this.stopLoop();

    if (this.finalScoreEl) {
      this.finalScoreEl.textContent = `最终得分: ${this.score}`;
    }

    this.gameOverEl?.classList.remove("is-hidden");
  }

  updateUI() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `得分: ${this.score}`;
    }

    if (this.timeEl) {
      this.timeEl.textContent = `时间: ${Math.floor(this.playTime)}s`;
    }

    if (this.livesEl) {
      this.livesEl.innerHTML = Array.from({ length: PLAYER_MAX_LIVES }, (_, index) =>
        index < this.player.lives
          ? '<span class="play-shooter-life">❤</span>'
          : '<span class="play-shooter-life play-shooter-life-lost">❤</span>'
      ).join("");
    }
  }

  drawPlayer() {
    const isInvulnerable = performance.now() < this.player.invulnerableUntil;
    const shouldShowPlayer = !isInvulnerable || Math.floor(performance.now() / 100) % 2 === 0;

    if (!shouldShowPlayer) {
      return;
    }

    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    if (performance.now() < this.player.shieldUntil) {
      this.ctx.save();
      this.ctx.strokeStyle = "#7FDBFF";
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = "#7FDBFF";
      this.ctx.shadowBlur = 12;
      this.ctx.strokeRect(
        this.player.x - 6,
        this.player.y - 6,
        this.player.width + 12,
        this.player.height + 12
      );
      this.ctx.restore();
    }
  }

  drawPowerUps(currentTime) {
    this.powerUps.forEach((powerUp) => {
      const bobOffset = Math.sin(currentTime / 180 + powerUp.phase) * 2;

      this.ctx.save();
      this.ctx.translate(
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + bobOffset
      );

      if (powerUp.type === "shield") {
        this.ctx.fillStyle = "#7FDBFF";
        this.ctx.shadowColor = "#7FDBFF";
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, powerUp.width / 3.2, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (powerUp.type === "heal") {
        this.ctx.fillStyle = "#FF6B81";
        this.ctx.shadowColor = "#FF6B81";
        this.ctx.shadowBlur = 12;
        this.ctx.fillRect(-5, -11, 10, 22);
        this.ctx.fillRect(-11, -5, 22, 10);
      } else {
        this.ctx.strokeStyle = "#FFD166";
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = "#FFD166";
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(0, 10);
        this.ctx.moveTo(0, -6);
        this.ctx.lineTo(-9, 10);
        this.ctx.moveTo(0, -6);
        this.ctx.lineTo(9, 10);
        this.ctx.stroke();
      }

      this.ctx.restore();
    });
  }

  drawBulletBody(bullet, shadowBlur) {
    const hasDirection = bullet.vx !== 0 || bullet.vy !== 0;
    const angle = hasDirection ? Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2 : 0;

    this.ctx.save();
    this.ctx.globalAlpha = bullet.alpha;
    this.ctx.fillStyle = bullet.color;
    this.ctx.shadowColor = bullet.color;
    this.ctx.shadowBlur = shadowBlur;
    this.ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
    this.ctx.rotate(angle);
    this.ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
    this.ctx.restore();
  }

  drawEnemyBullets() {
    this.enemyBullets.forEach((bullet) => {
      this.ctx.save();
      this.ctx.shadowColor = bullet.color;
      this.ctx.shadowBlur = bullet.isBouncy ? 12 : 8;

      for (let index = 0; index < 5; index += 1) {
        const offset = index * 3;
        const scale = 1 - index * 0.15;
        this.ctx.globalAlpha = Math.max(0.08, bullet.alpha * (0.8 - index * 0.15));
        this.ctx.fillStyle = bullet.color;
        this.ctx.fillRect(
          bullet.x - (bullet.width * scale - bullet.width) / 2,
          bullet.y - offset,
          bullet.width * scale,
          bullet.height * scale
        );
      }

      const hasDirection = bullet.vx !== 0 || bullet.vy !== 0;
      const angle = hasDirection ? Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2 : 0;
      this.ctx.globalAlpha = bullet.alpha;
      this.ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
      this.ctx.rotate(angle);
      this.ctx.fillStyle = bullet.color;
      this.ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);

      if (bullet.isBouncy) {
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
      }

      this.ctx.restore();
    });
  }

  drawRectEnemy(enemy, x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);

    if (enemy.shotPattern === "bounce") {
      this.ctx.save();
      this.ctx.strokeStyle = "#FFFFFF";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.ellipse(
        x + width / 2,
        y + height / 2,
        Math.max(8, width * 0.18),
        height * 0.28,
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawTriangleEnemy(enemy, x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + width / 2, y);
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x, y + height);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.save();
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + width / 2, y + 4);
    this.ctx.lineTo(x + width / 2, y + height - 5);
    this.ctx.moveTo(x + width * 0.26, y + height - 6);
    this.ctx.lineTo(x + width * 0.74, y + height - 6);
    this.ctx.stroke();

    if (enemy.shieldHitsRemaining > 0) {
      this.ctx.strokeStyle = "#7FDBFF";
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowColor = "#7FDBFF";
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.ellipse(x + width / 2, y + height / 2, width * 0.72, height * 0.9, 0, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.trail.forEach((trailPoint, trailIndex) => {
        const scale = 0.76 + trailIndex * 0.05;
        const width = enemy.width * scale;
        const height = enemy.height * scale;
        const x = trailPoint.x + (enemy.width - width) / 2;
        const y = trailPoint.y + (enemy.height - height) / 2;

        this.ctx.save();
        this.ctx.globalAlpha = trailPoint.alpha;
        this.ctx.fillStyle = enemy.color;
        if (enemy.shape === "triangle") {
          this.drawTriangleEnemy(enemy, x, y, width, height);
        } else {
          this.drawRectEnemy(enemy, x, y, width, height);
        }
        this.ctx.restore();
      });

      this.ctx.fillStyle = enemy.color;
      if (enemy.shape === "triangle") {
        this.drawTriangleEnemy(enemy, enemy.x, enemy.y, enemy.width, enemy.height);
      } else {
        this.drawRectEnemy(enemy, enemy.x, enemy.y, enemy.width, enemy.height);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayer();
    this.drawEnemies();
    this.playerBullets.forEach((bullet) => this.drawBulletBody(bullet, 10));
    this.drawEnemyBullets();
    this.drawPowerUps(performance.now());
  }

  startLoop() {
    if (this.animationFrameId !== null) {
      return;
    }

    this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
  }

  stopLoop() {
    if (this.animationFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  gameLoop(currentTime) {
    this.animationFrameId = null;
    this.update(currentTime);
    this.draw();

    if (this.gameRunning) {
      this.startLoop();
    }
  }
}

if (!customElements.get("tc-danmaku-shooter-game")) {
  customElements.define("tc-danmaku-shooter-game", TcDanmakuShooterGame);
}
