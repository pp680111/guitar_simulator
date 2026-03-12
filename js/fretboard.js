/**
 * Fretboard - Guitar fretboard rendering and interaction
 */

class Fretboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.fretboard = document.getElementById('fretboard');
        this.numFrets = 24;
        this.numStrings = 6;
        this.stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // High to low (top to bottom)

        // Fret markers positions (1-indexed for display)
        this.markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        this.doubleMarkerFrets = [12, 24];

        // Current chord being displayed
        this.currentChord = null;
        this.activeNotes = [];

        // Bind methods
        this.handleNoteClick = this.handleNoteClick.bind(this);
    }

    /**
     * Initialize the fretboard
     */
    init() {
        this.render();
    }

    /**
     * Render the fretboard
     */
    render() {
        this.fretboard.innerHTML = '';

        // Create frets
        for (let fret = 0; fret <= this.numFrets; fret++) {
            const fretElement = this.createFret(fret);
            this.fretboard.appendChild(fretElement);
        }
    }

    /**
     * Create a single fret element
     * @param {number} fret - Fret number
     * @returns {HTMLElement} Fret element
     */
    createFret(fret) {
        const fretDiv = document.createElement('div');
        fretDiv.className = 'fret';
        fretDiv.dataset.fret = fret;

        // Set fret width (decreases towards the body)
        const baseWidth = 80;
        const width = Math.max(35, baseWidth - fret * 2);
        fretDiv.style.width = `${width}px`;
        fretDiv.style.minWidth = `${width}px`;

        // Create strings container
        const stringsContainer = document.createElement('div');
        stringsContainer.className = 'strings-container';

        // Create strings (top to bottom = high to low)
        for (let string = 0; string < this.numStrings; string++) {
            const stringElement = this.createString(string, fret);
            stringsContainer.appendChild(stringElement);
        }

        fretDiv.appendChild(stringsContainer);

        // Add fret markers (not for first fret)
        if (fret > 0 && this.markerFrets.includes(fret)) {
            const isDouble = this.doubleMarkerFrets.includes(fret);
            const markerClass = isDouble ? 'double' : 'single';
            const marker = document.createElement('div');
            marker.className = `fret-marker ${markerClass}`;
            fretDiv.appendChild(marker);
        }

        // Add fret number
        if (fret > 0) {
            const fretNumber = document.createElement('span');
            fretNumber.className = 'fret-number';
            fretNumber.textContent = fret;
            fretDiv.appendChild(fretNumber);
        }

        // Add string labels to first fret only
        if (fret === 0) {
            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'string-labels';
            labelsContainer.style.position = 'absolute';
            labelsContainer.style.left = '-20px';
            labelsContainer.style.top = '0';
            labelsContainer.style.bottom = '0';
            labelsContainer.style.display = 'flex';
            labelsContainer.style.flexDirection = 'column';
            labelsContainer.style.justifyContent = 'space-between';
            labelsContainer.style.padding = '5px 0';

            for (let string = 0; string < this.numStrings; string++) {
                const label = document.createElement('span');
                label.className = 'string-label';
                label.textContent = this.stringNames[string];
                label.style.fontSize = '0.7rem';
                label.style.color = '#888';
                labelsContainer.appendChild(label);
            }

            fretDiv.appendChild(labelsContainer);
        }

        return fretDiv;
    }

    /**
     * Create a string element
     * @param {string} string - String index (0-5)
     * @param {number} fret - Fret number
     * @returns {HTMLElement} String element
     */
    createString(string, fret) {
        const stringDiv = document.createElement('div');
        stringDiv.className = 'guitar-string';
        stringDiv.dataset.string = string;

        // String line
        const line = document.createElement('div');
        line.className = 'string-line';
        stringDiv.appendChild(line);

        // Fret position (note)
        const position = document.createElement('div');
        position.className = 'fret-position';
        position.dataset.string = string;
        position.dataset.fret = fret;

        // Calculate position within fret
        const offset = (fret === 0) ? 15 : 20;
        position.style.left = `${offset}px`;

        // Add note name for open strings
        if (fret === 0) {
            position.textContent = this.getOpenStringNote(string);
        }

        // Add mousedown handler for immediate response on desktop
        position.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.handleNoteClick(string, fret);
        });

        // Add touchstart handler for immediate response on mobile
        position.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleNoteClick(string, fret);
        }, { passive: false });

        stringDiv.appendChild(position);

        return stringDiv;
    }

    /**
     * Get the note name for an open string
     * @param {number} string - String index
     * @returns {string} Note name
     */
    getOpenStringNote(string) {
        // String 0 = highest pitch (E), String 5 = lowest pitch (E)
        const notes = ['E', 'B', 'G', 'D', 'A', 'E'];
        return notes[string];
    }

    /**
     * Handle note click
     * @param {number} string - String index
     * @param {number} fret - Fret number
     */
    handleNoteClick(string, fret) {
        // Play the note
        if (window.audioEngine) {
            window.audioEngine.playNote(string, fret);
        }

        // Visual feedback
        this.showNoteAnimation(string, fret);

        // Update note display
        this.updateNoteDisplay(string, fret);

        // Dispatch event
        const event = new CustomEvent('notePlay', {
            detail: { string, fret }
        });
        document.dispatchEvent(event);
    }

    /**
     * Show note animation
     * @param {number} string - String index
     * @param {number} fret - Fret number
     */
    showNoteAnimation(string, fret) {
        const position = this.fretboard.querySelector(
            `.fret[data-fret="${fret}"] .fret-position[data-string="${string}"]`
        );

        if (position) {
            position.classList.add('active');
            setTimeout(() => {
                position.classList.remove('active');
            }, 300);
        }
    }

    /**
     * Update note display
     * @param {number} string - String index
     * @param {number} fret - Fret number
     */
    updateNoteDisplay(string, fret) {
        const noteDisplay = document.getElementById('noteDisplay');
        if (noteDisplay) {
            const noteData = window.audioEngine.getNote(string, fret);
            if (noteData) {
                noteDisplay.textContent = `弦${string + 1} - 品${fret} - ${noteData.note} (${noteData.freq.toFixed(1)} Hz)`;
            }
        }
    }

    /**
     * Display a chord on the fretboard
     * @param {string} chordName - Chord name
     */
    displayChord(chordName) {
        // Clear previous chord
        this.clearChord();

        if (!chordName || !window.chordData) return;

        const positions = window.chordData.getPositions(chordName);
        if (!positions) return;

        this.currentChord = chordName;

        // Mark each position
        for (let string = 0; string < this.numStrings; string++) {
            const fret = positions[string];

            // Find the fret position element
            let positionEl;
            if (fret === 0) {
                // Open string
                positionEl = this.fretboard.querySelector(
                    `.fret[data-fret="0"] .fret-position[data-string="${string}"]`
                );
            } else if (fret > 0) {
                // Fretted note
                positionEl = this.fretboard.querySelector(
                    `.fret[data-fret="${fret}"] .fret-position[data-string="${string}"]`
                );
            }

            if (positionEl) {
                if (fret === -1) {
                    // Muted string
                    positionEl.classList.add('muted');
                } else if (fret === 0) {
                    // Open string
                    positionEl.classList.add('chord');
                } else {
                    // Fretted note
                    positionEl.classList.add('chord');
                }
            }
        }
    }

    /**
     * Clear chord display
     */
    clearChord() {
        if (!this.fretboard) return;

        const positions = this.fretboard.querySelectorAll('.fret-position');
        positions.forEach(pos => {
            pos.classList.remove('chord', 'muted');
        });

        this.currentChord = null;
    }

    /**
     * Clear all active notes
     */
    clearActiveNotes() {
        const positions = this.fretboard.querySelectorAll('.fret-position.active');
        positions.forEach(pos => {
            pos.classList.remove('active');
        });
    }

    /**
     * Apply custom styling from image
     * @param {object} colors - Color scheme
     */
    applyStyle(colors) {
        if (!colors) return;

        const root = document.documentElement;

        if (colors.fretboard) {
            root.style.setProperty('--fretboard-bg', colors.fretboard);
        }
        if (colors.fretWire) {
            root.style.setProperty('--fret-wire', colors.fretWire);
        }
        if (colors.string) {
            root.style.setProperty('--string-color', colors.string);
        }
        if (colors.marker) {
            root.style.setProperty('--fret-marker', colors.marker);
        }
        if (colors.note) {
            root.style.setProperty('--note-default', colors.note);
        }
    }

    /**
     * Reset styling to default
     */
    resetStyle() {
        const root = document.documentElement;
        root.style.setProperty('--fretboard-bg', '#2a1810');
        root.style.setProperty('--fret-wire', '#c0c0c0');
        root.style.setProperty('--string-color', '#e8dcc8');
        root.style.setProperty('--fret-marker', '#d4af37');
        root.style.setProperty('--note-default', '#FFD700');
    }

    /**
     * Scroll to a specific fret
     * @param {number} fret - Fret number
     */
    scrollToFret(fret) {
        const fretEl = this.fretboard.querySelector(`.fret[data-fret="${fret}"]`);
        if (fretEl) {
            fretEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
}

// Export
window.Fretboard = Fretboard;
