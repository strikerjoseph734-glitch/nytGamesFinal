window.addEventListener("load", () => {

  /* ---------- Navigation ---------- */
  const menu = document.getElementById("menu");
  const lovleBtn = document.getElementById("lovle-btn");
  const lovleGame = document.getElementById("lovle-game");
  const backButtons = document.querySelectorAll(".back-btn");

  lovleBtn.addEventListener("click", () => {
    menu.style.display = "none";
    lovleGame.style.display = "block";
    resetLovle();
  });

  backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".game-section").forEach(d => d.style.display = "none");
      menu.style.display = "";
      resetLovle();
    });
  });

 const mobileInput = document.getElementById("mobile-input");

// Focus hidden input when Lovle or Word Search is opened (mobile)
lovleBtn.addEventListener("click", () => {
  mobileInput.focus();
});


// Sync mobile input to Lovle game
mobileInput.addEventListener("input", () => {
  if (lovleGame.style.display !== "block") return;
  const val = mobileInput.value.toUpperCase();
  if (!val) return;

  for (let ch of val) {
    if (row >= 6) break;
    if (col >= 5) {
      submitGuess();
    }
    guesses[row][col] = ch;
    const cell = grid.children[row * 5 + col];
    cell.textContent = guesses[row][col];
    cell.classList.add("filled");
    col++;
  }

  mobileInput.value = "";
});

/* ---------- Lovle Game ---------- */
const words = ["HEART", "LOVER", "ADORE", "CUPID", "AMOUR"];
let target = "";
let row = 0;
let col = 0;
let guesses = [];

const grid = document.getElementById("lovle-grid");
const message = document.getElementById("lovle-message");

// Reset / start new game
function resetLovle() {
  target = words[Math.floor(Math.random() * words.length)];
  row = 0;
  col = 0;
  guesses = Array.from({ length: 6 }, () => Array(5).fill(""));
  message.textContent = "";
  message.classList.remove("show");

  grid.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.className = "lovle-cell";
    grid.appendChild(cell);
  }
}

// Handle key input
document.addEventListener("keydown", (e) => {
  if (lovleGame.style.display !== "block") return;
  if (row >= 6) return;

  e.preventDefault(); // prevent mobile scroll

  const cellIndex = row * 5 + col;

  if (e.key === "Backspace" && col > 0) {
    col--;
    guesses[row][col] = "";
    const cell = grid.children[row * 5 + col];
    cell.textContent = "";
    cell.classList.remove("filled");
  } else if (/^[a-zA-Z]$/.test(e.key) && col < 5) {
    guesses[row][col] = e.key.toUpperCase();
    const cell = grid.children[cellIndex];
    cell.textContent = guesses[row][col];
    cell.classList.add("filled");
    col++;
  } else if (e.key === "Enter" && col === 5) {
    submitGuess();
  }
});

// Submit a guess
function submitGuess() {
  const guess = guesses[row].join("");
  if (guess.length < 5) return;

  const letterCount = {}; // for duplicate letter logic
  for (let l of target) {
    letterCount[l] = (letterCount[l] || 0) + 1;
  }

  const statuses = Array(5).fill("absent");

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      statuses[i] = "correct";
      letterCount[guess[i]]--;
    }
  }

  // Second pass: present letters
  for (let i = 0; i < 5; i++) {
    if (statuses[i] === "correct") continue;
    if (target.includes(guess[i]) && letterCount[guess[i]] > 0) {
      statuses[i] = "present";
      letterCount[guess[i]]--;
    }
  }

  // Animate flip and add colors after half-flip
  for (let i = 0; i < 5; i++) {
    const cell = grid.children[row * 5 + i];
    setTimeout(() => {
      cell.classList.add("reveal"); // start flip
      setTimeout(() => {
        cell.classList.add(statuses[i]); // add color
      }, 200);
    }, i * 300);
  }

  // Check win/loss after animation
  setTimeout(() => {
    if (guess === target) {
      message.textContent = "💖 Yayy! You got the word 💖";
      message.classList.add("show");
      for (let i = 0; i < 5; i++) {
        grid.children[row * 5 + i].classList.add("lovle-win");
      }
      row = 6;
      return;
    }

    row++;
    col = 0;

    if (row === 6) {
      message.textContent = `💔 The word was ${target}`;
      message.classList.add("show");
    }
  }, 5 * 300 + 250); // wait for all flips to finish
}

