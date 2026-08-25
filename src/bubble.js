// Super Buster Bros - Bubble Manager
export class BubbleManager {
    constructor(game) {
        this.game = game;
        this.bubbles = []; // Active bubbles
        this.projectiles = []; // Player's harpoons
        this.bubbleSizes = [
            { radius: 20, points: 1000, color: '#ff0000' }, // Large (Red)
            { radius: 15, points: 500, color: '#00ff00' }, // Medium (Green)
            { radius: 10, points: 250, color: '#0000ff' }, // Small (Blue)
            { radius: 5, points: 100, color: '#ffff00' }   // Tiny (Yellow) - pops on hit
        ];
        this.totalBubbles = 0; // For panic mode tracking
        this.poppedCount = 0; // For panic mode tracking
        this.gravity = 300; // pixels per second^2
        this.bounceLoss = 0.8; // Energy loss on bounce (0.8 = 20% loss)
    }
    
    reset() {
        this.bubbles = [];
        this.projectiles = [];
        this.totalBubbles = 0;
        this.poppedCount = 0;
    }
    
    resetPositions() {
        // Reset bubble positions to initial state (used when player dies but level continues)
        // For now, we'll just regenerate the level
        // In a full implementation, we'd store initial positions
        this.reset();
        this.generateLevel(this.game.state.level, this.game.state.mode);
    }
    
    generateLevel(level, mode) {
        this.reset();
        
        if (mode === 'arcade') {
            // Arcade mode: fixed number of bubbles based on level
            const bubbleCount = Math.min(3 + Math.floor(level / 2), 10); // 3-10 bubbles
            this.totalBubbles = bubbleCount;
            
            // Create bubbles in a formation
            for (let i = 0; i < bubbleCount; i++) {
                // Distribute bubbles across the top of the screen
                const x = 50 + (i * (this.game.width - 100) / Math.max(bubbleCount - 1, 1));
                const y = 30 + Math.random() * 30; // Near top
                const sizeIndex = Math.min(Math.floor(level / 3), 2); // Increase size with level
                this.createBubble(x, y, sizeIndex);
            }
        } else if (mode === 'panic') {
            // Panic mode: continuous stream of bubbles
            this.totalBubbles = 50; // Target number for progress bar
            this.poppedCount = 0;
            
            // Create initial set of bubbles
            for (let i = 0; i < 8; i++) {
                const x = 50 + Math.random() * (this.game.width - 100);
                const y = 30 + Math.random() * 30;
                const sizeIndex = 0; // Start with large bubbles
                this.createBubble(x, y, sizeIndex);
            }
            
            // Set up bubble spawning timer
            this.spawnTimer = 0;
            this.spawnInterval = 2.0; // seconds between spawns
        }
    }
    
    createBubble(x, y, sizeIndex = 0) {
        const size = this.bubbleSizes[sizeIndex];
        const bubble = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 50, // Random horizontal velocity
            vy: -(Math.random() * 50), // Initial upward velocity
            radius: size.radius,
            sizeIndex: sizeIndex,
            points: size.points,
            color: size.color,
            active: true,
            // For visual effects
            pulse: 0,
            pulseDir: 1
        };
        
