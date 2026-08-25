// Super Buster Bros - Audio Manager
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = {};
        this.musicGain = null;
        this.sfxGain = null;
        this.currentMusic = null;
        this.musicPlaying = false;
        
        // Initialize audio system
        this.init();
    }
    
    init() {
        // Create audio context (with user interaction fallback)
        try {
            // Fixed: Use proper AudioContext constructor
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.audioContext = null;
        }
        
        if (this.audioContext) {
            // Create gain nodes for music and SFX
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            // Connect to destination
            this.musicGain.connect(this.audioContext.destination);
            this.sfxGain.connect(this.audioContext.destination);
            
            // Set volumes (0.0 to 1.0)
            this.musicGain.gain.value = 0.5;
            this.sfxGain.gain.value = 0.7;
        }
        
        // Load sounds (we'll use Web Audio API oscillators for simple sounds)
        // In a real game, we'd load actual audio files
        this.loadSounds();
    }
    
    loadSounds() {
        // We'll generate simple sounds using oscillators
        // For now, we'll just create placeholder methods
        // In a real implementation, we'd decode and load audio files
        this.sounds = {
            shoot: () => this.playSoundEffect('shoot'),
            player_hurt: () => this.playSoundEffect('player_hurt'),
            bubble_pop: () => this.playSoundEffect('bubble_pop'),
            level_complete: () => this.playSoundEffect('level_complete'),
            game_over: () => this.playSoundEffect('game_over')
        };
        
        this.music = {
            attract: () => this.playMusic('attract'),
            gameplay: () => this.playMusic('gameplay')
        };
    }
    
    playSound(type) {
        // Public alias that dispatches to playSoundEffect
        // Ensure audio context is resumed (required by browser autoplay policies)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => console.warn('AudioContext resume failed:', e));
        }
        this.playSoundEffect(type);
    }

    playSoundEffect(type) {
        if (!this.audioContext) return;
        
        // Create oscillator for sound effect
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Set sound parameters based on type
        switch (type) {
            case 'shoot':
                oscillator.type = 'square';
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                break;
            case 'player_hurt':
                oscillator.type = 'sawtooth';
                oscillator.frequency.value = 100;
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;
            case 'bubble_pop':
                oscillator.type = 'triangle';
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                break;
            case 'level_complete':
                oscillator.type = 'sine';
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                break;
            case 'game_over':
                oscillator.type = 'sawtooth';
                oscillator.frequency.value = 150;
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                break;
            default:
                oscillator.type = 'sine';
                oscillator.frequency.value = 440;
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        }
        
        // Start and stop the sound
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1.0);
    }
    
    playMusic(type) {
        if (!this.audioContext) return;
        
        // Stop current music if playing
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        // In a real implementation, we'd decode and play audio files
        // For now, we'll just indicate that music would play
        console.log(`Playing music: ${type}`);
        this.currentMusic = type;
        this.musicPlaying = true;
        
        // We could generate procedural music here, but for simplicity
        // we'll just note that music would be playing
    }
    
    stopMusic() {
        this.musicPlaying = false;
        this.currentMusic = null;
        // In a real implementation, we'd stop the music source
        console.log('Music stopped');
    }
    
    pauseMusic() {
        if (this.musicPlaying) {
            // In a real implementation, we'd pause the music
            console.log('Music paused');
        }
    }
    
    resumeMusic() {
        if (this.musicPlaying) {
            // In a real implementation, we'd resume the music
            console.log('Music resumed');
        }
    }
    
    // Set volume levels
    setMusicVolume(volume) {
        if (this.musicGain) {
            this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
    
    setSFXVolume(volume) {
        if (this.sfxGain) {
            this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
}