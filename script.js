/* ==========================================
   KYLIE'S MAGICAL BIRTHDAY GARDEN
   Original five-star game + real sparkles/confetti
   ========================================== */

const welcomeScene = document.getElementById("welcomeScene");
const gameScene = document.getElementById("gameScene");
const surpriseScene = document.getElementById("surpriseScene");

const enterButton = document.getElementById("enterButton");
const replayButton = document.getElementById("replayButton");
const musicButton = document.getElementById("musicButton");
const soundButton = document.getElementById("soundButton");

const backgroundMusic = document.getElementById("backgroundMusic");
const trumpetSound = document.getElementById("trumpetSound");

const starContainer = document.getElementById("starContainer");
const starProgress = document.getElementById("starProgress");
const progressText = document.getElementById("progressText");

const confettiContainer = document.getElementById("confettiContainer");
const sparkleLayer = document.getElementById("sparkleLayer");

const totalStars = 5;

const starPositions = [
  { x: 15, y: 27 },
  { x: 43, y: 38 },
  { x: 73, y: 29 },
  { x: 27, y: 61 },
  { x: 68, y: 64 }
];

let starsFound = 0;
let soundEnabled = false;
let musicPlaying = false;
let audioContext = null;
let trumpetStarted = false;
let confettiTimer = null;

