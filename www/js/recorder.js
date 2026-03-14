/**
 * Recorder - Audio recording and playback functionality
 */

class Recorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioContext = null;
        this.mediaStreamDestination = null;
        this.chunks = [];
        this.isRecording = false;
        this.isPlaying = false;
        this.recordedBlob = null;
        this.audioElement = null;
        this.startTime = 0;
        this.timerInterval = null;
        this.analyser = null;
        this.dataArray = null;

        // Callbacks
        this.onStateChange = null;
        this.onDataAvailable = null;
    }

    /**
     * Initialize the recorder
     */
    async init() {
        try {
            // Get audio context from Tone.js
            if (window.audioEngine && window.audioEngine.getContext()) {
                this.audioContext = window.audioEngine.getContext();
            } else {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create media stream destination for capturing audio
            this.mediaStreamDestination = this.audioContext.createMediaStreamDestination();

            // Connect Tone.js destination to our recorder
            if (window.audioEngine && window.audioEngine.getDestination()) {
                const toneDestination = window.audioEngine.getDestination();
                toneDestination.connect(this.mediaStreamDestination);
            }

            // Create analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.mediaStreamDestination.connect(this.analyser);
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            console.log('Recorder initialized');
        } catch (error) {
            console.error('Failed to initialize recorder:', error);
            throw error;
        }
    }

    /**
     * Start recording
     */
    async start() {
        if (this.isRecording) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Initialize if not already
            if (!this.mediaStreamDestination) {
                await this.init();
            }

            // Clear previous recording
            this.chunks = [];

            // Create media recorder
            const stream = this.mediaStreamDestination.stream;

            // Try different mime types
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = '';
                    }
                }
            }

            const options = mimeType ? { mimeType } : {};

            this.mediaRecorder = new MediaRecorder(stream, options);

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.chunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.recordedBlob = new Blob(this.chunks, {
                    type: mimeType || 'audio/webm'
                });
                this.onDataAvailable && this.onDataAvailable(this.recordedBlob);
            };

            // Start recording
            this.mediaRecorder.start(100);
            this.isRecording = true;
            this.startTime = Date.now();

            // Start timer
            this.startTimer();

            // Update state
            this.onStateChange && this.onStateChange('recording');

            console.log('Recording started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    }

    /**
     * Stop recording
     */
    stop() {
        if (!this.isRecording) return;

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        this.isRecording = false;
        this.stopTimer();

        // Update state
        this.onStateChange && this.onStateChange('stopped');

        console.log('Recording stopped');
    }

    /**
     * Play the recorded audio
     */
    play() {
        if (!this.recordedBlob || this.isPlaying) return;

        // Create audio element
        this.audioElement = new Audio(URL.createObjectURL(this.recordedBlob));

        this.audioElement.onplay = () => {
            this.isPlaying = true;
            this.onStateChange && this.onStateChange('playing');
            this.startPlaybackTimer();
        };

        this.audioElement.onended = () => {
            this.isPlaying = false;
            this.stopPlaybackTimer();
            this.onStateChange && this.onStateChange('stopped');
        };

        this.audioElement.play();
    }

    /**
     * Stop playback
     */
    stopPlayback() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.isPlaying = false;
            this.stopPlaybackTimer();
            this.onStateChange && this.onStateChange('stopped');
        }
    }

    /**
     * Export the recorded audio
     */
    exportRecording() {
        if (!this.recordedBlob) return null;

        // Create download link
        const url = URL.createObjectURL(this.recordedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guitar-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
    }

    /**
     * Start recording timer
     */
    startTimer() {
        const timeDisplay = document.getElementById('recorderTime');

        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            if (timeDisplay) {
                timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
            }

            // Update waveform
            this.updateWaveform();
        }, 50);
    }

    /**
     * Stop recording timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Start playback timer
     */
    startPlaybackTimer() {
        const timeDisplay = document.getElementById('recorderTime');

        this.timerInterval = setInterval(() => {
            if (this.audioElement) {
                const current = this.audioElement.currentTime;
                const duration = this.audioElement.duration || 0;
                const minutes = Math.floor(current / 60);
                const seconds = Math.floor(current % 60);

                if (timeDisplay) {
                    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            }
        }, 100);
    }

    /**
     * Stop playback timer
     */
    stopPlaybackTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update waveform visualization
     */
    updateWaveform() {
        const canvas = document.getElementById('waveformCanvas');
        if (!canvas || !this.analyser) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        this.analyser.getByteFrequencyData(this.dataArray);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        const barWidth = width / this.dataArray.length;
        const barGap = 1;

        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * height;
            const x = i * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = `rgb(255, ${215 - this.dataArray[i] / 2}, 0)`;
            ctx.fillRect(x, y, barWidth - barGap, barHeight);
        }
    }

    /**
     * Clear the recording
     */
    clear() {
        this.recordedBlob = null;
        this.chunks = [];

        // Clear waveform
        const canvas = document.getElementById('waveformCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Reset time display
        const timeDisplay = document.getElementById('recorderTime');
        if (timeDisplay) {
            timeDisplay.textContent = '00:00';
        }
    }

    /**
     * Check if there's a recording available
     * @returns {boolean}
     */
    hasRecording() {
        return this.recordedBlob !== null;
    }
}

// Export singleton instance
window.recorder = new Recorder();
