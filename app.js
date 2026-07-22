/**
 * @fileoverview App logic for the Holiday Cat Stress Checker Quiz.
 * Handles state, DOM updates, animations, and result calculation.
 */

// --- DATA ---

const questions = [
  {
    id: 1,
    text: "How many guests will visit your home this holiday season?",
    options: [
      { emoji: "🏠", text: "None — quiet holidays for us", value: 0 },
      { emoji: "👫", text: "Just a few (1–3 people)", value: 1 },
      { emoji: "👨‍👩‍👧‍👦", text: "A fair number (4–8 people)", value: 2 },
      { emoji: "🎉", text: "It's a full house (8+ people)", value: 3 }
    ]
  },
  {
    id: 2,
    text: "Will your daily routine (feeding, play, sleep times) change during the holidays?",
    options: [
      { emoji: "⏰", text: "Not at all — same schedule", value: 0 },
      { emoji: "🔄", text: "A little — minor shifts", value: 1 },
      { emoji: "📅", text: "Quite a bit — things get hectic", value: 2 },
      { emoji: "🌀", text: "Completely different routine", value: 3 }
    ]
  },
  {
    id: 3,
    text: "Will you be rearranging furniture or decorating near your cat's favorite spots?",
    options: [
      { emoji: "✅", text: "No changes planned", value: 0 },
      { emoji: "🎄", text: "Minor decorations nearby", value: 1 },
      { emoji: "🪟", text: "Major rearranging happening", value: 2 },
      { emoji: "😬", text: "Their spot IS the tree spot", value: 3 }
    ]
  },
  {
    id: 4,
    text: "Does your cat have a quiet, private retreat they can escape to?",
    options: [
      { emoji: "🛏️", text: "Yes — always available and peaceful", value: 0 },
      { emoji: "🚪", text: "Mostly — but it gets disrupted sometimes", value: 1 },
      { emoji: "😕", text: "Sometimes — depends on the day", value: 2 },
      { emoji: "🚫", text: "Not really — our space is limited", value: 3 }
    ]
  },
  {
    id: 5,
    text: "How does your cat typically react to new people in the home?",
    options: [
      { emoji: "😺", text: "Curious and social — loves guests", value: 0 },
      { emoji: "🐱", text: "Cautious but warms up eventually", value: 1 },
      { emoji: "🙀", text: "Hides for hours until they leave", value: 2 },
      { emoji: "😿", text: "Completely shuts down or acts out", value: 3 }
    ]
  },
  {
    id: 6,
    text: "Does your cat share litter boxes, food, or water with other pets?",
    options: [
      { emoji: "1️⃣", text: "No other pets — all resources are theirs", value: 0 },
      { emoji: "✌️", text: "Multiple pets, but separate resources", value: 1 },
      { emoji: "🤝", text: "Some resources are shared", value: 2 },
      { emoji: "😰", text: "Everything is shared among pets", value: 3 }
    ]
  },
  {
    id: 7,
    text: "Have you ever noticed your cat peeing outside the litter box during stressful times?",
    options: [
      { emoji: "✨", text: "Never — always uses the box", value: 0 },
      { emoji: "🔍", text: "Once or twice, but rarely", value: 1 },
      { emoji: "⚠️", text: "Occasionally — it seems stress-related", value: 2 },
      { emoji: "🚨", text: "Regularly — it's an ongoing concern", value: 3 }
    ]
  },
  {
    id: 8,
    text: "How would you describe your cat's overall personality?",
    options: [
      { emoji: "🦁", text: "Confident and bold", value: 0 },
      { emoji: "😸", text: "Easygoing and adaptable", value: 1 },
      { emoji: "🐾", text: "Nervous or shy", value: 2 },
      { emoji: "😾", text: "Highly anxious or easily startled", value: 3 }
    ]
  }
];