/* SCENE NAVIGATION */
function showScene(sceneToShow) {
  welcomeScene.hidden = true;
  gameScene.hidden = true;
  surpriseScene.hidden = true;
  sceneToShow.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* OPENING TRUMPET
   Browsers may block autoplay until a user gesture. */
async function playOpeningTrumpet() {
  if (trumpetStarted || !trumpetSound) return;

  try {
    trumpetSound.currentTime = 0;
    await trumpetSound.play();
    trumpetStarted = true;
  } catch (error) {
    console.info("Trumpet autoplay was blocked; browser interaction may be needed.");
  }
}

function stopTrumpet() {
  trumpetSound.pause();
  trumpetSound.currentTime = 0;
  trumpetStarted = false;
}

window.addEventListener("load", playOpeningTrumpet);

/* Fallback attempt if autoplay is blocked.
   Don't start it on the Open the Garden button, because that button stops it. */
document.addEventListener("pointerdown", function startTrumpetOnInteraction(event) {
  if (event.target.closest("#enterButton")) return;
  if (!trumpetStarted && !welcomeScene.hidden) playOpeningTrumpet();
});

/* OPEN THE GARDEN */
enterButton.addEventListener("click", async function () {
  stopTrumpet();
  showScene(gameScene);
  startGame();

  try {
    await backgroundMusic.play();
    musicPlaying = true;
  } catch (error) {
    musicPlaying = false;
    console.info("Use the music button to start the song.");
  }
  updateMusicButton();
});

/* BACKGROUND MUSIC CONTROLS */
musicButton.addEventListener("click", async function () {
  if (musicPlaying) {
    backgroundMusic.pause();
    musicPlaying = false;
    updateMusicButton();
    return;
  }

  try {
    await backgroundMusic.play();
    musicPlaying = true;
    updateMusicButton();
  } catch (error) {
    console.info("The music could not play.", error);
    musicButton.textContent = "🎵 Try Playing Music Again";
  }
});

function updateMusicButton() {
  musicButton.textContent = musicPlaying
    ? "⏸ Pause Birthday Music"
    : "🎵 Play Birthday Music";
}

backgroundMusic.addEventListener("play", function () {
  musicPlaying = true;
  updateMusicButton();
});

backgroundMusic.addEventListener("pause", function () {
  musicPlaying = false;
  updateMusicButton();
});

/* CREATE THE FIVE MAGIC STARS */
function startGame() {
  starsFound = 0;
  starContainer.replaceChildren();
  updateProgress();

  starPositions.forEach(function (position, index) {
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star-button";
    star.textContent = "⭐";
    star.setAttribute("aria-label", "Collect magic star " + (index + 1));
    star.style.left = position.x + "%";
    star.style.top = position.y + "%";
    star.style.transform = "translate(-50%, -50%)";
    star.style.animationDelay = (index * 0.2) + "s";

    star.addEventListener("click", function () {
      collectStar(star);
    });

    starContainer.appendChild(star);
  });
}

/* COLLECT A MAGIC STAR */
function collectStar(star) {
  if (star.classList.contains("collected")) return;

  star.classList.add("collected");
  star.disabled = true;
  starsFound++;

  updateProgress();
  playTone(660 + starsFound * 100, 0.16);

  if (starsFound === totalStars) {
    progressText.textContent = "You found all five stars! 🎉";
    window.setTimeout(showBirthdaySurprise, 650);
  }
}

/* UPDATE STAR PROGRESS */
function updateProgress() {
  const filledStars = Array(starsFound).fill("⭐").join(" ");
  const emptyStars = Array(totalStars - starsFound).fill("☆").join(" ");

  starProgress.textContent = [filledStars, emptyStars].filter(Boolean).join(" ");
  progressText.textContent =
    "You found " + starsFound + " out of " + totalStars + " stars!";
}

/* BIRTHDAY SURPRISE */
function showBirthdaySurprise() {
  showScene(surpriseScene);
  createConfetti();

  playTone(784, 0.18);
  window.setTimeout(function () { playTone(988, 0.2); }, 180);
  window.setTimeout(function () { playTone(1175, 0.35); }, 380);
}

/* REAL CSS CONFETTI - no emoji confetti */
function createConfetti() {
  confettiContainer.replaceChildren();
  if (confettiTimer) window.clearTimeout(confettiTimer);

  const colors = [
    "#ff69b4", "#ffb6d9", "#d8b4fe",
    "#a78bfa", "#ffe08a", "#ffffff"
  ];

  for (let i = 0; i < 150; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    piece.style.setProperty("--confetti-left", Math.random() * 100 + "%");
    piece.style.setProperty(
      "--confetti-color",
      colors[Math.floor(Math.random() * colors.length)]
    );
    piece.style.setProperty("--confetti-width", (5 + Math.random() * 7) + "px");
    piece.style.setProperty("--confetti-height", (7 + Math.random() * 12) + "px");
    piece.style.setProperty("--fall-time", (3 + Math.random() * 3) + "s");
    piece.style.setProperty("--fall-delay", (Math.random() * 1.2) + "s");
    piece.style.setProperty("--confetti-drift", (-120 + Math.random() * 240) + "px");
    piece.style.setProperty("--confetti-rotation", (360 + Math.random() * 1080) + "deg");
    piece.style.setProperty(
      "--confetti-radius",
      Math.random() > 0.7 ? "50%" : "2px"
    );

    confettiContainer.appendChild(piece);
  }

  confettiTimer = window.setTimeout(function () {
    confettiContainer.replaceChildren();
  }, 8000);
}

/* OPTIONAL STAR SOUND EFFECTS */
soundButton.addEventListener("click", function () {
  soundEnabled = !soundEnabled;

  soundButton.textContent = soundEnabled
    ? "🔔 Star Sounds: On"
    : "🔔 Star Sounds: Off";

  soundButton.setAttribute("aria-pressed", String(soundEnabled));

  if (soundEnabled) playTone(880, 0.15);
});

function playTone(frequency, duration) {
  if (!soundEnabled) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!audioContext) audioContext = new AudioContextClass();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const now = audioContext.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

/* REPLAY THE GAME */
replayButton.addEventListener("click", function () {
  confettiContainer.replaceChildren();
  if (confettiTimer) window.clearTimeout(confettiTimer);

  startGame();
  showScene(gameScene);
});

/* REAL TWINKLING SPARKLES */
function createSparkles() {
  sparkleLayer.replaceChildren();

  const sparkleColors = ["", "pink", "gold", "lavender"];

  for (let i = 0; i < 35; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";

    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    if (color) sparkle.classList.add(color);

    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.setProperty("--sparkle-size", (4 + Math.random() * 10) + "px");
    sparkle.style.setProperty("--sparkle-duration", (1.2 + Math.random() * 2.5) + "s");
    sparkle.style.setProperty("--sparkle-delay", (-Math.random() * 3) + "s");

    sparkleLayer.appendChild(sparkle);
  }
}

/* INITIAL STATE */
createSparkles();
updateMusicButton();
showScene(welcomeScene);
