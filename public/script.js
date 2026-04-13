const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.panel');
const proxyForm = document.getElementById('proxyForm');
const proxyFrame = document.getElementById('proxyFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameFullscreenBtn = document.getElementById('gameFullscreenBtn');
const htmlFullscreenBtn = document.getElementById('htmlFullscreenBtn');
const gameList = document.getElementById('gameList');
const gameInfo = document.getElementById('gameInfo');
const gameBoard = document.getElementById('gameBoard');
const downloadGameBtn = document.getElementById('downloadGameBtn');
const htmlContainer = document.getElementById('htmlContainer');
const proxyHtmlFileInput = document.getElementById('proxyHtmlFileInput');
const loadProxyHtmlBtn = document.getElementById('loadProxyHtmlBtn');
const gameHtmlFileInput = document.getElementById('gameHtmlFileInput');
const loadGameHtmlBtn = document.getElementById('loadGameHtmlBtn');

let activeGame = null;

const urlInput = document.getElementById('urlInput');

const games = [
  {
    id: 'ticTacToe',
    title: 'Star Tic-Tac-Toe',
    description: 'Play a quick 3x3 match. X takes the first move and every win feels like a warp jump.',
    type: 'dynamic',
    run: renderTicTacToe,
  },
  {
    id: 'memoryMatch',
    title: 'Memory Match',
    description: 'Find the matching star pairs before your time runs out.',
    type: 'dynamic',
    run: renderMemoryMatch,
  },
  {
    id: 'starDash',
    title: 'Star Dash',
    description: 'Click the moving star as many times as possible in 20 seconds.',
    type: 'dynamic',
    run: renderStarDash,
  },
  {
    id: 'aquaparkIo',
    title: 'Aquapark.io',
    description: 'Slide through the water park in a fast-paced HTML classic.',
    type: 'html',
    url: '/games/Aquapark.io.html',
  },
  {
    id: 'cheeseRolling',
    title: 'Cheese Rolling',
    description: 'Chase the cheese down the hill and beat the odds.',
    type: 'html',
    url: '/games/Cheese Rolling.html',
  },
  {
    id: 'fiveNightsEpsteins',
    title: 'Five Nights at Epstein\'s',
    description: 'A horror game experience powered by local HTML content.',
    type: 'html',
    url: '/games/Five Nights at Epstein\'s.html',
  },
  {
    id: 'blockBlast',
    title: 'Block Blast',
    description: 'Push and demolish blocks in a brain-bending arcade stage.',
    type: 'html',
    url: '/games/block_blast.html',
  },
  {
    id: 'fireboyWatergirl',
    title: 'Fireboy and Watergirl: Forest Temple',
    description: 'Solve elemental puzzles and navigate the enchanted temple.',
    type: 'html',
    url: '/games/fireboy_and_watergirl__forest_temple.html',
  },
  {
    id: 'gunSpin',
    title: 'Gun Spin',
    description: 'Get spinning in this fast-paced shooting HTML game.',
    type: 'html',
    url: '/games/gun_spin.html',
  },
  {
    id: 'pokemonFireRed',
    title: 'Pokemon FireRed',
    description: 'Explore a classic RPG world in this HTML-based adventure.',
    type: 'html',
    url: '/games/pokemon_firered.html',
  },
  {
    id: 'sandGame',
    title: 'Sand Game',
    description: 'Play with sand and particles for a calm, creative break.',
    type: 'html',
    url: '/games/sand_game.html',
  },
  {
    id: 'stackyDash',
    title: 'Stacky Dash',
    description: 'Dash through obstacles and stack your way to the finish.',
    type: 'html',
    url: '/games/stacky_dash.html',
  },
  {
    id: 'subwaySurfers',
    title: 'Subway Surfers',
    description: 'Run the tracks, dodge trains, and try not to get caught.',
    type: 'html',
    url: '/games/subway_surfers.html',
  },
  {
    id: 'thatsNotMyNeighbor',
    title: 'That\'s Not My Neighbor',
    description: 'Sneak past the neighbor in this quirky HTML escape game.',
    type: 'html',
    url: '/games/that_s_not_my_neighbor.html',
  },
  {
    id: 'ultrakill',
    title: 'Ultrakill',
    description: 'Experience the high-energy action of Ultrakill in browser form.',
    type: 'html',
    url: '/games/ultrakill.html',
  },
];

function safeRequestFullscreen(element) {
  if (!element) return;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function safeExitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function isElementFullscreen(element) {
  return document.fullscreenElement === element || document.webkitFullscreenElement === element || document.msFullscreenElement === element;
}

function toggleFullscreen(element, button, labelOn, labelOff) {
  if (isElementFullscreen(element)) {
    safeExitFullscreen();
    button.textContent = labelOn;
  } else {
    safeRequestFullscreen(element);
    button.textContent = labelOff;
  }
}

function updateFullscreenLabels() {
  const active = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  fullscreenBtn.textContent = active === proxyFrame ? 'Exit Proxy Fullscreen' : 'Fullscreen Proxy';
  gameFullscreenBtn.textContent = active === gameBoard ? 'Exit Game Fullscreen' : 'Fullscreen Game';
  htmlFullscreenBtn.textContent = active === htmlContainer ? 'Exit HTML Fullscreen' : 'Fullscreen HTML';
}

function renderHtmlInContainer(url, title) {
  htmlContainer.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.style.width = '100%';
  iframe.style.minHeight = '420px';
  iframe.style.border = '1px solid rgba(255,255,255,0.12)';
  iframe.style.borderRadius = '18px';
  iframe.style.marginTop = '18px';

  htmlContainer.appendChild(iframe);
}


function switchTab(selectedTab) {
  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === selectedTab);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === selectedTab);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => switchTab(button.dataset.tab));
});

proxyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let input = urlInput.value.trim();

  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    input = 'https://www.google.com/search?q=' + encodeURIComponent(input);
  }

  proxyFrame.src = '/proxy?url=' + encodeURIComponent(input);
});

fullscreenBtn.addEventListener('click', () => toggleFullscreen(proxyFrame, fullscreenBtn, 'Fullscreen Proxy', 'Exit Proxy Fullscreen'));

loadProxyHtmlBtn.addEventListener('click', () => {
  const file = proxyHtmlFileInput.files[0];
  if (!file) {
    alert('Please select an HTML file first.');
    return;
  }

  const url = URL.createObjectURL(file);
  renderHtmlInContainer(url, 'Custom HTML');
});

htmlFullscreenBtn.addEventListener('click', () => toggleFullscreen(htmlContainer, htmlFullscreenBtn, 'Fullscreen HTML', 'Exit HTML Fullscreen'));

gameFullscreenBtn.addEventListener('click', () => toggleFullscreen(gameBoard, gameFullscreenBtn, 'Fullscreen Game', 'Exit Game Fullscreen'));

downloadGameBtn.addEventListener('click', () => {
  if (!activeGame) return;

  if (activeGame.type === 'html') {
    downloadStaticHtmlFile(activeGame.url, `${activeGame.id}.html`);
    return;
  }

  const html = buildGameHtml(activeGame);
  downloadTextFile(html, `${activeGame.id}.html`);
});

loadGameHtmlBtn.addEventListener('click', () => {
  const file = gameHtmlFileInput.files[0];
  if (!file) {
    alert('Please select an HTML file first.');
    return;
  }

  const url = URL.createObjectURL(file);
  activeGame = { id: 'customHtml', title: 'Custom HTML Game', type: 'html', url };
  gameInfo.innerHTML = '<h3>Custom HTML Game</h3><p>Loaded from uploaded file.</p>';
  renderHtmlGame(activeGame, gameBoard);
});

document.addEventListener('fullscreenchange', updateFullscreenLabels);
document.addEventListener('webkitfullscreenchange', updateFullscreenLabels);
document.addEventListener('msfullscreenchange', updateFullscreenLabels);

