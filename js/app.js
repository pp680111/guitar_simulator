/**
 * GuitarSim - Main Application
 */

class App {
    constructor() {
        this.fretboard = null;
        this.audioInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing GuitarSim...');

        try {
            // Initialize fretboard
            this.fretboard = new Fretboard('fretboard');
            this.fretboard.init();

            // Initialize chord buttons
            this.initChordButtons();

            // Initialize control handlers
            this.initControls();

            // Initialize recorder
            this.initRecorder();

            // Initialize help modal
            this.initHelpModal();

            // Show welcome message
            this.showWelcomeMessage();

            console.log('GuitarSim initialized successfully');
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    /**
     * Initialize chord buttons
     */
    initChordButtons() {
        const chordGrid = document.getElementById('chordGrid');
        if (!chordGrid || !window.chordData) return;

        // Common chords to display
        const chords = [
            'C', 'D', 'E', 'F', 'G', 'A', 'B',
            'Am', 'Dm', 'Em', 'Gm', 'Bm',
            'C7', 'D7', 'E7', 'G7', 'A7',
            'Am7', 'Dm7', 'Em7',
            'Cmaj7', 'Dmaj7', 'Emaj7'
        ];

        chordGrid.innerHTML = '';

        chords.forEach(chord => {
            const btn = document.createElement('button');
            btn.className = 'chord-btn';
            btn.textContent = chord;
            btn.addEventListener('click', () => this.selectChord(chord, btn));
            chordGrid.appendChild(btn);
        });

        // Clear chord button
        const clearBtn = document.getElementById('clearChordBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChord());
        }
    }

    /**
     * Select a chord
     * @param {string} chord - Chord name
     * @param {HTMLElement} btn - Button element
     */
    selectChord(chord, btn) {
        // Update active state
        const buttons = document.querySelectorAll('.chord-btn');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Display chord on fretboard
        this.fretboard.displayChord(chord);

        // Update chord diagram
        this.updateChordDiagram(chord);

        // Show chord info
        const chordInfo = window.chordData.getChord(chord);
        if (chordInfo) {
            document.querySelector('.chord-name').textContent = chordInfo.name;
            document.querySelector('.chord-fingers').textContent = `手指: ${chordInfo.fingers}`;
        }
    }

    /**
     * Clear selected chord
     */
    clearChord() {
        const buttons = document.querySelectorAll('.chord-btn');
        buttons.forEach(b => b.classList.remove('active'));

        this.fretboard.clearChord();

        document.querySelector('.chord-name').textContent = '选择和弦';
        document.querySelector('.chord-fingers').textContent = '';
    }

    /**
     * Update chord diagram
     * @param {string} chord - Chord name
     */
    updateChordDiagram(chord) {
        const diagram = document.getElementById('chordDiagram');
        if (!diagram) return;

        diagram.innerHTML = '';

        // Create grid
        const grid = document.createElement('div');
        grid.className = 'chord-diagram-grid';
        grid.style.position = 'absolute';
        grid.style.inset = '20px 10px';

        // Add frets (5 frets for display)
        for (let i = 0; i < 5; i++) {
            const fret = document.createElement('div');
            fret.className = 'chord-diagram-fret';
            fret.style.top = `${i * 25}%`;
            grid.appendChild(fret);
        }

        // Add strings (6 strings)
        for (let i = 0; i < 6; i++) {
            const string = document.createElement('div');
            string.className = 'chord-diagram-string';
            string.style.left = `${i * 16.67 + 8}%`;
            grid.appendChild(string);
        }

        diagram.appendChild(grid);

        // Get chord positions
        const positions = window.chordData.getPositions(chord);
        if (!positions) return;

        // Add dots and finger numbers
        for (let string = 0; string < 6; string++) {
            const fret = positions[string];

            if (fret === -1) {
                // Muted string - add X at top
                const muted = document.createElement('div');
                muted.className = 'chord-diagram-muted';
                muted.style.left = `${string * 16.67 + 8}%`;
                muted.style.top = '10px';
                diagram.appendChild(muted);
            } else if (fret === 0) {
                // Open string - add O at top
                const open = document.createElement('div');
                open.style.position = 'absolute';
                open.style.left = `${string * 16.67 + 8}%`;
                open.style.top = '12px';
                open.style.width = '12px';
                open.style.height = '12px';
                open.style.border = '2px solid #FFD700';
                open.style.borderRadius = '50%';
                diagram.appendChild(open);
            } else if (fret > 0 && fret <= 5) {
                // Fretted note - add finger number
                const finger = document.createElement('div');
                finger.className = 'chord-diagram-finger';
                finger.textContent = this.getFingerNumber(positions, string);
                finger.style.left = `${string * 16.67 + 8}%`;
                finger.style.top = `${(fret - 0.5) * 20}%`;
                diagram.appendChild(finger);
            }
        }
    }

    /**
     * Get finger number for chord position
     * @param {number[]} positions - Chord positions
     * @param {number} currentString - Current string index
     * @returns {number} Finger number
     */
    getFingerNumber(positions, currentString) {
        const fingerMap = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
        const fret = positions[currentString];

        if (fret <= 0) return '';

        // Count fingers from index to pinky
        const usedFrets = [];
        for (let i = 0; i < 6; i++) {
            if (positions[i] > 0) {
                usedFrets.push(positions[i]);
            }
        }

        const uniqueFrets = [...new Set(usedFrets)].sort((a, b) => a - b);
        const fingerIndex = uniqueFrets.indexOf(fret);

        return fingerMap[fingerIndex + 1] || '';
    }

    /**
     * Initialize control handlers
     */
    initControls() {
        // Tone selection
        const toneSelect = document.getElementById('toneSelect');
        if (toneSelect) {
            toneSelect.addEventListener('change', (e) => {
                if (window.audioEngine) {
                    window.audioEngine.setTone(e.target.value);
                }
            });
        }

        // Volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (volumeValue) {
                    volumeValue.textContent = `${value}%`;
                }
                if (window.audioEngine) {
                    window.audioEngine.setVolume(value / 100);
                }
            });
        }

        // Load soundfont button
        const loadSoundfontBtn = document.getElementById('loadSoundfontBtn');
        const soundfontInput = document.getElementById('soundfontInput');
        if (loadSoundfontBtn && soundfontInput) {
            loadSoundfontBtn.addEventListener('click', () => {
                soundfontInput.click();
            });

            soundfontInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.loadSoundfont(e.target.files[0]);
                }
            });
        }

        // Initialize audio on first interaction (anywhere on page)
        const initAudio = async () => {
            if (!this.audioInitialized && window.audioEngine) {
                try {
                    await window.audioEngine.init();
                    this.audioInitialized = true;
                    console.log('Audio engine initialized on first interaction');
                } catch (error) {
                    console.error('Failed to initialize audio:', error);
                }
            }
        };

        // Listen for first click anywhere
        document.addEventListener('click', initAudio, { once: true });
        // Also handle touch events
        document.addEventListener('touchstart', initAudio, { once: true });
    }

    /**
     * Load soundfont file
     * @param {File} file - Soundfont file
     */
    async loadSoundfont(file) {
        // Show loading message
        window.showToast('加载音色库中...', 'info');

        try {
            // Read the file as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            // Load into audio engine
            const success = await window.audioEngine.loadSoundfont(arrayBuffer);

            if (success) {
                const soundfontInfo = document.getElementById('soundfontInfo');
                const soundfontName = document.getElementById('soundfontName');
                const instrumentSelect = document.getElementById('instrumentSelect');

                if (soundfontInfo && soundfontName) {
                    soundfontInfo.style.display = 'block';
                    soundfontName.textContent = file.name;
                }

                if (instrumentSelect) {
                    instrumentSelect.disabled = false;
                    // Show the loaded instrument name
                    const instrumentName = window.audioEngine.currentInstrument || '已加载';
                    instrumentSelect.innerHTML = `<option value="0">${instrumentName}</option>`;
                }

                window.showToast('音色库加载成功！', 'success');
            } else {
                window.showToast('音色库加载失败', 'error');
            }
        } catch (error) {
            console.error('Error loading soundfont:', error);
            window.showToast('音色库加载失败: ' + error.message, 'error');
        }
    }

    /**
     * Initialize recorder
     */
    initRecorder() {
        const recordBtn = document.getElementById('recordBtn');
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        const exportBtn = document.getElementById('exportBtn');

        // Set up recorder callbacks
        window.recorder.onStateChange = (state) => {
            const status = document.getElementById('recorderStatus');
            if (status) {
                const statusText = {
                    'recording': '录音中...',
                    'playing': '播放中...',
                    'stopped': '准备就绪'
                };
                status.textContent = statusText[state] || '准备就绪';
            }

            // Update button states
            if (recordBtn) {
                recordBtn.classList.toggle('recording', state === 'recording');
                recordBtn.innerHTML = state === 'recording'
                    ? '<i class="fas fa-stop"></i> 停止'
                    : '<i class="fas fa-microphone"></i> 录音';
            }

            if (playBtn) {
                playBtn.disabled = state === 'recording' || !window.recorder.hasRecording();
            }

            if (stopBtn) {
                stopBtn.disabled = state !== 'recording' && state !== 'playing';
            }

            if (exportBtn) {
                exportBtn.disabled = !window.recorder.hasRecording();
            }
        };

        // Record button
        if (recordBtn) {
            recordBtn.addEventListener('click', async () => {
                if (window.recorder.isRecording) {
                    window.recorder.stop();
                } else {
                    // Initialize audio if not already
                    if (!this.audioInitialized && window.audioEngine) {
                        await window.audioEngine.init();
                        this.audioInitialized = true;
                    }
                    window.recorder.clear();
                    await window.recorder.start();
                }
            });
        }

        // Play button
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (window.recorder.isPlaying) {
                    window.recorder.stopPlayback();
                } else {
                    window.recorder.play();
                }
            });
        }

        // Stop button
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                if (window.recorder.isRecording) {
                    window.recorder.stop();
                }
                if (window.recorder.isPlaying) {
                    window.recorder.stopPlayback();
                }
            });
        }

        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (window.recorder.exportRecording()) {
                    window.showToast('录音已导出', 'success');
                }
            });
        }
    }

    /**
     * Initialize help modal
     */
    initHelpModal() {
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');
        const closeHelpBtn = document.getElementById('closeHelpBtn');

        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.add('show');
            });
        }

        if (closeHelpBtn && helpModal) {
            closeHelpBtn.addEventListener('click', () => {
                helpModal.classList.remove('show');
            });
        }

        // Close on outside click
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.remove('show');
                }
            });
        }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        setTimeout(() => {
            window.showToast('欢迎使用 GuitarSim！点击指板开始弹奏。', 'info');
        }, 500);
    }
}

// Toast notification helper
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
