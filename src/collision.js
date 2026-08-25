// Super Buster Bros - Collision Handler
export class CollisionHandler {
    constructor(game) {
        this.game = game;
    }
    
    update() {
        // Check player collisions with bubbles and projectiles
        this.checkPlayerCollisions();
        
        // Check projectile collisions with bubbles
        this.checkProjectileCollisions();
        
        // Check bubble-to-bubble collisions (simple version)
        this.checkBubbleCollisions();
    }
    
    checkPlayerCollisions() {
        const player = this.game.player;
        if (!player.isAlive) return;
        
        const playerBounds = player.getBounds();
        
        // Check collision with bubbles
        for (const bubble of this.game.bubbleManager.bubbles) {
            if (!bubble.active) continue;
            
            if (this.circleRectCollision(
                bubble.x, bubble.y, bubble.radius,
                playerBounds.x, playerBounds.y, playerBounds.width, playerBounds.height
            )) {
                // Player hit a bubble
                player.hit();
                // Create particle effect
                this.game.particleManager.createExplosion(
                    bubble.x, bubble.y, '#ff0000', 20
                );
                break; // Only handle first collision per frame
            }
        }
    }
    
    checkProjectileCollisions() {
        const projectiles = this.game.bubbleManager.projectiles;
        const bubbles = this.game.bubbleManager.bubbles;
        
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            if (!projectile.active) continue;
            
            const projBounds = {
                x: projectile.x - projectile.width / 2,
                y: projectile.y - projectile.height / 2,
                width: projectile.width,
                height: projectile.height
            };
            
            for (let j = bubbles.length - 1; j >= 0; j--) {
                const bubble = bubbles[j];
                if (!bubble.active) continue;
                
                if (this.circleRectCollision(
                    bubble.x, bubble.y, bubble.radius,
                    projBounds.x, projBounds.y, projBounds.width, projBounds.height
                )) {
                    // Projectile hit a bubble
                    this.game.bubbleManager.splitBubble(bubble);
                    projectile.active = false; // Remove projectile
                    
                    // Create hit effect
                    this.game.particleManager.createImpact(
                        bubble.x, bubble.y, bubble.color
                    );
                    
                    break; // Projectile can only hit one bubble
                }
            }
        }
    }
    
    checkBubbleCollisions() {
        // Simple bubble-to-bubble collision (optional, can be expensive)
        // For now, we'll skip this to keep performance good
        // In a more advanced implementation, we could add this
        const bubbles = this.game.bubbleManager.bubbles;
        for (let i = 0; i < bubbles.length; i++) {
            const bubbleA = bubbles[i];
            if (!bubbleA.active) continue;
            
            for (let j = i + 1; j < bubbles.length; j++) {
                const bubbleB = bubbles[j];
                if (!bubbleB.active) continue;
                
                // Simple distance check
                const dx = bubbleA.x - bubbleB.x;
                const dy = bubbleA.y - bubbleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = bubbleA.radius + bubbleB.radius;
                
                if (distance < minDistance) {
                    // Bubbles are colliding - apply simple separation
                    const overlap = minDistance - distance;
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    // Move bubbles apart
                    bubbleA.x += nx * overlap * 0.5;
                    bubbleA.y += ny * overlap * 0.5;
                    bubbleB.x -= nx * overlap * 0.5;
                    bubbleB.y -= ny * overlap * 0.5;
                    
                    // Exchange some velocity (simple elastic collision)
                    const dvx = bubbleA.vx - bubbleB.vx;
                    const dvy = bubbleA.vy - bubbleB.vy;
                    const dot = dvx * nx + dvy * ny;
                    
                    if (dot > 0) {
                        const impulse = 2 * dot / 2; // Assuming equal mass
                        bubbleA.vx -= impulse * nx;
                        bubbleA.vy -= impulse * ny;
                        bubbleB.vx += impulse * nx;
                        bubbleB.vy += impulse * ny;
                    }
                }
            }
        }
    }
    
    // Circle-rectangle collision detection
    circleRectCollision(circleX, circleY, radius, rectX, rectY, rectWidth, rectHeight) {
        // Find the closest point to the circle within the rectangle
        const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
        const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));
        
        // Calculate the distance between the circle's center and this closest point
        const dx = circleX - closestX;
        const dy = circleY - closestY;
        
        // If the distance is less than the radius, we have a collision
        return (dx * dx + dy * dy) < (radius * radius);
    }
    
    // Rectangle-rectangle collision detection (for debugging)
    rectRectCollision(rect1X, rect1Y, rect1Width, rect1Height, rect2X, rect2Y, rect2Width, rect2Height) {
        return rect1X < rect2X + rect2Width &&
               rect1X + rect1Width > rect2X &&
               rect1Y < rect2Y + rect2Height &&
               rect1Y + rect1Height > rect2Y;
    }
}