// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const toolCards = document.querySelectorAll('.tool-card');
const activeToolTitle = document.getElementById('activeToolTitle');
const activeToolDesc = document.getElementById('activeToolDesc');
const toolContent = document.getElementById('toolContent');
const welcomeState = document.getElementById('welcomeState');
const quickToolsGrid = document.getElementById('quickToolsGrid');
const toast = document.getElementById('toast');

// Tool Interfaces
const calculatorTool = document.getElementById('calculatorTool');
const translatorTool = document.getElementById('translatorTool');
const timerTool = document.getElementById('timerTool');
const colorTool = document.getElementById('colorTool');
const tasbeehTool = document.getElementById('tasbeehTool');

// Current active tool
let activeTool = null;

// Frequently used tools tracking
let frequentlyUsedTools = JSON.parse(localStorage.getItem('frequentlyUsedTools')) || {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    initializeTools();
    updateQuickTools();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Tool selection
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.getAttribute('data-tool');
            selectTool(tool);
        });
    });
    
    // Window scroll event
    window.addEventListener('scroll', toggleScrollTopButton);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Scroll to top button visibility
function toggleScrollTopButton() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
}

// Tool Selection and Management
function selectTool(tool) {
    // Update active tool
    activeTool = tool;
    
    // Hide all tool interfaces
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.style.display = 'none';
    });
    
    // Hide welcome state
    welcomeState.style.display = 'none';
    
    // Show selected tool
    const toolElement = document.getElementById(`${tool}Tool`);
    if (toolElement) {
        toolElement.style.display = 'block';
    }
    
    // Update tool title and description
    updateToolInfo(tool);
    
    // Track tool usage
    trackToolUsage(tool);
    
    // Update quick tools
    updateQuickTools();
    
    // Scroll to tool section
    document.querySelector('.active-tool-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function updateToolInfo(tool) {
    const toolCard = document.querySelector(`[data-tool="${tool}"]`);
    if (toolCard) {
        const title = toolCard.querySelector('h3').textContent;
        const description = toolCard.querySelector('p').textContent;
        
        activeToolTitle.textContent = title;
        activeToolDesc.textContent = description;
    }
}

function trackToolUsage(tool) {
    if (!frequentlyUsedTools[tool]) {
        frequentlyUsedTools[tool] = 0;
    }
    frequentlyUsedTools[tool]++;
    localStorage.setItem('frequentlyUsedTools', JSON.stringify(frequentlyUsedTools));
}

function updateQuickTools() {
    // Clear current quick tools
    quickToolsGrid.innerHTML = '';
    
    // Get top 4 most used tools
    const sortedTools = Object.entries(frequentlyUsedTools)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);
    
    // If no tools used yet, show default set
    if (sortedTools.length === 0) {
        const defaultTools = ['calculator', 'translator', 'timer', 'color'];
        defaultTools.forEach(tool => {
            createQuickToolCard(tool);
        });
    } else {
        sortedTools.forEach(([tool, count]) => {
            createQuickToolCard(tool);
        });
    }
}

function createQuickToolCard(tool) {
    const toolCard = document.querySelector(`[data-tool="${tool}"]`);
    if (!toolCard) return;
    
    const title = toolCard.querySelector('h3').textContent;
    const iconClass = toolCard.querySelector('i').className;
    
    const quickToolCard = document.createElement('div');
    quickToolCard.className = 'quick-tool-card glass-card';
    quickToolCard.setAttribute('data-tool', tool);
    quickToolCard.innerHTML = `
        <div class="tool-icon">
            <i class="${iconClass}"></i>
        </div>
        <h3>${title}</h3>
    `;
    
    quickToolCard.addEventListener('click', () => {
        selectTool(tool);
    });
    
    quickToolsGrid.appendChild(quickToolCard);
}