const resultTiers = [
  {
    id: 'low',
    name: 'Holly Jolly Kitty',
    emoji: '🟢',
    scoreRange: [0, 6],
    gaugeAngle: -60,
    headline: 'Your Cat\'s Holiday Stress Risk: Low',
    description: 'Great news! Your cat\'s holiday environment looks relatively calm. Even so, keeping a few simple habits in place can help your cat cruise through the season stress-free.',
    tips: [
      'Maintain consistent feeding and play schedules, even on busy days.',
      'Keep at least one quiet room accessible as your cat\'s safe haven.',
      'Introduce any new decorations gradually, giving your cat time to adjust.'
    ],
    showFIC: false,
    showReframe: false,
    ctaStyle: 'soft'
  },
  {
    id: 'moderate',
    name: 'Tinsel Tension',
    emoji: '🟡',
    scoreRange: [7, 12],
    gaugeAngle: -20,
    headline: 'Your Cat\'s Holiday Stress Risk: Moderate',
    description: 'Your cat may experience some holiday stress. Cats are creatures of habit, and even small routine changes can build up. Watch for signs like hiding, appetite changes, or litter box avoidance.',
    tips: [
      'Create a dedicated quiet zone away from holiday activity.',
      'Watch for changes in eating, grooming, or litter box habits.',
      'Consider asking your veterinarian about stress-supportive nutrition.'
    ],
    ficText: 'When cats feel stressed, it can trigger a condition called feline idiopathic cystitis (FIC) — a painful inflammation of the bladder that may cause your cat to pee outside the litter box. This isn\'t bad behavior. It\'s a sign your cat may be in pain.',
    showFIC: true,
    showReframe: false,
    ctaStyle: 'medium'
  },
  {
    id: 'high',
    name: 'Jingle Bell Jitters',
    emoji: '🟠',
    scoreRange: [13, 18],
    gaugeAngle: 25,
    headline: 'Your Cat\'s Holiday Stress Risk: High',
    description: 'Your cat\'s holiday environment has several stress triggers. Cats in high-stress situations may develop feline idiopathic cystitis (FIC), which can make urinating painful — and lead them to avoid the litter box altogether.',
    tips: [
      'Set up a safe room with food, water, litter, and a cozy bed before guests arrive.',
      'Keep holiday noise levels in check — music, fireworks, and crowds all add up.',
      'Talk to your veterinarian about therapeutic nutrition that may help manage stress-related urinary issues.'
    ],
    ficText: '<strong>The Stress → FIC → Litter Box Connection</strong><br><br>Feline idiopathic cystitis (FIC) originates in the nervous system, not the bladder. Cats with FIC have a sensitized nervous system that overreacts to stress, causing painful bladder inflammation.<br><br>Holiday triggers — like guests, rearranged furniture, or routine disruptions — can set off this response. When the bladder is inflamed and painful, your cat may associate the litter box with that pain and start avoiding it.<br><br>Therapeutic foods specifically formulated for urinary health have been shown to help reduce the incidence of FIC. Your veterinarian can recommend the right nutrition plan for your cat.',
    showFIC: true,
    showReframe: true,
    ctaStyle: 'strong'
  },
  {
    id: 'critical',
    name: 'Silent Night SOS',
    emoji: '🔴',
    scoreRange: [19, 24],
    gaugeAngle: 70,
    headline: 'Your Cat\'s Holiday Stress Risk: Very High',
    description: 'Your cat\'s holiday stress risk is very high. Multiple factors in your environment may trigger or worsen feline idiopathic cystitis (FIC). The good news? There are steps you can take right now — before the holidays arrive.',
    tips: [
      'Schedule a veterinary visit now, before the holiday season begins.',
      'Create a dedicated, quiet sanctuary room your cat can retreat to at any time.',
      'Ensure each cat has their own litter box, food, and water — plus one extra of each.',
      'Ask your vet about therapeutic nutrition designed to help manage stress-related urinary conditions.'
    ],
    ficText: '<strong>Understanding Feline Idiopathic Cystitis (FIC)</strong><br><br><strong>What is it?</strong> FIC causes painful inflammation in the bladder without an infection. It originates in the nervous system — cats with FIC have brain chemistry that makes them feel pain more intensely and react more strongly to stress.<br><br><strong>How does stress cause bladder pain?</strong> Cats with FIC live in a heightened state of alertness. When stress hormones surge — from guests, noise, routine changes — the bladder wall becomes inflamed and irritated, making urination painful.<br><br><strong>Why the litter box avoidance?</strong> When peeing hurts, your cat may start associating the litter box with pain. Peeing outside the box is not revenge or bad behavior — it is a signal that your cat may be in pain and needs help.<br><br><strong>Can nutrition help?</strong> Yes. Therapeutic foods specifically formulated for urinary health have been shown to help reduce the incidence of FIC. Combined with environmental modifications to lower stress, proper nutrition can make a significant difference. Your veterinarian can recommend the right approach for your cat.',
    showFIC: true,
    showReframe: true,
    ctaStyle: 'urgent'
  }
];