// Initialize first game
resetLovle();

// ==========================
// 🐝 SPELLING BEE GAME
// ==========================

const spellingBtn = document.getElementById("spelling-btn");
const spellingGame = document.getElementById("spelling-game");

const beeLetters = document.querySelectorAll(".bee-letter");
const beeWordDisplay = document.getElementById("bee-current-word");
const beeMessage = document.getElementById("bee-message");
const beeScore = document.getElementById("bee-score");

const beeSubmitBtn = document.getElementById("bee-submit");

// ---------- Valentine-themed word sets ----------
const spellingSets = [
  {
    center: "V",
    letters: ["A","L","O","E","H","R"],
    words: ["LOVE","LOVER","VALOR","VOLE","VALE","HOVER","ROVE"]
  },
];

let currentSet;
let currentWord = "";
let score = 0;
let foundWords = [];

// ---------- Reset / initialize game ----------
function resetSpellingBee() {
  currentWord = "";
  score = 0;
  foundWords = [];
  beeWordDisplay.textContent = "";
  beeMessage.textContent = "";
  beeScore.textContent = "Score: 0";

  // Random set
  currentSet = spellingSets[Math.floor(Math.random() * spellingSets.length)];

  // Center letter
  const centerEl = document.querySelector(".bee-letter.center");
  centerEl.textContent = currentSet.center;
  centerEl.dataset.letter = currentSet.center;

  // Outer letters
  const outers = document.querySelectorAll(".bee-letter.outer");
  outers.forEach((el, i) => {
    el.textContent = currentSet.letters[i];
    el.dataset.letter = currentSet.letters[i];
  });

  // Position honeycomb
  positionHoneycomb();
}

// ---------- Button navigation ----------
spellingBtn.addEventListener("click", () => {
  menu.style.display = "none";
  spellingGame.style.display = "block";
  resetSpellingBee();
});

spellingGame.querySelector(".back-btn").addEventListener("click", () => {
  spellingGame.style.display = "none";
  menu.style.display = ""; // restore default CSS
});

// ---------- Letter click ----------
beeLetters.forEach(letter => {
  letter.addEventListener("click", () => {
    currentWord += letter.dataset.letter;
    beeWordDisplay.textContent = currentWord;
    pop(letter);
  });
});

// ---------- Keyboard input ----------
document.addEventListener("keydown", (e) => {
  if (spellingGame.style.display !== "block") return;

  if (/^[a-zA-Z]$/.test(e.key)) {
    currentWord += e.key.toUpperCase();
    beeWordDisplay.textContent = currentWord;

    // Pop the corresponding letters
    beeLetters.forEach(letter => {
      if (letter.dataset.letter === e.key.toUpperCase()) pop(letter);
    });

    pop(beeWordDisplay);
    pop(beeMessage);
  }

  if (e.key === "Backspace") {
    currentWord = currentWord.slice(0, -1);
    beeWordDisplay.textContent = currentWord;
  }

  if (e.key === "Enter") {
    submitBeeWord();
  }
});

// ---------- Submit word ----------
function submitBeeWord() {
  const word = currentWord.toUpperCase();

  // Must include center
  if (!word.includes(currentSet.center)) {
    beeMessage.textContent = "❌ Must include the center letter!";
    pop(beeMessage);
    shake(beeWordDisplay);
    currentWord = "";
    beeWordDisplay.textContent = "";
    return;
  }

  // Must be in word list
  if (!currentSet.words.includes(word)) {
    beeMessage.textContent = "❌ Not a valid Valentine word!";
    pop(beeMessage);
    shake(beeWordDisplay);
    currentWord = "";
    beeWordDisplay.textContent = "";
    return;
  }

  // Already found
  if (foundWords.includes(word)) {
    beeMessage.textContent = "⚠️ Already found!";
    pop(beeMessage);
    currentWord = "";
    beeWordDisplay.textContent = "";
    return;
  }

  // Success
  foundWords.push(word);
  score += word.length;
  beeScore.textContent = `Score: ${score}`;
  beeMessage.textContent = "💖 Great word!";
  pop(beeMessage);
  pop(beeWordDisplay);

  currentWord = "";
  beeWordDisplay.textContent = "";

  // All words found
  if (foundWords.length === currentSet.words.length) {
    beeMessage.textContent = "🎉 You found all the words!";
    pop(beeMessage);
  }
}