// Toast Notification
function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Calculator Implementation
function initializeCalculator() {
    const calcDisplay = document.getElementById('calcDisplay');
    const calcHistory = document.getElementById('calcHistory');
    const calcButtons = document.querySelectorAll('.calc-btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    
    // Update display
    function updateDisplay() {
        calcDisplay.textContent = currentInput;
        calcHistory.textContent = previousInput + (operation ? ' ' + getOperationSymbol(operation) : '');
    }
    
    // Get operation symbol for display
    function getOperationSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'power': 'x²',
            'square-root': '√',
            'percentage': '%',
            'plus-minus': '±',
            'inverse': '1/x'
        };
        return symbols[op] || op;
    }
    
    // Reset calculator
    function reset() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetScreen = false;
        updateDisplay();
    }
    
    // Append number
    function appendNumber(number) {
        if (currentInput === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            currentInput += number;
        }
    }
    
    // Add decimal point
    function addDecimal() {
        if (resetScreen) {
            currentInput = '0.';
            resetScreen = false;
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    
    // Handle operations
    function chooseOperation(op) {
        if (currentInput === '0') return;
        
        if (previousInput !== '') {
            compute();
        }
        
        operation = op;
        previousInput = currentInput;
        resetScreen = true;
    }
    
    // Perform calculation
    function compute() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    showToast("Cannot divide by zero");
                    return;
                }
                computation = prev / current;
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            case 'square-root':
                computation = Math.sqrt(prev);
                break;
            case 'percentage':
                computation = (prev * current) / 100;
                break;
            case 'inverse':
                if (prev === 0) {
                    showToast("Cannot divide by zero");
                    return;
                }
                computation = 1 / prev;
                break;
            default:
                return;
        }
        
        currentInput = computation.toString();
        operation = null;
        previousInput = '';
        resetScreen = true;
    }
    
    // Handle scientific functions
    function handleScientificFunction(action) {
        const current = parseFloat(currentInput);
        
        if (isNaN(current)) return;
        
        switch (action) {
            case 'power':
                currentInput = Math.pow(current, 2).toString();
                break;
            case 'square-root':
                if (current < 0) {
                    showToast("Cannot calculate square root of negative number");
                    return;
                }
                currentInput = Math.sqrt(current).toString();
                break;
            case 'percentage':
                currentInput = (current / 100).toString();
                break;
            case 'plus-minus':
                currentInput = (-current).toString();
                break;
            case 'inverse':
                if (current === 0) {
                    showToast("Cannot divide by zero");
                    return;
                }
                currentInput = (1 / current).toString();
                break;
        }
        
        resetScreen = true;
        updateDisplay();
    }
    
    // Handle button clicks
    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const number = button.getAttribute('data-number');
            
            if (number) {
                appendNumber(number);
                updateDisplay();
                return;
            }
            
            switch (action) {
                case 'clear':
                    reset();
                    break;
                case 'clear-entry':
                    currentInput = '0';
                    updateDisplay();
                    break;
                case 'backspace':
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    updateDisplay();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    chooseOperation(action);
                    updateDisplay();
                    break;
                case 'equals':
                    compute();
                    updateDisplay();
                    break;
                case '.':
                    addDecimal();
                    updateDisplay();
                    break;
                case 'power':
                case 'square-root':
                case 'percentage':
                case 'plus-minus':
                case 'inverse':
                    handleScientificFunction(action);
                    break;
            }
        });
    });
    
    // Initialize calculator
    reset();
}

