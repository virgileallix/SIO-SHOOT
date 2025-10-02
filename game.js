// ============================================
// CONFIGURATION ET INITIALISATION
// ============================================

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVR6PulRxYb4BYBwglmy-uw1sc-JMIbzo",
    authDomain: "csweb-428eb.firebaseapp.com",
    databaseURL: "https://csweb-428eb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "csweb-428eb",
    storageBucket: "csweb-428eb.firebasestorage.app",
    messagingSenderId: "698101872735",
    appId: "1:698101872735:web:0950c951015b8f58a243ea"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.database();
window.auth = firebase.auth();

// État global du jeu
window.gameState = {
    currentUser: null,
    userProfile: null,
    inventory: { skins: ['default'], equipped: 'default' },
    settings: {
        keys: { up: 'Z', down: 'S', left: 'Q', right: 'D', reload: 'R', buy: 'B' },
        mouseSensitivity: 1.0
    },
    weapons: {
        "Classic": { type: "pistol", damage: 26, magazine: 12, spread: 0.05, range: 1200, price: 0 },
        "Sheriff": { type: "pistol", damage: 55, magazine: 6, spread: 0.03, range: 1500, price: 800 },
        "Phantom": { type: "rifle", damage: 39, magazine: 30, spread: 0.04, range: 1800, price: 2900 },
        "Vandal": { type: "rifle", damage: 40, magazine: 25, spread: 0.045, range: 2000, price: 2900 },
        "Operator": { type: "sniper", damage: 150, magazine: 5, spread: 0.005, range: 5000, price: 4700 }
    },
    maps: {
        map1: {
            name: "Haven",
            width: 3200,
            height: 2400,
            walls: [
                { x: 0, y: 0, width: 3200, height: 50 },
                { x: 0, y: 2350, width: 3200, height: 50 },
                { x: 0, y: 0, width: 50, height: 2400 },
                { x: 3150, y: 0, width: 50, height: 2400 },
                { x: 400, y: 400, width: 200, height: 600 },
                { x: 1000, y: 800, width: 300, height: 200 },
                { x: 2000, y: 600, width: 400, height: 150 }
            ],
            sites: [
                { name: "A", x: 800, y: 600 },
                { name: "B", x: 2400, y: 1800 }
            ],
            spawns: {
                ATK: [
                    { x: 200, y: 1200 }, { x: 300, y: 1200 }, { x: 400, y: 1200 },
                    { x: 200, y: 1300 }, { x: 300, y: 1300 }
                ],
                DEF: [
                    { x: 2800, y: 600 }, { x: 2900, y: 600 }, { x: 3000, y: 600 },
                    { x: 2800, y: 700 }, { x: 2900, y: 700 }
                ]
            }
        }
    }
};