// ✅ Connect the Submit button
beeSubmitBtn.addEventListener("click", submitBeeWord);

// ---------- Animations ----------
function pop(el) {
  const isCenter = el.classList.contains("center");
  const original = isCenter ? "translate(-50%, -50%)" : "";

  el.style.transition = "transform 0.15s ease";
  el.style.transform = `${original} translateY(-10%) scale(1.15)`;

  setTimeout(() => {
    el.style.transform = original || "translateY(0) scale(1)";
  }, 150);
}

function shake(el) {
  el.style.animation = "shake 0.3s";
  el.addEventListener("animationend", () => {
    el.style.animation = "";
  }, { once: true });
}

// ---------- Honeycomb positioning ----------
function positionHoneycomb() {
  const centerX = 110;
  const centerY = 110;
  const radius = 70;

  const outerLetters = document.querySelectorAll(".bee-letter.outer");
  const total = outerLetters.length;

  outerLetters.forEach((el, i) => {
    const angle = (i * 360 / total - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle) - 30;
    const y = centerY + radius * Math.sin(angle) - 30;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
}

// Initialize once in case game is shown first
positionHoneycomb();


// ---------------------
// 🔎 Word Search JS
// ---------------------

const wsBtn = document.getElementById("wordsearch-btn");
const wsGame = document.getElementById("wordsearch-game");
const wsBackBtn = wsGame.querySelector(".back-btn");

const wsGridEl = document.getElementById("wordsearch-grid");
const wsMessage = document.getElementById("wordsearch-message");
const wsScore = document.getElementById("wordsearch-score");
const wsWordListEl = document.getElementById("wordsearch-word-list");
const wsSubmitBtn = document.getElementById("ws-submit");

const gridSize = 10;
let selectedCells = [];
let wsFoundWords = [];

// Valentine-themed words
const wordsearchWords = [
  "MANGO","BBG","BOTTOM","MASC","BABE","YAY","LOVERS","KISSING"
];

// ---------- Helpers ----------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearSelection() {
  selectedCells.forEach(c => c.classList.remove("selected"));
  selectedCells = [];
}

function isContiguous(cells) {
  if (cells.length <= 1) return true;

  const r0 = parseInt(cells[0].dataset.row);
  const c0 = parseInt(cells[0].dataset.col);
  const r1 = parseInt(cells[1].dataset.row);
  const c1 = parseInt(cells[1].dataset.col);

  const stepR = Math.sign(r1 - r0);
  const stepC = Math.sign(c1 - c0);

  for (let i = 1; i < cells.length; i++) {
    const prevR = parseInt(cells[i - 1].dataset.row);
    const prevC = parseInt(cells[i - 1].dataset.col);
    const currR = parseInt(cells[i].dataset.row);
    const currC = parseInt(cells[i].dataset.col);

    if ((currR - prevR !== stepR) || (currC - prevC !== stepC)) return false;
  }
  return true;
}

// ---------- Generate Grid ----------
function generateWordSearch() {
  wsGridEl.innerHTML = "";
  wsMessage.textContent = "";
  wsScore.textContent = `Found: ${wsFoundWords.length}`;

  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  // Place words
  wordsearchWords.forEach(word => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      attempts++;
      const dir = randomInt(0, 2); // 0=H, 1=V, 2=Diagonal
      const row = randomInt(0, gridSize - 1);
      const col = randomInt(0, gridSize - 1);
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        let r = row, c = col;
        if (dir === 0) c += i;
        else if (dir === 1) r += i;
        else { r += i; c += i; }

        if (r >= gridSize || c >= gridSize || (grid[r][c] && grid[r][c] !== word[i])) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          let r = row, c = col;
          if (dir === 0) c += i;
          else if (dir === 1) r += i;
          else { r += i; c += i; }
          grid[r][c] = word[i];
        }
        placed = true;
      }
    }
  });

  // Fill remaining cells
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c]) grid[r][c] = letters[randomInt(0, letters.length - 1)];
    }
  }

  // Create HTML cells
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("wordsearch-cell");
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      wsGridEl.appendChild(cell);

      // Click to select
      cell.addEventListener("click", () => {
        if (cell.classList.contains("selected")) {
          cell.classList.remove("selected");
          selectedCells = selectedCells.filter(sc => sc !== cell);
        } else {
          cell.classList.add("selected");
          selectedCells.push(cell);
        }
      });
    }
  }

  // Word list
  wsWordListEl.innerHTML = "";
  wordsearchWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    li.dataset.word = word;
    wsWordListEl.appendChild(li);
  });
}