// Translator Implementation
function initializeTranslator() {
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const swapLangs = document.getElementById('swapLangs');
    const sourceText = document.getElementById('sourceText');
    const translateBtn = document.getElementById('translateBtn');
    const translatedText = document.getElementById('translatedText');
    const copyTranslation = document.getElementById('copyTranslation');
    const speakTranslation = document.getElementById('speakTranslation');
    const clearSource = document.getElementById('clearSource');
    const sourceCharCount = document.getElementById('sourceCharCount');
    const targetCharCount = document.getElementById('targetCharCount');
    const translationInfo = document.getElementById('translationInfo');
    
    // Language mapping for display
    const languageNames = {
        'auto': 'Detect Language',
        'en': 'English',
        'ar': 'Arabic',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean'
    };
    
    // Character count update
    sourceText.addEventListener('input', () => {
        sourceCharCount.textContent = sourceText.value.length;
    });
    
    // Clear source text
    clearSource.addEventListener('click', () => {
        sourceText.value = '';
        sourceCharCount.textContent = '0';
        translatedText.textContent = 'Translation will appear here...';
        targetCharCount.textContent = '0';
        translationInfo.textContent = '';
    });
    
    // Swap languages
    swapLangs.addEventListener('click', () => {
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;
    });
    
    // Translate text
    translateBtn.addEventListener('click', performTranslation);
    
    // Copy translation
    copyTranslation.addEventListener('click', () => {
        navigator.clipboard.writeText(translatedText.textContent)
            .then(() => {
                showToast('Translation copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy translation');
            });
    });
    
    // Speak translation
    speakTranslation.addEventListener('click', () => {
        const text = translatedText.textContent;
        if (text && text !== 'Translation will appear here...') {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLang.value;
            speechSynthesis.speak(utterance);
        }
    });
    
    // Perform translation using MyMemory API
    async function performTranslation() {
        const text = sourceText.value.trim();
        if (!text) {
            translatedText.textContent = 'Please enter text to translate';
            return;
        }
        
        // Show loading state
        translatedText.textContent = 'Translating...';
        translateBtn.disabled = true;
        
        try {
            const fromLang = sourceLang.value === 'auto' ? '' : sourceLang.value;
            const toLang = targetLang.value;
            
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
            const data = await response.json();
            
            if (data.responseStatus === 200) {
                translatedText.textContent = data.responseData.translatedText;
                targetCharCount.textContent = data.responseData.translatedText.length;
                
                // Show translation info
                const detectedLang = data.responseData.detected ? data.responseData.detected.lang : fromLang;
                translationInfo.textContent = `Translated from ${languageNames[detectedLang] || detectedLang} to ${languageNames[toLang]}`;
                
                showToast('Translation completed!');
            } else {
                translatedText.textContent = 'Translation failed. Please try again.';
                translationInfo.textContent = '';
            }
        } catch (error) {
            console.error('Translation error:', error);
            translatedText.textContent = 'Translation failed. Please check your connection.';
            translationInfo.textContent = '';
        } finally {
            translateBtn.disabled = false;
        }
    }
}

