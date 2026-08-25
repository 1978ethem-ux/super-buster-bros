// Super Buster Bros - Input Handler
export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };
        this.touch = {
            x: 0,
            y: 0,
            active: false
        };
        this.pauseRequested = false;
        
        // Touch control zones (for mobile)
        this.touchControls = {
            leftZone: { x: 0, y: 0, width: 0, height: 0 },
            rightZone: { x: 0, y: 0, width: 0, height: 0 },
            shootZone: { x: 0, y: 0, width: 0, height: 0 }
        };
        
        // Bind event listeners
        this.bindEvents();
    }
    
    bindEvents() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            // Prevent default for space bar to avoid scrolling
            if (e.code === 'Space') {
                e.preventDefault();
            }
            // Handle P key for pause (only when playing)
            if (e.key === 'p' || e.key === 'P') {
                this.pauseRequested = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse events (for desktop testing)
        window.addEventListener('mousedown', (e) => {
            this.mouse.clicked = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseup', (e) => {
            this.mouse.clicked = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Touch events (for mobile)
        window.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            this.touch.x = touch.clientX;
            this.touch.y = touch.clientY;
            this.touch.active = true;
            
            // Show touch controls when touch starts
            if (this.game && this.game.uiManager && typeof this.game.uiManager.showTouchControls === 'function') {
                this.game.uiManager.showTouchControls();
            }
        }, { passive: false });
        
        window.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
            
            // Hide touch controls when touch ends
            if (this.game && this.game.uiManager && typeof this.game.uiManager.hideTouchControls === 'function') {
                this.game.uiManager.hideTouchControls();
            }
        }, { passive: false });
        
        window.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            this.touch.x = touch.clientX;
            this.touch.y = touch.clientY;
        }, { passive: false });
        
        // Handle window resize for touch zones
        window.addEventListener('resize', () => this.updateTouchZones());
    }
    
    update() {
        // No continuous update needed for this simple input handler
        // State is updated via event listeners
    }
    
    // Calculate touch control zones based on screen size
    updateTouchZones() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Left zone: bottom-left 30% of screen
        this.touchControls.leftZone = {
            x: rect.left,
            y: rect.top + height * 0.5,
            width: width * 0.3,
            height: height * 0.5
        };
        
        // Right zone: bottom-right 30% of screen
        this.touchControls.rightZone = {
            x: rect.left + width * 0.7,
            y: rect.top + height * 0.5,
            width: width * 0.3,
            height: height * 0.5
        };
        
        // Shoot zone: center 40% of bottom half
        this.touchControls.shootZone = {
            x: rect.left + width * 0.3,
            y: rect.top + height * 0.5,
            width: width * 0.4,
            height: height * 0.5
        };
    }
    
    // Check if a point is in a zone
    pointInZone(x, y, zone) {
        return x >= zone.x && x <= zone.x + zone.width &&
               y >= zone.y && y <= zone.y + zone.height;
    }
    
    // Check if touch is in left zone
    isTouchLeft() {
        if (!this.touch.active) return false;
        return this.pointInZone(this.touch.x, this.touch.y, this.touchControls.leftZone);
    }
    
    // Check if touch is in right zone
    isTouchRight() {
        if (!this.touch.active) return false;
        return this.pointInZone(this.touch.x, this.touch.y, this.touchControls.rightZone);
    }
    
    // Check if touch is in shoot zone
    isTouchShoot() {
        if (!this.touch.active) return false;
        return this.pointInZone(this.touch.x, this.touch.y, this.touchControls.shootZone);
    }
    
    // Check if pause was requested this frame
    wasPauseRequested() {
        if (this.pauseRequested) {
            this.pauseRequested = false;
            return true;
        }
        return false;
    }
    
    // Check if a key is currently pressed
    isKeyPressed(key) {
        return this.keys[key] === true;
    }
    
    // Check if mouse was clicked (returns true once per click)
    wasMouseClicked() {
        if (this.mouse.clicked) {
            this.mouse.clicked = false; // Reset for next frame
            return true;
        }
        return false;
    }
    
    // Check if touch is active
    isTouchActive() {
        return this.touch.active;
    }
    
    // Get touch position
    getTouchPosition() {
        return { x: this.touch.x, y: this.touch.y };
    }
    
    // Get mouse position
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    // Check if start button was clicked (UI interaction)
    isStartButtonClicked() {
        // This would be handled by UI events in a real implementation
        // For now, we'll rely on keyboard/touch for game controls
        return false;
    }
}