const didYouKnowFacts = {
  2: 'Cats with FIC have a sensitized nervous system that can overreact to environmental changes — like rearranged furniture or new holiday decorations. Even small changes to their territory can trigger a stress response.', // Index 2 is after Q3
  5: 'Sharing resources — like litter boxes — with other cats can be a significant source of chronic stress. Veterinary behaviorists recommend providing one litter box per cat, plus one extra, to help reduce tension.'  // Index 5 is after Q6
};

// --- APP STATE ---

const state = {
  currentQuestion: 0,
  answers: [],
  totalScore: 0,
  maxScore: 24
};

// --- DOM ELEMENTS ---

const getEl = (id) => document.getElementById(id);

// Sections
const sections = {
  landing: getEl('landing'),
  quiz: getEl('quiz'),
  results: getEl('results')
};

// Quiz elements
const questionContainer = getEl('question-container');
const questionNumber = getEl('question-number');
const questionText = getEl('question-text');
const answersContainer = getEl('answers-container');
const gaugeNeedle = getEl('gauge-needle');

// DYK elements
const dykOverlay = getEl('dyk-overlay');
const dykText = getEl('dyk-text');
const dykClose = getEl('dyk-close');

// Result elements
const resultBadge = getEl('result-badge');
const resultHeadline = getEl('result-headline');
const resultDescription = getEl('result-description');
const resultTipsList = getEl('result-tips');
const ficPanel = getEl('fic-panel');
const ficHeader = getEl('fic-header');
const ficBody = getEl('fic-body');
const ficContent = getEl('fic-content');
const reframeBanner = getEl('reframe-banner');
const resultGaugeNeedle = getEl('results-gauge-needle');

// Action elements
const startBtn = getEl('start-btn');
const retakeBtn = getEl('retake-btn');

// Share & Email elements
const shareFb = getEl('share-facebook');
const shareTw = getEl('share-twitter');
const shareEmailBtn = getEl('share-email');
const copyLinkBtn = getEl('copy-link');
const emailForm = getEl('email-form');
const emailInput = getEl('email-input');
const emailFormMessage = getEl('email-form-message');

// --- FUNCTIONS ---

/**
 * Shows a specific section and hides the others.
 * @param {string} sectionId - The ID of the section to show ('landing', 'quiz', 'results')
 */
function showSection(sectionId) {
  Object.keys(sections).forEach(key => {
    if (sections[key]) {
      sections[key].style.display = 'none';
      sections[key].classList.remove('fade-in');
    }
  });
  
  if (sections[sectionId]) {
    sections[sectionId].style.display = '';
    // Trigger reflow for animation
    void sections[sectionId].offsetWidth; 
    sections[sectionId].classList.add('fade-in');
  }
}

/**
 * Initializes and starts the quiz.
 */
function startQuiz() {
  state.currentQuestion = 0;
  state.answers = [];
  state.totalScore = 0;
  updateGauge(0);
  showSection('quiz');
  renderQuestion(state.currentQuestion);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Renders a specific question by index.
 * @param {number} index - The zero-based index of the question.
 */
function renderQuestion(index) {
  const q = questions[index];
  if (!q) return;

  // Update text
  if (questionNumber) questionNumber.textContent = `Question ${q.id} of ${questions.length}`;
  if (questionText) questionText.textContent = q.text;

  // Render options
  if (answersContainer) {
    answersContainer.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'answer-card';
      btn.dataset.value = opt.value;
      btn.innerHTML = `<span class="emoji">${opt.emoji}</span><span class="text">${opt.text}</span>`;
      answersContainer.appendChild(btn);
    });
  }

  // Animate container
  if (questionContainer) {
    questionContainer.classList.remove('slide-in-right');
    void questionContainer.offsetWidth; // Reflow
    questionContainer.classList.add('slide-in-right');
  }

  updateProgress(index);
}