// Timer Implementation
function initializeTimer() {
    const timerTabs = document.querySelectorAll('.timer-tab');
    const timeDisplay = document.getElementById('timeDisplay');
    const startTimer = document.getElementById('startTimer');
    const pauseTimer = document.getElementById('pauseTimer');
    const lapTimer = document.getElementById('lapTimer');
    const resetTimer = document.getElementById('resetTimer');
    const countdownSetup = document.getElementById('countdownSetup');
    const pomodoroSetup = document.getElementById('pomodoroSetup');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    const setTimeBtn = document.getElementById('setTimeBtn');
    const focusTime = document.getElementById('focusTime');
    const shortBreak = document.getElementById('shortBreak');
    const longBreak = document.getElementById('longBreak');
    const sessionsBeforeLong = document.getElementById('sessionsBeforeLong');
    const setPomodoroBtn = document.getElementById('setPomodoroBtn');
    const pomodoroInfo = document.getElementById('pomodoroInfo');
    const pomodoroPhase = document.getElementById('pomodoroPhase');
    const currentSession = document.getElementById('currentSession');
    const totalSessions = document.getElementById('totalSessions');
    const lapsList = document.getElementById('lapsList');
    
    let timer;
    let isRunning = false;
    let startTime;
    let elapsedTime = 0;
    let currentMode = 'stopwatch';
    let countdownTime = 0;
    let pomodoroSettings = {
        focus: 25 * 60 * 1000, // 25 minutes in milliseconds
        shortBreak: 5 * 60 * 1000, // 5 minutes
        longBreak: 15 * 60 * 1000, // 15 minutes
        sessionsBeforeLong: 4,
        currentSession: 1,
        isBreak: false,
        isLongBreak: false
    };
    let lapTimes = [];
    
    // Tab switching
    timerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            timerTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Switch mode
            switchMode(tabName);
        });
    });
    
    // Timer controls
    startTimer.addEventListener('click', start);
    pauseTimer.addEventListener('click', pause);
    lapTimer.addEventListener('click', recordLap);
    resetTimer.addEventListener('click', reset);
    
    // Countdown setup
    setTimeBtn.addEventListener('click', setCountdownTime);
    
    // Pomodoro setup
    setPomodoroBtn.addEventListener('click', setPomodoroTime);
    
    // Switch between modes
    function switchMode(mode) {
        currentMode = mode;
        reset();
        
        // Show/hide setup panels
        countdownSetup.style.display = mode === 'countdown' ? 'block' : 'none';
        pomodoroSetup.style.display = mode === 'pomodoro' ? 'block' : 'none';
        pomodoroInfo.style.display = mode === 'pomodoro' ? 'block' : 'none';
        
        if (mode === 'stopwatch') {
            timeDisplay.textContent = '00:00:00';
        } else if (mode === 'countdown') {
            timeDisplay.textContent = '00:00:00';
        } else if (mode === 'pomodoro') {
            updatePomodoroDisplay();
        }
    }
    
    // Start timer
    function start() {
        if (isRunning) return;
        
        if (currentMode === 'countdown' && countdownTime === 0) {
            showToast('Please set countdown time first');
            return;
        }
        
        if (currentMode === 'pomodoro' && !pomodoroSettings.focus) {
            showToast('Please set Pomodoro settings first');
            return;
        }
        
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        
        startTimer.style.display = 'none';
        pauseTimer.style.display = 'block';
        
        timer = setInterval(updateTime, 10);
    }
    
    // Pause timer
    function pause() {
        if (!isRunning) return;
        
        isRunning = false;
        elapsedTime = Date.now() - startTime;
        
        startTimer.style.display = 'block';
        pauseTimer.style.display = 'none';
        
        clearInterval(timer);
    }
    
    // Reset timer
    function reset() {
        isRunning = false;
        elapsedTime = 0;
        lapTimes = [];
        
        startTimer.style.display = 'block';
        pauseTimer.style.display = 'none';
        
        clearInterval(timer);
        
        if (currentMode === 'stopwatch') {
            timeDisplay.textContent = '00:00:00';
            lapsList.innerHTML = '';
        } else if (currentMode === 'countdown') {
            timeDisplay.textContent = formatTime(countdownTime);
        } else if (currentMode === 'pomodoro') {
            updatePomodoroDisplay();
        }
    }
    
    // Update time display
    function updateTime() {
        if (currentMode === 'stopwatch') {
            elapsedTime = Date.now() - startTime;
            timeDisplay.textContent = formatTime(elapsedTime);
        } else if (currentMode === 'countdown') {
            // Countdown mode
            const remaining = countdownTime - (Date.now() - startTime);
            
            if (remaining <= 0) {
                timeDisplay.textContent = '00:00:00';
                pause();
                showToast('Countdown finished!');
                // Play sound
                playNotificationSound();
                return;
            }
            
            timeDisplay.textContent = formatTime(remaining);
        } else if (currentMode === 'pomodoro') {
            // Pomodoro mode
            const remaining = (pomodoroSettings.isBreak ? 
                (pomodoroSettings.isLongBreak ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) 
                : pomodoroSettings.focus) - (Date.now() - startTime);
            
            if (remaining <= 0) {
                // Switch phase
                if (pomodoroSettings.isBreak) {
                    // Break finished, start focus
                    pomodoroSettings.isBreak = false;
                    pomodoroSettings.isLongBreak = false;
                    pomodoroSettings.currentSession++;
                    pomodoroPhase.textContent = 'Focus Time';
                    showToast('Break finished! Time to focus.');
                } else {
                    // Focus finished, start break
                    pomodoroSettings.isBreak = true;
                    if (pomodoroSettings.currentSession % pomodoroSettings.sessionsBeforeLong === 0) {
                        pomodoroSettings.isLongBreak = true;
                        pomodoroPhase.textContent = 'Long Break';
                        showToast('Focus session completed! Time for a long break.');
                    } else {
                        pomodoroSettings.isLongBreak = false;
                        pomodoroPhase.textContent = 'Short Break';
                        showToast('Focus session completed! Time for a short break.');
                    }
                }
                
                // Play sound
                playNotificationSound();
                
                // Reset timer for new phase
                elapsedTime = 0;
                startTime = Date.now();
                updatePomodoroDisplay();
                return;
            }
            
            timeDisplay.textContent = formatTime(remaining);
            currentSession.textContent = pomodoroSettings.currentSession;
        }
    }
    
    // Set countdown time
    function setCountdownTime() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        countdownTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        
        if (countdownTime === 0) {
            showToast('Please set a valid time');
            return;
        }
        
        timeDisplay.textContent = formatTime(countdownTime);
        showToast('Countdown time set!');
    }
    
    // Set Pomodoro time
    function setPomodoroTime() {
        const focus = parseInt(focusTime.value) || 25;
        const short = parseInt(shortBreak.value) || 5;
        const long = parseInt(longBreak.value) || 15;
        const sessions = parseInt(sessionsBeforeLong.value) || 4;
        
        pomodoroSettings.focus = focus * 60 * 1000;
        pomodoroSettings.shortBreak = short * 60 * 1000;
        pomodoroSettings.longBreak = long * 60 * 1000;
        pomodoroSettings.sessionsBeforeLong = sessions;
        pomodoroSettings.currentSession = 1;
        pomodoroSettings.isBreak = false;
        pomodoroSettings.isLongBreak = false;
        
        totalSessions.textContent = sessions;
        updatePomodoroDisplay();
        showToast('Pomodoro settings applied!');
    }
    
    // Update Pomodoro display
    function updatePomodoroDisplay() {
        const time = pomodoroSettings.isBreak ? 
            (pomodoroSettings.isLongBreak ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) 
            : pomodoroSettings.focus;
        
        timeDisplay.textContent = formatTime(time);
        pomodoroPhase.textContent = pomodoroSettings.isBreak ? 
            (pomodoroSettings.isLongBreak ? 'Long Break' : 'Short Break') 
            : 'Focus Time';
        currentSession.textContent = pomodoroSettings.currentSession;
    }
    
    // Format time for display
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Record lap (for stopwatch)
    function recordLap() {
        if (currentMode !== 'stopwatch' || !isRunning) return;
        
        const lapTime = elapsedTime;
        lapTimes.push(lapTime);
        
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.textContent = `Lap ${lapTimes.length}: ${formatTime(lapTime)}`;
        
        lapsList.appendChild(lapItem);
        lapsList.scrollTop = lapsList.scrollHeight;
    }
    
    // Play notification sound
    function playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Initialize timer
    switchMode('stopwatch');
}

