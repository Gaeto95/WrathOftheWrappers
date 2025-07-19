// Collision detection utilities
export interface Point {
  x: number;
  y: number;
}

export interface Circle extends Point {
  radius: number;
}

export interface Rectangle extends Point {
  width: number;
  height: number;
}

export function circleToCircle(circle1: Circle, circle2: Circle): boolean {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

export function circleToCircleWithRadius(circle1: Circle, circle2: Circle, customRadius?: number): boolean {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const effectiveRadius = customRadius || circle2.radius;
  return distance < circle1.radius + effectiveRadius;
}
export function circleToRectangle(circle: Circle, rect: Rectangle): boolean {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance < circle.radius;
}

export function isOffScreen(point: Point, width: number, height: number, margin: number = 100): boolean {
  return point.x < -150 || point.x > width + 150 || 
         point.y < -150 || point.y > height + 150;
}

export function getRandomSpawnPosition(screenWidth: number, screenHeight: number, screenScale: number = 1): Point {
  // Calculate effective screen dimensions based on scale
  const effectiveWidth = screenWidth / screenScale;
  const effectiveHeight = screenHeight / screenScale;
  
  // Calculate center offset for scaled screen
  const centerOffsetX = (effectiveWidth - screenWidth) / 2;
  const centerOffsetY = (effectiveHeight - screenHeight) / 2;
  
  // Dynamic margin based on screen scale - spawn further out when zoomed out
  const baseMargin = 80;
  const scaleMargin = screenScale < 1 ? baseMargin / screenScale : baseMargin;
  const margin = Math.max(80, Math.min(200, scaleMargin));
  
  const side = Math.floor(Math.random() * 4);
  
  switch (side) {
    case 0: // Top
      return { 
        x: Math.random() * effectiveWidth - centerOffsetX, 
        y: -margin - centerOffsetY 
      };
    case 1: // Right
      return { 
        x: effectiveWidth + margin - centerOffsetX, 
        y: Math.random() * effectiveHeight - centerOffsetY 
      };
    case 2: // Bottom
      return { 
        x: Math.random() * effectiveWidth - centerOffsetX, 
        y: effectiveHeight + margin - centerOffsetY 
      };
    case 3: // Left
      return { 
        x: -margin - centerOffsetX, 
        y: Math.random() * effectiveHeight - centerOffsetY 
      };
    default:
      return { x: 0, y: 0 };
  }
}

export function getDistance(point1: Point, point2: Point): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(vector: Point): Point {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}