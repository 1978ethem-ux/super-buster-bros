// Super Buster Bros - Scoring Manager
export class ScoringManager {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.levelScore = 0;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.comboDuration = 2.0; // seconds to maintain combo
        this.lastBubbleColor = null;
    }
    
    reset() {
        this.score = 0;
        this.levelScore = 0;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.lastBubbleColor = null;
        this.updateScoreDisplay();
    }
    
    addScore(points) {
        // Apply combo multiplier
        const multiplier = this.calculateComboMultiplier();
        const finalPoints = Math.floor(points * multiplier);
        
        this.score += finalPoints;
        this.levelScore += finalPoints;
        this.game.state.score = this.score;
        
        // Update combo
        this.updateCombo();
        
        // Update display
        this.updateScoreDisplay();
        
        // Check for high score
        this.checkHighScore();
    }
    
    calculateComboMultiplier() {
        // Base multiplier
        let multiplier = 1.0;
        
        // Combo multiplier: 1x, 2x, 3x, etc.
        if (this.comboCount > 0) {
            multiplier = 1 + (this.comboCount * 0.5); // 1.5x, 2x, 2.5x, etc.
        }
        
        return multiplier;
    }
    
    updateCombo() {
        // Reset combo timer
        this.comboTimer = this.comboDuration;
        
        // Increment combo count
        this.comboCount++;
        
        // Update combo display
        this.updateComboDisplay();
    }
    
    update(deltaTime) {
        // Update combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
                this.lastBubbleColor = null;
                this.updateComboDisplay();
            }
        }
    }
    
    updateScoreDisplay() {
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            scoreElement.textContent = this.score.toString().padStart(7, '0');
        }
        
        // Update final score on game over screen
        const finalScoreElement = document.getElementById('final-score');
        if (finalScoreElement) {
            finalScoreElement.textContent = this.score.toString().padStart(7, '0');
        }
        
        // Update level complete score
        const levelScoreElement = document.getElementById('level-score');
        if (levelScoreElement) {
            levelScoreElement.textContent = this.levelScore.toString().padStart(7, '0');
        }
    }
    
    updateComboDisplay() {
        const comboElement = document.getElementById('combo-display');
        if (comboElement) {
            if (this.comboCount > 0) {
                comboElement.textContent = `COMBO x${this.comboCount + 1}`;
                comboElement.style.display = 'block';
            } else {
                comboElement.style.display = 'none';
            }
        }
    }
    
    checkHighScore() {
        // Check if current score beats high score
        const highScore = localStorage.getItem('superbusterhighscore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('superbusterhighscore', this.score);
            this.updateHighScoreDisplay();
        }
    }
    
    updateHighScoreDisplay() {
        const highScore = localStorage.getItem('superbusterhighscore') || 0;
        const highScoreElement = document.getElementById('high-score-value');
        if (highScoreElement) {
            highScoreElement.textContent = highScore.toString().padStart(7, '0');
            // Show high score display if we have a high score
            const highScoreDisplay = document.getElementById('high-score-display');
            if (highScoreDisplay) {
                highScoreDisplay.style.display = 'block';
            }
        }
    }
    
    // Get bonus for level completion (based on time, etc.)
    getLevelCompleteBonus() {
        // Time bonus for arcade mode
        if (this.game.state.mode === 'arcade') {
            const timeBonus = Math.max(0, (300 - this.game.state.timer) * 10); // 10 points per second under 5 minutes
            return timeBonus;
        }
        return 0;
    }
}