// Color Picker Implementation
function initializeColorPicker() {
    const colorPreview = document.getElementById('selectedColor');
    const colorHex = document.getElementById('colorHex');
    const colorR = document.getElementById('colorR');
    const colorG = document.getElementById('colorG');
    const colorB = document.getElementById('colorB');
    const copyHex = document.getElementById('copyHex');
    const copyRGB = document.getElementById('copyRGB');
    const randomColor = document.getElementById('randomColor');
    const paletteGrid = document.getElementById('paletteGrid');
    
    let currentColor = {
        hex: '#6C63FF',
        r: 108,
        g: 99,
        b: 255
    };
    
    // Predefined color palette
    const colorPalette = [
        '#6C63FF', '#4A44C6', '#FF6584', '#4CAF50', '#FF9800',
        '#2196F3', '#9C27B0', '#FF5722', '#795548', '#607D8B',
        '#E91E63', '#00BCD4', '#8BC34A', '#FFC107', '#3F51B5',
        '#F44336', '#009688', '#CDDC39', '#FFEB3B', '#673AB7'
    ];
    
    // Initialize color palette
    function initializePalette() {
        paletteGrid.innerHTML = '';
        colorPalette.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'palette-color';
            colorElement.style.backgroundColor = color;
            colorElement.setAttribute('data-color', color);
            
            colorElement.addEventListener('click', () => {
                setColorFromHex(color);
            });
            
            paletteGrid.appendChild(colorElement);
        });
    }
    
    // Set color from HEX value
    function setColorFromHex(hex) {
        currentColor.hex = hex;
        
        // Convert HEX to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        currentColor.r = r;
        currentColor.g = g;
        currentColor.b = b;
        
        updateColorDisplay();
    }
    
    // Set color from RGB values
    function setColorFromRGB(r, g, b) {
        currentColor.r = r;
        currentColor.g = g;
        currentColor.b = b;
        
        // Convert RGB to HEX
        currentColor.hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        updateColorDisplay();
    }
    
    // Update color display
    function updateColorDisplay() {
        colorPreview.style.backgroundColor = currentColor.hex;
        colorHex.value = currentColor.hex.toUpperCase();
        colorR.value = currentColor.r;
        colorG.value = currentColor.g;
        colorB.value = currentColor.b;
    }
    
    // Generate random color
    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        
        setColorFromRGB(r, g, b);
    }
    
    // Event listeners
    colorHex.addEventListener('input', () => {
        const hex = colorHex.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            setColorFromHex(hex);
        }
    });
    
    colorR.addEventListener('input', () => {
        const r = parseInt(colorR.value) || 0;
        const g = parseInt(colorG.value) || 0;
        const b = parseInt(colorB.value) || 0;
        setColorFromRGB(r, g, b);
    });
    
    colorG.addEventListener('input', () => {
        const r = parseInt(colorR.value) || 0;
        const g = parseInt(colorG.value) || 0;
        const b = parseInt(colorB.value) || 0;
        setColorFromRGB(r, g, b);
    });
    
    colorB.addEventListener('input', () => {
        const r = parseInt(colorR.value) || 0;
        const g = parseInt(colorG.value) || 0;
        const b = parseInt(colorB.value) || 0;
        setColorFromRGB(r, g, b);
    });
    
    copyHex.addEventListener('click', () => {
        navigator.clipboard.writeText(currentColor.hex)
            .then(() => {
                showToast('HEX color copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy HEX color');
            });
    });
    
    copyRGB.addEventListener('click', () => {
        const rgbText = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
        navigator.clipboard.writeText(rgbText)
            .then(() => {
                showToast('RGB color copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy RGB color');
            });
    });
    
    randomColor.addEventListener('click', generateRandomColor);
    
    // Initialize
    initializePalette();
    updateColorDisplay();
}

