// script.js

// Timer elements
const startBtn = document.getElementById('startBtn');
const stopBtn  = document.getElementById('stopBtn');
const timerDisplay   = document.getElementById('timer');
const exerciseDisplay= document.getElementById('exercise');

// FAQ elements\const faqToggle  = document.querySelector('.faq-toggle');
const faqContent = document.querySelector('.faq-content');

// Timer state
let intervalId;
let duration, totalRounds, exercises = [];
let genericMode = false;
let currentCycle = 0;
let totalCycles  = 0;
let remaining;

// Beep sound function
function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 1000;
  osc.start();
  setTimeout(() => osc.stop(), 200);
}

// Parse exercises from textarea input
function parseExercises(input) {
  return input
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [name, desc] = line.split(':');
      return { name: name.trim(), desc: desc?.trim() };
    });
}

// Update timer and exercise display
function updateDisplay() {
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;

  if (genericMode) {
    exerciseDisplay.textContent = `Cycle ${currentCycle + 1}/${totalCycles}`;
  } else {
    const round = Math.floor(currentCycle / exercises.length) + 1;
    const ex    = exercises[currentCycle % exercises.length];
    exerciseDisplay.innerHTML = ex
      ? `<strong>Round ${round}/${totalRounds}:</strong> ${ex.name}${ex.desc ? ` — <em>${ex.desc}</em>` : ''}`
      : '';
  }
}

// Start the EMOM timer
function startTimer() {
  duration     = parseInt(document.getElementById('interval').value, 10) || 60;
  exercises    = parseExercises(document.getElementById('exList').value);
  totalRounds  = parseInt(document.getElementById('rounds').value, 10) || 1;
  genericMode  = exercises.length === 0;
  totalCycles  = genericMode ? totalRounds : exercises.length * totalRounds;
  currentCycle = 0;
  remaining    = duration;

  updateDisplay();
  startBtn.disabled = true;
  stopBtn.disabled  = false;
  beep();

  intervalId = setInterval(() => {
    remaining--;
    if (remaining < 0) {
      currentCycle++;
      if (currentCycle >= totalCycles) {
        clearInterval(intervalId);
        timerDisplay.textContent = '00:00';
        exerciseDisplay.textContent = 'Done! 👏';
        startBtn.disabled = false;
        stopBtn.disabled  = true;
        return;
      }
      remaining = duration;
      beep();
    }
    updateDisplay();
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(intervalId);
  timerDisplay.textContent = '00:00';
  exerciseDisplay.textContent = '';
  startBtn.disabled = false;
  stopBtn.disabled  = true;
}

// Toggle FAQ section
faqToggle.addEventListener('click', () => {
  const isOpen = faqContent.classList.toggle('open');
  faqToggle.setAttribute('aria-expanded', isOpen);
});

// Event listeners
startBtn.addEventListener('click', startTimer);
stopBtn .addEventListener('click', stopTimer);
