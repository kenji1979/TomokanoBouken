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
      id: "prince",
      name: "イケメン剣士 レオン",
      label: "王道・高速剣技",
      desc: "青いマントと光の剣を持つ、まっすぐな王子タイプ。",
      color: "#5fbdfd",
      aura: "#fff08a",
      speed: 190,
      maxHp: 150,
      maxMp: 60,
      attack: 27,
      magic: 42,
      special: "スターライトスラッシュ",
      icon: "剣",
      design: {
        skin: "#f2c097",
        hair: "#24335f",
        hair2: "#6ac7ff",
        outfit: "#2c65d8",
        cape: "#f6f0d0",
        accent: "#ffe17a",
        eyes: "#3cc8ff",
        weapon: "sword",
        mood: "brave",
      },
    },
    {
      id: "mira",
      name: "かわいい魔法剣士 ミラ",
      label: "剣と魔法の万能型",
      desc: "ピンクの髪飾りと小さな杖剣で、明るく戦うヒロイン。",
      color: "#ff83c8",
      aura: "#a6fffa",
      speed: 180,
      maxHp: 135,
      maxMp: 82,
      attack: 23,
      magic: 52,
      special: "ハートフレア",
      icon: "花",
      design: {
        skin: "#ffd0aa",
        hair: "#ff7fb7",
        hair2: "#ffd7ed",
        outfit: "#ff4fa4",
        cape: "#fff4ff",
        accent: "#78f8ff",
        eyes: "#7d3cff",
        weapon: "wand",
        mood: "smile",
      },
    },
    {
      id: "noa",
      name: "闇落ち女子 ノア",
      label: "闇魔法・連続攻撃",
      desc: "片目に闇の紋章を宿す少女。紫の刃で素早く斬る。",
      color: "#9a69ff",
      aura: "#20112f",
      speed: 205,
      maxHp: 128,
      maxMp: 78,
      attack: 25,
      magic: 56,
      special: "ダークムーン",
      icon: "闇",
      design: {
        skin: "#e8bca1",
        hair: "#17111f",
        hair2: "#8b55ff",
        outfit: "#3b204f",
        cape: "#121018",
        accent: "#ff4c91",
        eyes: "#f149ff",
        weapon: "dagger",
        mood: "dark",
      },
    },
    {
      id: "shade",
      name: "ダークヒーロー シェイド",
      label: "高火力・大剣",
      desc: "黒い外套と赤い大剣。無口だが仲間を守る影の英雄。",
      color: "#4b5268",
      aura: "#f14972",
      speed: 165,
      maxHp: 170,
      maxMp: 52,
      attack: 34,
      magic: 38,
      special: "ブラックインパクト",
      icon: "影",
      design: {
        skin: "#c99577",
        hair: "#101522",
        hair2: "#70778d",
        outfit: "#202738",
        cape: "#090b12",
        accent: "#ff355f",
        eyes: "#ff445f",
        weapon: "greatsword",
        mood: "cool",
      },
    },
    {
      id: "archer",
      name: "弓使い女子 リン",
      label: "遠距離・安全",
      desc: "緑のフードと星の弓で、遠くから仲間を支える。",
      color: "#7dff9b",
      aura: "#d7ff6d",
      speed: 198,
      maxHp: 130,
      maxMp: 68,
      attack: 24,
      magic: 44,
      special: "シャイニングアロー",
      icon: "弓",
      design: {
        skin: "#efba8b",
        hair: "#75411d",
        hair2: "#e6a44f",
        outfit: "#2f9c63",
        cape: "#184f3a",
        accent: "#d7ff6d",
        eyes: "#36e092",
        weapon: "bow",
        mood: "focus",
      },
    },
    {
      id: "kid",
      name: "元気な冒険者 ソラ",
      label: "初心者向け",
      desc: "オレンジのバンダナが目印。明るくタフな冒険好き。",
      color: "#ffb14a",
      aura: "#fff4c7",
      speed: 185,
      maxHp: 165,
      maxMp: 64,
      attack: 26,
      magic: 43,
      special: "ブレイブスマッシュ",
      icon: "星",
      design: {
        skin: "#f0b489",
        hair: "#5b341b",
        hair2: "#ffb14a",
        outfit: "#ef7135",
        cape: "#ffe39a",
        accent: "#58c7ff",
        eyes: "#2f7cff",
        weapon: "shortsword",
        mood: "smile",
      },
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

  const stageNames = ["星の森", "風の草原", "炎の山", "水晶の湖", "砂の王国", "闇の城"];
  const bossData = [
    ["ツタの大蛇", "#3fb86b", "#bdff69"],
    ["風冠のグリフォン", "#83d9ff", "#fff7a8"],
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
    objective.textContent = `${stageNames[stage]}: 敵を倒して大型ボスに挑もう。クイズはステージクリア時だけ!`;
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
    drawPlayer();
    drawParticles();
    drawTopUi();
    ctx.restore();
  }

  function drawBackground() {
    const palettes = [
      ["#123929", "#236247", "#78c86b"],
      ["#244a7a", "#54a85f", "#c5e87a"],
      ["#321917", "#8b3322", "#ff8c45"],
      ["#103553", "#1c7fa2", "#a9f4ff"],
      ["#563816", "#c3913d", "#ffe39b"],
      ["#130d20", "#30163d", "#9b3a81"],
    ];
    const gradients = palettes[state.stage] || palettes[0];
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, gradients[0]);
    g.addColorStop(0.58, gradients[1]);
    g.addColorStop(1, gradients[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    drawStageLandmarks(state.stage);
    drawPath();
    drawAmbientLights();
  }

  function drawStageLandmarks(stage) {
    if (stage === 0) drawForest();
    else if (stage === 1) drawGrassland();
    else if (stage === 2) drawVolcano();
    else if (stage === 3) drawLakeTemple();
    else if (stage === 4) drawDesertKingdom();
    else drawDarkCastle();
  }

  function drawPath() {
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = state.stage === 4 ? "#f4cb78" : "#d6b27b";
    ctx.beginPath();
    ctx.moveTo(0, 330);
    ctx.bezierCurveTo(230, 260, 330, 400, 520, 315);
    ctx.bezierCurveTo(690, 240, 780, 300, W, 225);
    ctx.lineTo(W, 310);
    ctx.bezierCurveTo(760, 400, 610, 330, 470, 410);
    ctx.bezierCurveTo(300, 505, 170, 415, 0, 470);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawForest() {
    for (let i = 0; i < 16; i += 1) {
      const x = (i * 73 + 22) % W;
      const y = 78 + ((i * 49) % 380);
      drawTree(x, y, 1 + (i % 3) * 0.18, i % 2 ? "#1f7d4c" : "#2fa35f");
    }
    drawRuins(455, 105, "#b9d7c0");
    drawCrystal(690, 142, "#8fffe2");
  }

  function drawGrassland() {
    for (let i = 0; i < 36; i += 1) {
      const x = (i * 59 + 31) % W;
      const y = 72 + ((i * 83) % 405);
      drawGrassTuft(x, y, i % 2 ? "#d4ff68" : "#8cff7a");
    }
    drawWindmill(165, 125);
    drawCrystal(720, 350, "#fff6a4");
    drawCloud(610, 94, 1.1);
    drawCloud(805, 132, 0.8);
  }

  function drawVolcano() {
    drawMountain(770, 200, 185, "#3c1f1c", "#ff693d");
    drawMountain(125, 185, 130, "#4b2620", "#ff9a3a");
    for (let i = 0; i < 12; i += 1) drawLavaCrack(70 + i * 78, 110 + ((i * 47) % 350));
    drawRuins(450, 380, "#6c4a42");
  }

  function drawLakeTemple() {
    ctx.save();
    ctx.fillStyle = "rgba(148, 237, 255, 0.35)";
    ctx.beginPath();
    ctx.ellipse(650, 285, 250, 115, -0.08, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(220,255,255,0.5)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.ellipse(650, 285, 100 + i * 34, 38 + i * 16, -0.08, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
    drawTemple(185, 125, "#e6fbff");
    drawCrystal(470, 138, "#bdf7ff");
  }

  function drawDesertKingdom() {
    for (let i = 0; i < 9; i += 1) drawDune(60 + i * 118, 410 - (i % 3) * 36);
    drawPyramid(750, 142, 160);
    drawPyramid(155, 165, 110);
    for (let i = 0; i < 10; i += 1) drawCactus(90 + i * 86, 120 + ((i * 61) % 315));
  }

  function drawDarkCastle() {
    drawCastle(685, 126);
    for (let i = 0; i < 20; i += 1) {
      drawThorn(40 + i * 48, 92 + ((i * 71) % 390));
    }
    drawCrystal(235, 392, "#ff4c91");
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawAmbientLights() {
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 44; i += 1) {
      const x = (i * 137 + state.stage * 79) % W;
      const y = 58 + ((i * 83) % (H - 110));
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 4), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, H - 34, W, 34);
    ctx.restore();
  }

  function drawTree(x, y, scale, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#5b371d";
    ctx.fillRect(-6, 8, 12, 34);
    ctx.fillStyle = color;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc((i - 1) * 14, 0, 24, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGrassTuft(x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 8, y - 3);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 9, y - 4);
    ctx.stroke();
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

  function drawRuins(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 52, y + 42, 104, 15);
    ctx.fillRect(x - 42, y, 18, 55);
    ctx.fillRect(x + 20, y + 12, 18, 43);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x - 16, y + 22, 31, 35);
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
    const oldCtx = ctx;
    const target = targetCtx;
    target.clearRect(0, 0, 120, 120);
    target.save();
    target.scale(scale, scale);
    target.translate(60, 62);
    drawHeroFigure(target, hero, 0, 0, 1.45, 0, true);
    target.restore();
    return oldCtx;
  }

  function drawPlayer() {
    const p = state.player;
    ctx.save();
    if (p.invuln > 0) ctx.globalAlpha = 0.55 + Math.sin(state.time * 45) * 0.25;
    drawHeroFigure(ctx, state.hero, p.x, p.y, 0.78, Math.atan2(p.dirY, p.dirX), false);
    ctx.restore();
  }

  function drawHeroFigure(target, hero, x, y, scale, angle, portrait) {
    const d = hero.design;
    target.save();
    target.translate(x, y);
    target.scale(scale, scale);
    target.shadowColor = hero.aura;
    target.shadowBlur = portrait ? 18 : 12;

    target.fillStyle = d.cape;
    target.beginPath();
    target.moveTo(-24, -2);
    target.quadraticCurveTo(0, 26, 28, -2);
    target.lineTo(22, 44);
    target.quadraticCurveTo(0, 58, -24, 44);
    target.closePath();
    target.fill();

    target.fillStyle = d.outfit;
    roundRect(target, -18, -6, 36, 48, 10);
    target.fill();
    target.fillStyle = d.accent;
    target.fillRect(-4, -5, 8, 48);
    target.fillRect(-18, 14, 36, 6);

    target.fillStyle = d.skin;
    target.beginPath();
    target.arc(0, -30, 22, 0, TAU);
    target.fill();

    target.fillStyle = d.hair;
    target.beginPath();
    target.arc(0, -39, 24, Math.PI, TAU);
    target.lineTo(22, -29);
    target.quadraticCurveTo(10, -54, -24, -25);
    target.closePath();
    target.fill();
    target.fillStyle = d.hair2;
    target.beginPath();
    target.moveTo(-15, -47);
    target.quadraticCurveTo(-4, -58, 10, -46);
    target.quadraticCurveTo(0, -39, -15, -47);
    target.fill();

    target.fillStyle = d.eyes;
    target.beginPath();
    target.arc(-8, -30, 2.6, 0, TAU);
    target.arc(8, -30, 2.6, 0, TAU);
    target.fill();
    target.strokeStyle = d.mood === "dark" ? d.accent : "rgba(70,28,28,0.75)";
    target.lineWidth = 2;
    target.beginPath();
    if (d.mood === "smile") target.arc(0, -23, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    else if (d.mood === "dark") {
      target.moveTo(-11, -38);
      target.lineTo(-3, -35);
      target.moveTo(3, -35);
      target.lineTo(12, -39);
    } else {
      target.moveTo(-6, -22);
      target.lineTo(7, -22);
    }
    target.stroke();

    target.strokeStyle = d.skin;
    target.lineWidth = 8;
    target.lineCap = "round";
    target.beginPath();
    target.moveTo(-18, 2);
    target.lineTo(-34, 17);
    target.moveTo(18, 2);
    target.lineTo(34, 17);
    target.stroke();

    drawHeroWeapon(target, d.weapon, d.accent, angle, portrait);

    target.strokeStyle = d.outfit;
    target.lineWidth = 9;
    target.beginPath();
    target.moveTo(-9, 39);
    target.lineTo(-14, 58);
    target.moveTo(9, 39);
    target.lineTo(14, 58);
    target.stroke();
    target.restore();
  }

  function drawHeroWeapon(target, weapon, color, angle, portrait) {
    target.save();
    target.strokeStyle = color;
    target.fillStyle = color;
    target.lineCap = "round";
    target.lineWidth = portrait ? 5 : 6;
    if (!portrait) target.rotate(angle);
    if (weapon === "bow") {
      target.beginPath();
      target.arc(42, 2, 26, -1.2, 1.2);
      target.stroke();
      target.beginPath();
      target.moveTo(42, -24);
      target.lineTo(42, 28);
      target.stroke();
    } else if (weapon === "wand") {
      target.beginPath();
      target.moveTo(36, 16);
      target.lineTo(54, -26);
      target.stroke();
      target.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const a = -Math.PI / 2 + (TAU * i) / 5;
        target.lineTo(54 + Math.cos(a) * 11, -26 + Math.sin(a) * 11);
      }
      target.closePath();
      target.fill();
    } else {
      const len = weapon === "greatsword" ? 64 : weapon === "dagger" ? 38 : 52;
      target.beginPath();
      target.moveTo(30, 18);
      target.lineTo(30 + len, -18);
      target.stroke();
      target.strokeStyle = "#f8fbff";
      target.lineWidth = weapon === "greatsword" ? 9 : 5;
      target.beginPath();
      target.moveTo(36, 12);
      target.lineTo(30 + len, -18);
      target.stroke();
    }
    target.restore();
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
    if (!state.boss) {
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
