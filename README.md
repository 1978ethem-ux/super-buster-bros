# Super Buster Bros

A modern web-based recreation of the classic arcade game Super Buster Bros. (also known as Super Pang).

## Gameplay

Super Buster Bros. is a fixed-screen shooter/puzzle hybrid where players control characters who shoot harpoons upward to pop bouncing bubbles. When a bubble is popped, it splits into two smaller bubbles that bounce off in different directions. This continues until the bubbles are small enough to disappear completely.

### Features
- **Two Game Modes**: 
  - Arcade/Tour Mode: Structured levels with specific layouts
  - Panic Mode: Survival mode with continuous bubble rain
- **Bubble Splitting Mechanics**: Pop bubbles to split them into smaller ones
- **Multiple Bubble Sizes**: Four size tiers with different point values
- **Player Movement**: Left/right movement along the bottom of the screen
- **Scoring System**: Points awarded for popping bubbles, with bonuses for combos and quick level completion
- **Responsive Design**: Scales to different screen sizes while maintaining aspect ratio
- **Modern Neon UI**: Cyberpunk-inspired interface with glowing effects
- **Sound Effects**: Procedural audio for shooting, explosions, and game events
- **Particle Effects**: Visual feedback for explosions and impacts

## Controls
- **← / →** or **A / D**: Move left/right
- **Spacebar**: Shoot harpoon upward
- **P**: Pause/resume game
- **Mouse/Touch**: Click or tap to start game from start screen
- **Mobile Touch Controls**: 
  - Tap left side of screen to move left
  - Tap right side of screen to move right
  - Tap center of screen to shoot

## How to Play
1. Open `index.html` in a modern web browser
2. Click "START GAME" or press any key to begin
3. Select your game mode (Arcade or Panic) using the mode buttons
4. Use arrow keys to move your character left and right
5. Press spacebar to shoot harpoons upward at the bubbles
6. Avoid touching bubbles or you'll lose a life
7. Clear all bubbles to complete the level
8. In Panic mode, fill the progress bar by popping bubbles to advance levels

## Technical Implementation
This game is built using:
- **HTML5 Canvas** for rendering game graphics
- **JavaScript ES6 Modules** for organized code structure
- **CSS3** for modern neon-style UI with animations
- **Web Audio API** for procedural sound effects
- **RequestAnimationFrame** for smooth game loop

### Project Structure
```
super-buster-bros/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling (Modern Neon theme)
├── src/
│   ├── main.js         # Entry point
│   ├── game.js         # Main game logic
│   ├── player.js       # Player character
│   ├── bubble.js       # Bubble and projectile management
│   ├── collision.js    # Collision detection system
│   ├── scoring.js      # Score and combo management
│   ├── ui.js           # User interface management
│   ├── audio.js        # Sound effects and music
│   └── particles.js    # Particle effects system
```

## Setup Instructions
No installation required! Simply:
1. Clone or download this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
3. Enjoy the game!

For the best experience:
- Use a desktop browser for keyboard controls
- On mobile devices, tap the screen to start, then use on-screen controls that appear
- The game will automatically scale to fit your screen while maintaining the 3:2 aspect ratio

## Development
To modify the game:
1. Edit the JavaScript files in the `src/` directory
2. Modify styles in `css/styles.css`
3. Changes will be visible immediately when you reload the page

### Game States
The game manages several states:
- `start`: Start screen
- `playing`: Active gameplay
- `paused`: Game is paused
- `gameover`: Player has lost all lives
- `levelcomplete`: Player has cleared all bubbles

### Modes
- **Arcade Mode**: Features a level timer and predefined bubble layouts
- **Panic Mode**: Features a progress bar that fills as bubbles are popped, with continuous bubble spawning

## Credits
Inspired by the original Super Buster Bros. / Super Pang arcade game (1990) developed by Mitchell Corporation and published by Capcom.

This is a fan-made recreation for educational and entertainment purposes.

---
*Built with ❤️ using modern web technologies*