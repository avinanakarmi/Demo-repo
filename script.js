class Timer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.intervalId = null;
        
        // DOM elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.minuteInput = document.getElementById('minuteInput');
        this.secondInput = document.getElementById('secondInput');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.notification = document.getElementById('notification');
        this.timerDisplay = document.querySelector('.timer-display');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.minuteInput.addEventListener('input', () => this.updateDisplay());
        this.secondInput.addEventListener('input', () => this.updateDisplay());
        
        // Initial display
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = parseInt(this.minuteInput.value) || 0;
        const seconds = parseInt(this.secondInput.value) || 0;
        
        // Constrain values
        if (seconds > 59) this.secondInput.value = 59;
        if (minutes > 59) this.minuteInput.value = 59;
        
        const displayMinutes = String(Math.max(0, parseInt(this.minuteInput.value) || 0)).padStart(2, '0');
        const displaySeconds = String(Math.max(0, parseInt(this.secondInput.value) || 0)).padStart(2, '0');
        
        this.minutesDisplay.textContent = displayMinutes;
        this.secondsDisplay.textContent = displaySeconds;
    }
    
    start() {
        if (this.isRunning) return;
        
        const minutes = parseInt(this.minuteInput.value) || 0;
        const seconds = parseInt(this.secondInput.value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            this.showNotification('Please set a time first!', 'error');
            return;
        }
        
        this.totalSeconds = minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;
        
        // Disable inputs while running
        this.minuteInput.disabled = true;
        this.secondInput.disabled = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.showNotification('Timer started!', 'success');
        this.timerDisplay.classList.remove('alert');
        
        this.intervalId = setInterval(() => this.tick(), 1000);
    }
    
    tick() {
        this.remainingSeconds--;
        
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        
        this.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        this.secondsDisplay.textContent = String(seconds).padStart(2, '0');
        
        if (this.remainingSeconds <= 10 && this.remainingSeconds > 0) {
            this.timerDisplay.classList.add('alert');
        }
        
        if (this.remainingSeconds === 0) {
            this.complete();
        }
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.showNotification('Timer paused', 'success');
    }
    
    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        
        // Enable inputs
        this.minuteInput.disabled = false;
        this.secondInput.disabled = false;
        this.minuteInput.value = 1;
        this.secondInput.value = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.updateDisplay();
        this.timerDisplay.classList.remove('alert');
        this.showNotification('Timer reset', 'success');
    }
    
    complete() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        // Play notification and show alert
        this.timerDisplay.classList.add('alert');
        this.showNotification('⏰ Time\'s up!', 'success');
        this.playNotificationSound();
    }
    
    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.notification.className = 'notification';
        }, 3000);
    }
    
    playNotificationSound() {
        // Create a simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Timer();
});
