// Super Buster Bros - Main Game Entry Point
import { Game } from './game.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    const game = new Game();
    game.init();
    // Expose for debugging (console access)
    window.game = game;
});