function setupGames() {
  games.forEach((game, index) => {
    const button = document.createElement('button');
    button.className = 'game-card';
    button.innerHTML = `<h3>${game.title}</h3><p>${game.description}</p>`;
    button.addEventListener('click', () => loadGame(game));
    gameList.appendChild(button);

    if (index === 0) {
      loadGame(game);
    }
  });
}

function loadGame(game) {
  activeGame = game;
  gameInfo.innerHTML = `<h3>${game.title}</h3><p>${game.description}</p>`;
  gameBoard.innerHTML = '';

  if (game.type === 'html') {
    renderHtmlGame(game, gameBoard);
    return;
  }

  game.run(gameBoard);
}

function renderHtmlGame(game, target) {
  const openButton = document.createElement('button');
  openButton.className = 'control-button';
  openButton.textContent = 'Open HTML Game';
  openButton.addEventListener('click', () => {
    window.open(game.url, '_blank');
  });

  const iframe = document.createElement('iframe');
  iframe.src = encodeURI(game.url);
  iframe.title = game.title;
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.style.width = '100%';
  iframe.style.minHeight = '420px';
  iframe.style.border = '1px solid rgba(255,255,255,0.12)';
  iframe.style.borderRadius = '18px';
  iframe.style.marginTop = '18px';

  target.append(openButton, iframe);
}

function downloadStaticHtmlFile(url, filename) {
  fetch(encodeURI(url))
    .then((response) => {
      if (!response.ok) throw new Error('Unable to fetch HTML file.');
      return response.text();
    })
    .then((text) => downloadTextFile(text, filename))
    .catch((error) => alert(error.message));
}

function renderTicTacToe(target) {
  const board = Array(9).fill('');
  let currentPlayer = 'X';
  let winner = null;

  const status = document.createElement('div');
  status.className = 'game-info';
  status.textContent = `Current turn: ${currentPlayer}`;

  const grid = document.createElement('div');
  grid.className = 'display-board';

  const cells = board.map((value, index) => {
    const button = document.createElement('button');
    button.textContent = '';
    button.addEventListener('click', () => handleMove(index));
    grid.appendChild(button);
    return button;
  });

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Reset Board';
  resetButton.addEventListener('click', resetGame);

  target.append(status, grid, resetButton);

  function updateStatus(message) {
    status.textContent = message;
  }

  function handleMove(index) {
    if (board[index] || winner) return;
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    winner = checkWin();

    if (winner) {
      updateStatus(`Winner: ${winner}`);
      return;
    }

    if (board.every(Boolean)) {
      updateStatus('Draw!');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Current turn: ${currentPlayer}`);
  }

  function resetGame() {
    board.fill('');
    winner = null;
    currentPlayer = 'X';
    cells.forEach((cell) => (cell.textContent = ''));
    updateStatus(`Current turn: ${currentPlayer}`);
  }

  function checkWin() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }
}

function renderMemoryMatch(target) {
  const icons = ['✨', '☄️', '🚀', '🪐', '🌌', '🌠'];
  const cards = shuffle([...icons, ...icons]);
  const board = document.createElement('div');
  board.className = 'card-grid';

  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let matches = 0;

  const score = document.createElement('div');
  score.className = 'score-row';
  score.textContent = `Matches: ${matches} / ${icons.length}`;

  cards.forEach((value) => {
    const card = document.createElement('button');
    card.textContent = '';
    card.dataset.value = value;
    card.addEventListener('click', () => revealCard(card));
    board.appendChild(card);
  });

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Restart Memory';
  resetButton.addEventListener('click', () => {
    target.innerHTML = '';
    renderMemoryMatch(target);
  });

  target.append(score, board, resetButton);

  function revealCard(card) {
    if (lock || card === firstCard || card.textContent) return;

    card.textContent = card.dataset.value;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lock = true;

    if (firstCard.dataset.value === secondCard.dataset.value) {
      matches += 1;
      score.textContent = `Matches: ${matches} / ${icons.length}`;
      resetSelection();

      if (matches === icons.length) {
        score.textContent = 'All matched! Great work.';
      }
      return;
    }

    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetSelection();
    }, 800);
  }

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    lock = false;
  }
}

function renderStarDash(target) {
  let score = 0;
  let timeLeft = 20;
  let intervalId = null;

  const scorePanel = document.createElement('div');
  scorePanel.className = 'score-row';
  scorePanel.textContent = `Score: ${score}  •  Time: ${timeLeft}s`;

  const area = document.createElement('div');
  area.className = 'runner-area';

  const star = document.createElement('div');
  star.className = 'runner-item';
  area.appendChild(star);

  const instructions = document.createElement('p');
  instructions.className = 'runner-guide';
  instructions.textContent = "Tap or click the star before time runs out. It moves every second.";

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Restart Star Dash';
  resetButton.addEventListener('click', startGame);

  area.addEventListener('click', () => {
    score += 1;
    updateStatus();
  });

  target.append(scorePanel, area, instructions, resetButton);

  function updateStatus() {
    scorePanel.textContent = `Score: ${score}  •  Time: ${timeLeft}s`;
  }

  function placeStar() {
    const width = area.clientWidth - 40;
    const height = area.clientHeight - 40;
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    star.style.transform = `translate(${x}px, ${y}px)`;
  }

  function startGame() {
    score = 0;
    timeLeft = 20;
    instructions.textContent = "Tap or click the star before time runs out. It moves every second.";
    updateStatus();
    placeStar();

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      timeLeft -= 1;
      updateStatus();
      placeStar();

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        instructions.textContent = `Time's up! Final score: ${score}`;
      }
    }, 1000);
  }

  startGame();
}

