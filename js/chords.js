/**
 * Chord Data - Common guitar chord definitions
 */

class ChordData {
    constructor() {
        // Chord definitions: [string1, string2, string3, string4, string5, string6]
        // -1 = muted string, 0 = open string, 1-24 = fret number
        this.chords = {
            // Major chords
            'C': { name: 'C', fingers: '1-2-3', positions: [-1, 3, 2, 0, 1, 0] },
            'D': { name: 'D', fingers: '1-2-3', positions: [-1, -1, 0, 2, 3, 2] },
            'E': { name: 'E', fingers: '1-2-3', positions: [0, 2, 2, 1, 0, 0] },
            'F': { name: 'F', fingers: '1-2-3-4', positions: [1, 3, 3, 2, 1, 1] },
            'G': { name: 'G', fingers: '1-2-3', positions: [3, 2, 0, 0, 0, 3] },
            'A': { name: 'A', fingers: '1-2-3', positions: [-1, 0, 2, 2, 2, 0] },
            'B': { name: 'B', fingers: '1-2-4', positions: [-1, 2, 4, 4, 4, 2] },

            // Minor chords
            'Am': { name: 'Am', fingers: '1-2-3', positions: [-1, 0, 2, 2, 1, 0] },
            'Bm': { name: 'Bm', fingers: '1-2-4', positions: [-1, 2, 4, 4, 3, 2] },
            'Cm': { name: 'Cm', fingers: '1-3-4', positions: [-1, 3, 5, 5, 4, 3] },
            'Dm': { name: 'Dm', fingers: '1-2-3', positions: [-1, -1, 0, 2, 3, 1] },
            'Em': { name: 'Em', fingers: '1-2', positions: [0, 2, 2, 0, 0, 0] },
            'Gm': { name: 'Gm', fingers: '1-2-3', positions: [3, 5, 5, 3, 3, 3] },

            // 7th chords
            'C7': { name: 'C7', fingers: '1-2-3', positions: [-1, 3, 2, 3, 1, 0] },
            'D7': { name: 'D7', fingers: '1-2-3', positions: [-1, -1, 0, 2, 1, 2] },
            'E7': { name: 'E7', fingers: '1-2', positions: [0, 2, 0, 1, 0, 0] },
            'F7': { name: 'F7', fingers: '1-2-3', positions: [1, 3, 3, 1, 1, 1] },
            'G7': { name: 'G7', fingers: '1-2-3', positions: [3, 2, 0, 0, 0, 1] },
            'A7': { name: 'A7', fingers: '1-2-3', positions: [-1, 0, 2, 0, 2, 0] },
            'B7': { name: 'B7', fingers: '1-2-3', positions: [-1, 2, 1, 2, 0, 2] },

            // Minor 7th chords
            'Am7': { name: 'Am7', fingers: '1-2-3', positions: [-1, 0, 2, 0, 1, 0] },
            'Dm7': { name: 'Dm7', fingers: '1-2-3', positions: [-1, -1, 0, 2, 1, 1] },
            'Em7': { name: 'Em7', fingers: '1-2', positions: [0, 2, 0, 0, 0, 0] },
            'Gm7': { name: 'Gm7', fingers: '1-2-3', positions: [3, 5, 3, 3, 3, 3] },
            'Bm7': { name: 'Bm7', fingers: '1-2-4', positions: [-1, 2, 4, 2, 3, 2] },

            // Major 7th chords
            'Cmaj7': { name: 'Cmaj7', fingers: '1-2-3', positions: [-1, 3, 2, 0, 0, 0] },
            'Dmaj7': { name: 'Dmaj7', fingers: '1-2-3', positions: [-1, -1, 0, 2, 2, 2] },
            'Emaj7': { name: 'Emaj7', fingers: '1-2', positions: [0, 2, 1, 1, 0, 0] },
            'Fmaj7': { name: 'Fmaj7', fingers: '1-2-3', positions: [-1, 3, 3, 2, 0, 0] },
            'Gmaj7': { name: 'Gmaj7', fingers: '1-2-3', positions: [3, 2, 0, 0, 0, 2] },
            'Amaj7': { name: 'Amaj7', fingers: '1-2-3', positions: [-1, 0, 2, 1, 2, 0] },
            'Bmaj7': { name: 'Bmaj7', fingers: '1-2-4', positions: [-1, 2, 4, 3, 4, 2] },

            // Suspended chords
            'Csus2': { name: 'Csus2', fingers: '1-3', positions: [-1, 3, 0, 0, 1, 3] },
            'Csus4': { name: 'Csus4', fingers: '1-3', positions: [-1, 3, 3, 3, 1, 1] },
            'Dsus2': { name: 'Dsus2', fingers: '1-2-3', positions: [-1, -1, 0, 2, 3, 0] },
            'Dsus4': { name: 'Dsus4', fingers: '1-2-3', positions: [-1, -1, 0, 2, 3, 3] },
            'Esus2': { name: 'Esus2', fingers: '1-2', positions: [0, 2, 4, 4, 0, 0] },
            'Esus4': { name: 'Esus4', fingers: '1-2', positions: [0, 2, 2, 2, 0, 0] },
            'Gsus2': { name: 'Gsus2', fingers: '1-2-3', positions: [3, 0, 0, 0, 3, 3] },
            'Gsus4': { name: 'Gsus4', fingers: '1-2-3', positions: [3, 3, 0, 0, 3, 3] },
            'Asus2': { name: 'Asus2', fingers: '1-3', positions: [-1, 0, 2, 2, 0, 0] },
            'Asus4': { name: 'Asus4', fingers: '1-3', positions: [-1, 0, 2, 2, 3, 0] },

            // Add9 chords
            'Cadd9': { name: 'Cadd9', fingers: '1-2-3-4', positions: [-1, 3, 0, 2, 3, 0] },
            'Dadd9': { name: 'Dadd9', fingers: '1-2-3-4', positions: [-1, -1, 0, 2, 3, 0] },
            'Eadd9': { name: 'Eadd9', fingers: '1-2-3', positions: [0, 2, 2, 1, 0, 2] },
            'Gadd9': { name: 'Gadd9', fingers: '1-2-3', positions: [3, 0, 0, 0, 0, 3] },
            'Aadd9': { name: 'Aadd9', fingers: '1-2-3', positions: [-1, 0, 2, 4, 2, 0] },

            // Slash chords
            'C/E': { name: 'C/E', fingers: '1-2-3', positions: [0, 3, 2, 0, 1, 0] },
            'D/F#': { name: 'D/F#', fingers: '1-2-3', positions: [2, -1, 0, 2, 3, 2] },
            'G/B': { name: 'G/B', fingers: '1-2-3', positions: [-1, 2, 0, 0, 0, 3] },
            'A/G': { name: 'A/G', fingers: '1-2-3', positions: [3, 0, 2, 2, 2, 0] },
            'Am/G': { name: 'Am/G', fingers: '1-2-3', positions: [3, 0, 2, 0, 1, 0] },

            // Additional common chords
            'Ab': { name: 'Ab', fingers: '1-2-3-4', positions: [4, 6, 6, 5, 4, 4] },
            'Bb': { name: 'Bb', fingers: '1-2-3', positions: [-1, 1, 3, 3, 3, 1] },
            'Db': { name: 'Db', fingers: '1-2-3-4', positions: [-1, -1, 4, 6, 6, 4] },
            'Eb': { name: 'Eb', fingers: '1-2-3', positions: [-1, 6, 8, 8, 8, 6] },
            'Gb': { name: 'Gb', fingers: '1-2-3-4', positions: [2, 4, 4, 3, 2, 2] },

            // More minor chords
            'Dm': { name: 'Dm', fingers: '1-2-3', positions: [-1, -1, 0, 2, 3, 1] },
            'Fm': { name: 'Fm', fingers: '1-2-3-4', positions: [1, 3, 3, 1, 1, 1] },
            'Gm': { name: 'Gm', fingers: '1-2-3', positions: [3, 5, 5, 3, 3, 3] },
            'Abm': { name: 'Abm', fingers: '1-2-4', positions: [-1, 4, 6, 6, 5, 4] },
            'Bbm': { name: 'Bbm', fingers: '1-2-4', positions: [-1, 1, 3, 3, 2, 1] },
            'Ebm': { name: 'Ebm', fingers: '1-2-4', positions: [-1, 6, 8, 8, 7, 6] }
        };

        // Chord categories for display
        this.categories = {
            '常用': ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Dm', 'Em', 'G', 'Bm'],
            '七和弦': ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'],
            '小七': ['Am7', 'Dm7', 'Em7', 'Gm7', 'Bm7'],
            '大七': ['Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'],
            '挂留': ['Csus2', 'Csus4', 'Dsus2', 'Dsus4', 'Esus2', 'Esus4', 'Gsus2', 'Gsus4', 'Asus2', 'Asus4'],
            '加九': ['Cadd9', 'Dadd9', 'Eadd9', 'Gadd9', 'Aadd9']
        };
    }