// Tasbeeh Counter Implementation
function initializeTasbeehCounter() {
    const tasbeehCounter = document.getElementById('tasbeehCounter');
    const tasbeehTarget = document.getElementById('tasbeehTarget');
    const countBtn = document.getElementById('countBtn');
    const tasbeehReset = document.getElementById('tasbeehReset');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const customTarget = document.getElementById('customTarget');
    const setTargetBtn = document.getElementById('setTargetBtn');
    const vibration = document.getElementById('vibration');
    const todayCount = document.getElementById('todayCount');
    const totalCount = document.getElementById('totalCount');
    const completedCount = document.getElementById('completedCount');
    
    let count = 0;
    let target = 33;
    let todayStats = {
        date: new Date().toDateString(),
        count: 0,
        completed: 0
    };
    let totalStats = {
        count: 0,
        completed: 0
    };
    
    // Load stats from localStorage
    function loadStats() {
        const savedTodayStats = localStorage.getItem('tasbeehTodayStats');
        const savedTotalStats = localStorage.getItem('tasbeehTotalStats');
        
        if (savedTodayStats) {
            const parsed = JSON.parse(savedTodayStats);
            // Check if it's the same day
            if (parsed.date === todayStats.date) {
                todayStats = parsed;
            }
        }
        
        if (savedTotalStats) {
            totalStats = JSON.parse(savedTotalStats);
        }
        
        updateStatsDisplay();
    }
    
    // Save stats to localStorage
    function saveStats() {
        localStorage.setItem('tasbeehTodayStats', JSON.stringify(todayStats));
        localStorage.setItem('tasbeehTotalStats', JSON.stringify(totalStats));
    }
    
    // Update stats display
    function updateStatsDisplay() {
        todayCount.textContent = todayStats.count;
        totalCount.textContent = totalStats.count;
        completedCount.textContent = totalStats.completed;
    }
    
    // Increment counter
    function incrementCounter() {
        count++;
        tasbeehCounter.textContent = count;
        
        // Update stats
        todayStats.count++;
        totalStats.count++;
        
        // Check if target reached
        if (count >= target) {
            count = 0;
            tasbeehCounter.textContent = count;
            
            // Update completed stats
            todayStats.completed++;
            totalStats.completed++;
            
            // Show completion message
            showToast('Target completed! Subhanallah!');
            
            // Vibrate if enabled
            if (vibration.checked && 'vibrate' in navigator) {
                navigator.vibrate(200);
            }
        }
        
        // Save stats
        saveStats();
        updateStatsDisplay();
        
        // Vibrate if enabled (short vibration for each count)
        if (vibration.checked && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Reset counter
    function resetCounter() {
        count = 0;
        tasbeehCounter.textContent = count;
    }
    
    // Set target
    function setTarget(newTarget) {
        target = newTarget;
        tasbeehTarget.textContent = target;
        resetCounter();
    }
    
    // Event listeners
    countBtn.addEventListener('click', incrementCounter);
    
    // Also allow keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (activeTool === 'tasbeeh' && (e.key === ' ' || e.key === 'Enter')) {
            incrementCounter();
        }
    });
    
    tasbeehReset.addEventListener('click', resetCounter);
    
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dhikr = button.getAttribute('data-dhikr');
            const newTarget = parseInt(button.getAttribute('data-target'));
            setTarget(newTarget);
            showToast(`Set to: ${dhikr}`);
        });
    });
    
    setTargetBtn.addEventListener('click', () => {
        const newTarget = parseInt(customTarget.value) || 33;
        if (newTarget > 0 && newTarget <= 1000) {
            setTarget(newTarget);
            showToast(`Custom target set to ${newTarget}`);
        } else {
            showToast('Please enter a valid target (1-1000)');
        }
    });
    
    // Initialize
    loadStats();
    setTarget(33);
}