// ---------- Navigation ----------
wsBtn.addEventListener("click", () => {
  menu.style.display = "none";
  wsGame.style.display = "block";
  generateWordSearch();
});

wsBackBtn.addEventListener("click", () => {
  wsGame.style.display = "none";
  menu.style.display = ""; // use block to match other games
  selectedCells = [];
});

// ---------- Submit Logic ----------
function submitWordSearch() {
  if (!isContiguous(selectedCells)) {
    wsMessage.textContent = "❌ Letters must be connected in a line!";
    clearSelection();
    return;
  }

  const word = selectedCells.map(c => c.textContent).join("").toUpperCase();
  if (!word) return;

  if (wsFoundWords.includes(word)) {
    wsMessage.textContent = "⚠️ Already found!";
  } else if (wordsearchWords.includes(word)) {
    wsMessage.textContent = "💖 Found: " + word;
    wsFoundWords.push(word);
    wsScore.textContent = `Found: ${wsFoundWords.length}`;

    selectedCells.forEach(c => c.classList.add("found"));

    const li = [...wsWordListEl.children].find(l => l.dataset.word === word);
    if (li) li.classList.add("found");

    if (wsFoundWords.length === wordsearchWords.length) {
      wsMessage.textContent = "🎉 You found all the words!";
      wsMessage.classList.add("pop");
      wsMessage.addEventListener("animationend", () => {
        wsMessage.classList.remove("pop");
      }, { once: true });
    }
  } else {
    wsMessage.textContent = "❌ Not a word!";
  }

  clearSelection();
}

// Trigger submit
wsSubmitBtn.addEventListener("click", submitWordSearch);

// Enter key triggers submit
document.addEventListener("keydown", (e) => {
  if (wsGame.style.display !== "block") return;
  if (e.key === "Enter") submitWordSearch();
});

// ---------------------
// 🧩 Mini Crossword JS
// ---------------------
const crosswordBtn = document.getElementById("crossword-btn");
const crosswordGame = document.getElementById("crossword-game");
const crosswordBack = crosswordGame.querySelector(".back-btn");
const crosswordGridEl = document.getElementById("crossword-grid");
const crosswordMessage = document.getElementById("crossword-message");
const crosswordHintsEl = document.getElementById("crossword-hints");

const crosswordSize = 7;

const crosswordWords = [
  { word: "INDIA",  row: 2, col: 0, dir: "H" },
  { word: "LILY",   row: 1, col: 0, dir: "V" },
  { word: "YAPPER", row: 4, col: 0, dir: "H" },
  { word: "DRAG",   row: 3, col: 5, dir: "V" }
];

const crosswordHints = [
  "1: A city beginning with M is located here",
  "2: They give messy pollen stains",
  "3: Someone who talks a lot",
  "4: Jimmy Fallon got scared when he said this word"
];

let cells = [];

