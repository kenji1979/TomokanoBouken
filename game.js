(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
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
  const quizTitle = document.getElementById("quizTitle");
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
      id: "blue-swordsman",
      name: "イケメン剣士 レオン",
      label: "青髪・赤マント・王道剣士",
      desc: "青い髪と赤いマントの主人公。軽快な剣さばきで前線を切り開く。",
      color: "#3d8dff",
      aura: "#fff08a",
      speed: 195,
      maxHp: 152,
      maxMp: 58,
      attack: 28,
      magic: 40,
      special: "スターライトスラッシュ",
      icon: "剣",
      spriteKey: "blue-swordsman",
      design: {
        skin: "#f0b58c",
        hair: "#1f69c8",
        hair2: "#79d2ff",
        outfit: "#2e75d6",
        cape: "#b83232",
        accent: "#ffd75a",
        eyes: "#1b4eff",
        weapon: "sword",
        mood: "brave",
        trim: "#d9ecff",
      },
    },
    {
      id: "red-silver-sword",
      name: "イケメン銀剣士 アレン",
      label: "赤髪・銀剣・技巧派",
      desc: "赤い髪と白銀の剣が目印。リーチの長い連撃が得意。",
      color: "#e85858",
      aura: "#e9f3ff",
      speed: 188,
      maxHp: 146,
      maxMp: 64,
      attack: 30,
      magic: 42,
      special: "シルバーレイヴ",
      icon: "銀",
      spriteKey: "red-silver-sword",
      design: {
        skin: "#f4bd96",
        hair: "#d43b3b",
        hair2: "#ff8b72",
        outfit: "#7c4ad8",
        cape: "#f0e8ff",
        accent: "#f5f8ff",
        eyes: "#6d33ff",
        weapon: "longsword",
        mood: "cool",
        trim: "#ffd76b",
      },
    },
    {
      id: "pink-mage-sword",
      name: "かわいい女子魔法剣士 ルル",
      label: "桃髪・花飾り・魔法剣",
      desc: "花のような衣装の魔法剣士。かわいさと魔法火力を両立する。",
      color: "#ff78bd",
      aura: "#ffd7f1",
      speed: 181,
      maxHp: 136,
      maxMp: 86,
      attack: 23,
      magic: 54,
      special: "ハートフレア",
      icon: "花",
      spriteKey: "pink-mage-sword",
      design: {
        skin: "#ffd0aa",
        hair: "#ef5fae",
        hair2: "#ffd56f",
        outfit: "#f0529f",
        cape: "#72d86f",
        accent: "#ffe46b",
        eyes: "#8a35ff",
        weapon: "wandblade",
        mood: "smile",
        trim: "#ffffff",
      },
    },
    {
      id: "blonde-mage-sword",
      name: "かわいい女子魔法剣士 ティナ",
      label: "金髪ツイン・杖剣・回復寄り",
      desc: "明るい金髪とピンクの杖剣。仲間を支えながら戦える。",
      color: "#ffb7d9",
      aura: "#a6fffa",
      speed: 176,
      maxHp: 132,
      maxMp: 92,
      attack: 21,
      magic: 58,
      special: "プリズムブルーム",
      icon: "杖",
      spriteKey: "blonde-mage-sword",
      design: {
        skin: "#ffd6b0",
        hair: "#f3c65b",
        hair2: "#fff2a8",
        outfit: "#ff8ac8",
        cape: "#f9fff5",
        accent: "#56e3d8",
        eyes: "#278cff",
        weapon: "wand",
        mood: "smile",
        trim: "#7eea78",
      },
    },
    {
      id: "fallen-girl",
      name: "闇落ち女子 ノア",
      label: "紫髪・闇オーラ・双刃",
      desc: "闇の力をまとった少女。紫の残像を出しながら素早く斬る。",
      color: "#9a69ff",
      aura: "#20112f",
      speed: 208,
      maxHp: 128,
      maxMp: 80,
      attack: 26,
      magic: 58,
      special: "ダークムーン",
      icon: "闇",
      spriteKey: "fallen-girl",
      design: {
        skin: "#e8bca1",
        hair: "#7432a8",
        hair2: "#ef62ff",
        outfit: "#261436",
        cape: "#090712",
        accent: "#ff4c91",
        eyes: "#f149ff",
        weapon: "dagger",
        mood: "dark",
        trim: "#7440ff",
      },
    },
    {
      id: "dark-hero",
      name: "ダークヒーロー グレイヴ",
      label: "黒鎧・大剣・重火力",
      desc: "重い黒鎧と大剣を持つ影の英雄。遅いが一撃が強い。",
      color: "#4b5268",
      aura: "#f14972",
      speed: 164,
      maxHp: 174,
      maxMp: 52,
      attack: 36,
      magic: 38,
      special: "ブラックインパクト",
      icon: "鎧",
      spriteKey: "dark-hero",
      design: {
        skin: "#b9876b",
        hair: "#121722",
        hair2: "#6f748a",
        outfit: "#202738",
        cape: "#070911",
        accent: "#ff355f",
        eyes: "#ff445f",
        weapon: "greatsword",
        mood: "cool",
        trim: "#7f879c",
      },
    },
    {
      id: "boy-adventurer",
      name: "元気な少年冒険者 ソラ",
      label: "茶髪・青服・初心者向け",
      desc: "青い冒険服の少年。扱いやすく、連続攻撃も素直に出せる。",
      color: "#56b9ff",
      aura: "#fff4c7",
      speed: 186,
      maxHp: 166,
      maxMp: 64,
      attack: 27,
      magic: 43,
      special: "ブレイブスマッシュ",
      icon: "星",
      spriteKey: "boy-adventurer",
      design: {
        skin: "#f0b489",
        hair: "#b45f2c",
        hair2: "#ffb14a",
        outfit: "#45a7e8",
        cape: "#ffe39a",
        accent: "#ef7135",
        eyes: "#2f7cff",
        weapon: "shortsword",
        mood: "smile",
        trim: "#ffffff",
      },
    },
    {
      id: "cool-archer",
      name: "クールな弓使い女子 リン",
      label: "黒フード・弓・遠距離",
      desc: "黒いフードと弓を使うクールな女子。距離を取りながら戦う。",
      color: "#526071",
      aura: "#d7ff6d",
      speed: 198,
      maxHp: 132,
      maxMp: 70,
      attack: 25,
      magic: 44,
      special: "シャイニングアロー",
      icon: "弓",
      spriteKey: "cool-archer",
      design: {
        skin: "#d0a080",
        hair: "#252a38",
        hair2: "#59627c",
        outfit: "#2f3548",
        cape: "#111521",
        accent: "#a9ff5f",
        eyes: "#76ffcf",
        weapon: "bow",
        mood: "focus",
        trim: "#7d879d",
      },
    },
    {
      id: "rose-archer",
      name: "クールアーチャー ロゼ",
      label: "桃鎧・弓剣・派手エフェクト",
      desc: "ピンクの鎧と大きな弓剣を使う華やかなアーチャー。",
      color: "#ff6fc0",
      aura: "#ffef7a",
      speed: 192,
      maxHp: 140,
      maxMp: 76,
      attack: 26,
      magic: 50,
      special: "ローズシュート",
      icon: "矢",
      spriteKey: "rose-archer",
      design: {
        skin: "#ffd0aa",
        hair: "#e85b9f",
        hair2: "#ffc0ea",
        outfit: "#bd4fb4",
        cape: "#31234a",
        accent: "#ffd75a",
        eyes: "#5a40ff",
        weapon: "bowblade",
        mood: "cool",
        trim: "#ffffff",
      },
    },
  ];

  const enemyCatalog = [
    ["スライム", "#65d6ff", 26, 11, 8, 6, "slime"],
    ["黄金キノコ", "#ff8d4f", 30, 12, 10, 8, "mushroom"],
    ["ゴブリン", "#79ce5f", 38, 16, 13, 11, "goblin"],
    ["バット", "#775ccf", 24, 15, 11, 10, "bat"],
    ["ウルフ", "#9aa4b8", 34, 17, 13, 12, "wolf"],
    ["ゴーレム", "#a88b69", 58, 22, 26, 20, "golem"],
    ["ゴースト", "#e8ecff", 28, 16, 14, 12, "ghost"],
    ["ミミック", "#b57542", 42, 20, 22, 18, "mimic"],
    ["リザード戦士", "#4fc18b", 44, 19, 17, 15, "lizard"],
    ["ビースマーム", "#a3d847", 36, 20, 19, 16, "bee"],
    ["カクタス兵", "#8ccf45", 46, 18, 19, 17, "cactus"],
    ["スノーマン魔物", "#c7f4ff", 48, 18, 22, 18, "snowman"],
    ["小型ドラゴン", "#e45e41", 62, 26, 35, 28, "dragon"],
    ["ダークナイト", "#38405d", 58, 24, 32, 24, "knight"],
    ["魔女モンスター", "#8d4ed8", 44, 22, 28, 22, "mage"],
    ["ジェムカニ", "#57d7d1", 40, 15, 20, 16, "crab"],
    ["ドール", "#c89c62", 52, 21, 29, 22, "doll"],
    ["毒花モンスター", "#d95d91", 32, 13, 10, 8, "flower"],
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

  const stageNames = ["ツタの森", "溶岩洞窟", "水晶湖", "砂の遺跡", "黒星の宮殿"];
  const bossData = [
    ["ツタの大蛇", "#3fb86b", "#bdff69"],
    ["マグマゴーレム", "#d95c32", "#ffcf65"],
    ["アクアドラゴン", "#3aabff", "#cff8ff"],
    ["サンドスコーピオン", "#d3a24d", "#fff06b"],
    ["黒星の魔王", "#27172f", "#ff4c91"],
  ];

  const assetLibrary = {
    image: new Image(),
    ready: false,
    failed: false,
  };
  assetLibrary.image.onload = () => {
    assetLibrary.ready = true;
    setupCharacters();
  };
  assetLibrary.image.onerror = () => {
    assetLibrary.failed = true;
  };
  assetLibrary.image.src = "assets/asset-library.jpg";

  const heroSprites = {
    "blue-swordsman": { x: 55, y: 143, w: 55, h: 87 },
    "red-silver-sword": { x: 296, y: 142, w: 62, h: 88 },
    "pink-mage-sword": { x: 293, y: 270, w: 55, h: 88 },
    "blonde-mage-sword": { x: 369, y: 269, w: 58, h: 88 },
    "fallen-girl": { x: 296, y: 397, w: 58, h: 88 },
    "dark-hero": { x: 47, y: 528, w: 66, h: 88 },
    "boy-adventurer": { x: 48, y: 643, w: 62, h: 86 },
    "cool-archer": { x: 48, y: 758, w: 59, h: 88 },
    "rose-archer": { x: 296, y: 757, w: 62, h: 88 },
  };

  const enemySprites = {
    slime: { x: 548, y: 126, w: 62, h: 66 },
    mushroom: { x: 626, y: 126, w: 62, h: 66 },
    goblin: { x: 700, y: 125, w: 64, h: 68 },
    bat: { x: 770, y: 126, w: 58, h: 66 },
    wolf: { x: 846, y: 126, w: 64, h: 66 },
    golem: { x: 923, y: 123, w: 68, h: 70 },
    ghost: { x: 550, y: 216, w: 64, h: 68 },
    mimic: { x: 625, y: 215, w: 64, h: 70 },
    lizard: { x: 699, y: 215, w: 66, h: 70 },
    bee: { x: 774, y: 215, w: 58, h: 70 },
    cactus: { x: 849, y: 215, w: 64, h: 70 },
    snowman: { x: 925, y: 215, w: 66, h: 70 },
    dragon: { x: 550, y: 296, w: 66, h: 70 },
    knight: { x: 625, y: 296, w: 66, h: 70 },
    mage: { x: 699, y: 296, w: 68, h: 70 },
    crab: { x: 775, y: 296, w: 56, h: 70 },
    doll: { x: 849, y: 296, w: 54, h: 70 },
    flower: { x: 923, y: 296, w: 68, h: 70 },
    rareSlime: { x: 560, y: 407, w: 55, h: 54 },
    rareMushroom: { x: 704, y: 405, w: 62, h: 58 },
    rareRabbit: { x: 857, y: 396, w: 55, h: 60 },
  };

  const bossSprites = [
    { x: 548, y: 500, w: 145, h: 88 },
    { x: 706, y: 500, w: 145, h: 86 },
    { x: 706, y: 500, w: 145, h: 86 },
    { x: 866, y: 497, w: 132, h: 92 },
    { x: 552, y: 637, w: 132, h: 72 },
    { x: 558, y: 750, w: 120, h: 72 },
  ];

  const effectSprites = {
    slash: { x: 834, y: 812, w: 48, h: 54 },
    dark: { x: 890, y: 812, w: 48, h: 54 },
    burst: { x: 947, y: 812, w: 48, h: 54 },
  };

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
    boss: null,
    cameraShake: 0,
    time: 0,
    kills: 0,
    rareKills: 0,
    quizzesSolved: 0,
    bossDefeated: 0,
    attackCooldown: 0,
    attackTimer: 0,
    attackDuration: 0.32,
    attackAngle: 0,
    attackCombo: 0,
    magicCooldown: 0,
    magicTimer: 0,
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
        <canvas class="character-face" width="120" height="120" aria-hidden="true"></canvas>
        <strong>${hero.name}</strong>
        <span>${hero.label}</span>
        <p>${hero.desc}</p>
        <small>必殺: ${hero.special}</small>
      `;
      button.addEventListener("click", () => startGame(hero));
      characterGrid.appendChild(button);
      drawHeroPortrait(button.querySelector("canvas").getContext("2d"), hero, 1);
    });
  }

  function refreshCharacterPortraits() {
    characterGrid.querySelectorAll(".character-card canvas").forEach((canvasEl, index) => {
      drawHeroPortrait(canvasEl.getContext("2d"), heroes[index], 1);
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
    state.boss = null;
    state.player.x = 150;
    state.player.y = 280;
    const count = 7 + stage * 2;
    for (let i = 0; i < count; i += 1) spawnEnemy(false);
    if (Math.random() < 0.85) spawnEnemy(true);
    objective.textContent = `${stageNames[stage]}: 敵を倒して大型ボスに挑もう。クイズはステージクリア時だけ!`;
  }

  function spawnEnemy(rare) {
    const pick = enemyCatalog[(Math.random() * Math.min(enemyCatalog.length, 5 + state.stage * 2)) | 0];
    const enemyName = rare ? "キラキラスライム" : pick[0];
    state.enemies.push({
      name: enemyName,
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
      spriteKey: getEnemySpriteKey(enemyName, rare),
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
    state.attackTimer = Math.max(0, state.attackTimer - dt);
    state.magicCooldown = Math.max(0, state.magicCooldown - dt);
    state.magicTimer = Math.max(0, state.magicTimer - dt);
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
    if (!state.boss && state.enemies.length <= 2) spawnBoss();
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

  function attack() {
    if (state.screen !== "game" || activeQuiz || state.attackCooldown > 0) return;
    state.attackDuration = state.hero.design.weapon === "greatsword" ? 0.42 : 0.32;
    state.attackCooldown = state.attackDuration * 0.82;
    state.attackTimer = state.attackDuration;
    state.attackCombo = (state.attackCombo + 1) % 3;
    const p = state.player;
    const baseAngle = Math.atan2(p.dirY, p.dirX);
    state.attackAngle = baseAngle;
    const ranged = state.hero.design.weapon === "bow" || state.hero.design.weapon === "bowblade";
    const range = ranged ? 160 : state.hero.design.weapon === "greatsword" ? 108 : 88;
    const cx = p.x + p.dirX * range * 0.52;
    const cy = p.y + p.dirY * range * 0.52;
    slashEffect(p.x, p.y, baseAngle, range, state.hero.aura, state.hero.design.weapon);
    lungeEffect(p.x, p.y, baseAngle, state.hero.design.accent);
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
    state.magicTimer = 0.55;
    const cx = p.x + p.dirX * 105;
    const cy = p.y + p.dirY * 105;
    state.cameraShake = 7;
    magicCastEffect(p.x, p.y, cx, cy, state.hero.aura);
    burst(cx, cy, state.hero.aura, 54, 3.4);
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
    toastMessage("ボス撃破! クリスタルの封印クイズに答えよう!");
    setTimeout(() => {
      if (state.screen === "game") openStageQuiz();
    }, 700);
  }

  function advanceStageAfterQuiz() {
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
    }, 1100);
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

  function openStageQuiz() {
    const quiz = quizPool[(Math.random() * quizPool.length) | 0];
    activeQuiz = { kind: "stageEnd", quiz };
    quizTitle.textContent = `${stageNames[state.stage]} クリアクイズ`;
    quizQuestion.textContent = quiz.q;
    quizHint.textContent = "正解すると次のステージへ進めるよ。";
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
    if (!activeQuiz) return;
    const quiz = activeQuiz.quiz;
    if (idx === quiz.correct) {
      const kind = activeQuiz.kind;
      activeQuiz = null;
      quizModal.classList.add("hidden");
      state.quizzesSolved += 1;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 45);
      state.player.mp = Math.min(state.player.maxMp, state.player.mp + 32);
      burst(state.player.x, state.player.y, "#9dffcd", 56, 2.8);
      toastMessage("正解! クリスタルの道が開いた!");
      playSfx("correct");
      if (kind === "stageEnd") advanceStageAfterQuiz();
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
    drawPickups();
    drawEnemies();
    drawBoss();
    drawParty();
    drawParticles();
    drawTopUi();
    ctx.restore();
  }

  function drawBackground() {
    const palettes = [
      ["#2f9b4e", "#5cca54", "#b7e970"],
      ["#46a866", "#72d85b", "#d4ed7a"],
      ["#733b27", "#b45733", "#f2a15b"],
      ["#2389a8", "#55c5ca", "#bdf7ec"],
      ["#bd8540", "#e7b45f", "#ffe29a"],
      ["#251738", "#503068", "#b05091"],
    ];
    const palette = palettes[state.stage] || palettes[0];
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, palette[0]);
    g.addColorStop(0.55, palette[1]);
    g.addColorStop(1, palette[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    drawTileTexture(state.stage);
    drawPathNetwork(state.stage);
    drawStageLandmarks(state.stage);
    drawForegroundDetails(state.stage);
  }

  function drawTileTexture(stage) {
    ctx.save();
    const grassA = stage === 5 ? "rgba(90, 65, 120, 0.38)" : stage === 4 ? "rgba(255, 236, 150, 0.34)" : "rgba(25, 125, 56, 0.28)";
    const grassB = stage === 5 ? "rgba(25, 15, 40, 0.35)" : stage === 4 ? "rgba(180, 120, 45, 0.24)" : "rgba(190, 255, 112, 0.24)";
    for (let y = 44; y < H; y += 12) {
      for (let x = 0; x < W; x += 12) {
        const n = (x * 17 + y * 31 + state.stage * 47) % 7;
        ctx.fillStyle = n < 3 ? grassA : grassB;
        ctx.fillRect(x + (n % 3), y + (n % 2), 5, 2);
      }
    }
    ctx.restore();
  }

  function drawPathNetwork(stage) {
    ctx.save();
    const path = stage === 4 ? "#d89d56" : stage === 2 ? "#6f3c2c" : stage === 5 ? "#4c385d" : "#b8895b";
    const edge = stage === 4 ? "#f5cf87" : stage === 5 ? "#2a1d35" : "#6b4b34";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = edge;
    ctx.lineWidth = 78;
    drawPathStroke();
    ctx.strokeStyle = path;
    ctx.lineWidth = 58;
    drawPathStroke();
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#f7dba0";
    ctx.lineWidth = 10;
    drawPathStroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawPathStroke() {
    ctx.beginPath();
    ctx.moveTo(-30, 345);
    ctx.bezierCurveTo(170, 280, 255, 394, 420, 316);
    ctx.bezierCurveTo(552, 250, 685, 322, 980, 210);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(455, -30);
    ctx.bezierCurveTo(432, 135, 510, 212, 430, 316);
    ctx.bezierCurveTo(350, 425, 405, 495, 380, 570);
    ctx.stroke();
  }

  function drawStageLandmarks(stage) {
    if (stage === 0) drawForest();
    else if (stage === 1) drawGrassland();
    else if (stage === 2) drawVolcano();
    else if (stage === 3) drawLakeTemple();
    else if (stage === 4) drawDesertKingdom();
    else drawDarkCastle();
  }

  function drawForest() {
    drawWater(120, 450, 145, 52, "#4fb7bf");
    drawCliff(700, 82, 210, 150);
    for (let i = 0; i < 28; i += 1) {
      const x = (i * 67 + 18) % W;
      const y = 65 + ((i * 97) % 380);
      if (Math.abs(x - 430) < 70 && y > 100 && y < 430) continue;
      drawCanopyTree(x, y, 0.8 + (i % 4) * 0.12, i % 2 ? "#1f8d47" : "#35b957", i % 3 === 0 ? "#b8ff5f" : "#0f6f3b");
    }
    drawGiantStump(308, 110, 1.1);
    drawFlowerPatch(575, 150, "#ffcc5d", 10);
    drawFlowerPatch(690, 405, "#ff71c7", 8);
  }

  function drawGrassland() {
    drawWater(780, 90, 105, 36, "#57b7c9");
    drawWindmill(150, 112);
    for (let i = 0; i < 46; i += 1) {
      drawGrassTuft((i * 53 + 20) % W, 65 + ((i * 61) % 415), i % 2 ? "#d8ff71" : "#77e75b");
    }
    drawFlowerPatch(520, 120, "#fff06b", 12);
    drawFlowerPatch(815, 405, "#ff9ad6", 9);
    drawCloud(620, 88, 1.15);
    drawCloud(820, 128, 0.85);
  }

  function drawVolcano() {
    drawMountain(760, 205, 190, "#4a241f", "#ff6b35");
    drawMountain(112, 174, 135, "#5b2c22", "#ffb13b");
    for (let i = 0; i < 16; i += 1) drawLavaCrack(38 + i * 62, 95 + ((i * 47) % 380));
    drawRockCluster(330, 115, 8, "#6d5148");
    drawRockCluster(640, 415, 10, "#49322f");
  }

  function drawLakeTemple() {
    drawWater(650, 285, 265, 120, "#5fd0dd");
    drawTemple(188, 126, "#e6fbff");
    drawCrystal(470, 138, "#bdf7ff");
    drawRockCluster(775, 402, 9, "#8ab7b9");
    drawFlowerPatch(340, 390, "#8ff0ff", 10);
  }

  function drawDesertKingdom() {
    for (let i = 0; i < 10; i += 1) drawDune(60 + i * 108, 420 - (i % 3) * 34);
    drawPyramid(740, 145, 158);
    drawPyramid(150, 170, 112);
    for (let i = 0; i < 13; i += 1) drawCactus(78 + i * 75, 118 + ((i * 61) % 315));
    drawRockCluster(512, 112, 7, "#c99659");
  }

  function drawDarkCastle() {
    drawCastle(690, 124);
    for (let i = 0; i < 24; i += 1) drawThorn(30 + i * 42, 85 + ((i * 71) % 400));
    drawCrystal(235, 392, "#ff4c91");
    drawWater(120, 450, 130, 45, "#4c236a");
    ctx.save();
    ctx.globalAlpha = 0.17;
    ctx.fillStyle = "#08040d";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawForegroundDetails(stage) {
    for (let i = 0; i < 38; i += 1) {
      const x = (i * 89 + 37) % W;
      const y = 70 + ((i * 43) % 410);
      if (stage === 4) drawPebble(x, y, "#b8793d");
      else if (stage === 5) drawPebble(x, y, "#1b1025");
      else if (i % 3 === 0) drawFlower(x, y, i % 2 ? "#ffd75a" : "#ff7ecb");
      else drawGrassTuft(x, y, "rgba(205,255,112,0.8)");
    }
    drawMiniMap();
  }

  function drawMiniMap() {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "rgba(255, 238, 190, 0.2)";
    ctx.strokeStyle = "rgba(255, 238, 190, 0.65)";
    ctx.lineWidth = 2;
    ctx.fillRect(W - 128, 14, 108, 78);
    ctx.strokeRect(W - 128, 14, 108, 78);
    ctx.fillStyle = "rgba(90, 220, 100, 0.55)";
    for (let i = 0; i < 10; i += 1) ctx.fillRect(W - 120 + ((i * 17) % 90), 22 + ((i * 29) % 58), 18, 13);
    ctx.fillStyle = "#44d8ff";
    ctx.beginPath();
    ctx.arc(W - 73, 53, 11, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ff5d76";
    ctx.beginPath();
    ctx.arc(W - 118 + (state.player ? state.player.x / W : 0) * 96, 21 + (state.player ? state.player.y / H : 0) * 66, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawWater(x, y, rx, ry, color) {
    ctx.save();
    ctx.fillStyle = "rgba(67, 80, 90, 0.32)";
    ctx.beginPath();
    ctx.ellipse(x, y + 6, rx + 10, ry + 8, -0.08, 0, TAU);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.08, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(240,255,220,0.55)";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#d8ffff";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx - 24 - i * 18, ry - 12 - i * 7, -0.08, 0.1, Math.PI - 0.2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCliff(x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "#a15f37";
    ctx.fillRect(x, y, w, h);
    for (let i = 0; i < 30; i += 1) {
      const px = x + ((i * 31) % w);
      const py = y + ((i * 47) % h);
      ctx.fillStyle = i % 2 ? "#d09a63" : "#6d3f2e";
      ctx.beginPath();
      ctx.ellipse(px, py, 10, 18, 0.2, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = "#5d3928";
    ctx.lineWidth = 5;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function drawCanopyTree(x, y, scale, color, highlight) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 28, 25, 10, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#80512a";
    ctx.fillRect(-7, 8, 14, 32);
    ctx.fillStyle = color;
    [[0, -18, 24], [-17, -3, 23], [17, -3, 23], [0, 10, 24]].forEach((c) => {
      ctx.beginPath();
      ctx.arc(c[0], c[1], c[2], 0, TAU);
      ctx.fill();
    });
    ctx.fillStyle = highlight;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(-10, -20, 10, 0, TAU);
    ctx.arc(8, -9, 8, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawGiantStump(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#6a3b22";
    ctx.fillRect(-33, -4, 66, 72);
    ctx.fillStyle = "#9b6137";
    ctx.beginPath();
    ctx.ellipse(0, -4, 36, 18, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#d6a36b";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, -4, 10 + i * 8, 5 + i * 4, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGrassTuft(x, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y + 9);
    ctx.lineTo(x - 8, y - 2);
    ctx.moveTo(x, y + 9);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 9);
    ctx.lineTo(x + 9, y - 3);
    ctx.stroke();
    ctx.restore();
  }

  function drawFlowerPatch(x, y, color, count) {
    for (let i = 0; i < count; i += 1) drawFlower(x + ((i * 19) % 72) - 36, y + ((i * 31) % 48) - 24, i % 3 ? color : "#ffffff");
  }

  function drawFlower(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i += 1) {
      const a = (TAU * i) / 5;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 4, 7, a, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = "#ffe45f";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawRockCluster(x, y, count, color) {
    for (let i = 0; i < count; i += 1) {
      drawPebble(x + ((i * 29) % 96) - 48, y + ((i * 41) % 74) - 37, color);
    }
  }

  function drawPebble(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 6, 0.4, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(x - 3, y - 2, 3, 2, 0.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawWindmill(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#f6e1b1";
    ctx.fillRect(-24, 36, 48, 82);
    ctx.fillStyle = "#7a4b2b";
    ctx.beginPath();
    ctx.moveTo(-34, 36);
    ctx.lineTo(0, 0);
    ctx.lineTo(34, 36);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff6d0";
    ctx.lineWidth = 6;
    for (let i = 0; i < 4; i += 1) {
      const a = state.time * 0.8 + (TAU * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(Math.cos(a) * 42, 32 + Math.sin(a) * 42);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMountain(x, y, size, rock, lava) {
    ctx.fillStyle = rock;
    ctx.beginPath();
    ctx.moveTo(x - size, y + size);
    ctx.lineTo(x, y - size * 0.65);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = lava;
    ctx.beginPath();
    ctx.moveTo(x - 22, y - size * 0.32);
    ctx.lineTo(x, y - size * 0.58);
    ctx.lineTo(x + 28, y - size * 0.28);
    ctx.lineTo(x + 9, y + 20);
    ctx.closePath();
    ctx.fill();
  }

  function drawLavaCrack(x, y) {
    ctx.strokeStyle = "#ffbc46";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 18, y + 9);
    ctx.lineTo(x + 5, y + 25);
    ctx.lineTo(x + 30, y + 37);
    ctx.stroke();
  }

  function drawTemple(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 60, y + 50, 120, 20);
    for (let i = -2; i <= 2; i += 1) ctx.fillRect(x + i * 24 - 6, y, 12, 70);
    ctx.beginPath();
    ctx.moveTo(x - 78, y);
    ctx.lineTo(x, y - 42);
    ctx.lineTo(x + 78, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawCrystal(x, y, color) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - 36);
    ctx.lineTo(x + 24, y);
    ctx.lineTo(x, y + 44);
    ctx.lineTo(x - 24, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawDune(x, y) {
    ctx.fillStyle = "rgba(255,238,173,0.32)";
    ctx.beginPath();
    ctx.ellipse(x, y, 95, 22, -0.15, 0, TAU);
    ctx.fill();
  }

  function drawPyramid(x, y, size) {
    ctx.fillStyle = "#d9a14d";
    ctx.beginPath();
    ctx.moveTo(x - size, y + size);
    ctx.lineTo(x, y - size * 0.55);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.55);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x + 16, y + size);
    ctx.closePath();
    ctx.fill();
  }

  function drawCactus(x, y) {
    ctx.strokeStyle = "#278c4f";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y + 30);
    ctx.lineTo(x, y - 24);
    ctx.moveTo(x, y - 2);
    ctx.lineTo(x - 20, y - 2);
    ctx.lineTo(x - 20, y - 18);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 18, y + 8);
    ctx.lineTo(x + 18, y - 8);
    ctx.stroke();
  }

  function drawCastle(x, y) {
    ctx.fillStyle = "#181222";
    ctx.fillRect(x - 130, y + 75, 260, 155);
    for (let i = -2; i <= 2; i += 1) {
      ctx.fillRect(x + i * 62 - 18, y + 18 + Math.abs(i) * 12, 36, 212);
      ctx.beginPath();
      ctx.moveTo(x + i * 62 - 24, y + 18 + Math.abs(i) * 12);
      ctx.lineTo(x + i * 62, y - 18 + Math.abs(i) * 12);
      ctx.lineTo(x + i * 62 + 24, y + 18 + Math.abs(i) * 12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#ff4c91";
    ctx.fillRect(x - 22, y + 160, 44, 70);
    ctx.fillRect(x - 92, y + 105, 26, 34);
    ctx.fillRect(x + 66, y + 105, 26, 34);
  }

  function drawThorn(x, y) {
    ctx.strokeStyle = "rgba(15, 6, 23, 0.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 28);
    ctx.lineTo(x + 17, y - 18);
    ctx.lineTo(x + 29, y + 16);
    ctx.stroke();
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    [-28, 0, 28].forEach((cx, idx) => {
      ctx.beginPath();
      ctx.arc(cx, idx === 1 ? -8 : 0, idx === 1 ? 28 : 22, 0, TAU);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawHeroPortrait(targetCtx, hero, scale) {
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.clearRect(0, 0, 120, 120);
    if (drawLibrarySprite(targetCtx, hero.spriteKey, 60, 96, 1.55 * scale, 0, false)) return;
    targetCtx.save();
    targetCtx.translate(60, 68);
    drawHeroFigure(targetCtx, hero, 0, 0, 1.7 * scale, -Math.PI / 6, true);
    targetCtx.restore();
  }

  function drawLibrarySprite(target, key, x, y, scale, angle, flip) {
    const source = heroSprites[key] || enemySprites[key];
    if (!assetLibrary.ready || !source) return false;
    target.save();
    target.translate(x, y);
    if (angle) target.rotate(angle);
    target.scale(flip ? -scale : scale, scale);
    target.imageSmoothingEnabled = false;
    target.drawImage(
      assetLibrary.image,
      source.x,
      source.y,
      source.w,
      source.h,
      -source.w / 2,
      -source.h,
      source.w,
      source.h,
    );
    target.restore();
    return true;
  }

  function drawLibraryBossSprite(target, index, scale) {
    const source = bossSprites[index] || bossSprites[0];
    if (!assetLibrary.ready || !source) return false;
    target.save();
    target.scale(scale, scale);
    target.imageSmoothingEnabled = false;
    target.drawImage(
      assetLibrary.image,
      source.x,
      source.y,
      source.w,
      source.h,
      -source.w / 2,
      -source.h / 2,
      source.w,
      source.h,
    );
    target.restore();
    return true;
  }

  function drawBossLibrarySprite(target, index, x, y, radius) {
    const source = bossSprites[index] || bossSprites[0];
    if (!assetLibrary.ready || !source) return false;
    const scale = Math.max((radius * 1.7) / source.w, (radius * 1.25) / source.h);
    target.save();
    target.translate(x, y + 8);
    target.imageSmoothingEnabled = false;
    target.drawImage(
      assetLibrary.image,
      source.x,
      source.y,
      source.w,
      source.h,
      (-source.w * scale) / 2,
      (-source.h * scale) / 2,
      source.w * scale,
      source.h * scale,
    );
    target.restore();
    return true;
  }

  function getEnemySpriteKey(name, rare) {
    if (rare) return Math.random() < 0.5 ? "rareSlime" : "rareMushroom";
    if (name.includes("スライム")) return "slime";
    if (name.includes("きのこ")) return "mushroom";
    if (name.includes("ゴブリン")) return "goblin";
    if (name.includes("コウモリ")) return "bat";
    if (name.includes("オオカミ")) return "wolf";
    if (name.includes("ゴーレム")) return "golem";
    if (name.includes("ゴースト")) return "ghost";
    if (name.includes("ミミック")) return "mimic";
    if (name.includes("トカゲ")) return "lizard";
    if (name.includes("ハチ")) return "bee";
    if (name.includes("サボテン")) return "cactus";
    if (name.includes("雪")) return "snowman";
    if (name.includes("ドラゴン")) return "dragon";
    if (name.includes("騎士")) return "knight";
    if (name.includes("魔法")) return "mage";
    if (name.includes("カニ")) return "crab";
    if (name.includes("人形")) return "doll";
    if (name.includes("花")) return "flower";
    return "slime";
  }

  function drawAssetHeroFigure(target, hero, x, y, scale, angle, portrait, companion) {
    const isPlayer = !portrait && !companion && state.hero && hero.id === state.hero.id;
    const attackProgress = isPlayer && state.attackTimer > 0 ? 1 - state.attackTimer / state.attackDuration : 0;
    const magicProgress = isPlayer && state.magicTimer > 0 ? 1 - state.magicTimer / 0.55 : 0;
    const swing = attackProgress > 0 ? Math.sin(attackProgress * Math.PI) : 0;
    const bob = portrait ? 0 : Math.sin(state.time * 8 + x * 0.03) * 2;
    const lunge = isPlayer ? swing * 10 : 0;
    target.save();
    target.translate(x + Math.cos(angle) * lunge, y + bob + Math.sin(angle) * lunge);
    if (!portrait && attackProgress > 0) target.rotate(Math.sin((attackProgress - 0.2) * Math.PI) * 0.16);
    target.scale(1 + swing * 0.08, 1 - swing * 0.03);
    if (!portrait) {
      target.fillStyle = "rgba(0,0,0,0.28)";
      target.beginPath();
      target.ellipse(0, 24, 24 + swing * 6, 8, 0, 0, TAU);
      target.fill();
    }
    const spriteScale = portrait ? 1.15 * scale : 0.9 * scale;
    drawLibrarySprite(target, hero.spriteKey, 0, portrait ? 34 : 26, spriteScale, 0, false);
    if (attackProgress > 0) drawSpriteWeaponOverlay(target, hero.design.weapon, hero.design.accent, angle, attackProgress, portrait);
    if (magicProgress > 0) drawCastingAura(target, hero.design.accent, magicProgress);
    target.restore();
  }

  function drawParty() {
    const p = state.player;
    const party = getPartyMembers();
    const offsets = [
      { x: -46 - p.dirX * 10, y: 30 - p.dirY * 6, scale: 0.54 },
      { x: 44 - p.dirX * 8, y: 34 - p.dirY * 4, scale: 0.52 },
    ];
    offsets.forEach((off, index) => {
      const hero = party[index + 1];
      drawHeroFigure(ctx, hero, p.x + off.x, p.y + off.y, off.scale, Math.atan2(p.dirY, p.dirX), false, true);
    });
    ctx.save();
    if (p.invuln > 0) ctx.globalAlpha = 0.55 + Math.sin(state.time * 45) * 0.25;
    drawHeroFigure(ctx, party[0], p.x, p.y, 0.64, Math.atan2(p.dirY, p.dirX), false, false);
    ctx.restore();
  }

  function getPartyMembers() {
    if (!state.hero) return [heroes[0], heroes[1], heroes[2]];
    const chosen = state.hero;
    const rest = heroes.filter((h) => h.id !== chosen.id);
    return [chosen, rest[(state.stage + 1) % rest.length], rest[(state.stage + 3) % rest.length]];
  }

  function drawHeroFigure(target, hero, x, y, scale, angle, portrait, companion) {
    if (assetLibrary.ready && hero.spriteKey) {
      drawAssetHeroFigure(target, hero, x, y, scale, angle, portrait, companion);
      return;
    }
    const d = hero.design;
    const isPlayer = !portrait && !companion && state.hero && hero.id === state.hero.id;
    const attackProgress = isPlayer && state.attackTimer > 0 ? 1 - state.attackTimer / state.attackDuration : 0;
    const magicProgress = isPlayer && state.magicTimer > 0 ? 1 - state.magicTimer / 0.55 : 0;
    const swing = attackProgress > 0 ? Math.sin(attackProgress * Math.PI) : 0;
    const windup = attackProgress > 0 && attackProgress < 0.38 ? -1 : 1;
    const bob = portrait ? 0 : Math.sin(state.time * 8 + x * 0.03) * 2;
    const lunge = isPlayer ? swing * 10 : 0;
    if (assetLibrary.ready) {
      target.save();
      target.translate(x + Math.cos(angle) * lunge, y + bob + Math.sin(angle) * lunge);
      if (!portrait && attackProgress > 0) target.rotate(Math.sin((attackProgress - 0.2) * Math.PI) * 0.16);
      target.scale(1 + swing * 0.08, 1 - swing * 0.03);
      const spriteScale = portrait ? 1.9 * scale : 1.15 * scale;
      drawLibrarySprite(target, hero.spriteKey, 0, 8, spriteScale, angle, false);
      if (attackProgress > 0) drawSpriteWeaponOverlay(target, hero.design.weapon, hero.design.accent, angle, attackProgress, portrait);
      if (magicProgress > 0) drawCastingAura(target, d.accent, magicProgress);
      target.restore();
      return;
    }
    target.save();
    target.translate(x + Math.cos(angle) * lunge, y + bob + Math.sin(angle) * lunge);
    if (attackProgress > 0 && !portrait) target.rotate(Math.sin((attackProgress - 0.2) * Math.PI) * 0.1);
    target.scale(scale * (1 + swing * 0.06), scale * (1 - swing * 0.03));
    target.shadowColor = "rgba(0,0,0,0.35)";
    target.shadowBlur = 0;
    target.fillStyle = "rgba(0,0,0,0.28)";
    target.beginPath();
    target.ellipse(0, 31, 30 + swing * 5, 11, 0, 0, TAU);
    target.fill();
    target.globalAlpha = companion ? 0.9 : 1;

    const pose = { attackProgress, magicProgress, swing, windup, angle };
    drawHeroWeapon(target, d.weapon, d.accent, angle, portrait, true, pose);

    target.lineWidth = 4;
    target.strokeStyle = "rgba(48, 32, 28, 0.85)";
    target.fillStyle = d.cape;
    target.beginPath();
    target.moveTo(-24 - swing * 4, -2);
    target.quadraticCurveTo(-34, 28 + swing * 4, -16, 50);
    target.quadraticCurveTo(0, 60, 22, 49);
    target.quadraticCurveTo(32 + swing * 4, 25, 24 + swing * 4, -2);
    target.closePath();
    target.fill();
    target.stroke();

    target.fillStyle = d.outfit;
    roundRect(target, -22, -4, 44, 48, 12);
    target.fill();
    target.stroke();
    target.fillStyle = d.trim || d.accent;
    target.fillRect(-21, 10, 42, 5);
    target.fillStyle = d.accent;
    target.fillRect(-4, -2, 8, 45);
    target.beginPath();
    target.arc(0, 12, 8, 0, TAU);
    target.fill();

    drawArms(target, d, pose, portrait);

    target.strokeStyle = "rgba(55,33,28,0.95)";
    target.lineWidth = 4;
    target.fillStyle = d.skin;
    target.beginPath();
    target.ellipse(0, -30 - swing * 2, 23, 25, 0, 0, TAU);
    target.fill();
    target.stroke();

    drawHair(target, d);
    drawFace(target, d);

    target.strokeStyle = "rgba(60,35,25,0.9)";
    target.lineWidth = 8;
    target.beginPath();
    target.moveTo(-10 - swing * 2, 39);
    target.lineTo(-15 - swing * 4, 58);
    target.moveTo(10 + swing * 2, 39);
    target.lineTo(15 + swing * 4, 58);
    target.stroke();
    target.strokeStyle = d.outfit;
    target.lineWidth = 5;
    target.beginPath();
    target.moveTo(-10 - swing * 2, 39);
    target.lineTo(-15 - swing * 4, 57);
    target.moveTo(10 + swing * 2, 39);
    target.lineTo(15 + swing * 4, 57);
    target.stroke();

    if (magicProgress > 0) drawCastingAura(target, d.accent, magicProgress);
    drawHeroWeapon(target, d.weapon, d.accent, angle, portrait, false, pose);
    target.restore();
  }

  function drawArms(target, d, pose, portrait) {
    const swing = portrait ? 0 : pose.swing;
    const atk = portrait ? 0 : pose.attackProgress;
    const lift = pose.magicProgress > 0 ? -18 * Math.sin(pose.magicProgress * Math.PI) : 0;
    target.strokeStyle = "rgba(60,35,25,0.9)";
    target.lineWidth = 8;
    target.lineCap = "round";
    target.beginPath();
    target.moveTo(-19, 4);
    target.quadraticCurveTo(-36 - swing * 6, 12 + lift, -31 - swing * 8, 30 + lift);
    target.moveTo(19, 4);
    target.quadraticCurveTo(34 + swing * 18, 6 - swing * 22 + lift, 42 + swing * 24, 22 - swing * 18 + lift);
    target.stroke();
    target.strokeStyle = d.skin;
    target.lineWidth = 6;
    target.beginPath();
    target.moveTo(-19, 5);
    target.quadraticCurveTo(-34 - swing * 6, 13 + lift, -30 - swing * 8, 29 + lift);
    target.moveTo(19, 5);
    target.quadraticCurveTo(32 + swing * 18, 7 - swing * 22 + lift, 40 + swing * 24, 21 - swing * 18 + lift);
    target.stroke();
    if (atk > 0.05) {
      target.fillStyle = d.accent;
      target.beginPath();
      target.arc(41 + swing * 20, 20 - swing * 20, 5 + swing * 3, 0, TAU);
      target.fill();
    }
  }

  function drawHair(target, d) {
    target.save();
    target.fillStyle = d.hair;
    target.strokeStyle = "rgba(40,24,25,0.9)";
    target.lineWidth = 3;
    target.beginPath();
    target.moveTo(-24, -33);
    target.quadraticCurveTo(-15, -61, 13, -55);
    target.quadraticCurveTo(32, -47, 24, -24);
    target.quadraticCurveTo(10, -34, 0, -28);
    target.quadraticCurveTo(-11, -38, -24, -33);
    target.closePath();
    target.fill();
    target.stroke();
    target.fillStyle = d.hair2;
    target.beginPath();
    target.moveTo(-13, -51);
    target.quadraticCurveTo(0, -65, 16, -49);
    target.quadraticCurveTo(6, -43, -13, -51);
    target.fill();
    if (d.mood === "dark") {
      target.strokeStyle = d.accent;
      target.lineWidth = 4;
      target.beginPath();
      target.moveTo(18, -45);
      target.lineTo(28, -18);
      target.stroke();
    }
    target.restore();
  }

  function drawFace(target, d) {
    target.fillStyle = d.eyes;
    target.beginPath();
    target.ellipse(-8, -29, 3, 5, 0, 0, TAU);
    target.ellipse(8, -29, 3, 5, 0, 0, TAU);
    target.fill();
    target.fillStyle = "#fff";
    target.beginPath();
    target.arc(-9, -31, 1, 0, TAU);
    target.arc(7, -31, 1, 0, TAU);
    target.fill();
    target.strokeStyle = d.mood === "dark" ? d.accent : "#714533";
    target.lineWidth = 2;
    target.beginPath();
    if (d.mood === "smile") target.arc(0, -20, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    else if (d.mood === "dark") {
      target.moveTo(-12, -38);
      target.lineTo(-3, -35);
      target.moveTo(3, -35);
      target.lineTo(13, -39);
    } else target.moveTo(-6, -20), target.lineTo(7, -20);
    target.stroke();
  }

  function drawHeroWeapon(target, weapon, color, angle, portrait, behind, pose) {
    const isBehind = weapon === "bow" || weapon === "greatsword" || weapon === "bowblade";
    if (behind !== isBehind) return;
    const swing = portrait || !pose ? 0 : pose.swing;
    const progress = portrait || !pose ? 0 : pose.attackProgress;
    const windup = pose ? pose.windup : 1;
    target.save();
    if (!portrait) target.rotate(angle);
    if (progress > 0 && !portrait) {
      const arc = -1.15 + progress * 2.45;
      target.rotate(arc);
      target.translate(8 * swing, -8 * swing * windup);
    }
    target.strokeStyle = "rgba(40,25,25,0.9)";
    target.fillStyle = color;
    target.lineCap = "round";
    if (weapon === "bow" || weapon === "bowblade") {
      const big = weapon === "bowblade";
      target.lineWidth = big ? 7 : 5;
      target.beginPath();
      target.arc(41, 0, big ? 34 : 28, -1.25, 1.25);
      target.stroke();
      target.strokeStyle = color;
      target.lineWidth = 3;
      target.beginPath();
      target.arc(41, 0, big ? 31 : 25, -1.2, 1.2);
      target.stroke();
      target.strokeStyle = "#fff4bd";
      target.beginPath();
      target.moveTo(44, big ? -34 : -27);
      target.lineTo(44, big ? 34 : 28);
      target.stroke();
      if (big) {
        target.strokeStyle = "#f8fbff";
        target.lineWidth = 5;
        target.beginPath();
        target.moveTo(61, -18);
        target.lineTo(78, -34);
        target.moveTo(61, 18);
        target.lineTo(78, 34);
        target.stroke();
      }
    } else if (weapon === "wand" || weapon === "wandblade") {
      target.strokeStyle = "#6b3a2b";
      target.lineWidth = weapon === "wandblade" ? 7 : 5;
      target.beginPath();
      target.moveTo(30, 20);
      target.lineTo(58, -28);
      target.stroke();
      if (weapon === "wandblade") {
        target.strokeStyle = "#f8fbff";
        target.lineWidth = 5;
        target.beginPath();
        target.moveTo(52, -18);
        target.lineTo(72, -42);
        target.stroke();
      }
      target.fillStyle = color;
      drawStar(target, 60, -32, 11 + swing * 4, 5);
    } else {
      const len = weapon === "greatsword" ? 78 : weapon === "dagger" ? 39 : weapon === "longsword" ? 64 : weapon === "shortsword" ? 46 : 56;
      const bladeWidth = weapon === "greatsword" ? 12 : weapon === "dagger" ? 5 : 7;
      target.strokeStyle = "#6b4931";
      target.lineWidth = 8;
      target.beginPath();
      target.moveTo(29, 18);
      target.lineTo(29 + len, -20);
      target.stroke();
      target.strokeStyle = "#f8fbff";
      target.lineWidth = bladeWidth;
      target.beginPath();
      target.moveTo(35, 12);
      target.lineTo(29 + len, -20);
      target.stroke();
      target.strokeStyle = color;
      target.lineWidth = 3;
      target.beginPath();
      target.moveTo(38, 16);
      target.lineTo(52, 24);
      target.stroke();
    }
    target.restore();
  }

  function drawCastingAura(target, color, progress) {
    target.save();
    target.globalAlpha = Math.sin(progress * Math.PI) * 0.75;
    target.strokeStyle = color;
    target.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      target.beginPath();
      target.arc(0, -5, 34 + i * 9 + progress * 12, 0, TAU);
      target.stroke();
    }
    target.fillStyle = color;
    for (let i = 0; i < 6; i += 1) {
      const a = progress * TAU + (TAU * i) / 6;
      target.beginPath();
      target.arc(Math.cos(a) * 34, -5 + Math.sin(a) * 28, 3, 0, TAU);
      target.fill();
    }
    target.restore();
  }

  function drawStar(target, x, y, radius, points) {
    target.beginPath();
    for (let i = 0; i < points * 2; i += 1) {
      const a = -Math.PI / 2 + (Math.PI * i) / points;
      const r = i % 2 ? radius * 0.45 : radius;
      target.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    target.closePath();
    target.fill();
  }

  function roundRect(target, x, y, w, h, r) {
    target.beginPath();
    target.moveTo(x + r, y);
    target.lineTo(x + w - r, y);
    target.quadraticCurveTo(x + w, y, x + w, y + r);
    target.lineTo(x + w, y + h - r);
    target.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    target.lineTo(x + r, y + h);
    target.quadraticCurveTo(x, y + h, x, y + h - r);
    target.lineTo(x, y + r);
    target.quadraticCurveTo(x, y, x + r, y);
  }

  function drawEnemies() {
    for (const e of state.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y + Math.sin(state.time * 6 + e.x) * 2);
      ctx.globalAlpha = e.hit > 0 ? 0.72 : 1;
      if (assetLibrary.ready && drawLibrarySprite(ctx, e.spriteKey, 0, 0, e.rare ? 0.92 : 0.72, 0, false)) {
        ctx.fillStyle = "rgba(0,0,0,0.24)";
        ctx.beginPath();
        ctx.ellipse(0, 22, e.r + 10, 7, 0, 0, TAU);
        ctx.fill();
      } else if (e.rare) drawRareMonster(e);
      else if (e.name.includes("スライム")) drawSlime(e);
      else if (e.name.includes("花") || e.name.includes("きのこ")) drawPlantEnemy(e);
      else if (e.name.includes("コウモリ")) drawBat(e);
      else if (e.name.includes("ドラゴン") || e.name.includes("トカゲ")) drawLizard(e);
      else if (e.name.includes("騎士") || e.name.includes("ゴブリン")) drawGoblin(e);
      else drawRoundBeast(e);
      drawHpBar(0, -e.r - 18, e.hp / e.maxHp, 42);
      ctx.restore();
    }
  }

  function drawRareMonster(e) {
    ctx.shadowColor = "#fff49a";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 15, 18, 7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffe76b";
    ctx.strokeStyle = "#a77716";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.r + 6, e.r, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff8c9";
    drawStar(ctx, -8, -8, 6, 5);
    drawStar(ctx, 10, 3, 5, 5);
    ctx.fillStyle = "#4a2b2b";
    ctx.fillRect(-8, -2, 4, 5);
    ctx.fillRect(7, -2, 4, 5);
  }

  function drawSlime(e) {
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 14, e.r + 5, 6, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#24566a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-e.r - 4, 7);
    ctx.quadraticCurveTo(-e.r * 0.5, -e.r - 9, 0, -e.r - 4);
    ctx.quadraticCurveTo(e.r * 0.8, -e.r + 2, e.r + 5, 7);
    ctx.quadraticCurveTo(0, e.r + 10, -e.r - 4, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-6, -2, 3, 0, TAU);
    ctx.arc(7, -2, 3, 0, TAU);
    ctx.fill();
  }

  function drawPlantEnemy(e) {
    ctx.strokeStyle = "#276b32";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -6);
    ctx.stroke();
    ctx.fillStyle = "#2fc75a";
    ctx.beginPath();
    ctx.ellipse(-12, 9, 11, 6, -0.6, 0, TAU);
    ctx.ellipse(12, 6, 11, 6, 0.6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#6a214d";
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i += 1) {
      const a = (TAU * i) / 6;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 11, -12 + Math.sin(a) * 9, 9, 14, a, 0, TAU);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = "#ffe86d";
    ctx.beginPath();
    ctx.arc(0, -12, 8, 0, TAU);
    ctx.fill();
  }

  function drawBat(e) {
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#2d244e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-28, -14);
    ctx.lineTo(-18, 6);
    ctx.lineTo(-5, 5);
    ctx.lineTo(0, -8);
    ctx.lineTo(5, 5);
    ctx.lineTo(18, 6);
    ctx.lineTo(28, -14);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffef9d";
    ctx.fillRect(-7, -3, 3, 4);
    ctx.fillRect(5, -3, 3, 4);
  }

  function drawLizard(e) {
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#24533b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 2, e.r + 6, e.r, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(34, -10);
    ctx.lineTo(28, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-7, -5, 3, 0, TAU);
    ctx.arc(8, -5, 3, 0, TAU);
    ctx.fill();
  }

  function drawGoblin(e) {
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 20, 7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#31452c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -4, 16, 18, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, -8);
    ctx.lineTo(-28, -17);
    ctx.lineTo(-18, 0);
    ctx.moveTo(15, -8);
    ctx.lineTo(28, -17);
    ctx.lineTo(18, 0);
    ctx.stroke();
    ctx.strokeStyle = "#e6e7ef";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(17, 8);
    ctx.lineTo(35, -8);
    ctx.stroke();
  }

  function drawRoundBeast(e) {
    ctx.fillStyle = e.color;
    ctx.strokeStyle = "#4c372a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.r + 3, e.r + 1, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(-7, -5, 4, 0, TAU);
    ctx.arc(8, -5, 4, 0, TAU);
    ctx.fill();
  }

  function drawBoss() {
    const b = state.boss;
    if (!b) return;
    ctx.save();
    ctx.translate(b.x, b.y + Math.sin(state.time * 2) * 3);
    ctx.shadowColor = b.aura;
    ctx.shadowBlur = 34;
    ctx.globalAlpha = b.hit > 0 ? 0.76 : 1;
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, b.r * 0.62, b.r * 0.9, b.r * 0.22, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = b.color;
    ctx.strokeStyle = b.aura;
    ctx.lineWidth = 8;
    if (assetLibrary.ready && drawBossLibrarySprite(ctx, state.stage, 0, 0, b.r)) {
      // Submitted asset sheet is the primary source when available.
    } else if (b.name.includes("大蛇")) drawSerpentBoss(b);
    else if (b.name.includes("グリフォン")) drawGriffinBoss(b);
    else if (b.name.includes("ゴーレム")) drawGolemBoss(b);
    else if (b.name.includes("ドラゴン")) drawDragonBoss(b);
    else if (b.name.includes("スコーピオン")) drawScorpionBoss(b);
    else drawDemonBoss(b);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.name, 0, -b.r - 28);
    drawHpBar(0, -b.r - 18, b.hp / b.maxHp, 190);
    ctx.restore();
  }

  function drawSerpentBoss(b) {
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.85, b.r * 0.45, 0.25, 0, TAU);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-b.r * 0.42, -b.r * 0.35, b.r * 0.36, b.r * 0.28, -0.2, 0, TAU);
    ctx.fill(); ctx.stroke();
    drawBossEyes(-b.r * 0.48, -b.r * 0.42, 14);
  }

  function drawGriffinBoss(b) {
    ctx.beginPath();
    ctx.ellipse(0, 4, b.r * 0.62, b.r * 0.45, 0, 0, TAU);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-20, -12); ctx.lineTo(-b.r, -b.r * 0.55); ctx.lineTo(-b.r * 0.55, 10);
    ctx.moveTo(20, -12); ctx.lineTo(b.r, -b.r * 0.55); ctx.lineTo(b.r * 0.55, 10);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = b.aura;
    ctx.beginPath(); ctx.moveTo(0, -b.r * 0.65); ctx.lineTo(20, -b.r * 0.25); ctx.lineTo(-20, -b.r * 0.25); ctx.closePath(); ctx.fill();
    drawBossEyes(0, -b.r * 0.32, 12);
  }

  function drawGolemBoss(b) {
    for (let i = 0; i < 5; i += 1) {
      roundRect(ctx, -b.r * 0.55 + i * b.r * 0.28, -b.r * 0.35 + (i % 2) * 18, b.r * 0.26, b.r * 0.55, 12);
      ctx.fill(); ctx.stroke();
    }
    drawBossEyes(0, -b.r * 0.38, 12);
  }

  function drawDragonBoss(b) {
    ctx.beginPath(); ctx.ellipse(0, 5, b.r * 0.72, b.r * 0.44, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-b.r * 0.45, -8); ctx.lineTo(-b.r * 0.95, -b.r * 0.48); ctx.lineTo(-b.r * 0.65, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.r * 0.45, -8); ctx.lineTo(b.r * 0.95, -b.r * 0.48); ctx.lineTo(b.r * 0.65, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
    drawBossEyes(0, -b.r * 0.28, 13);
  }

  function drawScorpionBoss(b) {
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.72, b.r * 0.42, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 10;
    for (let side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 35, 8); ctx.lineTo(side * b.r * 0.95, -22); ctx.stroke();
      ctx.beginPath(); ctx.arc(side * b.r * 1.05, -28, 18, 0, TAU); ctx.fill(); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, -b.r * 0.35); ctx.quadraticCurveTo(28, -b.r, 0, -b.r * 1.15); ctx.stroke();
    drawBossEyes(0, -b.r * 0.18, 11);
  }

  function drawDemonBoss(b) {
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * 0.68, b.r * 0.55, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = b.aura;
    ctx.beginPath(); ctx.moveTo(-26, -b.r * 0.45); ctx.lineTo(-58, -b.r * 0.9); ctx.lineTo(-6, -b.r * 0.58); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26, -b.r * 0.45); ctx.lineTo(58, -b.r * 0.9); ctx.lineTo(6, -b.r * 0.58); ctx.closePath(); ctx.fill();
    drawBossEyes(0, -b.r * 0.15, 14);
  }

  function drawBossEyes(x, y, r) {
    ctx.fillStyle = "#fff0a0";
    ctx.beginPath(); ctx.arc(x - r, y, r * 0.38, 0, TAU); ctx.arc(x + r, y, r * 0.38, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2b1430";
    ctx.beginPath(); ctx.arc(x - r, y, r * 0.16, 0, TAU); ctx.arc(x + r, y, r * 0.16, 0, TAU); ctx.fill();
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
      if (p.type === "assetEffect" && assetLibrary.ready && effectSprites[p.spriteKey]) {
        const source = effectSprites[p.spriteKey];
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle || 0);
        ctx.imageSmoothingEnabled = false;
        const scale = (p.r || 1) * (1 + (1 - alpha) * 0.55);
        ctx.drawImage(
          assetLibrary.image,
          source.x,
          source.y,
          source.w,
          source.h,
          (-source.w * scale) / 2,
          (-source.h * scale) / 2,
          source.w * scale,
          source.h * scale,
        );
        ctx.restore();
        continue;
      }
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
    ctx.save();
    ctx.fillStyle = "rgba(42, 26, 20, 0.72)";
    ctx.strokeStyle = "rgba(255, 238, 190, 0.82)";
    ctx.lineWidth = 2;
    roundRect(ctx, 14, 12, 360, 40, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffe17a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`ともかクエスト - ${stageNames[state.stage]}`, 28, 37);
    if (!state.boss) {
      ctx.fillStyle = "#fff8d5";
      ctx.fillText("敵をあと少し倒すとボス出現!", 412, 37);
    }
    drawPartyHud();
    ctx.restore();
  }

  function drawPartyHud() {
    const party = getPartyMembers();
    const p = state.player;
    const baseY = H - 68;
    party.forEach((hero, index) => {
      const x = 16 + index * 214;
      const hpRatio = index === 0 ? p.hp / p.maxHp : 0.72 + ((index + state.stage) % 3) * 0.08;
      const mpRatio = index === 0 ? p.mp / p.maxMp : 0.42 + ((index + 1) % 3) * 0.16;
      ctx.fillStyle = "rgba(255, 244, 203, 0.9)";
      ctx.strokeStyle = "#5b3526";
      ctx.lineWidth = 3;
      roundRect(ctx, x, baseY, 198, 54, 10);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 4, baseY + 4, 44, 46);
      ctx.clip();
      ctx.fillStyle = hero.color;
      ctx.fillRect(x + 4, baseY + 4, 44, 46);
      drawHeroFigure(ctx, hero, x + 26, baseY + 39, 0.42, -0.2, true, false);
      ctx.restore();
      ctx.fillStyle = "#422818";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(hero.name.split(" ").pop(), x + 55, baseY + 17);
      drawHudBar(x + 55, baseY + 24, 126, 9, hpRatio, "#49d65c", "#fff3a6");
      drawHudBar(x + 55, baseY + 39, 96, 7, mpRatio, "#3bc8ff", "#b276ff");
      ctx.fillStyle = "#422818";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(index === 0 ? `HP ${Math.round(p.hp)}/${p.maxHp}` : "ALLY", x + 55, baseY + 34);
    });
  }

  function drawHudBar(x, y, w, h, ratio, c1, c2) {
    ctx.fillStyle = "#5a3b2e";
    ctx.fillRect(x, y, w, h);
    const g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(x + 1, y + 1, (w - 2) * clamp(ratio, 0, 1), h - 2);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  function drawHpBar(x, y, ratio, width) {
    ctx.fillStyle = "rgba(45, 25, 22, 0.68)";
    ctx.fillRect(x - width / 2, y, width, 7);
    ctx.fillStyle = ratio > 0.35 ? "#65ff72" : "#ff5d76";
    ctx.fillRect(x - width / 2 + 1, y + 1, (width - 2) * clamp(ratio, 0, 1), 5);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y, width, 7);
  }

  function slashEffect(x, y, angle, range, color, weapon) {
    const wide = weapon === "greatsword" || weapon === "longsword" || weapon === "bowblade";
    if (assetLibrary.ready) {
      const key = weapon === "dagger" || weapon === "greatsword" ? "dark" : "slash";
      state.particles.push({
        type: "assetEffect",
        spriteKey: key,
        x: x + Math.cos(angle) * range * 0.55,
        y: y + Math.sin(angle) * range * 0.38,
        angle,
        r: wide ? 1.8 : 1.35,
        life: 0.22,
        maxLife: 0.22,
        color,
      });
    }
    const start = angle - (wide ? 1.35 : 1.05);
    const end = angle + (wide ? 1.25 : 0.95);
    for (let i = 0; i < 34; i += 1) {
      const t = i / 33;
      const a = start + (end - start) * t;
      const radius = range * (0.38 + 0.45 * Math.sin(t * Math.PI));
      state.particles.push({
        type: "slash",
        x: x + Math.cos(a) * radius,
        y: y + Math.sin(a) * radius * 0.72,
        vx: Math.cos(a) * 32,
        vy: Math.sin(a) * 32,
        r: wide ? 8 + Math.sin(t * Math.PI) * 8 : 5 + Math.sin(t * Math.PI) * 6,
        life: 0.22 + t * 0.08,
        maxLife: 0.3,
        color,
      });
    }
    for (let i = 0; i < 18; i += 1) {
      const a = angle - 0.45 + Math.random() * 0.9;
      const speed = 120 + Math.random() * 160;
      state.particles.push({
        x: x + Math.cos(angle) * 32,
        y: y + Math.sin(angle) * 24,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: 2 + Math.random() * 4,
        life: 0.22 + Math.random() * 0.18,
        maxLife: 0.4,
        color: Math.random() < 0.5 ? "#ffffff" : color,
      });
    }
  }

  function lungeEffect(x, y, angle, color) {
    for (let i = 0; i < 10; i += 1) {
      const back = 8 + i * 5;
      state.particles.push({
        x: x - Math.cos(angle) * back + (Math.random() - 0.5) * 14,
        y: y - Math.sin(angle) * back + 25 + (Math.random() - 0.5) * 8,
        vx: -Math.cos(angle) * (40 + i * 8),
        vy: -Math.sin(angle) * (20 + i * 4),
        r: 3 + Math.random() * 4,
        life: 0.18 + Math.random() * 0.14,
        maxLife: 0.32,
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
    const master = ac.createGain();
    master.gain.value = 0.55;
    master.connect(ac.destination);
    let musicTimer = null;
    let step = 0;
    const stageThemes = [
      { root: 220, scale: [0, 2, 4, 7, 9, 12, 14, 16], mood: "triangle" },
      { root: 196, scale: [0, 2, 5, 7, 9, 12, 14, 17], mood: "triangle" },
      { root: 174.61, scale: [0, 3, 5, 7, 10, 12, 15, 17], mood: "sawtooth" },
      { root: 246.94, scale: [0, 2, 4, 7, 11, 12, 14, 16], mood: "sine" },
      { root: 207.65, scale: [0, 2, 4, 6, 7, 9, 12, 14], mood: "triangle" },
      { root: 164.81, scale: [0, 3, 5, 6, 7, 10, 12, 15], mood: "sawtooth" },
    ];

    function note(root, semitone) {
      return root * Math.pow(2, semitone / 12);
    }

    function tone(freq, dur, type, gain, when, dest) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const filter = ac.createBiquadFilter();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, when);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(type === "sawtooth" ? 1600 : 2600, when);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(filter);
      filter.connect(g);
      g.connect(dest || master);
      osc.start(when);
      osc.stop(when + dur + 0.04);
    }

    function noise(dur, gain, when) {
      const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      const g = ac.createGain();
      const filter = ac.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 900;
      g.gain.setValueAtTime(gain, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      src.buffer = buffer;
      src.connect(filter);
      filter.connect(g);
      g.connect(master);
      src.start(when);
      src.stop(when + dur);
    }

    function playMusicStep() {
      if (state.screen !== "game") return;
      const theme = stageThemes[state.stage] || stageThemes[0];
      const now = ac.currentTime;
      const beat = step % 16;
      const chordSets = [
        [0, 4, 7],
        [5, 9, 12],
        [7, 11, 14],
        [4, 7, 12],
      ];
      const chord = chordSets[Math.floor(beat / 4)];
      const melodyIndex = [0, 2, 4, 5, 7, 5, 4, 2, 3, 5, 7, 6, 4, 2, 1, 0][beat];
      const root = theme.root;
      if (beat % 4 === 0) {
        chord.forEach((semi, i) => tone(note(root, semi), 0.72, "sine", 0.018 - i * 0.002, now + i * 0.018));
        tone(note(root, chord[0] - 12), 0.82, "triangle", 0.034, now);
      }
      if (beat % 2 === 0) tone(note(root, theme.scale[melodyIndex % theme.scale.length] + 12), 0.28, theme.mood, 0.026, now + 0.02);
      if (beat === 3 || beat === 7 || beat === 11 || beat === 15) tone(note(root, -5), 0.08, "square", 0.012, now);
      if (beat === 0 || beat === 8) noise(0.045, 0.018, now);
      step += 1;
    }

    audio = {
      ensure() {
        if (ac.state === "suspended") ac.resume();
        if (!musicTimer) musicTimer = setInterval(playMusicStep, 210);
      },
      sfx(kind) {
        if (ac.state === "suspended") return;
        const now = ac.currentTime;
        const map = {
          slash: [620, 0.09, "sawtooth", 0.055],
          magic: [880, 0.24, "triangle", 0.065],
          hit: [190, 0.1, "square", 0.05],
          damage: [105, 0.18, "sawtooth", 0.055],
          rare: [1180, 0.34, "sine", 0.08],
          level: [740, 0.38, "triangle", 0.08],
          correct: [932, 0.2, "sine", 0.075],
          wrong: [130, 0.22, "square", 0.035],
          pickup: [660, 0.13, "sine", 0.052],
          quiz: [523, 0.16, "triangle", 0.045],
          boss: [82, 0.62, "sawtooth", 0.085],
          blast: [155, 0.24, "square", 0.042],
          clear: [1046, 0.62, "triangle", 0.09],
        };
        const args = map[kind] || map.hit;
        tone(args[0], args[1], args[2], args[3], now);
        if (kind === "magic" || kind === "clear" || kind === "level") {
          tone(args[0] * 1.5, args[1] * 0.75, "sine", args[3] * 0.62, now + 0.05);
          tone(args[0] * 2, args[1] * 0.55, "triangle", args[3] * 0.4, now + 0.1);
        }
        if (kind === "blast" || kind === "boss") noise(0.16, 0.035, now);
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
