// Super Buster Bros - Storage Manager
// Handles persistent storage for high scores and level progress using localStorage
//
// SECURITY: localStorage is fully user/attacker-controlled (devtools, other
// scripts on the same origin, extensions). Parsed data is never trusted: it is
// normalized into a fixed schema of safe integers before any caller sees it.

import { safeInt } from './sanitize.js';

export class StorageManager {
    constructor() {
        this.storageKey = 'superbuster_data';
        this.data = this.load();
    }

    defaults() {
        return {
            highScore: 0,
            highestLevel: 1,
            arcadeHighScore: 0,
            panicHighScore: 0,
            arcadeHighestLevel: 1,
            panicHighestLevel: 1,
            totalGamesPlayed: 0,
            totalScore: 0,
            totalBubblesPopped: 0
        };
    }

    // Coerce arbitrary parsed JSON into the known schema. Unknown keys are
    // dropped; every value becomes a safe non-negative integer.
    normalize(raw) {
        const out = this.defaults();
        if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
            return out;
        }
        for (const key of Object.keys(out)) {
            const min = key.toLowerCase().includes('level') ? 1 : 0;
            out[key] = Math.max(min, safeInt(raw[key], out[key]));
        }
        return out;
    }

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return this.normalize(JSON.parse(stored));
            }
        } catch (e) {
            console.warn('Failed to load storage data:', e);
        }
        // Return default data structure
        return this.defaults();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save storage data:', e);
        }
    }

    // High Score Management
    getHighScore(mode = null) {
        if (mode === 'arcade') {
            return this.data.arcadeHighScore;
        }
        if (mode === 'panic') {
            return this.data.panicHighScore;
        }
        return this.data.highScore;
    }

    setHighScore(score, mode = null) {
        let updated = false;
        
        // Overall high score
        if (score > this.data.highScore) {
            this.data.highScore = score;
            updated = true;
        }
        
        // Mode-specific high scores
        if (mode === 'arcade' && score > this.data.arcadeHighScore) {
            this.data.arcadeHighScore = score;
            updated = true;
        }
        
        if (mode === 'panic' && score > this.data.panicHighScore) {
            this.data.panicHighScore = score;
            updated = true;
        }
        
        if (updated) {
            this.save();
        }
        
        return updated;
    }

    // Level Progress Management
    getHighestLevel(mode = null) {
        if (mode === 'arcade') {
            return this.data.arcadeHighestLevel;
        }
        if (mode === 'panic') {
            return this.data.panicHighestLevel;
        }
        return this.data.highestLevel;
    }

    setHighestLevel(level, mode = null) {
        let updated = false;
        
        // Overall highest level
        if (level > this.data.highestLevel) {
            this.data.highestLevel = level;
            updated = true;
        }
        
        // Mode-specific highest levels
        if (mode === 'arcade' && level > this.data.arcadeHighestLevel) {
            this.data.arcadeHighestLevel = level;
            updated = true;
        }
        
        if (mode === 'panic' && level > this.data.panicHighestLevel) {
            this.data.panicHighestLevel = level;
            updated = true;
        }
        
        if (updated) {
            this.save();
        }
        
        return updated;
    }

    // Statistics
    getStats() {
        return {
            totalGamesPlayed: this.data.totalGamesPlayed || 0,
            totalScore: this.data.totalScore || 0,
            totalBubblesPopped: this.data.totalBubblesPopped || 0
        };
    }

    recordGamePlayed(score, bubblesPopped) {
        this.data.totalGamesPlayed = (this.data.totalGamesPlayed || 0) + 1;
        this.data.totalScore = (this.data.totalScore || 0) + score;
        this.data.totalBubblesPopped = (this.data.totalBubblesPopped || 0) + bubblesPopped;
        this.save();
    }

    // Reset all data (for testing/debugging)
    reset() {
        this.data = this.defaults();
        this.save();
    }
}