// ============================================
// SCÈNE: MAIN MENU
// ============================================
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        this.add.text(640, 100, 'TACTICAL SHOOTER', {
            fontSize: '64px',
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const userInfo = window.gameState.userProfile;
        this.add.text(20, 20, `Joueur: ${userInfo.name}`, { fontSize: '18px', color: '#ffffff' });
        this.add.text(20, 45, `Crédits: ${userInfo.currency || 0}`, { fontSize: '18px', color: '#ffff00' });

        let yPos = 250;
        this.add.text(640, yPos, 'Sélectionner le mode:', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        yPos += 50;

        this.selectedMode = '5v5';
        this.modeButtons = {};
        const modes = ['2v2', '3v3', '5v5'];
        
        modes.forEach((mode, index) => {
            const btn = this.add.text(640 - 100 + index * 100, yPos, mode, {
                fontSize: '20px',
                color: mode === this.selectedMode ? '#00ff00' : '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 15, y: 10 }
            }).setOrigin(0.5).setInteractive();
            
            btn.on('pointerdown', () => {
                this.selectedMode = mode;
                Object.values(this.modeButtons).forEach(b => b.setColor('#ffffff'));
                btn.setColor('#00ff00');
            });
            this.modeButtons[mode] = btn;
        });
        yPos += 80;

        this.botFill = true;
        this.botFillText = this.add.text(640, yPos, `Remplir avec bots: OUI`, {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        this.botFillText.on('pointerdown', () => {
            this.botFill = !this.botFill;
            this.botFillText.setText(`Remplir avec bots: ${this.botFill ? 'OUI' : 'NON'}`);
        });
        yPos += 80;

        const playBtn = this.add.text(640, yPos, 'JOUER', {
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#222222',
            padding: { x: 50, y: 15 }
        }).setOrigin(0.5).setInteractive();
        
        playBtn.on('pointerdown', () => {
            const maxPlayers = parseInt(this.selectedMode.charAt(0)) * 2;
            this.scene.start('Lobby', {
                mode: this.selectedMode,
                maxPlayers,
                botFill: this.botFill,
                map: 'map1'
            });
        });
    }
}

// ============================================
// SCÈNE: LOBBY
// ============================================
class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Lobby' });
    }

    init(data) {
        this.lobbyData = data;
        this.isHost = true;
    }

    async create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        this.add.text(640, 50, 'LOBBY', { fontSize: '48px', color: '#00ffff' }).setOrigin(0.5);

        await this.createLobby();
        this.setupUI();
    }

    async createLobby() {
        const code = Math.random().toString(36).substr(2, 6).toUpperCase();
        const user = window.gameState.currentUser;
        
        this.lobbyRef = window.db.ref(`lobbies/${code}`);
        await this.lobbyRef.set({
            code,
            hostUid: user.uid,
            mode: this.lobbyData.mode,
            map: this.lobbyData.map,
            botFill: this.lobbyData.botFill,
            maxPlayers: this.lobbyData.maxPlayers,
            state: 'waiting',
            players: {
                [user.uid]: {
                    name: window.gameState.userProfile.name,
                    team: 'ATK',
                    ready: false,
                    isBot: false
                }
            }
        });

        this.currentLobby = { code, ...this.lobbyData };
    }

    setupUI() {
        this.add.text(100, 120, `Code: ${this.currentLobby.code}`, { fontSize: '24px', color: '#ffff00' });
        this.add.text(100, 160, `Mode: ${this.currentLobby.mode}`, { fontSize: '20px', color: '#ffffff' });

        this.playerSlots = [];
        let y = 220;
        for (let i = 0; i < this.currentLobby.maxPlayers; i++) {
            const team = i < this.currentLobby.maxPlayers / 2 ? 'ATK' : 'DEF';
            const x = i >= this.currentLobby.maxPlayers / 2 ? 700 : 100;
            
            const slot = this.add.text(x, y, `[${team}] Slot ${i + 1}: Vide`, {
                fontSize: '18px',
                color: team === 'ATK' ? '#ff6666' : '#6666ff'
            });
            this.playerSlots.push(slot);
            
            y += 30;
            if ((i + 1) === this.currentLobby.maxPlayers / 2) y = 220;
        }

        const startBtn = this.add.text(640, 600, 'DÉMARRER', {
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#222222',
            padding: { x: 40, y: 15 }
        }).setOrigin(0.5).setInteractive();

        startBtn.on('pointerdown', () => this.startMatch());

        const backBtn = this.add.text(100, 600, 'RETOUR', {
            fontSize: '24px',
            color: '#ff0000',
            backgroundColor: '#222222',
            padding: { x: 30, y: 10 }
        }).setInteractive();
        
        backBtn.on('pointerdown', () => {
            if (this.lobbyRef) this.lobbyRef.remove();
            this.scene.start('MainMenu');
        });

        this.startListening();
    }

    startListening() {
        this.lobbyRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                this.scene.start('MainMenu');
                return;
            }

            this.updatePlayerList(data.players || {});

            if (this.isHost && data.botFill) {
                this.fillWithBots(data);
            }

            if (data.state === 'running') {
                this.lobbyRef.off();
                this.scene.start('Match', { lobby: data });
            }
        });
    }

    updatePlayerList(players) {
        this.playerSlots.forEach((slot, index) => {
            const team = index < this.currentLobby.maxPlayers / 2 ? 'ATK' : 'DEF';
            slot.setText(`[${team}] Slot ${index + 1}: Vide`);
        });

        Object.entries(players).forEach(([uid, player], index) => {
            if (this.playerSlots[index]) {
                const prefix = player.isBot ? '[BOT] ' : '';
                this.playerSlots[index].setText(`[${player.team}] ${prefix}${player.name}`);
            }
        });
    }

    async fillWithBots(lobbyData) {
        const players = Object.keys(lobbyData.players || {}).length;
        const needed = lobbyData.maxPlayers - players;

        if (needed > 0) {
            for (let i = 0; i < needed; i++) {
                const botId = `bot_${Date.now()}_${i}`;
                const team = players + i < lobbyData.maxPlayers / 2 ? 'ATK' : 'DEF';
                
                await this.lobbyRef.child(`players/${botId}`).set({
                    name: `Bot${i + 1}`,
                    team,
                    ready: true,
                    isBot: true
                });
            }
        }
    }

    async startMatch() {
        await this.lobbyRef.update({ state: 'running' });
    }
}

