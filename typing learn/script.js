const quoteDisplay = document.getElementById('quote-display');
const inputField = document.getElementById('input-field');
const presetSelect = document.getElementById('preset-select');
const customTextArea = document.getElementById('custom-text');
const loadCustomBtn = document.getElementById('load-custom-btn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('toggle-sound');
const completionMessage = document.getElementById('completion-message');

const practiceSets = [
    {
        title: 'The Classic Flow',
        text: `The quick brown fox jumps over the lazy dog.
It is a bright and sunny day in the valley.
Birds are singing in the tall oak trees now.
The river flows gently toward the open sea.
Every moment is a chance to start again fresh.
Keep moving forward with hope and confidence.`
    },
    {
        title: 'Focus on Rhythm',
        text: `Type slowly to ensure that every key is hit.
Accuracy is much more important than speed now.
Take a deep breath and relax your shoulders.
Find a steady pace that feels natural to you.
Your fingers will learn the path with practice.
Consistency is the key to mastering this skill.`
    },
    {
        title: 'Technology & Innovation',
        text: `Programming is like writing a story in code.
Every line brings a new idea to digital life.
Computers are tools that expand our horizons.
The future is being built by curious minds.
Solve problems one small step at a time here.
Persistence makes the hard challenges simpler.`
    },
    {
        title: 'Nature and Serenity',
        text: `Green forests stretch across the rolling hills.
The mountain air feels cool against the skin.
Watching the sunset brings a sense of peace.
Stars begin to twinkle in the velvet sky soon.
The night is quiet and full of soft whispers.
Nature is the best place to find your calm.`
    },
    {
        title: 'Professional Growth',
        text: `Set clear goals for every day of the week.
Hard work leads to steady personal progress.
Stay focused on the tasks that matter today.
Collaboration helps teams reach greater heights.
Listen well to learn from everyone you meet.
Success is a journey of constant discovery.`
    },
    {
        title: 'Creative Writing',
        text: `A mysterious map was found in the attic dust.
It showed the way to a hidden golden valley.
Adventure awaits those who dare to seek it.
The path is winding and full of surprises.
Grab your gear and head into the wild unknown.
Every journey changes who you are inside.`
    },
    {
        title: 'Daily Habits',
        text: `Start your morning with a glass of water now.
Write down three things you are grateful for.
Spend some time reading a book you enjoy.
Exercise helps to keep your body feeling fit.
Plan your tasks to stay organized and calm.
End the day with a grateful heart and rest.`
    },
    {
        title: 'Learning and Wisdom',
        text: `Knowledge is a treasure that stays with you.
Read widely to understand the diverse world.
Ask questions whenever you do not understand.
Mistakes are just lessons in disguise today.
Keep an open mind as you face new challenges.
Wisdom comes from years of learning and life.`
    },
    {
        title: 'Abstract Thoughts',
        text: `Time moves in ways we cannot always control.
Memories are the threads of our past stories.
Change is the only constant in this universe.
Embrace the beauty of the present moment now.
Light and shadow dance across the gray walls.
Life is a beautiful puzzle to solve daily.`
    },
    {
        title: 'Velocity Drills',
        text: `The blue sky looks clear and very wide today.
Bring the snacks for the long trip home soon.
Always look ahead when driving on the road.
Practice helps you type faster than you think.
Keep your eyes on the screen at all times.
You are doing a great job with these drills.`
    }
];

let sampleText = '';
let soundEnabled = true;
const clickSound = new Audio('assets/key-click.mp3');
let startTime = null;
let errors = 0;

function normalizeText(text) {
    return text.replace(/\r\n/g, '\n');
}

function renderText(text) {
    sampleText = normalizeText(text);
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
    completionMessage.innerText = '';
}

function init() {
    inputField.value = '';
    startTime = null;
    errors = 0;
    clearStats();

    quoteDisplay.querySelectorAll('span').forEach(span => {
        span.classList.remove('correct', 'incorrect');
    });
    inputField.focus();
}

function getCompletionMessage(wpm, accuracy) {
    if (accuracy >= 90 && wpm >= 40) return 'Good job bruhh..';
    if (accuracy >= 80 && wpm >= 30) return 'Good';
    if (accuracy >= 50 && wpm >= 20) return 'So bad';
    return 'Keep practicing.';
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
        completionMessage.innerText = getCompletionMessage(wpm, accuracy);
    } else {
        completionMessage.innerText = '';
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