// ---------------------
// Generate Crossword
// ---------------------
function generateCrossword() {
  crosswordGridEl.innerHTML = "";
  crosswordMessage.textContent = "";
  cells = Array.from({ length: crosswordSize }, () => Array(crosswordSize).fill(null));

  for (let r = 0; r < crosswordSize; r++) {
    for (let c = 0; c < crosswordSize; c++) {
      const cellDiv = document.createElement("div");
      cellDiv.className = "crossword-cell";
      cellDiv.style.position = "relative";

      let isWordCell = false;

      crosswordWords.forEach((w, idx) => {
        for (let i = 0; i < w.word.length; i++) {
          const rr = w.row + (w.dir === "V" ? i : 0);
          const cc = w.col + (w.dir === "H" ? i : 0);

          if (rr === r && cc === c) {
            isWordCell = true;

            // Number for first letter
            if (i === 0) {
              const numberEl = document.createElement("span");
              numberEl.className = "crossword-number";
              numberEl.textContent = idx + 1;
              numberEl.style.position = "absolute";
              numberEl.style.top = "0";
              numberEl.style.left = "2px";
              numberEl.style.fontSize = "0.7rem";
              numberEl.style.fontWeight = "bold";
              numberEl.style.color = "#fff";
              cellDiv.appendChild(numberEl);
            }

            if (!cells[r][c]) {
              const input = document.createElement("input");
              input.maxLength = 1;
              input.dataset.row = r;
              input.dataset.col = c;
              input.style.textTransform = "uppercase";

              // Handle input and auto-move
              input.addEventListener("input", () => {
                input.value = input.value.toUpperCase();
                moveNext(input);
                checkCrossword();
              });

              // Handle Backspace smoothly
              input.addEventListener("keydown", (e) => {
                const r = +input.dataset.row;
                const c = +input.dataset.col;

                if (e.key === "Backspace") {
                  e.preventDefault();
                  if (input.value) {
                    // Delete current letter
                    input.value = "";
                  } else {
                    // Move to previous letter in any word that contains this cell
                    const wordsHere = crosswordWords.filter(w => {
                      for (let i = 0; i < w.word.length; i++) {
                        const rr = w.row + (w.dir === "V" ? i : 0);
                        const cc = w.col + (w.dir === "H" ? i : 0);
                        if (rr === r && cc === c) return true;
                      }
                      return false;
                    });

                    for (const w of wordsHere) {
                      const dir = w.dir;
                      let prevR = r;
                      let prevC = c;

                      while (true) {
                        if (dir === "H") prevC--;
                        else prevR--;

                        if (prevR < 0 || prevC < 0) break;

                        const prevInput = cells[prevR]?.[prevC];
                        if (prevInput) {
                          prevInput.focus();
                          prevInput.value = "";
                          return;
                        }
                      }
                    }
                  }
                }
              });

              cellDiv.appendChild(input);
              cells[r][c] = input;
            }
          }
        }
      });

      if (!isWordCell) cellDiv.classList.add("empty");
      crosswordGridEl.appendChild(cellDiv);
    }
  }

  // Display hints
  crosswordHintsEl.innerHTML = "";
  crosswordHints.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    crosswordHintsEl.appendChild(li);
  });
}

// ---------------------
// Move focus to next input
// ---------------------
function moveNext(input) {
  const r = +input.dataset.row;
  const c = +input.dataset.col;

  const wordsHere = crosswordWords.filter(w => {
    for (let i = 0; i < w.word.length; i++) {
      const rr = w.row + (w.dir === "V" ? i : 0);
      const cc = w.col + (w.dir === "H" ? i : 0);
      if (rr === r && cc === c) return true;
    }
    return false;
  });

  for (const w of wordsHere) {
    const dir = w.dir;
    let nextR = r;
    let nextC = c;

    while (true) {
      if (dir === "H") nextC++;
      else nextR++;

      if (nextR >= crosswordSize || nextC >= crosswordSize) break;

      const nextInput = cells[nextR]?.[nextC];
      if (nextInput && !nextInput.value) {
        nextInput.focus();
        return;
      }
    }
  }

  // Focus first empty cell if no next in same word
  for (let rr = 0; rr < crosswordSize; rr++) {
    for (let cc = 0; cc < crosswordSize; cc++) {
      const inp = cells[rr][cc];
      if (inp && !inp.value) {
        inp.focus();
        return;
      }
    }
  }
}

// ---------------------
// Check completion
// ---------------------
function checkCrossword() {
  let solved = true;
  crosswordWords.forEach(w => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.row + (w.dir === "V" ? i : 0);
      const c = w.col + (w.dir === "H" ? i : 0);
      const input = cells[r][c];
      if (!input || input.value.toUpperCase() !== w.word[i]) solved = false;
    }
  });

  if (solved) {
    crosswordMessage.textContent = "💖 Crossword Complete!";
    crosswordMessage.classList.add("pop");
    crosswordMessage.addEventListener("animationend", () => crosswordMessage.classList.remove("pop"), { once: true });
    cells.flat().forEach(i => { if (i) i.disabled = true; });
  }
}

// ---------------------
// Button Navigation
// ---------------------
crosswordBtn.addEventListener("click", () => {
  menu.style.display = "none";
  crosswordGame.style.display = "block";
  generateCrossword();
});

crosswordBack.addEventListener("click", () => {
  crosswordGame.style.display = "none";
  menu.style.display = "";

  // Reset inputs so reopening works
  cells.flat().forEach(i => {
    if (i) i.value = "";
    if (i) i.removeAttribute("disabled");
  });
});
});