function buildGameHtml(game) {
  const pageStyles = `body { margin: 0; font-family: Inter, system-ui, sans-serif; background: radial-gradient(circle at top, #0a1a2c 0%, #02050d 55%, #000 100%); color: #edf6ff; } .page-shell { max-width: 900px; margin: 0 auto; padding: 24px; } .header { margin-bottom: 20px; } .header h1 { margin: 0 0 8px; } .game-board { min-height: 360px; } .display-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; } .display-board button, .card-grid button { min-height: 100px; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); color: #edf6ff; cursor: pointer; font-size: 1.5rem; } .card-grid { display: grid; grid-template-columns: repeat(3, minmax(80px, 1fr)); gap: 10px; } .score-row { margin-top: 18px; display: flex; justify-content: space-between; gap: 10px; } .runner-area { position: relative; width: 100%; height: 320px; background: rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden; } .runner-item { position: absolute; width: 40px; height: 40px; border-radius: 18px; background: #fb7185; }`; 
  const pageScript = getStandaloneScript(game.id);

  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${escapeHtml(game.title)}</title>\n<style>${pageStyles}</style>\n</head>\n<body>\n<div class="page-shell">\n  <div class="header">\n    <h1>${escapeHtml(game.title)}</h1>\n    <p>${escapeHtml(game.description)}</p>\n  </div>\n  <div class="game-board" id="gameBoard"></div>\n</div>\n<script>${pageScript}</script>\n</body>\n</html>`;
}

function getStandaloneScript(gameId) {
  if (gameId === 'ticTacToe') {
    return ticTacToeStandalone();
  }
  if (gameId === 'memoryMatch') {
    return memoryMatchStandalone();
  }
  if (gameId === 'starDash') {
    return starDashStandalone();
  }
  return '';
}

function ticTacToeStandalone() {
  return `const board = Array(9).fill(''); let currentPlayer = 'X'; let winner = null; const target = document.getElementById('gameBoard'); const status = document.createElement('div'); status.className='score-row'; status.textContent='Current turn: X'; const grid = document.createElement('div'); grid.className='display-board'; const cells = board.map((value,index)=>{ const button=document.createElement('button'); button.textContent=''; button.addEventListener('click',()=>handleMove(index)); grid.appendChild(button); return button; }); const resetButton=document.createElement('button'); resetButton.textContent='Reset Board'; resetButton.addEventListener('click',resetGame); target.append(status,grid,resetButton); function updateStatus(message){status.textContent=message;} function handleMove(index){ if(board[index]||winner)return; board[index]=currentPlayer; cells[index].textContent=currentPlayer; winner=checkWin(); if(winner){updateStatus('Winner: '+winner); return;} if(board.every(Boolean)){updateStatus('Draw!'); return;} currentPlayer=currentPlayer==='X'?'O':'X'; updateStatus('Current turn: '+currentPlayer);} function resetGame(){board.fill(''); winner=null; currentPlayer='X'; cells.forEach(cell=>cell.textContent=''); updateStatus('Current turn: '+currentPlayer);} function checkWin(){ const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const [a,b,c] of lines){ if(board[a]&&board[a]===board[b]&&board[a]===board[c]) return board[a]; } return null; }`;
}

function memoryMatchStandalone() {
  return `const icons=['✨','☄️','🚀','🪐','🌌','🌠']; const target=document.getElementById('gameBoard'); const board=document.createElement('div'); board.className='card-grid'; let firstCard=null; let secondCard=null; let lock=false; let matches=0; const score=document.createElement('div'); score.className='score-row'; score.textContent='Matches: 0 / '+icons.length; function revealCard(card){ if(lock||card===firstCard||card.textContent) return; card.textContent=card.dataset.value; if(!firstCard){ firstCard=card; return; } secondCard=card; lock=true; if(firstCard.dataset.value===secondCard.dataset.value){ matches+=1; score.textContent='Matches: '+matches+' / '+icons.length; resetSelection(); if(matches===icons.length){ score.textContent='All matched! Great work.';} return; } setTimeout(()=>{ firstCard.textContent=''; secondCard.textContent=''; resetSelection(); },800);} function resetSelection(){ firstCard=null; secondCard=null; lock=false;} function shuffle(array){ const copied=array.slice(); for(let i=copied.length-1;i>0;i--){ const j=Math.floor(Math.random()* (i+1)); [copied[i],copied[j]]=[copied[j],copied[i]];} return copied;} function init(){ const cards=shuffle([...icons,...icons]); cards.forEach(value=>{ const card=document.createElement('button'); card.textContent=''; card.dataset.value=value; card.addEventListener('click',()=>revealCard(card)); board.appendChild(card); }); const resetButton=document.createElement('button'); resetButton.textContent='Restart Memory'; resetButton.addEventListener('click',()=>{ target.innerHTML=''; init(); }); target.append(score,board,resetButton); } init();`;
}

function starDashStandalone() {
  return `const target=document.getElementById('gameBoard'); let score=0; let timeLeft=20; let intervalId=null; const scorePanel=document.createElement('div'); scorePanel.className='score-row'; scorePanel.textContent='Score: 0 • Time: 20s'; const area=document.createElement('div'); area.className='runner-area'; const star=document.createElement('div'); star.className='runner-item'; area.appendChild(star); const instructions=document.createElement('p'); instructions.className='runner-guide'; instructions.textContent='Tap or click the star before time runs out. It moves every second.'; const resetButton=document.createElement('button'); resetButton.textContent='Restart Star Dash'; resetButton.addEventListener('click',startGame); area.addEventListener('click',()=>{ score+=1; updateStatus(); }); target.append(scorePanel,area,instructions,resetButton); function updateStatus(){ scorePanel.textContent='Score: '+score+' • Time: '+timeLeft+'s'; } function placeStar(){ const width=area.clientWidth-40; const height=area.clientHeight-40; const x=Math.floor(Math.random()*width); const y=Math.floor(Math.random()*height); star.style.transform='translate('+x+'px, '+y+'px)'; } function startGame(){ score=0; timeLeft=20; instructions.textContent='Tap or click the star before time runs out. It moves every second.'; updateStatus(); placeStar(); if(intervalId) clearInterval(intervalId); intervalId=setInterval(()=>{ timeLeft-=1; updateStatus(); placeStar(); if(timeLeft<=0){ clearInterval(intervalId); instructions.textContent='Time\'s up! Final score: '+score; } },1000);} startGame();`;
}

function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>'"]/g, (match) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[match]));
}

function shuffle(array) {
  const copied = array.slice();
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function renderTicTacToe(target) {
  const board = Array(9).fill('');
  let currentPlayer = 'X';
  let winner = null;

  const status = document.createElement('div');
  status.className = 'game-info';
  status.textContent = `Current turn: ${currentPlayer}`;

  const grid = document.createElement('div');
  grid.className = 'display-board';

  const cells = board.map((value, index) => {
    const button = document.createElement('button');
    button.textContent = '';
    button.addEventListener('click', () => handleMove(index));
    grid.appendChild(button);
    return button;
  });

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Reset Board';
  resetButton.addEventListener('click', resetGame);

  target.append(status, grid, resetButton);

  function updateStatus(message) {
    status.textContent = message;
  }

  function handleMove(index) {
    if (board[index] || winner) return;
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    winner = checkWin();

    if (winner) {
      updateStatus(`Winner: ${winner}`);
      return;
    }

    if (board.every(Boolean)) {
      updateStatus('Draw!');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Current turn: ${currentPlayer}`);
  }

  function resetGame() {
    board.fill('');
    winner = null;
    currentPlayer = 'X';
    cells.forEach((cell) => (cell.textContent = ''));
    updateStatus(`Current turn: ${currentPlayer}`);
  }

  function checkWin() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }
}