// Initialize all tools
function initializeTools() {
    initializeCalculator();
    initializeTranslator();
    initializeTimer();
    initializeColorPicker();
    initializeTasbeehCounter();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back to welcome state
    if (e.key === 'Escape' && activeTool) {
        welcomeState.style.display = 'block';
        document.querySelectorAll('.tool-interface').forEach(interface => {
            interface.style.display = 'none';
        });
        
        activeToolTitle.textContent = 'Select a Tool to Begin';
        activeToolDesc.textContent = 'Choose any tool from the grid above to start using it';
        activeTool = null;
    }
    
    // Number keys for calculator when active
    if (activeTool === 'calculator' && e.key >= '0' && e.key <= '9') {
        const button = document.querySelector(`.calc-btn[data-number="${e.key}"]`);
        if (button) button.click();
    }
    
    // Operator keys for calculator
    if (activeTool === 'calculator') {
        switch (e.key) {
            case '+':
                document.querySelector('.calc-btn[data-action="add"]').click();
                break;
            case '-':
                document.querySelector('.calc-btn[data-action="subtract"]').click();
                break;
            case '*':
                document.querySelector('.calc-btn[data-action="multiply"]').click();
                break;
            case '/':
                e.preventDefault(); // Prevent quick search in some browsers
                document.querySelector('.calc-btn[data-action="divide"]').click();
                break;
            case 'Enter':
            case '=':
                document.querySelector('.calc-btn[data-action="equals"]').click();
                break;
            case 'Backspace':
                document.querySelector('.calc-btn[data-action="backspace"]').click();
                break;
            case 'Escape':
                document.querySelector('.calc-btn[data-action="clear"]').click();
                break;
        }
    }
});
// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Tool selection
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.getAttribute('data-tool');
            selectTool(tool);
        });
    });
    
    // Window scroll event
    window.addEventListener('scroll', toggleScrollTopButton);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    navMenu.classList.add('active');
    menuToggle.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
}