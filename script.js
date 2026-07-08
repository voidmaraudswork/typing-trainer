const quoteDisplay = document.getElementById('quote-display');
const inputField = document.getElementById('input-field');
const presetSelect = document.getElementById('preset-select');
const customTextArea = document.getElementById('custom-text');
const loadCustomBtn = document.getElementById('load-custom-btn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('toggle-sound');
const completionModal = document.getElementById('completion-modal');
const modalTitle = document.getElementById('modal-title');
const modalWpm = document.getElementById('modal-wpm');
const modalAccuracy = document.getElementById('modal-accuracy');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

const practiceSets = [
    {
        title: 'Touch Typing Fundamentals',
        text: `The art of touch typing relies on maintaining a consistent rhythm and proper finger placement on the home row keys. By practicing daily, you build the muscle memory required to type without looking down at the keyboard. Precision is the ultimate goal, as accuracy naturally leads to increased speed over time.`
    },
    {
        title: 'Posture and Comfort',
        text: `Focusing on your posture while you work can help prevent fatigue and improve your overall typing efficiency during long sessions. Keep your wrists in a neutral position and ensure that your screen is at eye level for better comfort. A relaxed body allows your fingers to move more fluidly across the keys.`
    },
    {
        title: 'Technology and Productivity',
        text: `Technology has changed the way we write and communicate, making keyboard proficiency an essential skill in the modern world. Whether you are typing a quick message or a long report, speed and accuracy save valuable time. Consistent practice will help you master the layout and boost your daily productivity.`
    },
    {
        title: 'Focus and Flow',
        text: `Finding a quiet environment to practice can significantly improve your ability to concentrate on the rhythm of your keystrokes. Minimizing distractions allows you to enter a state of flow where the words seem to appear on the screen effortlessly. Take small breaks to stretch your hands and keep your mind fresh.`
    },
    {
        title: 'Progress and Persistence',
        text: `Every successful typist began as a beginner who had to learn the position of each individual letter on the board. Do not be discouraged by initial mistakes; they are simply part of the learning process. With dedication and regular drills, you will soon find yourself typing faster and more accurately.`
    }
];

let sampleText = '';
let soundEnabled = true;
const clickSound = new Audio('./assets/key-click.mp3');
clickSound.preload = 'auto';
let startTime = null;
let errors = 0;

function normalizeText(text) {
    return text.replace(/\r\n/g, '\n');
}

function renderText(text) {
    sampleText = text.replace(/\n\s+/g, '\n').trim();
    quoteDisplay.innerHTML = '';

    sampleText.split('').forEach(char => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.dataset.char = char;

        if (char === '\n') {
            span.classList.add('newline');
            span.innerText = '↵';
            quoteDisplay.appendChild(span);
            quoteDisplay.appendChild(document.createElement('br'));
        } else {
            span.innerText = char;
            quoteDisplay.appendChild(span);
        }
    });
}

function createPresetOptions() {
    practiceSets.forEach((set, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${index + 1}. ${set.title}`;
        presetSelect.appendChild(option);
    });
}

function loadPreset(index) {
    renderText(practiceSets[index].text);
    init();
}

function loadCustomText() {
    const customText = customTextArea.value.trim();
    if (!customText) {
        alert('Please paste some custom text first.');
        return;
    }
    presetSelect.value = '';
    renderText(customText);
    init();
}

function clearStats() {
    wpmDisplay.innerText = '0';
    accuracyDisplay.innerText = '100';
}

function init() {
    inputField.value = '';
    startTime = null;
    errors = 0;
    clearStats();
    completionModal.classList.add('hidden');

    quoteDisplay.querySelectorAll('span').forEach(span => {
        span.classList.remove('correct', 'incorrect');
    });
    inputField.focus();
}

function getCompletionMessage(wpm, accuracy) {
    if (accuracy >= 100 && wpm >= 95) return 'Fabulous..4.9/5';
    if (accuracy >= 100 && wpm >= 75) return 'Awesome..4.5/5';
    if (accuracy >= 100 && wpm >= 60) return 'Great..4/5';
    if (accuracy >= 90 && wpm >= 50) return 'Good job..3.5/5';
    if (accuracy >= 90 && wpm >= 40) return 'Good job..3/5';
    if (accuracy >= 80 && wpm >= 30) return 'Good..2.5/5';
    if (accuracy >= 100 && wpm >= 31) return 'Good..3/5';
    if (accuracy >= 50 && wpm >= 20) return 'bad..1/5';
    return 'so bad 0.5/5';
}

function showCompletionModal(wpm, accuracy) {
    const message = getCompletionMessage(wpm, accuracy);
    
    modalWpm.innerText = wpm;
    modalAccuracy.innerText = accuracy;
    modalMessage.innerText = message;
    
    // Set message color based on performance
    modalMessage.classList.remove('excellent', 'good', 'bad');
    if (accuracy >= 90 && wpm >= 45) {
        modalMessage.classList.add('excellent');
    } else if (accuracy >= 80 && wpm >= 30) {
        modalMessage.classList.add('good');
    } else {
        modalMessage.classList.add('bad');
    }
    
    completionModal.classList.remove('hidden');
}

function updateStats() {
    const arrayQuote = quoteDisplay.querySelectorAll('span.char');
    const typedValue = normalizeText(inputField.value);
    const arrayValue = typedValue.split('');

    errors = 0;

    arrayQuote.forEach((charSpan, index) => {
        const typedChar = arrayValue[index];
        const targetChar = charSpan.dataset.char;

        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
            return;
        }

        if (typedChar === targetChar) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            errors++;
        }
    });

    if (arrayValue.length > arrayQuote.length) {
        errors += arrayValue.length - arrayQuote.length;
    }

    const typedChars = arrayValue.length;
    const timeInMinutes = startTime ? (new Date() - startTime) / 60000 : 0;
    const wpm = timeInMinutes > 0 ? Math.round((typedChars / 5) / timeInMinutes) : 0;
    const accuracy = typedChars === 0 ? 100 : Math.max(0, Math.round(((typedChars - errors) / typedChars) * 100));

    wpmDisplay.innerText = wpm;
    accuracyDisplay.innerText = accuracy;

    if (typedChars === sampleText.length) {
        showCompletionModal(wpm, accuracy);
    }
}

soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerText = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
});

presetSelect.addEventListener('change', () => {
    if (presetSelect.value === '') return;
    loadPreset(Number(presetSelect.value));
});

loadCustomBtn.addEventListener('click', loadCustomText);
resetBtn.addEventListener('click', init);
modalCloseBtn.addEventListener('click', init);

inputField.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
    }

    if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }

    updateStats();
});

createPresetOptions();
loadPreset(0);