/**
 * Handles clicks on answer cards.
 * @param {Event} event 
 */
function handleAnswerSelection(event) {
  const card = event.target.closest('.answer-card');
  if (!card) return; // Not an answer card

  // Prevent multiple selections if already moving forward
  if (card.parentElement.querySelector('.selected')) return;

  // Mark selected
  card.classList.add('selected');
  const value = parseInt(card.dataset.value, 10);
  
  // Update state
  state.answers[state.currentQuestion] = value;
  state.totalScore = state.answers.reduce((sum, val) => sum + val, 0);
  
  // Update running gauge
  updateGauge(state.totalScore);

  // Determine next steps after delay
  setTimeout(() => {
    // Check for "Did You Know?" triggers
    if (didYouKnowFacts[state.currentQuestion]) {
      showDYK(state.currentQuestion);
    } else {
      advanceToNextQuestion();
    }
  }, 600);
}

/**
 * Advances to the next question or shows results if done.
 */
function advanceToNextQuestion() {
  state.currentQuestion++;
  if (state.currentQuestion < questions.length) {
    renderQuestion(state.currentQuestion);
  } else {
    showResults();
  }
}

/**
 * Shows the "Did You Know?" interstitial overlay.
 * @param {number} index - The current question index triggering the DYK.
 */
function showDYK(index) {
  if (dykText && dykOverlay) {
    dykText.textContent = didYouKnowFacts[index];
    dykOverlay.style.display = 'flex';
    dykOverlay.classList.remove('fade-in');
    void dykOverlay.offsetWidth;
    dykOverlay.classList.add('fade-in');
  } else {
    advanceToNextQuestion();
  }
}

/**
 * Updates the visual gauge needle based on score or specific angle.
 * @param {number} score - Current total score
 * @param {boolean} isResult - Whether to apply to the result gauge
 * @param {number|null} explicitAngle - Specific angle to use, overrides score calculation
 */
function updateGauge(score, isResult = false, explicitAngle = null) {
  let angle;
  if (explicitAngle !== null) {
    angle = explicitAngle;
  } else {
    // Linear interpolation: score 0 = -90deg, maxScore = 90deg
    angle = (score / state.maxScore) * 180 - 90;
    // Cap just in case
    angle = Math.max(-90, Math.min(90, angle));
  }

  const needle = isResult ? resultGaugeNeedle : gaugeNeedle;
  if (needle) {
    needle.style.transform = `rotate(${angle}deg)`;
  }
}

/**
 * Updates the progress ornaments state.
 * @param {number} index - The current active question index.
 */
function updateProgress(index) {
  const ornaments = document.querySelectorAll('#progress-bar .ornament');
  ornaments.forEach((ornament, i) => {
    ornament.classList.remove('active', 'completed');
    if (i < index) {
      ornament.classList.add('completed');
    } else if (i === index) {
      ornament.classList.add('active');
    }
  });
}

/**
 * Calculates final tier and displays the results section.
 */
function showResults() {
  const score = state.totalScore;
  
  // Find tier
  const tier = resultTiers.find(t => score >= t.scoreRange[0] && score <= t.scoreRange[1]) || resultTiers[0];

  // Populate Result Elements
  if (resultBadge) {
    resultBadge.innerHTML = `<span class="emoji">${tier.emoji}</span> <span class="name">${tier.name}</span>`;
    resultBadge.className = `badge tier-${tier.id}`;
  }
  
  if (resultHeadline) resultHeadline.textContent = tier.headline;
  if (resultDescription) resultDescription.textContent = tier.description;
  
  if (resultTipsList) {
    resultTipsList.innerHTML = '';
    tier.tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      resultTipsList.appendChild(li);
    });
  }

  // FIC Panel
  if (ficPanel) {
    ficPanel.style.display = tier.showFIC ? 'block' : 'none';
    if (tier.showFIC && ficContent) {
      ficContent.innerHTML = tier.ficText;
    }
    // Ensure it's closed initially
    if (ficBody) ficBody.style.maxHeight = null;
  }

  // Reframe Banner
  if (reframeBanner) {
    reframeBanner.style.display = tier.showReframe ? 'flex' : 'none';
  }

  // Show Results Section
  showSection('results');
  
  // Set Result Gauge
  // Delay slightly so the CSS transition plays nicely after the section becomes visible
  setTimeout(() => {
    updateGauge(score, true, tier.gaugeAngle);
  }, 200);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Toggles the FIC accordion panel open/closed.
 */
