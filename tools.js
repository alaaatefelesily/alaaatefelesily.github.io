// ============================================
// TOOLS.JS - Study Tools Hub
// جميع الأدوات في ملف واحد موحد
// ============================================

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const toolCards = document.querySelectorAll('.tool-card');
    const activeToolTitle = document.getElementById('activeToolTitle');
    const activeToolDesc = document.getElementById('activeToolDesc');
    const toolContent = document.getElementById('toolContent');
    const welcomeState = document.getElementById('welcomeState');
    const activeToolInfo = document.getElementById('activeToolInfo');
    const quickToolsGrid = document.getElementById('quickToolsGrid');
    const toast = document.getElementById('toast');

    // ========================================
    // State
    // ========================================
    let activeTool = null;
    let frequentlyUsedTools = JSON.parse(localStorage.getItem('frequentlyUsedTools')) || {};

    // ========================================
    // Toast Notification
    // ========================================
    function showToast(message, duration = 3000) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // ========================================
    // Theme Management
    // ========================================
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
        // تحديث أيقونات Lucide بعد تغيير الثيم
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // ========================================
    // Mobile Menu
    // ========================================
    function toggleMobileMenu() {
        const isActive = navMenu.classList.contains('open');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navMenu.classList.add('open');
        menuToggle.classList.add('active');
    }

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
    }

    // ========================================
    // Tool Selection
    // ========================================
    function selectTool(tool) {
        if (!tool) return;
        activeTool = tool;

        // إخفاء جميع واجهات الأدوات
        document.querySelectorAll('.tool-interface').forEach(el => {
            el.style.display = 'none';
        });

        // إخفاء حالة الترحيب
        if (welcomeState) welcomeState.style.display = 'none';
        if (activeToolInfo) activeToolInfo.style.display = 'block';

        // إظهار الأداة المحددة
        const toolElement = document.getElementById(tool + 'Tool');
        if (toolElement) {
            toolElement.style.display = 'block';
        }

        // تحديث معلومات الأداة
        updateToolInfo(tool);

        // تتبع الاستخدام
        trackToolUsage(tool);

        // تحديث الأدوات الأكثر استخداماً
        updateQuickTools();

        // التمرير إلى قسم الأداة
        const section = document.querySelector('.active-tool-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // تهيئة Lucide icons في الأداة الجديدة
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function updateToolInfo(tool) {
        const card = document.querySelector(`[data-tool="${tool}"]`);
        if (card) {
            const title = card.querySelector('h3')?.textContent || tool;
            const desc = card.querySelector('p')?.textContent || '';
            if (activeToolTitle) activeToolTitle.textContent = title;
            if (activeToolDesc) activeToolDesc.textContent = desc;
        }
    }

    function trackToolUsage(tool) {
        if (!frequentlyUsedTools[tool]) {
            frequentlyUsedTools[tool] = 0;
        }
        frequentlyUsedTools[tool]++;
        localStorage.setItem('frequentlyUsedTools', JSON.stringify(frequentlyUsedTools));
    }

    // ========================================
    // Quick Tools
    // ========================================
    function updateQuickTools() {
        if (!quickToolsGrid) return;
        quickToolsGrid.innerHTML = '';

        // الحصول على أهم 4 أدوات مستخدمة
        const sortedTools = Object.entries(frequentlyUsedTools)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([tool]) => tool);

        // إذا لم توجد أدوات مستخدمة، استخدم الأدوات الافتراضية
        const toolsToShow = sortedTools.length > 0 ? sortedTools : ['calculator', 'translator', 'timer', 'color'];

        toolsToShow.forEach(tool => {
            const card = document.querySelector(`[data-tool="${tool}"]`);
            if (!card) return;

            const title = card.querySelector('h3')?.textContent || tool;
            const iconEl = card.querySelector('.card-icon i');
            const iconName = iconEl ? iconEl.getAttribute('data-lucide') || 'circle' : 'circle';

            const quickCard = document.createElement('button');
            quickCard.className = 'card tool-card reveal';
            quickCard.setAttribute('data-tool', tool);
            quickCard.innerHTML = `
                <div class="card-icon"><i data-lucide="${iconName}"></i></div>
                <h3>${title}</h3>
                <div class="tag">Quick</div>
            `;
            quickCard.addEventListener('click', () => selectTool(tool));
            quickToolsGrid.appendChild(quickCard);
        });

        // تهيئة Lucide icons للأدوات السريعة
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // ========================================
    // ========================================
    // CALCULATOR
    // ========================================
    // ========================================
// CALCULATOR - نسخة محسنة ومصححة
// ========================================
function initializeCalculator() {
    const display = document.getElementById('calcDisplay');
    const history = document.getElementById('calcHistory');
    const buttons = document.querySelectorAll('.calc-btn');
    
    if (!display) return;

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;

    function updateDisplay() {
        display.textContent = currentInput;
        if (history) {
            history.textContent = previousInput + (operation ? ' ' + getOpSymbol(operation) : '');
        }
    }

    function getOpSymbol(op) {
        const symbols = { 
            '+': '+', 
            '-': '−', 
            '*': '×', 
            '/': '÷',
            'add': '+', 
            'subtract': '−', 
            'multiply': '×', 
            'divide': '÷' 
        };
        return symbols[op] || op;
    }

    function reset() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetScreen = false;
        updateDisplay();
    }

    function clearEntry() {
        currentInput = '0';
        updateDisplay();
    }

    function backspace() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    function appendNumber(num) {
        if (currentInput === '0' || resetScreen) {
            currentInput = num;
            resetScreen = false;
        } else {
            // منع إدخال أكثر من 15 رقم
            if (currentInput.replace('-', '').replace('.', '').length >= 15) return;
            currentInput += num;
        }
        updateDisplay();
    }

    function addDecimal() {
        if (resetScreen) {
            currentInput = '0.';
            resetScreen = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }

    function toggleSign() {
        if (currentInput === '0') return;
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }

    function chooseOperation(op) {
        if (currentInput === '0' && op !== '-' && op !== '+') return;
        if (previousInput !== '' && operation) {
            compute();
        }
        if (currentInput === '' || currentInput === '0') return;
        operation = op;
        previousInput = currentInput;
        resetScreen = true;
        updateDisplay();
    }

    function compute() {
        if (!operation || previousInput === '') return;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        let result;
        switch (operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/':
                if (current === 0) {
                    showToast('لا يمكن القسمة على صفر');
                    reset();
                    return;
                }
                result = prev / current;
                break;
            default: return;
        }

        // التعامل مع أخطاء التقريب
        result = parseFloat(result.toPrecision(12));
        
        currentInput = String(result);
        operation = null;
        previousInput = '';
        resetScreen = true;
        updateDisplay();
    }

    function handleScientific(action) {
        const current = parseFloat(currentInput);
        if (isNaN(current)) return;

        let result;
        switch (action) {
            case 'sqrt':
                if (current < 0) {
                    showToast('لا يمكن حساب جذر عدد سالب');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case '^2':
                result = Math.pow(current, 2);
                break;
            case '%':
                result = current / 100;
                break;
            case '+/-':
                toggleSign();
                return;
            case '1/x':
                if (current === 0) {
                    showToast('لا يمكن قسمة على صفر');
                    return;
                }
                result = 1 / current;
                break;
            default: return;
        }

        currentInput = String(parseFloat(result.toPrecision(12)));
        resetScreen = true;
        updateDisplay();
    }

    // ========================================
    // معالجة الأزرار - باستخدام data-calc
    // ========================================
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.dataset.calc;
            
            console.log('Button clicked:', value); // للمساعدة في التصحيح

            // العمليات الأساسية
            if (value === 'C') {
                reset();
                return;
            }
            if (value === 'CE') {
                clearEntry();
                return;
            }
            if (value === 'back') {
                backspace();
                return;
            }

            // الأرقام
            if (/^[0-9]$/.test(value)) {
                appendNumber(value);
                return;
            }

            // العمليات الحسابية
            if (['+', '-', '*', '/'].includes(value)) {
                chooseOperation(value);
                return;
            }

            // مساواة
            if (value === '=') {
                compute();
                return;
            }

            // العلامة العشرية
            if (value === '.') {
                addDecimal();
                return;
            }

            // العمليات العلمية
            if (['sqrt', '^2', '%', '+/-', '1/x'].includes(value)) {
                handleScientific(value);
                return;
            }
        });
    });

    // ========================================
    // دعم لوحة المفاتيح
    // ========================================
    document.addEventListener('keydown', function(e) {
        if (activeTool !== 'calculator') return;
        if (e.target.closest('input') || e.target.closest('textarea')) return;

        const key = e.key;
        
        // الأرقام
        if (/^[0-9]$/.test(key)) {
            e.preventDefault();
            appendNumber(key);
            return;
        }

        // العمليات
        if (key === '+') { e.preventDefault(); chooseOperation('+'); return; }
        if (key === '-') { e.preventDefault(); chooseOperation('-'); return; }
        if (key === '*') { e.preventDefault(); chooseOperation('*'); return; }
        if (key === '/') { e.preventDefault(); chooseOperation('/'); return; }

        // مساواة
        if (key === 'Enter' || key === '=') {
            e.preventDefault();
            compute();
            return;
        }

        // نقطة عشرية
        if (key === '.') {
            e.preventDefault();
            addDecimal();
            return;
        }

        // مسح
        if (key === 'Escape') {
            e.preventDefault();
            reset();
            return;
        }

        // مسح حرف
        if (key === 'Backspace') {
            e.preventDefault();
            backspace();
            return;
        }

        // علامة سالب/موجب
        if (key === '±' || key === '_') {
            e.preventDefault();
            toggleSign();
            return;
        }
    });

    // ========================================
    // تهيئة
    // ========================================
    reset();
    console.log('✅ Calculator initialized');
}

    // ========================================
    // TRANSLATOR
    // ========================================
    function initializeTranslator() {
        const sourceLang = document.getElementById('sourceLang');
        const targetLang = document.getElementById('targetLang');
        const swapBtn = document.getElementById('swapLangs');
        const sourceText = document.getElementById('sourceText');
        const translateBtn = document.getElementById('translateBtn');
        const translatedText = document.getElementById('translatedText');
        const copyBtn = document.getElementById('copyTranslation');
        const speakBtn = document.getElementById('speakTranslation');
        const clearBtn = document.getElementById('clearSource');
        const charCount = document.getElementById('sourceCharCount');
        const targetCharCount = document.getElementById('targetCharCount');
        const info = document.getElementById('translationInfo');

        if (!sourceText || !translateBtn) return;

        // حروف
        sourceText.addEventListener('input', () => {
            if (charCount) charCount.textContent = sourceText.value.length;
        });

        // مسح
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                sourceText.value = '';
                if (charCount) charCount.textContent = '0';
                if (translatedText) translatedText.textContent = 'Translation will appear here...';
                if (targetCharCount) targetCharCount.textContent = '0';
                if (info) info.textContent = '';
            });
        }

        // تبديل اللغات
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const temp = sourceLang.value;
                sourceLang.value = targetLang.value;
                targetLang.value = temp;
            });
        }

        // ترجمة
        translateBtn.addEventListener('click', performTranslation);

        // نسخ
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = translatedText?.textContent || '';
                if (text && text !== 'Translation will appear here...' && text !== 'Please enter text to translate' && text !== 'Translating...') {
                    navigator.clipboard.writeText(text)
                        .then(() => showToast('Translation copied!'))
                        .catch(() => showToast('Failed to copy'));
                }
            });
        }

        // نطق
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                const text = translatedText?.textContent || '';
                if (text && text !== 'Translation will appear here...' && text !== 'Please enter text to translate' && text !== 'Translating...') {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = targetLang.value || 'en';
                    speechSynthesis.speak(utterance);
                }
            });
        }

        async function performTranslation() {
            const text = sourceText.value.trim();
            if (!text) {
                if (translatedText) translatedText.textContent = 'Please enter text to translate';
                return;
            }

            if (translatedText) translatedText.textContent = 'Translating...';
            translateBtn.disabled = true;

            try {
                const from = sourceLang.value === 'auto' ? '' : sourceLang.value;
                const to = targetLang.value;
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.responseStatus === 200 && data.responseData) {
                    if (translatedText) translatedText.textContent = data.responseData.translatedText;
                    if (targetCharCount) targetCharCount.textContent = data.responseData.translatedText?.length || 0;
                    if (info) {
                        const detected = data.responseData.detected?.lang || from || 'unknown';
                        info.textContent = `Translated from ${detected} to ${to}`;
                    }
                    showToast('Translation completed!');
                } else {
                    if (translatedText) translatedText.textContent = 'Translation failed. Please try again.';
                }
            } catch (error) {
                console.error('Translation error:', error);
                if (translatedText) translatedText.textContent = 'Translation failed. Please check your connection.';
            } finally {
                translateBtn.disabled = false;
            }
        }
    }

    // ========================================
    // TIMER
    // ========================================
    function initializeTimer() {
        const tabs = document.querySelectorAll('.timer-tab');
        const display = document.getElementById('timerDisplay');
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        const lapBtn = document.getElementById('lapTimer');
        const resetBtn = document.getElementById('resetTimer');
        const countdownSetup = document.getElementById('countdownSetup');
        const pomodoroSetup = document.getElementById('pomodoroSetup');
        const pomodoroInfo = document.getElementById('pomodoroInfo');
        const lapsList = document.getElementById('lapsList');

        if (!display) return;

        let timer = null;
        let isRunning = false;
        let startTime = 0;
        let elapsed = 0;
        let mode = 'stopwatch';
        let countdownTime = 0;
        let lapTimes = [];
        let pomodoro = {
            focus: 25 * 60 * 1000,
            shortBreak: 5 * 60 * 1000,
            longBreak: 15 * 60 * 1000,
            sessionsBeforeLong: 4,
            currentSession: 1,
            isBreak: false,
            isLongBreak: false
        };

        function formatTime(ms) {
            const total = Math.floor(ms / 1000);
            const h = String(Math.floor(total / 3600)).padStart(2, '0');
            const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
            const s = String(total % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        function updateDisplay(time) {
            display.textContent = formatTime(time);
        }

        function updatePomodoroDisplay() {
            const time = pomodoro.isBreak ? 
                (pomodoro.isLongBreak ? pomodoro.longBreak : pomodoro.shortBreak) : 
                pomodoro.focus;
            updateDisplay(time);
            const phase = document.getElementById('pomodoroPhase');
            const session = document.getElementById('currentSession');
            const total = document.getElementById('totalSessions');
            if (phase) phase.textContent = pomodoro.isBreak ? 
                (pomodoro.isLongBreak ? 'Long Break' : 'Short Break') : 'Focus Time';
            if (session) session.textContent = pomodoro.currentSession;
            if (total) total.textContent = pomodoro.sessionsBeforeLong;
        }

        function switchMode(newMode) {
            if (isRunning) {
                clearInterval(timer);
                isRunning = false;
                if (startBtn) startBtn.style.display = 'block';
                if (pauseBtn) pauseBtn.style.display = 'none';
            }
            mode = newMode;
            elapsed = 0;
            countdownTime = 0;
            lapTimes = [];
            if (lapsList) lapsList.innerHTML = '';

            if (countdownSetup) countdownSetup.style.display = mode === 'countdown' ? 'block' : 'none';
            if (pomodoroSetup) pomodoroSetup.style.display = mode === 'pomodoro' ? 'block' : 'none';
            if (pomodoroInfo) pomodoroInfo.style.display = mode === 'pomodoro' ? 'block' : 'none';

            if (mode === 'pomodoro') {
                updatePomodoroDisplay();
            } else {
                updateDisplay(0);
            }
        }

        function start() {
            if (isRunning) return;
            if (mode === 'countdown' && countdownTime === 0) {
                showToast('Please set countdown time first');
                return;
            }
            if (mode === 'pomodoro' && !pomodoro.focus) {
                showToast('Please set Pomodoro settings first');
                return;
            }

            isRunning = true;
            startTime = Date.now() - elapsed;
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'block';

            timer = setInterval(() => {
                const now = Date.now();
                let remaining = 0;

                if (mode === 'stopwatch') {
                    elapsed = now - startTime;
                    updateDisplay(elapsed);
                } else if (mode === 'countdown') {
                    remaining = countdownTime - (now - startTime);
                    if (remaining <= 0) {
                        updateDisplay(0);
                        pauseTimer();
                        showToast('Countdown finished!');
                        playSound();
                        return;
                    }
                    updateDisplay(remaining);
                } else if (mode === 'pomodoro') {
                    const totalTime = pomodoro.isBreak ? 
                        (pomodoro.isLongBreak ? pomodoro.longBreak : pomodoro.shortBreak) : 
                        pomodoro.focus;
                    remaining = totalTime - (now - startTime);
                    if (remaining <= 0) {
                        // تبديل المرحلة
                        if (pomodoro.isBreak) {
                            pomodoro.isBreak = false;
                            pomodoro.isLongBreak = false;
                            pomodoro.currentSession++;
                            showToast('Break finished! Time to focus.');
                        } else {
                            pomodoro.isBreak = true;
                            if (pomodoro.currentSession % pomodoro.sessionsBeforeLong === 0) {
                                pomodoro.isLongBreak = true;
                                showToast('Long break!');
                            } else {
                                pomodoro.isLongBreak = false;
                                showToast('Short break!');
                            }
                        }
                        elapsed = 0;
                        startTime = Date.now();
                        playSound();
                        updatePomodoroDisplay();
                        return;
                    }
                    updateDisplay(remaining);
                }
            }, 100);
        }

        function pauseTimer() {
            if (!isRunning) return;
            isRunning = false;
            elapsed = Date.now() - startTime;
            clearInterval(timer);
            if (startBtn) startBtn.style.display = 'block';
            if (pauseBtn) pauseBtn.style.display = 'none';
        }

        function resetTimer() {
            clearInterval(timer);
            isRunning = false;
            elapsed = 0;
            lapTimes = [];
            if (lapsList) lapsList.innerHTML = '';
            if (startBtn) startBtn.style.display = 'block';
            if (pauseBtn) pauseBtn.style.display = 'none';
            if (mode === 'pomodoro') {
                updatePomodoroDisplay();
            } else {
                updateDisplay(0);
            }
        }

        function recordLap() {
            if (mode !== 'stopwatch' || !isRunning) return;
            lapTimes.push(elapsed);
            const item = document.createElement('div');
            item.className = 'lap-item';
            item.textContent = `Lap ${lapTimes.length}: ${formatTime(elapsed)}`;
            if (lapsList) {
                lapsList.appendChild(item);
                lapsList.scrollTop = lapsList.scrollHeight;
            }
        }

        function playSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            } catch (e) {}
        }

        // Events - Tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                switchMode(tab.dataset.tab);
            });
        });

        // Events - Controls
        if (startBtn) startBtn.addEventListener('click', start);
        if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
        if (lapBtn) lapBtn.addEventListener('click', recordLap);
        if (resetBtn) resetBtn.addEventListener('click', resetTimer);

        // Countdown set
        const setTimeBtn = document.getElementById('setTimeBtn');
        if (setTimeBtn) {
            setTimeBtn.addEventListener('click', () => {
                const h = parseInt(document.getElementById('hoursInput')?.value) || 0;
                const m = parseInt(document.getElementById('minutesInput')?.value) || 0;
                const s = parseInt(document.getElementById('secondsInput')?.value) || 0;
                countdownTime = (h * 3600 + m * 60 + s) * 1000;
                if (countdownTime === 0) {
                    showToast('Please set a valid time');
                    return;
                }
                updateDisplay(countdownTime);
                showToast('Countdown time set!');
            });
        }

        // Pomodoro set
        const setPomodoroBtn = document.getElementById('setPomodoroBtn');
        if (setPomodoroBtn) {
            setPomodoroBtn.addEventListener('click', () => {
                const focus = parseInt(document.getElementById('focusTime')?.value) || 25;
                const short = parseInt(document.getElementById('shortBreak')?.value) || 5;
                const long = parseInt(document.getElementById('longBreak')?.value) || 15;
                const sessions = parseInt(document.getElementById('sessionsBeforeLong')?.value) || 4;
                pomodoro.focus = focus * 60 * 1000;
                pomodoro.shortBreak = short * 60 * 1000;
                pomodoro.longBreak = long * 60 * 1000;
                pomodoro.sessionsBeforeLong = sessions;
                pomodoro.currentSession = 1;
                pomodoro.isBreak = false;
                pomodoro.isLongBreak = false;
                updatePomodoroDisplay();
                showToast('Pomodoro settings applied!');
            });
        }

        // Initialize
        switchMode('stopwatch');
    }

    // ========================================
    // COLOR PICKER
    // ========================================
    function initializeColorPicker() {
        const preview = document.getElementById('colorPreview');
        const hexInput = document.getElementById('colorHex');
        const rInput = document.getElementById('colorR');
        const gInput = document.getElementById('colorG');
        const bInput = document.getElementById('colorB');
        const copyHexBtn = document.getElementById('copyHex');
        const copyRgbBtn = document.getElementById('copyRGB');
        const randomBtn = document.getElementById('randomColor');
        const paletteGrid = document.getElementById('paletteGrid');

        if (!preview || !hexInput) return;

        let currentColor = { hex: '#635BFF', r: 99, g: 91, b: 255 };

        const palette = [
            '#6C63FF', '#4A44C6', '#FF6584', '#4CAF50', '#FF9800',
            '#2196F3', '#9C27B0', '#FF5722', '#795548', '#607D8B',
            '#E91E63', '#00BCD4', '#8BC34A', '#FFC107', '#3F51B5',
            '#F44336', '#009688', '#CDDC39', '#FFEB3B', '#673AB7'
        ];

        function hexToRgb(hex) {
            const clean = hex.replace('#', '');
            if (clean.length === 3) {
                const c = clean.split('').map(x => x + x).join('');
                return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
            }
            return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
        }

        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
        }

        function updateColor(hex) {
            if (!/^#[0-9a-f]{3,6}$/i.test(hex)) return;
            if (hex.length === 4) {
                hex = '#' + hex.slice(1).split('').map(c => c + c).join('');
            }
            const [r, g, b] = hexToRgb(hex);
            currentColor = { hex: hex.toUpperCase(), r, g, b };
            preview.style.backgroundColor = hex;
            hexInput.value = hex.toUpperCase();
            if (rInput) rInput.value = r;
            if (gInput) gInput.value = g;
            if (bInput) bInput.value = b;
        }

        function updateFromRGB() {
            const r = parseInt(rInput?.value) || 0;
            const g = parseInt(gInput?.value) || 0;
            const b = parseInt(bInput?.value) || 0;
            const hex = rgbToHex(r, g, b);
            updateColor(hex);
        }

        function initPalette() {
            if (!paletteGrid) return;
            paletteGrid.innerHTML = '';
            palette.forEach(color => {
                const el = document.createElement('div');
                el.style.cssText = `
                    width:100%;padding-bottom:100%;border-radius:12px;
                    background:${color};cursor:pointer;border:2px solid var(--line);
                    transition:transform 0.2s;
                `;
                el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.1)'; });
                el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
                el.addEventListener('click', () => updateColor(color));
                paletteGrid.appendChild(el);
            });
        }

        // Events
        hexInput.addEventListener('input', () => {
            const val = hexInput.value;
            if (/^#[0-9a-f]{3,6}$/i.test(val)) {
                updateColor(val);
            }
        });

        if (rInput) rInput.addEventListener('input', updateFromRGB);
        if (gInput) gInput.addEventListener('input', updateFromRGB);
        if (bInput) bInput.addEventListener('input', updateFromRGB);

        if (copyHexBtn) {
            copyHexBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(currentColor.hex)
                    .then(() => showToast('HEX copied!'))
                    .catch(() => showToast('Failed to copy'));
            });
        }

        if (copyRgbBtn) {
            copyRgbBtn.addEventListener('click', () => {
                const rgb = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
                navigator.clipboard.writeText(rgb)
                    .then(() => showToast('RGB copied!'))
                    .catch(() => showToast('Failed to copy'));
            });
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                updateColor(hex);
            });
        }

        updateColor('#635BFF');
        initPalette();
    }

    // ========================================
    // TASBEEH COUNTER
    // ========================================
    function initializeTasbeeh() {
        const counter = document.getElementById('tasbeehCounter');
        const targetDisplay = document.getElementById('tasbeehTarget');
        const countBtn = document.getElementById('countBtn');
        const resetBtn = document.getElementById('tasbeehReset');
        const presetBtns = document.querySelectorAll('.preset-btn');
        const customTarget = document.getElementById('customTarget');
        const setTargetBtn = document.getElementById('setTargetBtn');
        const vibrationCheck = document.getElementById('vibration');
        const todayEl = document.getElementById('todayCount');
        const totalEl = document.getElementById('totalCount');
        const completedEl = document.getElementById('completedCount');

        if (!counter) return;

        let count = 0;
        let target = 33;
        let todayStats = {
            date: new Date().toDateString(),
            count: 0,
            completed: 0
        };
        let totalStats = { count: 0, completed: 0 };

        function loadStats() {
            try {
                const savedToday = localStorage.getItem('tasbeehTodayStats');
                const savedTotal = localStorage.getItem('tasbeehTotalStats');
                if (savedToday) {
                    const parsed = JSON.parse(savedToday);
                    if (parsed.date === todayStats.date) {
                        todayStats = parsed;
                    }
                }
                if (savedTotal) {
                    totalStats = JSON.parse(savedTotal);
                }
            } catch (e) {}
            updateStatsDisplay();
        }

        function saveStats() {
            localStorage.setItem('tasbeehTodayStats', JSON.stringify(todayStats));
            localStorage.setItem('tasbeehTotalStats', JSON.stringify(totalStats));
        }

        function updateStatsDisplay() {
            if (todayEl) todayEl.textContent = todayStats.count;
            if (totalEl) totalEl.textContent = totalStats.count;
            if (completedEl) completedEl.textContent = totalStats.completed;
        }

        function increment() {
            count++;
            counter.textContent = count;

            todayStats.count++;
            totalStats.count++;

            if (count >= target) {
                count = 0;
                counter.textContent = count;
                todayStats.completed++;
                totalStats.completed++;
                showToast('Target completed! Subhanallah!');
                if (vibrationCheck?.checked && 'vibrate' in navigator) {
                    navigator.vibrate(200);
                }
            }

            saveStats();
            updateStatsDisplay();

            if (vibrationCheck?.checked && 'vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }

        function resetCounter() {
            count = 0;
            counter.textContent = count;
        }

        function setTarget(newTarget) {
            target = newTarget;
            if (targetDisplay) targetDisplay.textContent = target;
            resetCounter();
        }

        // Events
        if (countBtn) countBtn.addEventListener('click', increment);
        if (resetBtn) resetBtn.addEventListener('click', resetCounter);

        // Keyboard shortcut (space)
        document.addEventListener('keydown', (e) => {
            if (activeTool === 'tasbeeh' && (e.key === ' ' || e.key === 'Enter') && 
                !e.target.closest('input') && !e.target.closest('textarea') && !e.target.closest('button')) {
                e.preventDefault();
                increment();
            }
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const newTarget = parseInt(btn.dataset.target) || 33;
                setTarget(newTarget);
                showToast(`Set to: ${btn.dataset.dhikr}`);
            });
        });

        if (setTargetBtn && customTarget) {
            setTargetBtn.addEventListener('click', () => {
                const val = parseInt(customTarget.value) || 33;
                if (val > 0 && val <= 10000) {
                    setTarget(val);
                    showToast(`Target set to ${val}`);
                } else {
                    showToast('Please enter a valid target');
                }
            });
        }

        loadStats();
        setTarget(33);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function initializeEventListeners() {
        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Mobile menu
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Tool selection from cards
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const tool = card.dataset.tool;
                if (tool) selectTool(tool);
            });
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (navMenu?.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !menuToggle?.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (navMenu?.classList.contains('open')) {
                    closeMobileMenu();
                }
                if (activeTool) {
                    // العودة إلى حالة الترحيب
                    document.querySelectorAll('.tool-interface').forEach(el => {
                        el.style.display = 'none';
                    });
                    if (welcomeState) welcomeState.style.display = 'block';
                    if (activeToolInfo) activeToolInfo.style.display = 'none';
                    activeTool = null;
                }
            }
        });

        // Keyboard shortcuts for calculator
        document.addEventListener('keydown', (e) => {
            if (activeTool !== 'calculator') return;
            if (e.target.closest('input') || e.target.closest('textarea')) return;

            const key = e.key;
            if (key >= '0' && key <= '9') {
                const btn = document.querySelector(`.calc-btn[data-number="${key}"]`);
                if (btn) btn.click();
            } else if (key === '+') {
                document.querySelector('.calc-btn[data-action="add"]')?.click();
            } else if (key === '-') {
                document.querySelector('.calc-btn[data-action="subtract"]')?.click();
            } else if (key === '*') {
                document.querySelector('.calc-btn[data-action="multiply"]')?.click();
            } else if (key === '/') {
                e.preventDefault();
                document.querySelector('.calc-btn[data-action="divide"]')?.click();
            } else if (key === 'Enter' || key === '=') {
                document.querySelector('.calc-btn[data-action="equals"]')?.click();
            } else if (key === 'Backspace') {
                document.querySelector('.calc-btn[data-action="backspace"]')?.click();
            } else if (key === 'Escape') {
                document.querySelector('.calc-btn[data-action="clear"]')?.click();
            }
        });

        // تحديث Lucide icons عند تغيير الحجم
        if (typeof lucide !== 'undefined') {
            window.addEventListener('resize', () => lucide.createIcons());
        }
    }

    // ========================================
    // INIT
    // ========================================
    function init() {
        initializeTheme();
        initializeEventListeners();
        
        // تهيئة الأدوات
        initializeCalculator();
        initializeTranslator();
        initializeTimer();
        initializeColorPicker();
        initializeTasbeeh();

        // تحديث الأدوات السريعة
        updateQuickTools();

        // تهيئة Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        console.log('✅ Study Tools Hub initialized successfully');
    }

    // تشغيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();