// ============================================
// SCÈNE: MATCH (JEU PRINCIPAL)
// ============================================
class MatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Match' });
    }

    init(data) {
        this.lobbyData = data.lobby;
        this.currentRound = 1;
        this.teamScores = { ATK: 0, DEF: 0 };
        this.roundPhase = 'pre';
        this.phaseTimer = 0;
        this.players = {};
        this.bots = {};
        this.bullets = [];
    }

    create() {
        this.loadMap();
        this.createPlayers();
        this.setupCamera();
        this.scene.launch('HUD', { match: this });
        this.setupInput();
        this.startRound();
    }

    loadMap() {
        const mapData = window.gameState.maps.map1;
        this.mapData = mapData;
        
        this.add.rectangle(0, 0, mapData.width, mapData.height, 0x1a1a2e).setOrigin(0);
        this.physics.world.setBounds(0, 0, mapData.width, mapData.height);
        
        this.wallsGroup = this.physics.add.staticGroup();
        mapData.walls.forEach(wall => {
            const w = this.add.rectangle(wall.x, wall.y, wall.width, wall.height, 0x444444).setOrigin(0);
            this.wallsGroup.add(w);
            this.physics.add.existing(w, true);
        });
        
        mapData.sites.forEach(site => {
            this.add.circle(site.x, site.y, 50, site.name === 'A' ? 0xff6666 : 0x6666ff, 0.3);
            this.add.text(site.x, site.y, site.name, { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
        });
    }

    createPlayers() {
        Object.entries(this.lobbyData.players).forEach(([uid, playerData]) => {
            const spawns = this.mapData.spawns[playerData.team];
            const spawn = spawns[Math.floor(Math.random() * spawns.length)];
            
            if (playerData.isBot) {
                this.createBot(uid, playerData, spawn);
            } else {
                this.createPlayer(uid, playerData, spawn);
            }
        });
    }

    createPlayer(uid, data, spawn) {
        const sprite = this.add.circle(spawn.x, spawn.y, 20, data.team === 'ATK' ? 0xff3333 : 0x3333ff);
        this.physics.add.existing(sprite);
        sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(sprite, this.wallsGroup);
        
        const nameText = this.add.text(0, -30, data.name, {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        
        this.players[uid] = {
            uid, sprite, nameText, data,
            hp: 100, money: 800,
            inventory: { secondary: { name: 'Classic', ...window.gameState.weapons.Classic } },
            currentWeapon: 'secondary',
            ammo: 12, maxAmmo: 12,
            isAlive: true
        };
    }

    createBot(uid, data, spawn) {
        const sprite = this.add.circle(spawn.x, spawn.y, 20, data.team === 'ATK' ? 0xff6666 : 0x6666ff);
        this.physics.add.existing(sprite);
        sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(sprite, this.wallsGroup);
        
        const nameText = this.add.text(0, -30, data.name, {
            fontSize: '14px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        
        this.bots[uid] = {
            uid, sprite, nameText, data,
            hp: 100, money: 800,
            inventory: { secondary: { name: 'Classic', ...window.gameState.weapons.Classic } },
            currentWeapon: 'secondary',
            ammo: 12, maxAmmo: 12,
            isAlive: true,
            ai: { target: null, lastShot: 0 }
        };
    }

    setupCamera() {
        const player = this.players[window.gameState.currentUser.uid];
        if (player) {
            this.cameras.main.startFollow(player.sprite);
            this.cameras.main.setBounds(0, 0, this.mapData.width, this.mapData.height);
        }
    }

    setupInput() {
        this.keys = this.input.keyboard.addKeys({
            up: this.input.keyboard.addKey(window.gameState.settings.keys.up),
            down: this.input.keyboard.addKey(window.gameState.settings.keys.down),
            left: this.input.keyboard.addKey(window.gameState.settings.keys.left),
            right: this.input.keyboard.addKey(window.gameState.settings.keys.right),
            reload: this.input.keyboard.addKey(window.gameState.settings.keys.reload)
        });

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButton) this.shoot();
        });
    }

    startRound() {
        this.roundPhase = 'pre';
        this.phaseTimer = 3;
        
        Object.values(this.players).concat(Object.values(this.bots)).forEach(p => {
            p.hp = 100;
            p.isAlive = true;
            p.sprite.setAlpha(1);
            const spawns = this.mapData.spawns[p.data.team];
            const spawn = spawns[Math.floor(Math.random() * spawns.length)];
            p.sprite.setPosition(spawn.x, spawn.y);
        });
        
        this.showToast(`Round ${this.currentRound}`);
        
        this.time.delayedCall(3000, () => {
            this.roundPhase = 'buy';
            this.phaseTimer = 20;
            this.showToast('Phase d\'achat!');
            
            this.time.delayedCall(20000, () => {
                this.roundPhase = 'action';
                this.phaseTimer = 100;
                this.showToast('GO!');
            });
        });
    }

    update(time, delta) {
        this.updatePhaseTimer(delta);
        this.updatePlayers();
        this.updateBots(time);
        this.updateBullets();
        this.checkRoundEnd();
    }

    updatePhaseTimer(delta) {
        if (this.roundPhase === 'buy' || this.roundPhase === 'action') {
            this.phaseTimer -= delta / 1000;
            if (this.phaseTimer <= 0) {
                if (this.roundPhase === 'buy') {
                    this.roundPhase = 'action';
                    this.phaseTimer = 100;
                } else {
                    this.endRound('DEF');
                }
            }
        }
    }

    updatePlayers() {
        const player = this.players[window.gameState.currentUser.uid];
        if (!player || !player.isAlive) return;

        const speed = 200;
        let vx = 0, vy = 0;

        if (this.keys.left.isDown) vx = -speed;
        if (this.keys.right.isDown) vx = speed;
        if (this.keys.up.isDown) vy = -speed;
        if (this.keys.down.isDown) vy = speed;

        player.sprite.body.setVelocity(vx, vy);

        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            player.sprite.x, player.sprite.y,
            pointer.worldX, pointer.worldY
        );
        player.sprite.rotation = angle;
        player.nameText.setPosition(player.sprite.x, player.sprite.y - 30);

        if (Phaser.Input.Keyboard.JustDown(this.keys.reload)) {
            const weapon = player.inventory[player.currentWeapon];
            if (weapon) player.ammo = weapon.magazine;
        }
    }

    updateBots(time) {
        Object.values(this.bots).forEach(bot => {
            if (!bot.isAlive) return;

            const enemies = Object.values(this.players).concat(Object.values(this.bots))
                .filter(p => p.isAlive && p.data.team !== bot.data.team);

            if (enemies.length > 0) {
                const target = enemies[0];
                const angle = Phaser.Math.Angle.Between(
                    bot.sprite.x, bot.sprite.y,
                    target.sprite.x, target.sprite.y
                );
                const dist = Phaser.Math.Distance.Between(
                    bot.sprite.x, bot.sprite.y,
                    target.sprite.x, target.sprite.y
                );

                bot.sprite.rotation = angle;

                if (dist > 300) {
                    bot.sprite.body.setVelocity(
                        Math.cos(angle) * 150,
                        Math.sin(angle) * 150
                    );
                } else {
                    bot.sprite.body.setVelocity(0, 0);
                    if (time - bot.ai.lastShot > 500) {
                        this.botShoot(bot, time);
                    }
                }
            }

            bot.nameText.setPosition(bot.sprite.x, bot.sprite.y - 30);
        });
    }

    shoot() {
        const player = this.players[window.gameState.currentUser.uid];
        if (!player || !player.isAlive || this.roundPhase !== 'action') return;

        const weapon = player.inventory[player.currentWeapon];
        if (!weapon || player.ammo <= 0) return;

        player.ammo--;
        const angle = player.sprite.rotation;
        const spread = weapon.spread * (Math.random() - 0.5) * 2;
        this.createBullet(player.sprite.x, player.sprite.y, angle + spread, weapon, player.data.team);
    }

    botShoot(bot, time) {
        const weapon = bot.inventory[bot.currentWeapon];
        if (!weapon || bot.ammo <= 0) return;

        bot.ammo--;
        bot.ai.lastShot = time;
        const angle = bot.sprite.rotation;
        const spread = weapon.spread * (Math.random() - 0.5) * 2;
        this.createBullet(bot.sprite.x, bot.sprite.y, angle + spread, weapon, bot.data.team);
    }

    createBullet(x, y, angle, weapon, team) {
        this.bullets.push({
            x, y, angle, weapon, team,
            vx: Math.cos(angle) * 1000,
            vy: Math.sin(angle) * 1000,
            graphics: this.add.circle(x, y, 3, 0xffff00),
            distance: 0,
            maxDistance: weapon.range,
            damage: weapon.damage
        });
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx * 0.016;
            bullet.y += bullet.vy * 0.016;
            bullet.distance += Math.sqrt(bullet.vx ** 2 + bullet.vy ** 2) * 0.016;
            bullet.graphics.setPosition(bullet.x, bullet.y);

            if (this.checkBulletCollision(bullet)) {
                bullet.graphics.destroy();
                return false;
            }

            if (bullet.distance >= bullet.maxDistance) {
                bullet.graphics.destroy();
                return false;
            }

            return true;
        });
    }

    checkBulletCollision(bullet) {
        const hitWall = this.wallsGroup.children.entries.some(wall => {
            return Phaser.Geom.Rectangle.Contains(wall.getBounds(), bullet.x, bullet.y);
        });
        if (hitWall) return true;

        const allEntities = Object.values(this.players).concat(Object.values(this.bots));
        for (let entity of allEntities) {
            if (!entity.isAlive || entity.data.team === bullet.team) continue;
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, entity.sprite.x, entity.sprite.y);
            if (dist < 20) {
                entity.hp -= bullet.damage;
                if (entity.hp <= 0) {
                    entity.hp = 0;
                    entity.isAlive = false;
                    entity.sprite.setAlpha(0.3);
                }
                return true;
            }
        }
        return false;
    }

    checkRoundEnd() {
        if (this.roundPhase === 'post') return;

        const atkAlive = Object.values(this.players).concat(Object.values(this.bots))
            .filter(p => p.isAlive && p.data.team === 'ATK').length;
        const defAlive = Object.values(this.players).concat(Object.values(this.bots))
            .filter(p => p.isAlive && p.data.team === 'DEF').length;

        if (atkAlive === 0) this.endRound('DEF');
        else if (defAlive === 0) this.endRound('ATK');
    }

    endRound(winner) {
        if (this.roundPhase === 'post') return;
        this.roundPhase = 'post';
        this.teamScores[winner]++;

        Object.values(this.players).concat(Object.values(this.bots)).forEach(p => {
            p.money += p.data.team === winner ? 3000 : 1900;
        });

        this.showToast(`${winner} GAGNE!`, 3000);

        this.time.delayedCall(3000, () => {
            this.currentRound++;
            if (this.teamScores.ATK >= 7 || this.teamScores.DEF >= 7) {
                this.endMatch();
            } else {
                this.startRound();
            }
        });
    }

    endMatch() {
        const winner = this.teamScores.ATK > this.teamScores.DEF ? 'ATK' : 'DEF';
        this.showToast(`${winner} VICTOIRE!`, 5000);
        this.time.delayedCall(5000, () => {
            this.scene.stop('HUD');
            this.scene.start('MainMenu');
        });
    }

    showToast(message, duration = 2000) {
        const toast = this.add.text(640, 360, message, {
            fontSize: '48px',
            color: '#00ffff',
            backgroundColor: '#000000',
            padding: { x: 40, y: 20 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

        this.time.delayedCall(duration, () => toast.destroy());
    }
}

// ============================================
// SCÈNE: HUD
// ============================================
class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUD' });
    }

    init(data) {
        this.matchScene = data.match;
    }

    create() {
        this.healthText = this.add.text(20, 640, '', { fontSize: '24px', color: '#00ff00' }).setScrollFactor(0);
        this.ammoText = this.add.text(1130, 640, '', { fontSize: '24px', color: '#ffff00' }).setScrollFactor(0);
        this.timerText = this.add.text(640, 20, '', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
        this.scoreText = this.add.text(640, 60, '', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
        this.moneyText = this.add.text(20, 20, '', { fontSize: '20px', color: '#ffff00' }).setScrollFactor(0);
    }

    update() {
        if (!this.matchScene) return;
        const player = this.matchScene.players[window.gameState.currentUser.uid];
        if (player) {
            this.healthText.setText(`HP: ${Math.max(0, Math.floor(player.hp))}`);
            this.healthText.setColor(player.hp > 50 ? '#00ff00' : player.hp > 25 ? '#ffff00' : '#ff0000');
            this.ammoText.setText(`Munitions: ${player.ammo} / ${player.maxAmmo}`);
            this.moneyText.setText(`$${player.money}`);
        }
        this.timerText.setText(`${Math.ceil(this.matchScene.phaseTimer)}s`);
        this.scoreText.setText(`ATK ${this.matchScene.teamScores.ATK} - ${this.matchScene.teamScores.DEF} DEF`);
    }
}

// ============================================
// AUTHENTIFICATION ET LANCEMENT
// ============================================
window.auth.signInAnonymously().then(async (userCredential) => {
    window.gameState.currentUser = userCredential.user;
    console.log('✅ Authentification réussie:', userCredential.user.uid);
    
    const userRef = window.db.ref(`users/${userCredential.user.uid}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || {};
    
    if (!userData.name) {
        userData.name = `Player${Math.floor(Math.random() * 9999)}`;
        userData.currency = 5000;
        userData.inventory = { skins: ['default'], equipped: 'default' };
        await userRef.set(userData);
    }
    
    window.gameState.userProfile = userData;
    document.getElementById('loading').innerHTML = '<h2>✅ Prêt!</h2>';
    
    setTimeout(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            parent: 'game-container',
            backgroundColor: '#0a0e27',
            physics: {
                default: 'arcade',
                arcade: { debug: false, gravity: { y: 0 } }
            },
            scene: [MainMenuScene, LobbyScene, MatchScene, HUDScene]
        };
        
        new Phaser.Game(config);
        document.getElementById('loading').style.display = 'none';
        console.log('✅ Jeu lancé!');
    }, 500);
    
}).catch((error) => {
    console.error('❌ Erreur auth:', error);
    document.getElementById('loading').innerHTML = `
        <h2>❌ Erreur d'authentification</h2>
        <p>Activez l'authentification anonyme dans Firebase Console</p>
        <p style="color: #ff6666; font-size: 14px;">${error.message}</p>
    `;
});