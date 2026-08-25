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
        }, { passive: false });
        
        window.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
        }, { passive: false });
        
        window.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            this.touch.x = touch.clientX;
            this.touch.y = touch.clientY;
        }, { passive: false });
    }
    
    update() {
        // No continuous update needed for this simple input handler
        // State is updated via event listeners
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