    /**
     * Get all chord names
     * @returns {string[]} Array of chord names
     */
    getAllChords() {
        return Object.keys(this.chords);
    }

    /**
     * Get chord data by name
     * @param {string} name - Chord name
     * @returns {object} Chord data
     */
    getChord(name) {
        return this.chords[name] || null;
    }

    /**
     * Get chords by category
     * @param {string} category - Category name
     * @returns {string[]} Array of chord names
     */
    getChordsByCategory(category) {
        return this.categories[category] || [];
    }

    /**
     * Get all categories
     * @returns {string[]} Array of category names
     */
    getCategories() {
        return Object.keys(this.categories);
    }

    /**
     * Get chord positions for display
     * @param {string} name - Chord name
     * @returns {number[]} Array of fret positions
     */
    getPositions(name) {
        const chord = this.chords[name];
        return chord ? chord.positions : null;
    }

    /**
     * Check if a string is muted in a chord
     * @param {string} name - Chord name
     * @param {number} stringIndex - String index (0-5)
     * @returns {boolean} True if muted
     */
    isMuted(name, stringIndex) {
        const positions = this.getPositions(name);
        return positions ? positions[stringIndex] === -1 : true;
    }

    /**
     * Check if a string is open in a chord
     * @param {string} name - Chord name
     * @param {number} stringIndex - String index (0-5)
     * @returns {boolean} True if open
     */
    isOpen(name, stringIndex) {
        const positions = this.getPositions(name);
        return positions ? positions[stringIndex] === 0 : false;
    }

    /**
     * Get fret position for a string in a chord
     * @param {string} name - Chord name
     * @param {number} stringIndex - String index (0-5)
     * @returns {number} Fret number (-1 for muted, 0 for open, 1-24 for fretted)
     */
    getFret(name, stringIndex) {
        const positions = this.getPositions(name);
        return positions ? positions[stringIndex] : -1;
    }
}

// Export singleton instance
window.chordData = new ChordData();
