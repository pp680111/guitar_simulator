/**
 * Audio Engine - Tone.js based audio handling
 */

class AudioEngine {
    constructor() {
        this.isInitialized = false;
        this.synth = null;
        this.synths = {};
        this.masterVolume = null;
        this.currentTone = 'nylon';
        this.volume = 0.7;

        // Soundfont (MIDI) support - SpessaSynth
        this.soundfontLoaded = false;
        this.spessaSynth = null;
        this.currentInstrument = 'acoustic_guitar_nylon';

        // Note frequencies for guitar (standard tuning)
        // Using formula: noteIndex = string * 25 + fret (0-24 frets per string)
        // String 0 = highest pitch (E4), String 5 = lowest pitch (E2)
        this.notes = {
            // String 0 (E4) - highest pitch, indices 0-24
            0: { note: 'E4', freq: 329.63 },
            1: { note: 'F4', freq: 349.23 },
            2: { note: 'F#4', freq: 369.99 },
            3: { note: 'G4', freq: 392.00 },
            4: { note: 'G#4', freq: 415.30 },
            5: { note: 'A4', freq: 440.00 },
            6: { note: 'A#4', freq: 466.16 },
            7: { note: 'B4', freq: 493.88 },
            8: { note: 'C5', freq: 523.25 },
            9: { note: 'C#5', freq: 554.37 },
            10: { note: 'D5', freq: 587.33 },
            11: { note: 'D#5', freq: 622.25 },
            12: { note: 'E5', freq: 659.25 },
            13: { note: 'F5', freq: 698.46 },
            14: { note: 'F#5', freq: 739.99 },
            15: { note: 'G5', freq: 783.99 },
            16: { note: 'G#5', freq: 830.61 },
            17: { note: 'A5', freq: 880.00 },
            18: { note: 'A#5', freq: 932.33 },
            19: { note: 'B5', freq: 987.77 },
            20: { note: 'C6', freq: 1046.50 },
            21: { note: 'C#6', freq: 1108.73 },
            22: { note: 'D6', freq: 1174.66 },
            23: { note: 'D#6', freq: 1244.51 },
            24: { note: 'E6', freq: 1318.51 },
            // String 1 (B3), indices 25-49
            25: { note: 'B3', freq: 246.94 },
            26: { note: 'C4', freq: 261.63 },
            27: { note: 'C#4', freq: 277.18 },
            28: { note: 'D4', freq: 293.66 },
            29: { note: 'D#4', freq: 311.13 },
            30: { note: 'E4', freq: 329.63 },
            31: { note: 'F4', freq: 349.23 },
            32: { note: 'F#4', freq: 369.99 },
            33: { note: 'G4', freq: 392.00 },
            34: { note: 'G#4', freq: 415.30 },
            35: { note: 'A4', freq: 440.00 },
            36: { note: 'A#4', freq: 466.16 },
            37: { note: 'B4', freq: 493.88 },
            38: { note: 'C5', freq: 523.25 },
            39: { note: 'C#5', freq: 554.37 },
            40: { note: 'D5', freq: 587.33 },
            41: { note: 'D#5', freq: 622.25 },
            42: { note: 'E5', freq: 659.25 },
            43: { note: 'F5', freq: 698.46 },
            44: { note: 'F#5', freq: 739.99 },
            45: { note: 'G5', freq: 783.99 },
            46: { note: 'G#5', freq: 830.61 },
            47: { note: 'A5', freq: 880.00 },
            48: { note: 'B5', freq: 987.77 },
            49: { note: 'C6', freq: 1046.50 },
            // String 2 (G3), indices 50-74
            50: { note: 'G3', freq: 196.00 },
            51: { note: 'G#3', freq: 207.65 },
            52: { note: 'A3', freq: 220.00 },
            53: { note: 'A#3', freq: 233.08 },
            54: { note: 'B3', freq: 246.94 },
            55: { note: 'C4', freq: 261.63 },
            56: { note: 'C#4', freq: 277.18 },
            57: { note: 'D4', freq: 293.66 },
            58: { note: 'D#4', freq: 311.13 },
            59: { note: 'E4', freq: 329.63 },
            60: { note: 'F4', freq: 349.23 },
            61: { note: 'F#4', freq: 369.99 },
            62: { note: 'G4', freq: 392.00 },
            63: { note: 'G#4', freq: 415.30 },
            64: { note: 'A4', freq: 440.00 },
            65: { note: 'A#4', freq: 466.16 },
            66: { note: 'B4', freq: 493.88 },
            67: { note: 'C5', freq: 523.25 },
            68: { note: 'C#5', freq: 554.37 },
            69: { note: 'D5', freq: 587.33 },
            70: { note: 'D#5', freq: 622.25 },
            71: { note: 'E5', freq: 659.25 },
            72: { note: 'F5', freq: 698.46 },
            73: { note: 'G5', freq: 783.99 },
            74: { note: 'A5', freq: 880.00 },
            // String 3 (D3), indices 75-99
            75: { note: 'D3', freq: 146.83 },
            76: { note: 'D#3', freq: 155.56 },
            77: { note: 'E3', freq: 164.81 },
            78: { note: 'F3', freq: 174.61 },
            79: { note: 'F#3', freq: 185.00 },
            80: { note: 'G3', freq: 196.00 },
            81: { note: 'G#3', freq: 207.65 },
            82: { note: 'A3', freq: 220.00 },
            83: { note: 'A#3', freq: 233.08 },
            84: { note: 'B3', freq: 246.94 },
            85: { note: 'C4', freq: 261.63 },
            86: { note: 'C#4', freq: 277.18 },
            87: { note: 'D4', freq: 293.66 },
            88: { note: 'D#4', freq: 311.13 },
            89: { note: 'E4', freq: 329.63 },
            90: { note: 'F4', freq: 349.23 },
            91: { note: 'F#4', freq: 369.99 },
            92: { note: 'G4', freq: 392.00 },
            93: { note: 'G#4', freq: 415.30 },
            94: { note: 'A4', freq: 440.00 },
            95: { note: 'B4', freq: 493.88 },
            96: { note: 'C5', freq: 523.25 },
            97: { note: 'D5', freq: 587.33 },
            98: { note: 'E5', freq: 659.25 },
            99: { note: 'F5', freq: 698.46 },
            // String 4 (A2), indices 100-124
            100: { note: 'A2', freq: 110.00 },
            101: { note: 'A#2', freq: 116.54 },
            102: { note: 'B2', freq: 123.47 },
            103: { note: 'C3', freq: 130.81 },
            104: { note: 'C#3', freq: 138.59 },
            105: { note: 'D3', freq: 146.83 },
            106: { note: 'D#3', freq: 155.56 },
            107: { note: 'E3', freq: 164.81 },
            108: { note: 'F3', freq: 174.61 },
            109: { note: 'F#3', freq: 185.00 },
            110: { note: 'G3', freq: 196.00 },
            111: { note: 'G#3', freq: 207.65 },
            112: { note: 'A3', freq: 220.00 },
            113: { note: 'A#3', freq: 233.08 },
            114: { note: 'B3', freq: 246.94 },
            115: { note: 'C4', freq: 261.63 },
            116: { note: 'D4', freq: 293.66 },
            117: { note: 'E4', freq: 329.63 },
            118: { note: 'F4', freq: 349.23 },
            119: { note: 'G4', freq: 392.00 },
            120: { note: 'A4', freq: 440.00 },
            121: { note: 'B4', freq: 493.88 },
            122: { note: 'C5', freq: 523.25 },
            123: { note: 'D5', freq: 587.33 },
            124: { note: 'E5', freq: 659.25 },
            // String 5 (E2) - lowest pitch, indices 125-149
            125: { note: 'E2', freq: 82.41 },
            126: { note: 'F2', freq: 87.31 },
            127: { note: 'F#2', freq: 92.50 },
            128: { note: 'G2', freq: 98.00 },
            129: { note: 'G#2', freq: 103.83 },
            130: { note: 'A2', freq: 110.00 },
            131: { note: 'A#2', freq: 116.54 },
            132: { note: 'B2', freq: 123.47 },
            133: { note: 'C3', freq: 130.81 },
            134: { note: 'C#3', freq: 138.59 },
            135: { note: 'D3', freq: 146.83 },
            136: { note: 'D#3', freq: 155.56 },
            137: { note: 'E3', freq: 164.81 },
            138: { note: 'F3', freq: 174.61 },
            139: { note: 'F#3', freq: 185.00 },
            140: { note: 'G3', freq: 196.00 },
            141: { note: 'G#3', freq: 207.65 },
            142: { note: 'A3', freq: 220.00 },
            143: { note: 'A#3', freq: 233.08 },
            144: { note: 'B3', freq: 246.94 },
            145: { note: 'C4', freq: 261.63 },
            146: { note: 'D4', freq: 293.66 },
            147: { note: 'E4', freq: 329.63 },
            148: { note: 'F4', freq: 349.23 },
            149: { note: 'G4', freq: 392.00 }
        };

        // Tone presets
        this.tonePresets = {
            nylon: {
                type: 'pluck',
                attack: 0.001,
                release: 2,
                freq: 220
            },
            steel: {
                type: 'pluck',
                attack: 0.001,
                release: 3,
                freq: 440
            },
            electric: {
                type: 'sine',
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.5
            },
            synth: {
                oscillator: {
                    type: 'triangle'
                },
                envelope: {
                    attack: 0.02,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.8
                }
            }
        };
    }

