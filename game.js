(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const titleScreen = document.getElementById("titleScreen");
  const characterScreen = document.getElementById("characterScreen");
  const gameScreen = document.getElementById("gameScreen");
  const endScreen = document.getElementById("endScreen");
  const startButton = document.getElementById("startButton");
  const continueButton = document.getElementById("continueButton");
  const restartButton = document.getElementById("restartButton");
  const characterGrid = document.getElementById("characterGrid");
  const hpText = document.getElementById("hpText");
  const mpText = document.getElementById("mpText");
  const xpText = document.getElementById("xpText");
  const objective = document.getElementById("objective");
  const toast = document.getElementById("toast");
  const quizModal = document.getElementById("quizModal");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizAnswers = document.getElementById("quizAnswers");
  const quizHint = document.getElementById("quizHint");
  const clearSummary = document.getElementById("clearSummary");
  const attackButton = document.getElementById("attackButton");
  const magicButton = document.getElementById("magicButton");
  const stick = document.getElementById("stick");
  const stickKnob = document.getElementById("stickKnob");

  const W = canvas.width;
  const H = canvas.height;
  const STORAGE_KEY = "tomokaQuestSave";
  const TAU = Math.PI * 2;

  const heroes = [
    {
      id: "prince",
      name: "イケメン剣士 レオン",
      label: "王道・高速剣技",
      desc: "光の斬撃でテンポよく戦える。",
      color: "#69c8ff",
      aura: "#fff08a",
      icon: "剣",
      speed: 190,
      maxHp: 150,
      maxMp: 60,
      attack: 27,
      magic: 42,
      special: "スターライトスラッシュ",
    },
    {
      id: "mira",
      name: "かわいい魔法剣士 ミラ",
      label: "剣と魔法の万能型",
      desc: "回復力と魔法演出が華やか。",
      color: "#ff83c8",
      aura: "#a6fffa",
      icon: "花",
      speed: 180,
      maxHp: 135,
      maxMp: 82,
      attack: 23,
      magic: 52,
      special: "ハートフレア",
    },
    {
      id: "noa",
      name: "闇落ち女子 ノア",
      label: "闇魔法・連続攻撃",
      desc: "黒い渦で敵をまとめて倒す。",
      color: "#9a69ff",
      aura: "#16111f",
      icon: "闇",
      speed: 205,
      maxHp: 128,
      maxMp: 78,
      attack: 25,
      magic: 56,
      special: "ダークムーン",
    },
    {
      id: "shade",
      name: "ダークヒーロー シェイド",
      label: "高火力・大剣",
      desc: "一撃が重く、ボスに強い。",
      color: "#4b5268",
      aura: "#f14972",
      icon: "影",
      speed: 165,
      maxHp: 170,
      maxMp: 52,
      attack: 34,
      magic: 38,
      special: "ブラックインパクト",
    },
    {
      id: "archer",
      name: "弓使い女子 リン",
      label: "遠距離・安全",
      desc: "弓の光弾で距離を取って戦う。",
      color: "#7dff9b",
      aura: "#d7ff6d",
      icon: "弓",
      speed: 198,
      maxHp: 130,
      maxMp: 68,
      attack: 24,
      magic: 44,
      special: "シャイニングアロー",
    },
    {
      id: "kid",
      name: "元気な冒険者 ソラ",
      label: "初心者向け",
      desc: "HPが高く、操作しやすい。",
      color: "#ffb14a",
      aura: "#fff4c7",
      icon: "星",
      speed: 185,
      maxHp: 165,
      maxMp: 64,
      attack: 26,
      magic: 43,
      special: "ブレイブスマッシュ",
    },
  ];

  const enemyCatalog = [
    ["ぷるぷるスライム", "#65d6ff", 26, 11, 8, 6],
    ["毒花モンスター", "#d95d91", 32, 13, 10, 8],
    ["きのこ兵", "#ff8d4f", 30, 12, 10, 8],
    ["ゴブリン", "#79ce5f", 38, 16, 13, 11],
    ["コウモリ", "#775ccf", 24, 15, 11, 10],
    ["トカゲ戦士", "#4fc18b", 44, 19, 17, 15],
    ["宝石カニ", "#57d7d1", 40, 15, 20, 16],
    ["サボテン兵", "#8ccf45", 46, 18, 19, 17],
    ["雪だるま魔人", "#c7f4ff", 48, 18, 22, 18],
    ["闇の騎士", "#38405d", 58, 24, 32, 24],
    ["からくり人形", "#c89c62", 52, 21, 29, 22],
    ["小型ドラゴン", "#e45e41", 62, 26, 35, 28],
  ];

  const quizPool = [
    { q: "8 + 7 = ?", a: ["13", "15", "16"], correct: 1, hint: "8に7をたすよ。" },
    { q: "15 - 6 = ?", a: ["7", "9", "11"], correct: 1, hint: "15から6をひくよ。" },
    { q: "3 x 4 = ?", a: ["7", "12", "14"], correct: 1, hint: "3が4こでいくつかな。" },
    { q: "12 ÷ 3 = ?", a: ["3", "4", "6"], correct: 1, hint: "12を3つに分けるよ。" },
    { q: "「大きい」の反対は?", a: ["小さい", "長い", "明るい"], correct: 0, hint: "サイズの反対のことばだよ。" },
    { q: "「空」に合うことばは?", a: ["青い", "熱い", "重い"], correct: 0, hint: "空の色を思い出してね。" },
    { q: "カタカナで書くことが多いのは?", a: ["りんご", "テレビ", "山"], correct: 1, hint: "外から来たことばに多いよ。" },
    { q: "「山」の読み方は?", a: ["かわ", "やま", "そら"], correct: 1, hint: "高くもり上がった土地だよ。" },
  ];

  const stageNames = ["星の森", "炎の山", "水の神殿", "砂の遺跡", "闇の城"];
  const bossData = [
    ["ツタの大蛇", "#3fb86b", "#bdff69"],
    ["マグマゴーレム", "#d95c32", "#ffcf65"],
    ["アクアドラゴン", "#3aabff", "#cff8ff"],
    ["サンドスコーピオン", "#d3a24d", "#fff06b"],
    ["黒星の魔王", "#27172f", "#ff4c91"],
  ];

  const keys = new Set();
  let audio;
  let last = performance.now();
  let activeQuiz = null;
  let toastTimer = 0;

  const state = {
    screen: "title",
    hero: null,
    player: null,
    stage: 0,
    enemies: [],
    particles: [],
    pickups: [],
    quizCrystals: [],
    boss: null,
    cameraShake: 0,
    time: 0,
    kills: 0,
    rareKills: 0,
    quizzesSolved: 0,
    bossDefeated: 0,
    attackCooldown: 0,
    magicCooldown: 0,
    mobile: { x: 0, y: 0, active: false },
  };

  function showScreen(name) {
    state.screen = name;
    [titleScreen, characterScreen, gameScreen, endScreen].forEach((el) => el.classList.add("hidden"));
    if (name === "title") titleScreen.classList.remove("hidden");
    if (name === "characters") characterScreen.classList.remove("hidden");
    if (name === "game") gameScreen.classList.remove("hidden");
    if (name === "end") endScreen.classList.remove("hidden");
  }

  function setupCharacters() {
    characterGrid.innerHTML = "";
    heroes.forEach((hero) => {
      const button = document.createElement("button");
      button.className = "character-card";
      button.style.setProperty("--hero-gradient", `radial-gradient(circle, ${hero.aura}, ${hero.color})`);
      button.innerHTML = `
        <div class="character-face">${hero.icon}</div>
        <strong>${hero.name}</strong>
        <span>${hero.label}</span>
        <p>${hero.desc}</p>
        <small>必殺: ${hero.special}</small>
      `;
      button.addEventListener("click", () => startGame(hero));
      characterGrid.appendChild(button);
    });
  }

  function startGame(hero, loaded) {
    initAudio();
    const save = loaded || {};
    state.hero = hero;
    state.stage = save.stage || 0;
    state.kills = save.kills || 0;
    state.rareKills = save.rareKills || 0;
    state.quizzesSolved = save.quizzesSolved || 0;
    state.bossDefeated = save.bossDefeated || 0;
    state.player = {
      x: 180,
      y: 300,
      r: 18,
      hp: save.hp || hero.maxHp,
      mp: save.mp || hero.maxMp,
      maxHp: hero.maxHp,
      maxMp: hero.maxMp,
      level: save.level || 1,
      xp: save.xp || 0,
      dirX: 1,
      dirY: 0,
      invuln: 0,
    };
    loadStage(state.stage);
    showScreen("game");
    toastMessage(`${hero.name}の冒険が始まった!`);
    saveGame();
  }

  function loadStage(stage) {
    state.enemies = [];
    state.particles = [];
    state.pickups = [];
    state.quizCrystals = [];
    state.boss = null;
    state.player.x = 150;
    state.player.y = 280;
    const count = 7 + stage * 2;
    for (let i = 0; i < count; i += 1) spawnEnemy(false);
    if (Math.random() < 0.85) spawnEnemy(true);
    state.quizCrystals.push({ x: 470, y: 120, r: 22, solved: false, pulse: 0 });
    state.quizCrystals.push({ x: 760, y: 410, r: 22, solved: false, pulse: 1.7 });
    objective.textContent = `${stageNames[stage]}: クイズ水晶を解き、敵を倒して大型ボスに挑もう`;
  }

  function spawnEnemy(rare) {
    const pick = enemyCatalog[(Math.random() * Math.min(enemyCatalog.length, 5 + state.stage * 2)) | 0];
    state.enemies.push({
      name: rare ? "キラキラスライム" : pick[0],
      x: 280 + Math.random() * 560,
      y: 75 + Math.random() * 390,
      r: rare ? 16 : 14 + Math.random() * 8,
      color: rare ? "#ffe86d" : pick[1],
      hp: rare ? 46 + state.stage * 12 : pick[2] + state.stage * 13,
      maxHp: rare ? 46 + state.stage * 12 : pick[2] + state.stage * 13,
      atk: rare ? 8 : pick[3] + state.stage * 3,
      xp: rare ? 180 + state.stage * 95 : pick[4] + state.stage * 9,
      gold: rare ? 60 : pick[5],
      rare,
      speed: rare ? 140 : 45 + Math.random() * 35 + state.stage * 7,
      hit: 0,
    });
  }

  function spawnBoss() {
    if (state.boss) return;
    const data = bossData[state.stage];
    state.boss = {
      name: data[0],
      x: 735,
      y: 260,
      r: 70 + state.stage * 8,
      color: data[1],
      aura: data[2],
      hp: 360 + state.stage * 170,
      maxHp: 360 + state.stage * 170,
      atk: 20 + state.stage * 8,
      cooldown: 1.2,
      phase: 0,
      hit: 0,
    };
    state.cameraShake = 16;
    burst(state.boss.x, state.boss.y, state.boss.aura, 70, 4);
    playSfx("boss");
    toastMessage(`大型ボス ${state.boss.name} が現れた!`);
  }

  function update(dt) {
    if (state.screen !== "game" || activeQuiz) return;
    state.time += dt;
    state.attackCooldown = Math.max(0, state.attackCooldown - dt);
    state.magicCooldown = Math.max(0, state.magicCooldown - dt);
    state.player.invuln = Math.max(0, state.player.invuln - dt);
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toast.classList.add("hidden");
    }
    updatePlayer(dt);
    updateEnemies(dt);
    updateBoss(dt);
    updateParticles(dt);
    updatePickups(dt);
    updateQuizCrystals(dt);
    if (!state.boss && state.enemies.length <= 2 && state.quizCrystals.every((q) => q.solved)) spawnBoss();
    updateHud();
  }

  function updatePlayer(dt) {
    const p = state.player;
    let mx = 0;
    let my = 0;
    if (keys.has("ArrowLeft") || keys.has("KeyA")) mx -= 1;
    if (keys.has("ArrowRight") || keys.has("KeyD")) mx += 1;
    if (keys.has("ArrowUp") || keys.has("KeyW")) my -= 1;
    if (keys.has("ArrowDown") || keys.has("KeyS")) my += 1;
    mx += state.mobile.x;
    my += state.mobile.y;
    const len = Math.hypot(mx, my) || 1;
    mx /= len;
    my /= len;
    if (Math.hypot(mx, my) > 0.1) {
      p.dirX = mx;
      p.dirY = my;
    }
    p.x = clamp(p.x + mx * state.hero.speed * dt, 32, W - 32);
    p.y = clamp(p.y + my * state.hero.speed * dt, 58, H - 38);
  }

  function updateEnemies(dt) {
    const p = state.player;
    for (const e of state.enemies) {
      e.hit = Math.max(0, e.hit - dt);
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      const d = Math.hypot(dx, dy) || 1;
      const flee = e.rare && d < 170 ? -1 : 1;
      e.x += (dx / d) * e.speed * dt * flee;
      e.y += (dy / d) * e.speed * dt * flee;
      e.x = clamp(e.x, 30, W - 30);
      e.y = clamp(e.y, 55, H - 35);
      if (d < p.r + e.r && p.invuln <= 0) damagePlayer(e.atk);
    }
    state.enemies = state.enemies.filter((e) => e.hp > 0);
  }

  function updateBoss(dt) {
    const b = state.boss;
    if (!b) return;
    b.hit = Math.max(0, b.hit - dt);
    b.phase += dt;
    b.x += Math.sin(b.phase * 1.3) * dt * 42;
    b.y += Math.cos(b.phase * 1.7) * dt * 32;
    b.x = clamp(b.x, 620, 860);
    b.y = clamp(b.y, 145, 410);
    b.cooldown -= dt;
    if (b.cooldown <= 0) {
      b.cooldown = Math.max(0.55, 1.35 - state.stage * 0.12);
      bossAttack(b);
    }
    const d = Math.hypot(state.player.x - b.x, state.player.y - b.y);
    if (d < state.player.r + b.r * 0.72 && state.player.invuln <= 0) damagePlayer(b.atk);
    if (b.hp <= 0) defeatBoss();
  }

  function bossAttack(b) {
    state.cameraShake = 8;
    playSfx("blast");
    for (let i = 0; i < 18; i += 1) {
      const angle = (TAU * i) / 18 + state.time * 0.5;
      state.particles.push({
        type: "hazard",
        x: b.x,
        y: b.y,
        vx: Math.cos(angle) * (115 + state.stage * 18),
        vy: Math.sin(angle) * (115 + state.stage * 18),
        r: 7,
        life: 1.4,
        maxLife: 1.4,
        color: b.aura,
        damage: b.atk * 0.6,
      });
    }
  }

  function updateParticles(dt) {
    for (const p of state.particles) {
      p.life -= dt;
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      if (p.type === "hazard" && p.life > 0) {
        const d = Math.hypot(state.player.x - p.x, state.player.y - p.y);
        if (d < state.player.r + p.r && state.player.invuln <= 0) {
          p.life = 0;
          damagePlayer(p.damage);
        }
      }
    }
    state.particles = state.particles.filter((p) => p.life > 0);
    state.cameraShake = Math.max(0, state.cameraShake - dt * 22);
  }

  function updatePickups(dt) {
    const p = state.player;
    for (const item of state.pickups) {
      item.life -= dt;
      item.y += Math.sin(state.time * 7 + item.x) * dt * 8;
      if (Math.hypot(item.x - p.x, item.y - p.y) < p.r + 18) {
        item.life = 0;
        if (item.type === "heart") {
          p.hp = Math.min(p.maxHp, p.hp + 25);
          toastMessage("ハートでHP回復!");
        } else {
          p.mp = Math.min(p.maxMp, p.mp + 18);
          toastMessage("星のしずくでMP回復!");
        }
        playSfx("pickup");
      }
    }
    state.pickups = state.pickups.filter((item) => item.life > 0);
  }

  function updateQuizCrystals(dt) {
    for (const q of state.quizCrystals) {
      q.pulse += dt * 2.3;
      if (!q.solved && Math.hypot(q.x - state.player.x, q.y - state.player.y) < 52) openQuiz(q);
    }
  }

  function attack() {
    if (state.screen !== "game" || activeQuiz || state.attackCooldown > 0) return;
    state.attackCooldown = 0.36;
    const p = state.player;
    const range = state.hero.id === "archer" ? 145 : 78;
    const cx = p.x + p.dirX * range * 0.55;
    const cy = p.y + p.dirY * range * 0.55;
    slashEffect(cx, cy, state.hero.aura);
    playSfx("slash");
    hitEnemies(cx, cy, range, state.hero.attack + p.level * 4, false);
  }

  function castMagic() {
    if (state.screen !== "game" || activeQuiz || state.magicCooldown > 0) return;
    const p = state.player;
    if (p.mp < 12) {
      toastMessage("MPがたりない!");
      return;
    }
    p.mp -= 12;
    state.magicCooldown = 0.75;
    const cx = p.x + p.dirX * 105;
    const cy = p.y + p.dirY * 105;
    state.cameraShake = 5;
    burst(cx, cy, state.hero.aura, 44, 3.2);
    playSfx("magic");
    hitEnemies(cx, cy, 125, state.hero.magic + p.level * 6, true);
  }

  function hitEnemies(x, y, range, damage, magic) {
    for (const e of state.enemies) {
      if (Math.hypot(e.x - x, e.y - y) < range + e.r) {
        e.hp -= damage;
        e.hit = 0.18;
        burst(e.x, e.y, e.rare ? "#fff3a4" : e.color, magic ? 18 : 10, magic ? 2 : 1.3);
        if (e.hp <= 0) defeatEnemy(e);
      }
    }
    const b = state.boss;
    if (b && Math.hypot(b.x - x, b.y - y) < range + b.r * 0.7) {
      b.hp -= damage * (magic ? 0.88 : 1);
      b.hit = 0.18;
      state.cameraShake = magic ? 10 : 6;
      burst(x, y, b.aura, magic ? 30 : 18, 2.4);
      playSfx("hit");
    }
  }

  function defeatEnemy(e) {
    state.kills += 1;
    if (e.rare) {
      state.rareKills += 1;
      toastMessage("レアモンスター撃破! 大量経験値!");
      state.cameraShake = 12;
    }
    gainXp(e.xp);
    if (Math.random() < 0.28) {
      state.pickups.push({ x: e.x, y: e.y, type: Math.random() < 0.5 ? "heart" : "mp", life: 8 });
    }
    playSfx(e.rare ? "rare" : "hit");
  }

  function defeatBoss() {
    const b = state.boss;
    state.bossDefeated += 1;
    gainXp(160 + state.stage * 85);
    burst(b.x, b.y, b.aura, 120, 5.2);
    state.cameraShake = 22;
    playSfx("clear");
    state.boss = null;
    if (state.stage >= stageNames.length - 1) {
      clearSummary.textContent = `Lv.${state.player.level} / 倒した敵 ${state.kills}体 / レア撃破 ${state.rareKills}体 / クイズ正解 ${state.quizzesSolved}問`;
      localStorage.removeItem(STORAGE_KEY);
      showScreen("end");
      return;
    }
    state.stage += 1;
    toastMessage("クリスタルのかけらを手に入れた! 次のエリアへ!");
    saveGame();
    setTimeout(() => {
      if (state.screen === "game") loadStage(state.stage);
    }, 1300);
  }

  function damagePlayer(amount) {
    const p = state.player;
    p.hp -= Math.round(amount);
    p.invuln = 0.85;
    state.cameraShake = 9;
    burst(p.x, p.y, "#ff5575", 18, 1.8);
    playSfx("damage");
    if (p.hp <= 0) {
      p.hp = Math.ceil(p.maxHp * 0.65);
      p.mp = Math.ceil(p.maxMp * 0.7);
      p.x = 145;
      p.y = 280;
      toastMessage("だいじょうぶ! 少し戻って再挑戦!");
      state.cameraShake = 14;
    }
  }

  function gainXp(amount) {
    const p = state.player;
    p.xp += Math.round(amount);
    let need = p.level * 100;
    while (p.xp >= need) {
      p.xp -= need;
      p.level += 1;
      p.maxHp += 16;
      p.maxMp += 8;
      p.hp = p.maxHp;
      p.mp = p.maxMp;
      need = p.level * 100;
      toastMessage(`レベルアップ! Lv.${p.level}`);
      burst(p.x, p.y, "#fff48a", 70, 3.6);
      playSfx("level");
    }
    saveGame();
  }

  function openQuiz(crystal) {
    activeQuiz = crystal;
    const quiz = quizPool[(Math.random() * quizPool.length) | 0];
    activeQuiz.quiz = quiz;
    quizQuestion.textContent = quiz.q;
    quizHint.textContent = "";
    quizAnswers.innerHTML = "";
    quiz.a.forEach((answer, idx) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => answerQuiz(idx));
      quizAnswers.appendChild(button);
    });
    quizModal.classList.remove("hidden");
    playSfx("quiz");
  }

  function answerQuiz(idx) {
    const quiz = activeQuiz.quiz;
    if (idx === quiz.correct) {
      activeQuiz.solved = true;
      activeQuiz = null;
      quizModal.classList.add("hidden");
      state.quizzesSolved += 1;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 35);
      state.player.mp = Math.min(state.player.maxMp, state.player.mp + 25);
      burst(state.player.x, state.player.y, "#9dffcd", 46, 2.4);
      toastMessage("正解! HPとMPが回復した!");
      playSfx("correct");
      saveGame();
    } else {
      quizHint.textContent = `もう一度! ヒント: ${quiz.hint}`;
      playSfx("wrong");
    }
  }

  function draw() {
    if (state.screen !== "game" || !state.player || !state.hero) return;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    const shakeX = (Math.random() - 0.5) * state.cameraShake;
    const shakeY = (Math.random() - 0.5) * state.cameraShake;
    ctx.translate(shakeX, shakeY);
    drawBackground();
    drawQuizCrystals();
    drawPickups();
    drawEnemies();
    drawBoss();
    drawPlayer();
    drawParticles();
    drawTopUi();
    ctx.restore();
  }

  function drawBackground() {
    const gradients = [
      ["#173b2f", "#2e6c54", "#6cc36d"],
      ["#392116", "#8c3e23", "#ff9452"],
      ["#173150", "#226e92", "#80e0ff"],
      ["#4b351c", "#a77932", "#ffe28a"],
      ["#15101f", "#2b1838", "#a83f86"],
    ][state.stage] || ["#173b2f", "#2e6c54", "#6cc36d"];
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, gradients[0]);
    g.addColorStop(0.62, gradients[1]);
    g.addColorStop(1, gradients[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.23;
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 137 + state.stage * 79) % W;
      const y = 60 + ((i * 83) % (H - 110));
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 4), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, H - 34, W, 34);
  }

  function drawPlayer() {
    const p = state.player;
    ctx.save();
    if (p.invuln > 0) ctx.globalAlpha = 0.55 + Math.sin(state.time * 45) * 0.25;
    ctx.shadowColor = state.hero.aura;
    ctx.shadowBlur = 20;
    ctx.fillStyle = state.hero.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(p.x + p.dirX * 8 - 5, p.y - 5, 3, 0, TAU);
    ctx.arc(p.x + p.dirX * 8 + 5, p.y - 5, 3, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = state.hero.aura;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.dirX * 30, p.y + p.dirY * 30);
    ctx.stroke();
    ctx.restore();
  }

  function drawEnemies() {
    for (const e of state.enemies) {
      ctx.save();
      ctx.shadowColor = e.rare ? "#fff8a6" : e.color;
      ctx.shadowBlur = e.rare ? 22 : 8;
      ctx.fillStyle = e.hit > 0 ? "#fff" : e.color;
      if (e.rare) {
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const a = (TAU * i) / 10;
          const r = i % 2 ? e.r * 0.75 : e.r * 1.25;
          ctx.lineTo(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, TAU);
        ctx.fill();
      }
      drawHpBar(e.x, e.y - e.r - 12, e.hp / e.maxHp, 38);
      ctx.restore();
    }
  }

  function drawBoss() {
    const b = state.boss;
    if (!b) return;
    ctx.save();
    ctx.shadowColor = b.aura;
    ctx.shadowBlur = 36;
    ctx.fillStyle = b.hit > 0 ? "#fff" : b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = b.aura;
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.fillStyle = b.aura;
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.14, 9, 0, TAU);
    ctx.arc(b.x + b.r * 0.28, b.y - b.r * 0.14, 9, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.name, b.x, b.y - b.r - 28);
    drawHpBar(b.x, b.y - b.r - 18, b.hp / b.maxHp, 190);
    ctx.restore();
  }

  function drawQuizCrystals() {
    for (const q of state.quizCrystals) {
      ctx.save();
      ctx.globalAlpha = q.solved ? 0.35 : 1;
      const r = q.r + Math.sin(q.pulse) * 4;
      ctx.shadowColor = "#a6f7ff";
      ctx.shadowBlur = 18;
      ctx.fillStyle = q.solved ? "#7c849e" : "#9de8ff";
      ctx.beginPath();
      ctx.moveTo(q.x, q.y - r);
      ctx.lineTo(q.x + r, q.y);
      ctx.lineTo(q.x, q.y + r);
      ctx.lineTo(q.x - r, q.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPickups() {
    for (const item of state.pickups) {
      ctx.save();
      ctx.shadowColor = item.type === "heart" ? "#ff80a5" : "#8bd7ff";
      ctx.shadowBlur = 14;
      ctx.fillStyle = item.type === "heart" ? "#ff5d8f" : "#69c8ff";
      ctx.beginPath();
      ctx.arc(item.x, item.y, 11, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.type === "heart" ? "+" : "M", item.x, item.y + 5);
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const p of state.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 22;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 + (1 - alpha) * 1.8), 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawTopUi() {
    ctx.fillStyle = "rgba(7, 11, 23, 0.62)";
    ctx.fillRect(12, 12, 306, 38);
    ctx.fillStyle = "#ffe17a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`ともかクエスト - ${stageNames[state.stage]}`, 26, 37);
    if (!state.boss && state.quizCrystals.every((q) => q.solved)) {
      ctx.fillStyle = "#fff";
      ctx.fillText("敵をあと少し倒すとボス出現!", 650, 37);
    }
  }

  function drawHpBar(x, y, ratio, width) {
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(x - width / 2, y, width, 6);
    ctx.fillStyle = ratio > 0.35 ? "#78ff8e" : "#ff5d76";
    ctx.fillRect(x - width / 2, y, width * clamp(ratio, 0, 1), 6);
  }

  function slashEffect(x, y, color) {
    for (let i = 0; i < 24; i += 1) {
      const a = state.time * 8 + (TAU * i) / 24;
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * (40 + i * 4),
        vy: Math.sin(a) * (40 + i * 4),
        r: 4 + (i % 3),
        life: 0.34,
        maxLife: 0.34,
        color,
      });
    }
  }

  function burst(x, y, color, count, power) {
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * TAU;
      const speed = (40 + Math.random() * 90) * power;
      const life = 0.45 + Math.random() * 0.55;
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: 2 + Math.random() * 6,
        life,
        maxLife: life,
        color,
      });
    }
  }

  function updateHud() {
    const p = state.player;
    hpText.textContent = `${Math.max(0, Math.round(p.hp))}/${p.maxHp}`;
    mpText.textContent = `${Math.round(p.mp)}/${p.maxMp}`;
    xpText.textContent = `Lv.${p.level} ${p.xp}/${p.level * 100}`;
  }

  function toastMessage(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    toastTimer = 2.8;
  }

  function saveGame() {
    if (!state.hero || !state.player) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        heroId: state.hero.id,
        stage: state.stage,
        hp: state.player.hp,
        mp: state.player.mp,
        level: state.player.level,
        xp: state.player.xp,
        kills: state.kills,
        rareKills: state.rareKills,
        quizzesSolved: state.quizzesSolved,
        bossDefeated: state.bossDefeated,
      }),
    );
  }

  function loadGame() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      toastMessage("セーブデータがありません。");
      return false;
    }
    try {
      const data = JSON.parse(raw);
      const hero = heroes.find((h) => h.id === data.heroId) || heroes[0];
      startGame(hero, data);
      return true;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
  }

  function initAudio() {
    if (audio) {
      audio.ensure();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      audio = { ensure() {}, sfx() {} };
      return;
    }
    const ac = new AudioCtx();
    let musicTimer = null;
    let step = 0;
    const notes = [262, 330, 392, 523, 494, 392, 330, 294];
    function tone(freq, dur, type, gain, when) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, when);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(when);
      osc.stop(when + dur + 0.03);
    }
    audio = {
      ensure() {
        if (ac.state === "suspended") ac.resume();
        if (!musicTimer) {
          musicTimer = setInterval(() => {
            if (state.screen !== "game") return;
            const now = ac.currentTime;
            tone(notes[step % notes.length], 0.22, "triangle", 0.025, now);
            tone(notes[(step + 2) % notes.length] / 2, 0.32, "sine", 0.018, now);
            step += 1;
          }, 330);
        }
      },
      sfx(kind) {
        if (ac.state === "suspended") return;
        const now = ac.currentTime;
        const map = {
          slash: [520, 0.08, "sawtooth", 0.06],
          magic: [740, 0.22, "triangle", 0.06],
          hit: [180, 0.09, "square", 0.05],
          damage: [110, 0.16, "sawtooth", 0.05],
          rare: [980, 0.28, "sine", 0.08],
          level: [660, 0.32, "triangle", 0.08],
          correct: [880, 0.18, "sine", 0.08],
          wrong: [140, 0.2, "square", 0.035],
          pickup: [620, 0.12, "sine", 0.055],
          quiz: [440, 0.12, "triangle", 0.04],
          boss: [92, 0.55, "sawtooth", 0.08],
          blast: [155, 0.22, "square", 0.04],
          clear: [1046, 0.55, "triangle", 0.09],
        };
        const args = map[kind] || map.hit;
        tone(args[0], args[1], args[2], args[3], now);
        if (kind === "magic" || kind === "clear") tone(args[0] * 1.5, args[1] * 0.8, "sine", args[3] * 0.65, now + 0.04);
      },
    };
    audio.ensure();
  }

  function playSfx(kind) {
    if (audio) audio.sfx(kind);
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function bindInput() {
    window.addEventListener("keydown", (event) => {
      keys.add(event.code);
      if (event.code === "Space") {
        event.preventDefault();
        attack();
      }
      if (event.code === "KeyQ") castMagic();
    });
    window.addEventListener("keyup", (event) => keys.delete(event.code));
    canvas.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") attack();
    });
    attackButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      attack();
    });
    magicButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      castMagic();
    });
    stick.addEventListener("pointerdown", startStick);
    stick.addEventListener("pointermove", moveStick);
    stick.addEventListener("pointerup", endStick);
    stick.addEventListener("pointercancel", endStick);
  }

  function startStick(event) {
    state.mobile.active = true;
    stick.setPointerCapture(event.pointerId);
    moveStick(event);
  }

  function moveStick(event) {
    if (!state.mobile.active) return;
    const rect = stick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const max = rect.width * 0.34;
    const len = Math.min(max, Math.hypot(dx, dy));
    const a = Math.atan2(dy, dx);
    const x = Math.cos(a) * len;
    const y = Math.sin(a) * len;
    stickKnob.style.transform = `translate(${x}px, ${y}px)`;
    state.mobile.x = x / max;
    state.mobile.y = y / max;
  }

  function endStick() {
    state.mobile.active = false;
    state.mobile.x = 0;
    state.mobile.y = 0;
    stickKnob.style.transform = "translate(0, 0)";
  }

  startButton.addEventListener("click", () => {
    initAudio();
    showScreen("characters");
  });
  continueButton.addEventListener("click", () => {
    initAudio();
    if (!loadGame()) showScreen("characters");
  });
  restartButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    showScreen("characters");
  });

  setupCharacters();
  bindInput();
  showScreen("title");
  requestAnimationFrame(loop);
})();
