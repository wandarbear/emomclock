// script.js
const startBtn       = document.getElementById('startBtn');
const stopBtn        = document.getElementById('stopBtn');
const timerDisplay   = document.getElementById('timer');
const exerciseDisplay= document.getElementById('exercise');
let intervalId, duration, totalRounds, exercises = [];
let genericMode=false, currentCycle=0, totalCycles=0, remaining;

// Beep
function beep() {
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.connect(ctx.destination);
  osc.type='sine';
  osc.frequency.value=1000;
  osc.start();
  setTimeout(()=>osc.stop(),200);
}

// Parse exercises
function parseExercises(input) {
  return input.trim().split('\n').filter(Boolean).map(line => {
    const [name, desc] = line.split(':');
    return { name: name.trim(), desc: desc?.trim() };
  });
}

// Update timer & text
function updateDisplay() {
  const mins = String(Math.floor(remaining/60)).padStart(2,'0');
  const secs = String(remaining%60).padStart(2,'0');
  timerDisplay.textContent = `${mins}:${secs}`;
  if (genericMode) {
    exerciseDisplay.textContent = `Cycle ${currentCycle+1}/${totalCycles}`;
  } else {
    const round = Math.floor(currentCycle/exercises.length)+1;
    const ex = exercises[currentCycle%exercises.length];
    exerciseDisplay.innerHTML = ex
      ? `<strong>Round ${round}/${totalRounds}:</strong> ${ex.name}${ex.desc? ` — <em>${ex.desc}</em>` : ''}`
      : '';
  }
}

// Start
function startTimer() {
  duration    = parseInt(document.getElementById('interval').value,10) || 60;
  exercises   = parseExercises(document.getElementById('exList').value);
  totalRounds = parseInt(document.getElementById('rounds').value,10) || 1;
  genericMode = exercises.length===0;
  totalCycles = genericMode ? totalRounds : exercises.length*totalRounds;
  currentCycle=0;
  remaining   = duration;
  updateDisplay();
  startBtn.disabled=true;
  stopBtn.disabled=false;
  beep();

  intervalId = setInterval(()=> {
    remaining--;
    if (remaining<0) {
      currentCycle++;
      if (currentCycle>=totalCycles) {
        clearInterval(intervalId);
        timerDisplay.textContent='00:00';
        exerciseDisplay.textContent='Done! 👏';
        startBtn.disabled=false;
        stopBtn.disabled=true;
        return;
      }
      remaining = duration;
      beep();
    }
    updateDisplay();
  }, 1000);
}

// Stop
function stopTimer() {
  clearInterval(intervalId);
  timerDisplay.textContent='00:00';
  exerciseDisplay.textContent='';
  startBtn.disabled=false;
  stopBtn.disabled=true;
}

startBtn.addEventListener('click', startTimer);
stopBtn .addEventListener('click', stopTimer);

// FAQ toggle
const faqToggle  = document.querySelector('.faq-toggle');
const faqContent = document.querySelector('.faq-content');
faqToggle.addEventListener('click', () => {
  const isOpen = faqContent.classList.toggle('open');
  faqToggle.setAttribute('aria-expanded', isOpen);
});