    /**
     * Initialize the audio engine
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Check if Tone.js is loaded
            if (typeof Tone === 'undefined') {
                throw new Error('Tone.js is not loaded');
            }

            await Tone.start();
            console.log('Tone.js audio context started');

            // Create master volume
            this.masterVolume = new Tone.Volume(Tone.gainToDb(this.volume)).toDestination();
            console.log('Master volume created');

            // Create synths for each tone type
            this.createSynths();
            console.log('Synths created');

            this.isInitialized = true;
            console.log('Audio engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            throw error;
        }
    }

    /**
     * Create synths for different guitar tones
     */
    createSynths() {
        // Nylon guitar - FMSynth for plucked sound
        this.synths.nylon = new Tone.FMSynth({
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: {
                type: 'sine'
            },
            modulation: {
                type: 'triangle'
            },
            envelope: {
                attack: 0.001,
                decay: 0.5,
                sustain: 0.1,
                release: 2
            },
            modulationEnvelope: {
                attack: 0.001,
                decay: 0.5,
                sustain: 0,
                release: 0.5
            }
        }).connect(this.masterVolume);

        // Steel guitar - FMSynth with different settings
        this.synths.steel = new Tone.FMSynth({
            harmonicity: 5,
            modulationIndex: 5,
            oscillator: {
                type: 'triangle'
            },
            modulation: {
                type: 'sine'
            },
            envelope: {
                attack: 0.001,
                decay: 0.8,
                sustain: 0.1,
                release: 3
            },
            modulationEnvelope: {
                attack: 0.001,
                decay: 0.3,
                sustain: 0,
                release: 0.5
            }
        }).connect(this.masterVolume);

        // Electric - AM synth for a softer tone
        this.synths.electric = new Tone.AMSynth({
            harmonicity: 2.5,
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.3,
                release: 0.5
            },
            modulation: {
                type: 'square'
            },
            modulationEnvelope: {
                attack: 0.5,
                decay: 0,
                sustain: 1,
                release: 0.5
            }
        }).connect(this.masterVolume);

