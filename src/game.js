// Super Buster Bros - Main Game Class
import { Player } from './player.js';
import { BubbleManager } from './bubble.js';
import { InputHandler } from './input.js';
import { CollisionHandler } from './collision.js';
import { ScoringManager } from './scoring.js';
import { UIManager } from './ui.js';
import { AudioManager } from './audio.js';
import { ParticleManager } from './particles.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.state = {
            current: 'start', // start, playing, paused, gameover, levelcomplete
            mode: 'arcade', // arcade or panic
            level: 1,
            score: 0,
            lives: 3,
            timer: 0, // for arcade mode (level timer)
            panicProgress: 0, // for panic mode (0-100)
            isPaused: false,
            isGameOver: false,
            isLevelComplete: false
        };
        
        // Systems
        this.input = new InputHandler();
        this.player = new Player(this);
        this.bubbleManager = new BubbleManager(this);
        this.collisionHandler = new CollisionHandler(this);
        this.scoringManager = new ScoringManager(this);
        this.uiManager = new UIManager(this);
        this.audioManager = new AudioManager();
        this.particleManager = new ParticleManager(this);
        
        // Game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        
        // Resize handler
        window.addEventListener('resize', () => this.resize());
        this.resize(); // Initial resize to fit container
    }
    
    init() {
        // Start the audio manager (if needed)
        this.audioManager.init();
        
        // Show start screen
        this.uiManager.showScreen('start');
        
        // Start the game loop
        requestAnimationFrame(this.gameLoop);
    }
    
    resize() {
        // Get the container size
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Maintain aspect ratio (480x320 = 3:2)
        const aspectRatio = 3 / 2;
        let newWidth, newHeight;
        
        if (containerWidth / containerHeight > aspectRatio) {
            // Container is wider than the aspect ratio
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        } else {
            // Container is taller than the aspect ratio
            newWidth = containerWidth;
            newHeight = containerWidth / aspectRatio;
        }
        
        // Apply the new size to the canvas (but keep the internal resolution fixed for pixel-perfect scaling)
        this.canvas.width = Math.floor(newWidth);
        this.canvas.height = Math.floor(newHeight);
        
        // Update the internal game resolution (we'll scale the drawing)
        this.width = 480; // Base width
        this.height = 320; // Base height
        this.scaleX = this.canvas.width / this.width;
        this.scaleY = this.canvas.height / this.height;
    }
    
    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = timestamp;
        
        // Update
        if (!this.state.isPaused && this.state.current === 'playing') {
            this.update(deltaTime);
        }
        
        // Render
        this.render();
        
        // Request next frame
        requestAnimationFrame(this.gameLoop);
    }
    
    update(deltaTime) {
        // Update systems
        this.input.update();
        this.player.update(deltaTime);
        this.bubbleManager.update(deltaTime);
        this.collisionHandler.update();
        this.scoringManager.update(deltaTime);
        this.particleManager.update(deltaTime);
        
        // Check for level completion
        if (this.state.mode === 'arcade' && this.bubbleManager.bubbles.length === 0) {
            this.completeLevel();
        }
        
        // Check for panic mode progression
        if (this.state.mode === 'panic') {
            this.state.panicProgress = this.bubbleManager.getPoppedCount() / this.bubbleManager.totalBubbles * 100;
            if (this.state.panicProgress >= 100) {
                this.completeLevel();
            }
        }
        
        // Check for game over (lives)
        if (this.state.lives <= 0) {
            this.gameOver();
        }
    }
    
    render() {
        // Clear the canvas with the base size, then scale
        this.ctx.save();
        this.ctx.scale(this.scaleX, this.scaleY);
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Render game objects
        this.player.render(this.ctx);
        this.bubbleManager.render(this.ctx);
        this.particleManager.render(this.ctx);
        
        this.ctx.restore();
        
        // The UI is rendered by the UIManager via HTML/CSS, so we don't draw it on canvas
    }
    
    startGame() {
        this.state.current = 'playing';
        this.state.isPaused = false;
        this.state.isGameOver = false;
        this.state.isLevelComplete = false;
        this.state.level = 1;
        this.state.score = 0;
        this.state.lives = 3;
        this.state.timer = 0;
        this.state.panicProgress = 0;
        
        // Reset systems
        this.player.reset();
        this.bubbleManager.reset();
        this.scoringManager.reset();
        this.uiManager.reset();
        
        // Load level
        this.loadLevel(this.state.level);
        
        // Hide start screen, show HUD
        this.uiManager.showScreen('hud');
    }
    
    loadLevel(level) {
        // Based on the level, load a specific layout (for now, we'll use a simple random layout)
        // In a full game, we would load from a level data structure
        this.bubbleManager.generateLevel(level, this.state.mode);
    }
    
    completeLevel() {
        this.state.current = 'levelcomplete';
        this.state.isLevelComplete = true;
        
        // Calculate bonus
        const timeBonus = this.state.mode === 'arcade' ? Math.max(0, (300 - this.state.timer) * 10) : 0;
        const scoreBonus = this.state.score * 0.1; // 10% bonus
        
        this.scoringManager.addScore(timeBonus + scoreBonus);
        
        // Show level complete screen
        this.uiManager.showScreen('levelcomplete');
        
        // Play level complete sound
        this.audioManager.playSound('level_complete');
    }
    
    gameOver() {
        this.state.current = 'gameover';
        this.state.isGameOver = true;
        
        // Show game over screen
        this.uiManager.showScreen('gameover');
        
        // Play game over sound
        this.audioManager.playSound('game_over');
    }
    
    pauseGame() {
        if (this.state.current === 'playing') {
            this.state.isPaused = true;
            this.state.current = 'paused';
            this.uiManager.showScreen('pause');
            this.audioManager.pauseMusic();
        }
    }
    
    resumeGame() {
        if (this.state.current === 'paused') {
            this.state.isPaused = false;
            this.state.current = 'playing';
            this.uiManager.showScreen('hud');
            this.audioManager.resumeMusic();
        }
    }
    
    returnToMenu() {
        this.state.current = 'start';
        this.state.isPaused = false;
        this.uiManager.showScreen('start');
        this.audioManager.resumeMusic(); // In case we were paused
        this.audioManager.playMusic('attract');
    }
    
    // Player died
    playerDied() {
        this.state.lives--;
        if (this.state.lives > 0) {
            // Reset player position and bubble positions for retry
            this.player.reset();
            this.bubbleManager.resetPositions();
            this.uiManager.updateLives(this.state.lives);
        } else {
            this.gameOver();
        }
    }
    
    // Player shot a bubble
    playerShot() {
        this.player.shoot();
        this.audioManager.playSound('shoot');
    }
}

// Initialize the game when the script is loaded (handled in main.js)