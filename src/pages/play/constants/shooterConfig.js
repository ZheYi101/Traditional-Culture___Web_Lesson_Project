export const PLAYER_WIDTH = 80;
export const PLAYER_HEIGHT = 20;
export const PLAYER_SPEED = 360;
export const PLAYER_COLOR = "#ffffff";
export const PLAYER_MAX_LIVES = 3;
export const PLAYER_INVULNERABLE_DURATION = 1200;
export const PLAYER_TRIPLE_SHOT_DURATION = 3000;
export const PLAYER_TRIPLE_SHOT_ANGLE_DEG = 35;
export const HELL_PLAYER_SCALE = 1 / 3;
export const DEFAULT_CANVAS_WIDTH = 960;
export const DEFAULT_CANVAS_HEIGHT = 720;
export const HELL_CANVAS_WIDTH = 1180;
export const HELL_CANVAS_HEIGHT = 860;

export const ENEMY_BASE_WIDTH = 80;
export const ENEMY_BASE_HEIGHT = 20;
export const ENEMY_WIDTH_SCALE_MIN = 0.5;
export const ENEMY_WIDTH_SCALE_MAX = 1;
export const ENEMY_VERTICAL_SPEED = 72;
export const ENEMY_HORIZONTAL_SPEED_MIN = 70;
export const ENEMY_HORIZONTAL_SPEED_MAX = 140;
export const ENEMY_BASE_COLORS = ["#FF5252", "#448AFF", "#69F0AE", "#FFD740", "#FF80AB", "#B388FF"];
export const ENEMY_SPAWN_PADDING = 24;

export const BULLET_WIDTH = 10;
export const BULLET_HEIGHT = 20;
export const PLAYER_BULLET_SPEED = 520;
export const ENEMY_BULLET_SPEED = 300;
export const PLAYER_BULLET_COLOR = "#18FFFF";
export const BOUNCE_BULLET_MIN_ANGLE_DEG = 30;
export const BOUNCE_BULLET_MAX_ANGLE_DEG = 60;

export const POWER_UP_SIZE = 24;
export const POWER_UP_FALL_SPEED = 150;
export const SHIELD_DURATION = 8000;
export const POWER_UP_DROP_CHANCE = 0.18;

export const GAME_MODES = {
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

export const MODE_ORDER = ["easy", "normal", "hard", "hell"];
export const PLAY_MODE_ORDER = ["basic", "full"];
export const ENEMY_SHOOT_INTERVAL = 1000;
export const TRIANGLE_ENEMY_SHOOT_INTERVAL = 650;
export const PLAYER_SHOOT_INTERVAL = 200;

export const SHOOTER_EFFECT_COLORS = {
  shield: "#7FDBFF",
  heal: "#FF6B81",
  tripleShot: "#FFD166",
  contrast: "#FFFFFF",
};