function renderMemoryMatch(target) {
  const icons = ['✨', '☄️', '🚀', '🪐', '🌌', '🌠'];
  const cards = shuffle([...icons, ...icons]);
  const board = document.createElement('div');
  board.className = 'card-grid';

  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let matches = 0;

  const score = document.createElement('div');
  score.className = 'score-row';
  score.textContent = `Matches: ${matches} / ${icons.length}`;

  cards.forEach((value) => {
    const card = document.createElement('button');
    card.textContent = '';
    card.dataset.value = value;
    card.addEventListener('click', () => revealCard(card));
    board.appendChild(card);
  });

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Restart Memory';
  resetButton.addEventListener('click', () => {
    target.innerHTML = '';
    renderMemoryMatch(target);
  });

  target.append(score, board, resetButton);

  function revealCard(card) {
    if (lock || card === firstCard || card.textContent) return;

    card.textContent = card.dataset.value;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lock = true;

    if (firstCard.dataset.value === secondCard.dataset.value) {
      matches += 1;
      score.textContent = `Matches: ${matches} / ${icons.length}`;
      resetSelection();

      if (matches === icons.length) {
        score.textContent = 'All matched! Great work.';
      }
      return;
    }

    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetSelection();
    }, 800);
  }

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    lock = false;
  }
}

