// ============================================
// GOAD Killchain - Interactive Script
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeTimelineAnimations();
    initializeEasterEgg();
    addInteractiveEffects();
});

// ========== TIMELINE ANIMATIONS ==========
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            timelineItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const marker = this.querySelector('.timeline-marker');
            if (marker) {
                marker.style.animation = 'none';
                setTimeout(() => {
                    marker.style.animation = 'pulse 0.5s ease-out';
                }, 10);
            }
        });
    });
}

// ========== EASTER EGG SOUND ==========
function playEasterEggSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Victory Fanfare from Final Fantasy
        const notes = [
            { freq: 440, duration: 0.5 },   // A4
            { freq: 440, duration: 0.5 },   // A4
            { freq: 440, duration: 0.5 },   // A4
            { freq: 349.23, duration: 0.35 }, // F4
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 440, duration: 0.5 },   // A4
            { freq: 349.23, duration: 0.35 }, // F4
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 440, duration: 1.0 },   // A4
            { freq: 659.25, duration: 0.5 },  // E5
            { freq: 659.25, duration: 0.5 },  // E5
            { freq: 659.25, duration: 0.5 },  // E5
            { freq: 698.46, duration: 0.35 }, // F5
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 415.3, duration: 0.5 },  // G#4
            { freq: 349.23, duration: 0.35 }, // F4
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 440, duration: 0.8 }    // A4
        ];
        
        let currentTime = audioContext.currentTime;
        
        notes.forEach(note => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.type = 'sine';
            osc.frequency.value = note.freq;
            
            gain.gain.setValueAtTime(0.35, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    } catch (e) {
        // Звук не поддерживается
    }
}

// ========== EASTER EGG ==========
function initializeEasterEgg() {
    const easterEggElement = document.querySelector('.easter-egg');
    const eggModal = document.getElementById('easterEggModal');
    
    if (!easterEggElement || !eggModal) {
        return;
    }

    const modalCloseBtn = eggModal.querySelector('.modal-close');

    // Закрытие модала при клике на кнопку X
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            eggModal.classList.add('hidden');
        });
    }

    // Закрытие модала при клике вне его (на фон)
    eggModal.addEventListener('click', function(e) {
        if (e.target === eggModal) {
            eggModal.classList.add('hidden');
        }
    });

    // Закрытие модала по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (!eggModal.classList.contains('hidden')) {
                eggModal.classList.add('hidden');
            }
        }
    });

    // Ctrl+Shift+K для открытия Easter Egg
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            
            easterEggElement.classList.add('activated');
            eggModal.classList.remove('hidden');
            playEasterEggSound();
            addConfetti();
            
            setTimeout(() => {
                easterEggElement.classList.remove('activated');
            }, 500);
        }
    });
}

// ========== CONFETTI EFFECT ==========
function addConfetti() {
    const confettiPieces = 30;
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

function getRandomColor() {
    const colors = ['#00ff88', '#ff0055', '#00d4ff', '#ff3333', '#ffaa00'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ========== ADD FALL ANIMATION ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.3); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    .timeline-item.active .timeline-marker {
        background: rgba(0, 255, 136, 0.3);
    }
    
    @keyframes eggPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .easter-egg.activated {
        animation: eggPulse 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// ========== INTERACTIVE EFFECTS ==========
function addInteractiveEffects() {
    document.addEventListener('mousemove', function(e) {
        const buttons = document.querySelectorAll('.btn-step');
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const distance = Math.hypot(
                e.clientX - (rect.left + rect.width / 2),
                e.clientY - (rect.top + rect.height / 2)
            );
            if (distance < 150) {
                const glow = Math.max(0, (1 - distance / 150) * 20);
                button.style.boxShadow = `0 0 ${glow}px rgba(0, 255, 136, 0.5)`;
            }
        });
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    let currentStep = 0;

    window.addEventListener('scroll', function() {
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) {
                currentStep = index + 1;
            }
        });
    });
}

// ========== CONSOLE EASTER EGG - BRANCHED PATHS WITH REAL INPUT ==========

// состояние
window.hackState = {
    stage: 0,
    choiceRecon: null,
    choiceVector: null,
    choiceAttack: null,
    inputBuffer: ''
};