        // Synth - basic synth
        this.synths.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: 'triangle'
            },
            envelope: {
                attack: 0.02,
                decay: 0.3,
                sustain: 0.4,
                release: 0.8
            }
        }).connect(this.masterVolume);

        // Set default synth
        this.synth = this.synths.nylon;
    }

    /**
     * Load a soundfont (MIDI instrument) from a file
     * Note: Full SF2 support requires hosting the worklet file locally due to browser security restrictions
     * @param {ArrayBuffer} arrayBuffer - The soundfont file data
     */
    async loadSoundfont(arrayBuffer) {
        try {
            window.showToast('正在加载音色库...', 'info');

            // Wait for SpessaSynth to be ready
            if (typeof WorkletSynthesizer === 'undefined') {
                console.log('Waiting for SpessaSynth to load...');
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('SpessaSynth load timeout')), 10000);
                    window.addEventListener('spessasynthReady', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                });
            }

            // Try to use SpessaSynth
            if (typeof WorkletSynthesizer !== 'undefined') {
                try {
                    // Create a new native AudioContext for SpessaSynth
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                    // Make sure context is running
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume();
                    }

                    // Load worklet from local path
                    await audioContext.audioWorklet.addModule('./spessasynth_lib-4.1.5/package/dist/spessasynth_processor.min.js');

                    this.spessaSynth = new WorkletSynthesizer(audioContext);

                    // Connect directly to audioContext destination
                    this.spessaSynth.connect(audioContext.destination);

                    await this.spessaSynth.soundBankManager.addSoundBank(arrayBuffer, 'main');
                    await this.spessaSynth.isReady;

                    this.soundfontLoaded = true;
                    this.currentInstrument = 'SF2 Instrument';
                    window.showToast('音色库加载成功！', 'success');
                    console.log('SF2 soundfont loaded successfully');
                    return true;
                } catch (e) {
                    console.error('SpessaSynth error:', e);
                }
            }

            // Fallback: use different synth settings to simulate guitar tones
            window.showToast('使用内置音色', 'info');

            // Update synth with different settings to simulate guitar
            this.synths.nylon = new Tone.FMSynth({
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: { type: 'sine' },
                modulation: { type: 'triangle' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 2 },
                modulationEnvelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 }
            }).connect(this.masterVolume);

            this.synth = this.synths.nylon;
            this.soundfontLoaded = true;
            this.currentInstrument = 'Nylon Guitar';

            console.log('Using fallback synth');
            window.showToast('音色已切换为古典吉他', 'success');
            return true;

        } catch (error) {
            console.error('Failed to load soundfont:', error);
            window.showToast('音色库加载失败: ' + error.message, 'error');
            return false;
        }
    }

    /**
     * Convert note name to MIDI number
     * @param {string} noteName - Note name like 'E4', 'C#5', etc.
     * @returns {number} MIDI note number
     */
    noteNameToMidi(noteName) {
        const noteMap = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
        const match = noteName.match(/^([A-G]#?)(\d+)$/);
        if (!match) return 60;
        const note = match[1];
        const octave = parseInt(match[2]);
        return 12 * (octave + 1) + noteMap[note];
    }

    /**
     * Play a note by fret position
     * @param {number} string - String number (0-5)
     * @param {number} fret - Fret number (0-24)
     */
    async playNote(string, fret) {
        // Initialize if not initialized
        if (!this.isInitialized) {
            try {
                await this.init();
            } catch (error) {
                console.error('Failed to initialize audio engine:', error);
                return;
            }
        }

        const noteIndex = string * 25 + fret;
        const noteData = this.notes[noteIndex];

        if (!noteData) {
            console.warn(`No note data for string ${string}, fret ${fret}`);
            return;
        }

        try {
            // Use SpessaSynth if soundfont is loaded
            if (this.soundfontLoaded && this.spessaSynth) {
                const midiNote = this.noteNameToMidi(noteData.note);
                // Play note on channel 0 with velocity 100
                this.spessaSynth.noteOn(0, midiNote, 100);

                // Release after 200ms
                setTimeout(() => {
                    this.spessaSynth.noteOff(0, midiNote);
                }, 200);
            } else {
                // Use Tone.js synth as fallback
                this.synth.triggerAttackRelease(noteData.note, 0.3);
            }

        } catch (error) {
            console.error('Error playing note:', error);
        }
    }

    /**
     * Play a specific note by frequency
     * @param {number|string} note - Note name or frequency
     * @param {string} duration - Duration (default: 8n)
     */
    play(note, duration = '8n') {
        if (!this.isInitialized) return;

        try {
            this.synth.triggerAttackRelease(note, duration);
        } catch (error) {
            console.error('Error playing note:', error);
        }
    }

    /**
     * Set the guitar tone
     * @param {string} tone - Tone type (nylon, steel, electric, synth)
     */
    setTone(tone) {
        if (!this.tonePresets[tone]) {
            console.warn(`Unknown tone: ${tone}`);
            return;
        }

        this.currentTone = tone;
        this.synth = this.synths[tone];
    }

    /**
     * Set the volume
     * @param {number} value - Volume value (0-1)
     */
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterVolume) {
            this.masterVolume.volume.value = Tone.gainToDb(this.volume);
        }
    }

    /**
     * Get current volume
     * @returns {number} Volume value (0-1)
     */
    getVolume() {
        return this.volume;
    }

    /**
     * Get note information for a fret position
     * @param {number} string - String number (0-5)
     * @param {number} fret - Fret number (0-24)
     * @returns {object} Note data
     */
    getNote(string, fret) {
        const noteIndex = string * 25 + fret;
        return this.notes[noteIndex] || null;
    }

    /**
     * Get audio context for recording
     * @returns {AudioContext} Tone.js audio context
     */
    getContext() {
        return Tone.getContext().rawContext;
    }

    /**
     * Get destination node for recording
     * @returns {object} Destination node
     */
    getDestination() {
        return Tone.getDestination();
    }
}

// Export singleton instance
window.audioEngine = new AudioEngine();