function renderStarDash(target) {
  let score = 0;
  let timeLeft = 20;
  let intervalId = null;

  const scorePanel = document.createElement('div');
  scorePanel.className = 'score-row';
  scorePanel.textContent = `Score: ${score}  •  Time: ${timeLeft}s`;

  const area = document.createElement('div');
  area.className = 'runner-area';

  const star = document.createElement('div');
  star.className = 'runner-item';
  area.appendChild(star);

  const instructions = document.createElement('p');
  instructions.className = 'runner-guide';
  instructions.textContent = "Tap or click the star before time runs out. It moves every second.";

  const resetButton = document.createElement('button');
  resetButton.className = 'control-button';
  resetButton.textContent = 'Restart Star Dash';
  resetButton.addEventListener('click', startGame);

  area.addEventListener('click', () => {
    score += 1;
    updateStatus();
  });

  target.append(scorePanel, area, instructions, resetButton);

  function updateStatus() {
    scorePanel.textContent = `Score: ${score}  •  Time: ${timeLeft}s`;
  }

  function placeStar() {
    const width = area.clientWidth - 40;
    const height = area.clientHeight - 40;
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    star.style.transform = `translate(${x}px, ${y}px)`;
  }

  function startGame() {
    score = 0;
    timeLeft = 20;
    instructions.textContent = "Tap or click the star before time runs out. It moves every second.";
    updateStatus();
    placeStar();

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      timeLeft -= 1;
      updateStatus();
      placeStar();

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        instructions.textContent = `Time's up! Final score: ${score}`;
      }
    }, 1000);
  }

  startGame();
}

setupGames();
switchTab('proxy');
urlInput.focus();