        this.bubbles.push(bubble);
        return bubble;
    }
    
    createProjectile(x, y, vx, vy) {
        const projectile = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            width: 4,
            height: 10,
            active: true,
            color: '#ff00ff' // Magenta for harpoon
        };
        
        this.projectiles.push(projectile);
        return projectile;
    }
    
    update(deltaTime) {
        // Update bubbles
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];
            if (!bubble.active) continue;
            
            // Apply gravity
            bubble.vy += this.gravity * deltaTime;
            
            // Update position
            bubble.x += bubble.vx * deltaTime;
            bubble.y += bubble.vy * deltaTime;
            
            // Bounce off walls
            if (bubble.x - bubble.radius < 0 && bubble.vx < 0) {
                bubble.x = bubble.radius;
                bubble.vx = Math.abs(bubble.vx) * this.bounceLoss;
            } else if (bubble.x + bubble.radius > this.game.width && bubble.vx > 0) {
                bubble.x = this.game.width - bubble.radius;
                bubble.vx = -Math.abs(bubble.vx) * this.bounceLoss;
            }
            
            // Bounce off floor and ceiling
            if (bubble.y + bubble.radius > this.game.height && bubble.vy > 0) {
                bubble.y = this.game.height - bubble.radius;
                bubble.vy = -Math.abs(bubble.vy) * this.bounceLoss;
            } else if (bubble.y - bubble.radius < 0 && bubble.vy < 0) {
                bubble.y = bubble.radius;
                bubble.vy = Math.abs(bubble.vy) * this.bounceLoss;
            }
            
            // Update pulse effect for visual feedback
            bubble.pulse += deltaTime * bubble.pulseDir * 2;
            if (bubble.pulse > 1) {
                bubble.pulse = 1;
                bubble.pulseDir = -1;
            } else if (bubble.pulse < 0) {
                bubble.pulse = 0;
                bubble.pulseDir = 1;
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            if (!projectile.active) continue;
            
            // Update position
            projectile.x += projectile.vx * deltaTime;
            projectile.y += projectile.vy * deltaTime;
            
            // Remove if off screen
            if (projectile.y < -10 || projectile.y > this.game.height + 10 ||
                projectile.x < -10 || projectile.x > this.game.width + 10) {
                projectile.active = false;
            }
        }
        
        // Remove inactive bubbles and projectiles
        this.bubbles = this.bubbles.filter(b => b.active);
        this.projectiles = this.projectiles.filter(p => p.active);
        
        // Panic mode bubble spawning
        if (this.game.state.mode === 'panic') {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.spawnInterval && this.bubbles.length < 12) {
                this.spawnTimer = 0;
                // Spawn a new bubble at the top
                const x = 50 + Math.random() * (this.game.width - 100);
                const y = -20; // Start above screen
                const sizeIndex = Math.min(Math.floor(this.game.state.level / 4), 2); // Increase size with level
                this.createBubble(x, y, sizeIndex);
                this.totalBubbles++; // Increase total for progress bar
            }
        }
    }
    
    render(ctx) {
        // Render bubbles
        for (const bubble of this.bubbles) {
            if (!bubble.active) continue;
            
            ctx.save();
            ctx.translate(bubble.x, bubble.y);
            
            // Draw bubble with pulse effect
            const radius = bubble.radius * (1 + bubble.pulse * 0.2); // Pulse up to 20%
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            
            // Create gradient for bubble
            const gradient = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.5, bubble.color);
            gradient.addColorStop(1, this.adjustColor(bubble.color, -0.3)); // Darker edge
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add highlight
            ctx.beginPath();
            ctx.arc(0 - radius * 0.3, 0 - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
            
            ctx.restore();
        }
        
        // Render projectiles
        for (const projectile of this.projectiles) {
            if (!projectile.active) continue;
            
            ctx.save();
            ctx.translate(projectile.x, projectile.y);
            ctx.fillStyle = projectile.color;
            ctx.fillRect(-projectile.width / 2, -projectile.height / 2, projectile.width, projectile.height);
            ctx.restore();
        }
    }
    
    adjustColor(color, amount) {
        // Simple color adjustment (darken/lighten)
        // Convert hex to RGB, adjust, convert back
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        r = Math.max(0, Math.min(255, r + amount * 255));
        g = Math.max(0, Math.min(255, g + amount * 255));
        b = Math.max(0, Math.min(255, b + amount * 255));
        
        return '#' + 
            ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Check if a bubble should split when hit
    splitBubble(bubble) {
        // Remove the original bubble
        bubble.active = false;
        
        // If this is the smallest size, it just disappears
        if (bubble.sizeIndex >= this.bubbleSizes.length - 1) {
            // Add points for popping
            this.game.scoringManager.addScore(bubble.points);
            this.poppedCount++;
            
            // Create particle effect
            this.game.particleManager.createExplosion(
                bubble.x, bubble.y, bubble.color, 15
            );
            
            return;
        }
        
        // Otherwise, split into two smaller bubbles
        const sizeIndex = bubble.sizeIndex + 1;
        const size = this.bubbleSizes[sizeIndex];
        
        // Create two bubbles moving in opposite directions
        const bubble1 = this.createBubble(
            bubble.x, bubble.y, sizeIndex
        );
        bubble1.vx = -50; // Move left
        bubble1.vy = -50; // Move up slightly
        
        const bubble2 = this.createBubble(
            bubble.x, bubble.y, sizeIndex
        );
        bubble2.vx = 50; // Move right
        bubble2.vy = -50; // Move up slightly
        
        // Add points for popping
        this.game.scoringManager.addScore(bubble.points);
        this.poppedCount++;
        
        // Create particle effect
        this.game.particleManager.createExplosion(
            bubble.x, bubble.y, bubble.color, 10
        );
    }
    
    getPoppedCount() {
        return this.poppedCount;
    }
}