function toggleFICPanel() {
  if (!ficBody) return;
  const isOpen = ficBody.style.maxHeight;
  
  if (isOpen) {
    ficBody.style.maxHeight = null;
    ficHeader?.classList.remove('expanded');
  } else {
    ficBody.style.maxHeight = ficBody.scrollHeight + "px";
    ficHeader?.classList.add('expanded');
  }
}

/**
 * Handles the email capture form submission.
 * @param {Event} e 
 */
function handleEmailSubmit(e) {
  e.preventDefault();
  if (emailInput && emailInput.value) {
    // Validate email roughly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
      if (emailFormMessage) {
        emailFormMessage.textContent = "Thank you! Keep an eye on your inbox for helpful tips.";
        emailFormMessage.className = "success-msg";
        emailForm.style.display = 'none'; // hide form on success
      }
    } else {
      if (emailFormMessage) {
        emailFormMessage.textContent = "Please enter a valid email address.";
        emailFormMessage.className = "error-msg";
      }
    }
  }
}

/**
 * Generates falling snowflakes via CSS animations.
 */
function createSnowflakes() {
  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; 
  }
  
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    flake.style.position = 'fixed';
    flake.style.width = (Math.random() * 3 + 2) + 'px';
    flake.style.height = flake.style.width;
    flake.style.backgroundColor = '#FFF';
    flake.style.borderRadius = '50%';
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.top = '-10px';
    flake.style.pointerEvents = 'none';
    flake.style.zIndex = '9999';
    flake.style.opacity = (Math.random() * 0.5 + 0.3).toString();
    
    // Random duration between 8s and 15s
    const duration = Math.random() * 7 + 8;
    // Random delay between 0s and 10s
    const delay = Math.random() * 10;
    
    flake.style.animation = `snowfall ${duration}s linear ${delay}s infinite`;
    document.body.appendChild(flake);
  }
}

// --- SHARE FUNCTIONS ---

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareTwitter() {
  const text = encodeURIComponent("I just checked my cat's holiday stress risk! Take the quiz to see if your feline friend is ready for the season.");
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
}

function shareViaEmail() {
  const subject = encodeURIComponent("Check out this Holiday Cat Stress Quiz");
  const body = encodeURIComponent(`Take this quick quiz by Hill's Pet Nutrition to see if your cat might be stressed this holiday season:\n\n${window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

async function copyPageLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (copyLinkBtn) {
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

// --- INIT & EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  createSnowflakes();
  showSection('landing');

  // Event Binding
  if (startBtn) startBtn.addEventListener('click', startQuiz);
  if (retakeBtn) retakeBtn.addEventListener('click', () => {
    showSection('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (answersContainer) {
    answersContainer.addEventListener('click', handleAnswerSelection);
  }

  if (dykClose) {
    dykClose.addEventListener('click', () => {
      if (dykOverlay) dykOverlay.style.display = 'none';
      advanceToNextQuestion();
    });
  }

  if (ficHeader) {
    ficHeader.addEventListener('click', toggleFICPanel);
  }

  if (emailForm) {
    emailForm.addEventListener('submit', handleEmailSubmit);
  }

  // Sharing
  if (shareFb) shareFb.addEventListener('click', shareFacebook);
  if (shareTw) shareTw.addEventListener('click', shareTwitter);
  if (shareEmailBtn) shareEmailBtn.addEventListener('click', shareViaEmail);
  if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyPageLink);
});
