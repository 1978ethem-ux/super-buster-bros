// Super Buster Bros - Player Class
export class Player {
    constructor(game) {
        this.game = game;
        this.width = 24;
        this.height = 24;
        // Start at bottom center
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 10; // 10px from bottom
        this.speed = 150; // pixels per second
        this.canShoot = true;
        this.shootCooldown = 0.3; // seconds between shots
        this.shootTimer = 0;
        this.isAlive = true;
        this.facingRight = true;
        
        // Animation states
        this.state = 'idle'; // idle, walking, shooting, hurt
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.1; // seconds per frame
    }
    
    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 10;
        this.canShoot = true;
        this.shootTimer = 0;
        this.isAlive = true;
        this.state = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;
    }
    
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // Handle input
        const input = this.game.input;
        
        // Movement
        let moving = false;
        if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('a') || input.isTouchLeft()) {
            this.x -= this.speed * deltaTime;
            moving = true;
            this.facingRight = false;
        }
        if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('d') || input.isTouchRight()) {
            this.x += this.speed * deltaTime;
            moving = true;
            this.facingRight = true;
        }
        
        // Keep player within bounds
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        
        // Shooting
        if ((input.isKeyPressed(' ') || input.isKeyPressed('Space') || input.isTouchShoot()) && this.canShoot) {
            this.shoot();
            this.canShoot = false;
            this.shootTimer = this.shootCooldown;
            this.state = 'shooting';
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
        
        // Update shoot cooldown
        if (!this.canShoot) {
            this.shootTimer -= deltaTime;
            if (this.shootTimer <= 0) {
                this.canShoot = true;
            }
        }
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2; // Simple 2-frame animation for now
            
            // Reset to idle if not shooting
            if (this.state === 'shooting' && this.animationFrame === 0) {
                this.state = moving ? 'walking' : 'idle';
            }
        }
        
        // Update animation state based on movement
        if (this.state !== 'shooting') {
            if (moving) {
                this.state = 'walking';
            } else {
                this.state = 'idle';
            }
        }
    }
    
    shoot() {
        // Create a projectile (harpoon) going straight up
        this.game.bubbleManager.createProjectile(
            this.x + this.width / 2, // Center of player
            this.y, // Top of player
            0, // Velocity X (straight up)
            -300 // Velocity Y (upwards)
        );
        
        // Notify game that player shot
        this.game.playerShot();
    }
    
    render(ctx) {
        if (!this.isAlive) return;
        
        // Save context
        ctx.save();
        
        // Translate to player position
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Flip horizontally if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
        }
        
        // Draw player based on state
        // For now, we'll draw a simple rectangle with color based on state
        ctx.fillStyle = this.getColorForState();
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw simple details (eyes, etc.) based on state
        ctx.fillStyle = '#000';
        // Eyes
        ctx.fillRect(-this.width / 3, -this.height / 3, 4, 4);
        ctx.fillRect(this.width / 3 - 4, -this.height / 3, 4, 4);
        
        // Mouth (different based on state)
        if (this.state === 'shooting') {
            // Shooting mouth (small line)
            ctx.fillRect(-2, 2, 4, 2);
        } else {
            // Normal mouth
            ctx.fillRect(-2, 2, 4, 2);
        }
        
        // Restore context
        ctx.restore();
    }
    
    getColorForState() {
        switch (this.state) {
            case 'idle':
                return '#00ffff'; // Cyan
            case 'walking':
                return '#00ff00'; // Green
            case 'shooting':
                return '#ff00ff'; // Magenta
            case 'hurt':
                return '#ff0000'; // Red
            default:
                return '#00ffff';
        }
    }
    
    // Get player's collision rectangle
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Called when player collides with a bubble or enemy
    hit() {
        if (!this.isAlive) return;
        
        this.isAlive = false;
        this.state = 'hurt';
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // Notify game
        this.game.playerDied();
        
        // Create particle effect
        this.game.particleManager.createExplosion(
            this.x + this.width / 2,
            this.y + this.height / 2,
            '#ff0000',
            20
        );
        
        // Play hurt sound
        this.game.audioManager.playSound('player_hurt');
    }
}