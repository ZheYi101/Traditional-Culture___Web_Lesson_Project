export const boatImageUrl = new URL("../assets/boat.png", import.meta.url).href;
export const stoneImageUrl = new URL("../assets/stone.png", import.meta.url).href;

export const BOAT_X = 80;
export const BOAT_WIDTH = 300;
export const BOAT_HEIGHT = 150;
export const OBSTACLE_WIDTH = 100;
export const OBSTACLE_HEIGHT = 80;
export const BOAT_COLLISION_TOLERANCE = 10;
export const MAX_SPEED = 14;
export const ACCELERATION = 0.12;
export const BASE_GAP = 500;
export const OBSTACLE_CLEANUP_THRESHOLD = -50;
export const BOUNCE_SPEED = 0.05;
export const BOUNCE_AMPLITUDE = 3;

export const BOAT_GAME_COLORS = {
  laneLine: "rgba(255, 255, 255, 0.4)",
  boatBody: "#d69e2e",
  boatTrim: "#b7791f",
  dragonRed: "#e53e3e",
  dragonEye: "#000000",
  wake: "rgba(255, 255, 255, 0.7)",
  rockBody: "#6b7280",
  rockCrack: "#4b5563",
  rockHighlight: "rgba(255, 255, 255, 0.2)",
  rockShadow: "rgba(0, 0, 0, 0.15)",
};
