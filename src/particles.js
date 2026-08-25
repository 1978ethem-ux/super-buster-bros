// Super Buster Bros - Particle Manager
export class ParticleManager {
    constructor(game) {
        this.game = game;
        this.particles = []; // Active particles
    }
    
    reset() {
        this.particles = [];
    }
    
    update(deltaTime) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Apply gravity
            particle.vy += particle.gravity * deltaTime;
            
            // Update life
            particle.life -= deltaTime;
            if (particle.life <= 0) {
                particle.active = false;
            }
            
            // Update size (fade out)
            particle.size = particle.initialSize * (particle.life / particle.initialLife);
            
            // Update alpha (fade out)
            particle.alpha = particle.initialAlpha * (particle.life / particle.initialLife);
        }
        
        // Remove inactive particles
        this.particles = this.particles.filter(p => p.active && p.life > 0);
    }
    
    render(ctx) {
        for (const particle of this.particles) {
            if (!particle.active) continue;
            
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            
            // Draw particle as a circle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    createExplosion(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 50 + Math.random() * 100;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 200,
                life: 0.5 + Math.random() * 0.5,
                initialLife: 0.5 + Math.random() * 0.5,
                size: 2 + Math.random() * 3,
                initialSize: 2 + Math.random() * 3,
                color: color,
                alpha: 0.8,
                initialAlpha: 0.8,
                active: true
            });
        }
    }
    
    createImpact(x, y, color) {
        // Create a small impact effect
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const speed = 20 + Math.random() * 30;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 100,
                life: 0.2 + Math.random() * 0.2,
                initialLife: 0.2 + Math.random() * 0.2,
                size: 1 + Math.random() * 2,
                initialSize: 1 + Math.random() * 2,
                color: color,
                alpha: 0.6,
                initialAlpha: 0.6,
                active: true
            });
        }
    }
    
    createPlayerHurt(x, y) {
        // Create hurt effect for player
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 30 + Math.random() * 40;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 150,
                life: 0.3 + Math.random() * 0.3,
                initialLife: 0.3 + Math.random() * 0.3,
                size: 2 + Math.random() * 2,
                initialSize: 2 + Math.random() * 2,
                color: '#ff0000',
                alpha: 0.7,
                initialAlpha: 0.7,
                active: true
            });
        }
    }
}