function showWaitingForStart() {
    console.clear();
    console.log('%c⚔️ Руководство по эксплуатации Kill Chain на GOAD ⚔️', 'font-size: 16px; color: #00ff88; font-weight: bold; text-shadow: 0 0 10px #00ff88;');
    console.log('%cДобро пожаловать в зону эксплуатации Active Directory!', 'color: #00d4ff; font-size: 14px;');
    console.log('%c\nТы в консоли «симулятора взлома». Действуй по этапам.', 'color: #00ff88; font-size: 11px;');
    console.log('%c\n💬 Введи число 0 и нажми Enter, чтобы начать...', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
    console.log('%c(вводи только цифру, затем Enter)', 'color: #ffaa00; font-size: 11px;');
    window.hackState.stage = 0.5;
}

function showIntro() {
    console.clear();
    console.log('%c⚔️ Руководство по эксплуатации Kill Chain на GOAD ⚔️', 'font-size: 16px; color: #00ff88; font-weight: bold; text-shadow: 0 0 10px #00ff88;');
    console.log('%cДобро пожаловать в зону эксплуатации Active Directory!', 'color: #00d4ff; font-size: 14px;');
    console.log('%c\nТы в консоли «симулятора взлома». Действуй по этапам.', 'color: #00ff88; font-size: 11px;');
    console.log('%c\nНажми Enter, чтобы начать разведку...', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
    window.hackState.stage = 1;
}

function stage1Recon() {
    console.clear();
    console.log('%c🎯 ЭТАП 1: РАЗВЕДКА', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
    console.log('%c$ nmap -p 88,389,445 192.168.1.10', 'color: #00ff88; font-size: 11px; font-family: monospace;');
    console.log('%c████████████████████ 100%', 'color: #00ff88; font-size: 11px;');
    console.log('%c✓ Найдены открытые порты: 88(Kerberos), 389(LDAP), 445(SMB)', 'color: #00ff88; font-size: 11px;');

    console.log('%c\n📋 Выбери направление разведки:', 'color: #ff0055; font-weight: bold; font-size: 12px;');
    console.log('%c  1) Брутфорс SMB анонимно', 'color: #00ff88; font-size: 11px;');
    console.log('%c  2) Собрать инфу через LDAP', 'color: #00ff88; font-size: 11px;');
    console.log('%c  3) Попробовать ping sweep ещё раз', 'color: #00ff88; font-size: 11px;');
    console.log('%c\n💬 Введи 1, 2 или 3 в консоль и нажми Enter', 'color: #ffaa00; font-size: 11px;');

    window.hackState.stage = 2;
}

function displayStage2Options() {
    console.log('%c\n📋 Выбери направление разведки:', 'color: #ff0055; font-weight: bold; font-size: 12px;');
    console.log('%c  1) Брутфорс SMB анонимно', 'color: #00ff88; font-size: 11px;');
    console.log('%c  2) Собрать инфу через LDAP', 'color: #00ff88; font-size: 11px;');
    console.log('%c  3) Попробовать ping sweep ещё раз', 'color: #00ff88; font-size: 11px;');
    console.log('%c💬 Введи 1, 2 или 3', 'color: #ffaa00; font-size: 11px;');
}

function handleStage2Choice(choice) {
    if (!choice || ![1, 2, 3].includes(choice)) {
        console.log('%c⚠️ Неверный выбор!', 'color: #ff6666; font-size: 11px;');
        displayStage2Options();
        return false;
    }

    window.hackState.choiceRecon = choice;

    console.clear();
    console.log('%c🎯 ЭТАП 1: РАЗВЕДКА – РЕЗУЛЬТАТ', 'color: #ffaa00; font-weight: bold; font-size: 12px;');

    if (choice === 1) {
        console.log('%cВы выбрали: 1) Брутфорс SMB анонимно', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Account lockout, SOC проснулся. ❌ Плохая идея.', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Попробуй ещё раз и выбери более тихий вариант...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceRecon = null;
        displayStage2Options();
        return false;
    }

    if (choice === 3) {
        console.log('%cВы выбрали: 3) Ещё раз ping sweep', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Ты просто тратишь время, ничего нового. ❌', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Попробуй выбрать что-то более умное...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceRecon = null;
        displayStage2Options();
        return false;
    }

    // правильный путь: 2
    console.log('%cВы выбрали: 2) Собрать инфу через LDAP', 'color: #00ff88; font-size: 11px;');
    console.log('%cРезультат: ✓ Собраны пользователи, группы, настройки домена.', 'color: #00ff88; font-size: 11px;');

    console.log('%c\n🎯 ЭТАП 2: ВЫБОР ВЕКТОРА АТАКИ', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
    displayStage3Options();

    window.hackState.stage = 3;
    return true;
}

function displayStage3Options() {
    console.log('%c  1) Password spraying по всем пользователям', 'color: #00ff88; font-size: 11px;');
    console.log('%c  2) AS-REP Roasting (без предварительной аутентификации)', 'color: #00ff88; font-size: 11px;');
    console.log('%c  3) Попробовать RDP сразу на DC', 'color: #00ff88; font-size: 11px;');
    console.log('%c💬 Введи 1, 2 или 3', 'color: #ffaa00; font-size: 11px;');
}

function handleStage3Choice(choice) {
    if (!choice || ![1, 2, 3].includes(choice)) {
        console.log('%c⚠️ Неверный выбор!', 'color: #ff6666; font-size: 11px;');
        displayStage3Options();
        return false;
    }

    window.hackState.choiceVector = choice;

    console.clear();
    console.log('%c🎯 ЭТАП 2: ВЕКТОР АТАКИ – РЕЗУЛЬТАТ', 'color: #ffaa00; font-weight: bold; font-size: 12px;');

    if (choice === 1) {
        console.log('%cВы выбрали: 1) Password spraying', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Несколько учёток залочено, шум в логах AD. ❌', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Совет: подбери что-то более точечное...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceVector = null;
        displayStage3Options();
        return false;
    }

    if (choice === 3) {
        console.log('%cВы выбрали: 3) RDP сразу на DC', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Брутфорс логина на DC = мгновенный алерт. ❌', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Попробуй сначала подготовить почву...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceVector = null;
        displayStage3Options();
        return false;
    }

    console.log('%cВы выбрали: 2) AS-REP Roasting', 'color: #00ff88; font-size: 11px;');
    console.log('%cРезультат: ✓ Получены AS-REP хэши для оффлайнового крэка.', 'color: #00ff88; font-size: 11px;');

    console.log('%c\n🎯 ЭТАП 3: ЭКСПЛУАТАЦИЯ', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
    displayStage4Options();

    window.hackState.stage = 4;
    return true;
}

function displayStage4Options() {
    console.log('%c  1) Крякнуть слабый пароль и зайти как обычный user', 'color: #00ff88; font-size: 11px;');
    console.log('%c  2) Попробовать сразу продвинутый Kerberoasting', 'color: #00ff88; font-size: 11px;');
    console.log('%c  3) Слить хэши и ничего не делать', 'color: #00ff88; font-size: 11px;');
    console.log('%c💬 Введи 1, 2 или 3', 'color: #ffaa00; font-size: 11px;');
}

function handleStage4Choice(choice) {
    if (!choice || ![1, 2, 3].includes(choice)) {
        console.log('%c⚠️ Неверный выбор!', 'color: #ff6666; font-size: 11px;');
        displayStage4Options();
        return false;
    }

    window.hackState.choiceAttack = choice;

    console.clear();
    console.log('%c🎯 ЭТАП 3: ЭКСПЛУАТАЦИЯ – РЕЗУЛЬТАТ', 'color: #ffaa00; font-weight: bold; font-size: 12px;');

    if (choice === 3) {
        console.log('%cВы выбрали: 3) Слить хэши и ничего не делать', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Ничего. Ты просто зря старался. ❌', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Попробуй более активное использование доступов...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceAttack = null;
        displayStage4Options();
        return false;
    }

    if (choice === 2) {
        console.log('%cВы выбрали: 2) Сразу Kerberoasting', 'color: #ff6666; font-size: 11px;');
        console.log('%cРезультат: Шумно, сложнее и не факт быстрый профит. ❌', 'color: #ff4444; font-size: 11px;');
        console.log('%c\n🔄 Лучше сначала закрепиться через простого юзера...', 'color: #ffaa00; font-size: 11px;');
        window.hackState.choiceAttack = null;
        displayStage4Options();
        return false;
    }

    console.log('%cВы выбрали: 1) Крякнуть слабый пароль и зайти как user', 'color: #00ff88; font-size: 11px;');
    console.log('%cРезультат: ✓ Доступ в домен, возможность двигаться латерально.', 'color: #00ff88; font-size: 11px;');

    console.log('%c\n🏆 ВЫ УСПЕШНО ВЫБРАЛИ РАБОЧИЙ ВЕКТОР', 'color: #00ff88; font-weight: bold; font-size: 12px;');
    console.log('%cТеперь разблокирован секретный протокол:', 'color: #ffaa00; font-size: 11px;');
    console.log('%c\n┌─────────────────────────────────────────────┐', 'color: #00ff88;');
    console.log('%c│   Зажмите CTRL + SHIFT + K                      │', 'color: #ffaa00; font-size: 11px;');
    console.log('%c│   (на англ. раскладке!)                         │', 'color: #ffaa00; font-size: 11px;');
    console.log('%c└─────────────────────────────────────────────┘', 'color: #00ff88;');
    console.log('%c\n⏳ Ожидание выполнения секретной комбинации...', 'color: #ffaa00; font-style: italic; font-size: 11px;');

    window.hackState.stage = 5;
    return true;
}

// обработчик ввода
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        const char = e.key;

        if (/[0-3]/.test(char)) {
            window.hackState.inputBuffer = char;
        }

        if (window.hackState.stage === 0.5) {
            if (window.hackState.inputBuffer === '0') {
                showIntro();
                window.hackState.inputBuffer = '';
            } else {
                console.log('%c⚠️ Введи 0 для начала!', 'color: #ff6666; font-size: 11px;');
                window.hackState.inputBuffer = '';
            }
        } else if (window.hackState.stage === 1) {
            stage1Recon();
        } else if (window.hackState.stage === 2) {
            const choice = window.hackState.inputBuffer ? parseInt(window.hackState.inputBuffer) : null;
            handleStage2Choice(choice);
            window.hackState.inputBuffer = '';
        } else if (window.hackState.stage === 3) {
            const choice = window.hackState.inputBuffer ? parseInt(window.hackState.inputBuffer) : null;
            handleStage3Choice(choice);
            window.hackState.inputBuffer = '';
        } else if (window.hackState.stage === 4) {
            const choice = window.hackState.inputBuffer ? parseInt(window.hackState.inputBuffer) : null;
            handleStage4Choice(choice);
            window.hackState.inputBuffer = '';
        }

        window.hackState.inputBuffer = '';
    } else if (/[0-3]/.test(e.key)) {
        window.hackState.inputBuffer = e.key;
    }
});

showWaitingForStart();

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
