// ============================================
// CONFIGURATION FIREBASE
// ============================================
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

// ============================================
// DONNÉES DU JEU
// ============================================
window.gameData = {
    weapons: {
        "Classic": { 
            type: "pistol", damage: 26, magazine: 12, fireRate: 400,
            spread: 0.05, range: 1200, price: 0, color: 0x888888
        },
        "Sheriff": { 
            type: "pistol", damage: 55, magazine: 6, fireRate: 600,
            spread: 0.03, range: 1500, price: 800, color: 0xcccccc
        },
        "Stinger": { 
            type: "smg", damage: 18, magazine: 20, fireRate: 100,
            spread: 0.08, range: 800, price: 1100, color: 0xffaa00
        },
        "Spectre": { 
            type: "smg", damage: 22, magazine: 30, fireRate: 120,
            spread: 0.07, range: 1000, price: 1600, color: 0xff6600
        },
        "Phantom": { 
            type: "rifle", damage: 39, magazine: 30, fireRate: 140,
            spread: 0.04, range: 1800, price: 2900, color: 0x00ffff
        },
        "Vandal": { 
            type: "rifle", damage: 40, magazine: 25, fireRate: 160,
            spread: 0.045, range: 2000, price: 2900, color: 0xff0088
        },
        "Guardian": { 
            type: "rifle", damage: 65, magazine: 12, fireRate: 450,
            spread: 0.02, range: 2200, price: 2400, color: 0x00ff88
        },
        "Marshal": { 
            type: "sniper", damage: 101, magazine: 5, fireRate: 1200,
            spread: 0.01, range: 3000, price: 950, color: 0x8800ff
        },
        "Operator": { 
            type: "sniper", damage: 150, magazine: 5, fireRate: 1500,
            spread: 0.005, range: 5000, price: 4700, color: 0xffff00
        }
    },
    
    skins: {
        "default": { 
            name: "Default", price: 0, rarity: "common", 
            color: 0x888888, glow: false, particle: false 
        },
        "chrome": { 
            name: "Chrome", price: 500, rarity: "common", 
            color: 0xcccccc, glow: false, particle: false 
        },
        "blue_steel": { 
            name: "Blue Steel", price: 800, rarity: "uncommon", 
            color: 0x4488ff, glow: false, particle: false 
        },
        "crimson_web": { 
            name: "Crimson Web", price: 1200, rarity: "rare", 
            color: 0xff0044, glow: false, particle: false 
        },
        "neon_rider": { 
            name: "Neon Rider", price: 2000, rarity: "epic", 
            color: 0x00ffff, glow: true, particle: false 
        },
        "dragon_lore": { 
            name: "Dragon Lore", price: 3500, rarity: "legendary", 
            color: 0xff8800, glow: true, particle: true 
        },
        "fade": { 
            name: "Fade", price: 2500, rarity: "epic", 
            color: 0xff00ff, glow: true, particle: false 
        },
        "fire_serpent": { 
            name: "Fire Serpent", price: 4000, rarity: "legendary", 
            color: 0xff4400, glow: true, particle: true 
        },
        "ice_coaled": { 
            name: "Ice Coaled", price: 3000, rarity: "legendary", 
            color: 0x00ddff, glow: true, particle: true 
        }
    },
    
    maps: {
        haven: {
            name: "Haven", width: 3200, height: 2400,
            walls: [
                { x: 0, y: 0, width: 3200, height: 50 },
                { x: 0, y: 2350, width: 3200, height: 50 },
                { x: 0, y: 0, width: 50, height: 2400 },
                { x: 3150, y: 0, width: 50, height: 2400 },
                { x: 400, y: 400, width: 200, height: 600 },
                { x: 1000, y: 800, width: 300, height: 200 },
                { x: 2000, y: 600, width: 400, height: 150 },
                { x: 1500, y: 1200, width: 200, height: 400 },
                { x: 800, y: 1600, width: 500, height: 100 }
            ],
            sites: [
                { name: "A", x: 800, y: 600, radius: 100 },
                { name: "B", x: 2400, y: 1800, radius: 100 }
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

window.gameState = {
    currentUser: null,
    userProfile: null,
    inventory: { 
        skins: ['default'], 
        equipped: { primary: 'default', secondary: 'default' } 
    },
    settings: {
        keys: { up: 'Z', down: 'S', left: 'Q', right: 'D', reload: 'R', buy: 'B' }
    }
};

// ============================================
// UTILITAIRES
// ============================================
function getRarityColor(rarity) {
    const colors = {
        common: '#888888',
        uncommon: '#44ff44',
        rare: '#4488ff',
        epic: '#ff00ff',
        legendary: '#ffaa00'
    };
    return colors[rarity] || colors.common;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ============================================
// SCÈNE: MENU PRINCIPAL
// ============================================
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        this.createBackground();
        this.createHeader();
        this.createProfile();
        this.createModeSelection();
        this.createMainButtons();
        this.createFooter();
    }

    createBackground() {
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        
        // Particules d'ambiance
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 1280;
            const y = Math.random() * 720;
            const size = Math.random() * 3 + 1;
            const particle = this.add.circle(x, y, size, 0x00ffff, 0.3);
            
            this.tweens.add({
                targets: particle,
                alpha: { from: 0.1, to: 0.5 },
                y: y - 50,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                yoyo: true
            });
        }
        
        // Grille de fond
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x00ffff, 0.05);
        for (let i = 0; i < 1280; i += 40) {
            graphics.lineBetween(i, 0, i, 720);
        }
        for (let i = 0; i < 720; i += 40) {
            graphics.lineBetween(0, i, 1280, i);
        }
    }

    createHeader() {
        const title = this.add.text(640, 80, 'TACTICAL OPS', {
            fontSize: '72px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        this.add.text(640, 130, 'PRO EDITION', {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            color: '#00ffff'
        }).setOrigin(0.5);
    }

    createProfile() {
        const user = window.gameState.userProfile;
        
        const profileBg = this.add.rectangle(200, 200, 340, 120, 0x1a1e3a, 0.9);
        profileBg.setStrokeStyle(2, 0x00ffff);
        
        this.add.text(60, 160, `👤 ${user.name}`, {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        });
        
        this.add.text(60, 195, `Niveau ${user.level || 1}`, {
            fontSize: '18px',
            color: '#00ffff'
        });
        
        const xpBar = this.add.rectangle(60, 225, 280, 10, 0x333333);
        xpBar.setOrigin(0, 0.5);
        const xpFill = this.add.rectangle(60, 225, 200, 10, 0x00ffff);
        xpFill.setOrigin(0, 0.5);
        
        this.add.text(60, 245, `💰 ${formatNumber(user.currency || 5000)} crédits`, {
            fontSize: '18px',
            color: '#ffff00'
        });
    }

    createModeSelection() {
        this.add.text(640, 300, 'MODE DE JEU', {
            fontSize: '28px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.selectedMode = '5v5';
        this.modeButtons = {};
        const modes = [
            { id: '2v2', name: '2v2\nDUEL', color: 0xff6666 },
            { id: '3v3', name: '3v3\nSKIRMISH', color: 0xffaa66 },
            { id: '5v5', name: '5v5\nCOMPETITIVE', color: 0x66ff66 }
        ];
        
        modes.forEach((mode, index) => {
            const x = 400 + index * 200;
            const y = 380;
            
            const bg = this.add.rectangle(x, y, 160, 120, mode.color, 0.2);
            bg.setStrokeStyle(3, mode.id === this.selectedMode ? 0x00ffff : 0x666666);
            bg.setInteractive({ useHandCursor: true });
            
            const text = this.add.text(x, y, mode.name, {
                fontSize: '20px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            bg.on('pointerdown', () => {
                this.selectedMode = mode.id;
                Object.values(this.modeButtons).forEach(btn => {
                    btn.bg.setStrokeStyle(3, 0x666666);
                });
                bg.setStrokeStyle(3, 0x00ffff);
            });
            
            bg.on('pointerover', () => {
                bg.setFillStyle(mode.color, 0.4);
                this.tweens.add({
                    targets: bg,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200
                });
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(mode.color, 0.2);
                this.tweens.add({
                    targets: bg,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200
                });
            });
            
            this.modeButtons[mode.id] = { bg, text };
        });

        // Toggle Bots
        this.botFill = true;
        const botBg = this.add.rectangle(640, 500, 300, 50, 0x1a1e3a);
        botBg.setStrokeStyle(2, 0x00ffff);
        botBg.setInteractive({ useHandCursor: true });
        
        this.botText = this.add.text(640, 500, '🤖 Remplir avec bots: OUI', {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            color: '#00ff88'
        }).setOrigin(0.5);
        
        botBg.on('pointerdown', () => {
            this.botFill = !this.botFill;
            this.botText.setText(`🤖 Remplir avec bots: ${this.botFill ? 'OUI' : 'NON'}`);
            this.botText.setColor(this.botFill ? '#00ff88' : '#ff6666');
        });
    }

    createMainButtons() {
        const buttons = [
            { 
                text: '▶ JOUER', 
                y: 570, 
                color: 0x00ff88, 
                action: () => this.startGame() 
            },
            { 
                text: '🛒 BOUTIQUE', 
                y: 630, 
                color: 0xffaa00, 
                action: () => this.scene.start('Shop') 
            },
            { 
                text: '🎒 INVENTAIRE', 
                y: 570, 
                color: 0x00aaff, 
                action: () => this.scene.start('Inventory'),
                x: 900
            },
            { 
                text: '📊 STATS', 
                y: 630, 
                color: 0xff00ff, 
                action: () => this.scene.start('Stats'),
                x: 900
            }
        ];
        
        buttons.forEach(btn => {
            const x = btn.x || 380;
            const bg = this.add.rectangle(x, btn.y, 200, 50, btn.color, 0.3);
            bg.setStrokeStyle(2, btn.color);
            bg.setInteractive({ useHandCursor: true });
            
            const text = this.add.text(x, btn.y, btn.text, {
                fontSize: '22px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            bg.on('pointerdown', btn.action);
            
            bg.on('pointerover', () => {
                bg.setFillStyle(btn.color, 0.6);
                this.tweens.add({
                    targets: [bg, text],
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200
                });
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(btn.color, 0.3);
                this.tweens.add({
                    targets: [bg, text],
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200
                });
            });
        });
    }

    createFooter() {
        this.add.text(640, 700, 'Connexion sécurisée • Serveurs EU', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
    }

    startGame() {
        const maxPlayers = parseInt(this.selectedMode.charAt(0)) * 2;
        this.scene.start('Lobby', {
            mode: this.selectedMode,
            maxPlayers,
            botFill: this.botFill,
            map: 'haven'
        });
    }
}

// ============================================
// SCÈNE: BOUTIQUE
// ============================================
class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Shop' });
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        
        this.add.text(640, 40, '🛒 BOUTIQUE DE SKINS', {
            fontSize: '48px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        const user = window.gameState.userProfile;
        this.add.text(640, 90, `💰 ${formatNumber(user.currency)} crédits`, {
            fontSize: '24px',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        this.displaySkins();
        this.createBackButton();
    }

    displaySkins() {
        const skins = window.gameData.skins;
        const ownedSkins = window.gameState.inventory.skins;
        
        let x = 150;
        let y = 180;
        let col = 0;
        
        Object.entries(skins).forEach(([id, skin]) => {
            const owned = ownedSkins.includes(id);
            
            const card = this.add.rectangle(x, y, 180, 200, 0x1a1e3a, 0.9);
            card.setStrokeStyle(3, getRarityColor(skin.rarity).replace('#', '0x'));
            
            // Skin preview
            const preview = this.add.circle(x, y - 40, 35, skin.color);
            if (skin.glow) {
                preview.setStrokeStyle(3, skin.color, 0.5);
            }
            
            this.add.text(x, y + 20, skin.name, {
                fontSize: '18px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            this.add.text(x, y + 45, skin.rarity.toUpperCase(), {
                fontSize: '14px',
                color: getRarityColor(skin.rarity)
            }).setOrigin(0.5);
            
            if (owned) {
                this.add.text(x, y + 70, '✓ POSSÉDÉ', {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#00ff88'
                }).setOrigin(0.5);
            } else {
                const buyBtn = this.add.rectangle(x, y + 70, 140, 35, 0xffaa00, 0.8);
                buyBtn.setStrokeStyle(2, 0xffaa00);
                buyBtn.setInteractive({ useHandCursor: true });
                
                const priceText = this.add.text(x, y + 70, `${skin.price} 💰`, {
                    fontSize: '18px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                buyBtn.on('pointerdown', () => this.buySkin(id, skin));
                
                buyBtn.on('pointerover', () => {
                    buyBtn.setFillStyle(0xffaa00, 1);
                    this.tweens.add({
                        targets: buyBtn,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 200
                    });
                });
                
                buyBtn.on('pointerout', () => {
                    buyBtn.setFillStyle(0xffaa00, 0.8);
                    this.tweens.add({
                        targets: buyBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200
                    });
                });
            }
            
            x += 220;
            col++;
            
            if (col >= 5) {
                col = 0;
                x = 150;
                y += 240;
            }
        });
    }

    async buySkin(skinId, skin) {
        const user = window.gameState.userProfile;
        
        if (user.currency < skin.price) {
            this.showNotification('❌ Crédits insuffisants!', 0xff0000);
            return;
        }
        
        user.currency -= skin.price;
        window.gameState.inventory.skins.push(skinId);
        
        const userRef = window.db.ref(`users/${window.gameState.currentUser.uid}`);
        await userRef.update({
            currency: user.currency,
            'inventory/skins': window.gameState.inventory.skins
        });
        
        this.showNotification(`✓ ${skin.name} acheté!`, 0x00ff88);
        this.time.delayedCall(1000, () => this.scene.restart());
    }

    showNotification(text, color) {
        const notif = this.add.text(640, 650, text, {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: `#${color.toString(16).padStart(6, '0')}`,
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setAlpha(0);
        
        this.tweens.add({
            targets: notif,
            alpha: 1,
            y: 620,
            duration: 300,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: notif,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => notif.destroy()
                    });
                });
            }
        });
    }

    createBackButton() {
        const btn = this.add.rectangle(100, 680, 150, 50, 0xff0000, 0.8);
        btn.setStrokeStyle(2, 0xff0000);
        btn.setInteractive({ useHandCursor: true });
        
        this.add.text(100, 680, '← RETOUR', {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        btn.on('pointerdown', () => this.scene.start('MainMenu'));
        
        btn.on('pointerover', () => btn.setFillStyle(0xff0000, 1));
        btn.on('pointerout', () => btn.setFillStyle(0xff0000, 0.8));
    }
}

// ============================================
// SCÈNE: INVENTAIRE
// ============================================
class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory' });
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        
        this.add.text(640, 40, '🎒 INVENTAIRE', {
            fontSize: '48px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(640, 100, 'Sélectionnez vos skins équipés', {
            fontSize: '20px',
            color: '#888888'
        }).setOrigin(0.5);
        
        this.displayInventory();
        this.createBackButton();
    }

    displayInventory() {
        const skins = window.gameData.skins;
        const ownedSkins = window.gameState.inventory.skins;
        const equipped = window.gameState.inventory.equipped;
        
        let x = 200;
        let y = 200;
        let col = 0;
        
        ownedSkins.forEach(skinId => {
            const skin = skins[skinId];
            if (!skin) return;
            
            const isPrimaryEquipped = equipped.primary === skinId;
            const isSecondaryEquipped = equipped.secondary === skinId;
            const isEquipped = isPrimaryEquipped || isSecondaryEquipped;
            
            const card = this.add.rectangle(x, y, 200, 220, 
                isEquipped ? 0x00ff88 : 0x1a1e3a, 
                isEquipped ? 0.3 : 0.9
            );
            card.setStrokeStyle(3, isEquipped ? 0x00ff88 : getRarityColor(skin.rarity).replace('#', '0x'));
            
            const preview = this.add.circle(x, y - 50, 40, skin.color);
            if (skin.glow) {
                preview.setStrokeStyle(4, skin.color, 0.5);
            }
            
            this.add.text(x, y + 10, skin.name, {
                fontSize: '20px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(x, y + 35, skin.rarity.toUpperCase(), {
                fontSize: '14px',
                color: getRarityColor(skin.rarity)
            }).setOrigin(0.5);
            
            if (isEquipped) {
                const label = isPrimaryEquipped ? 'PRIMAIRE' : 'SECONDAIRE';
                this.add.text(x, y + 65, `✓ ${label}`, {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#00ff88'
                }).setOrigin(0.5);
            } else {
                const primaryBtn = this.createEquipButton(x - 50, y + 75, 'P', skinId, 'primary');
                const secondaryBtn = this.createEquipButton(x + 50, y + 75, 'S', skinId, 'secondary');
            }
            
            x += 230;
            col++;
            
            if (col >= 5) {
                col = 0;
                x = 200;
                y += 260;
            }
        });
    }

    createEquipButton(x, y, label, skinId, slot) {
        const btn = this.add.rectangle(x, y, 70, 30, 0x00aaff, 0.8);
        btn.setStrokeStyle(2, 0x00aaff);
        btn.setInteractive({ useHandCursor: true });
        
        this.add.text(x, y, label, {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        btn.on('pointerdown', () => this.equipSkin(skinId, slot));
        btn.on('pointerover', () => btn.setFillStyle(0x00aaff, 1));
        btn.on('pointerout', () => btn.setFillStyle(0x00aaff, 0.8));
        
        return btn;
    }

    async equipSkin(skinId, slot) {
        window.gameState.inventory.equipped[slot] = skinId;
        
        const userRef = window.db.ref(`users/${window.gameState.currentUser.uid}`);
        await userRef.update({
            [`inventory/equipped/${slot}`]: skinId
        });
        
        this.scene.restart();
    }

    createBackButton() {
        const btn = this.add.rectangle(100, 680, 150, 50, 0xff0000, 0.8);
        btn.setStrokeStyle(2, 0xff0000);
        btn.setInteractive({ useHandCursor: true });
        
        this.add.text(100, 680, '← RETOUR', {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        btn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}

// ============================================
// SCÈNE: STATISTIQUES
// ============================================
class StatsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Stats' });
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        
        this.add.text(640, 40, '📊 STATISTIQUES', {
            fontSize: '48px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        const user = window.gameState.userProfile;
        const stats = user.stats || { kills: 0, deaths: 0, wins: 0, losses: 0, matches: 0 };
        
        const statsList = [
            { label: '🎯 Éliminations', value: stats.kills, color: 0x00ff88 },
            { label: '💀 Morts', value: stats.deaths, color: 0xff6666 },
            { label: '🏆 Victoires', value: stats.wins, color: 0xffaa00 },
            { label: '❌ Défaites', value: stats.losses, color: 0xff0000 },
            { label: '🎮 Matches', value: stats.matches, color: 0x00aaff },
            { label: '📈 K/D Ratio', value: stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills, color: 0xff00ff }
        ];
        
        let y = 150;
        statsList.forEach((stat, index) => {
            const bg = this.add.rectangle(640, y, 600, 60, 0x1a1e3a, 0.9);
            bg.setStrokeStyle(2, stat.color);
            
            this.add.text(400, y, stat.label, {
                fontSize: '24px',
                fontFamily: 'Rajdhani',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            this.add.text(880, y, stat.value.toString(), {
                fontSize: '32px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: `#${stat.color.toString(16).padStart(6, '0')}`
            }).setOrigin(1, 0.5);
            
            y += 80;
        });
        
        // Bouton retour
        const btn = this.add.rectangle(640, 650, 200, 50, 0xff0000, 0.8);
        btn.setStrokeStyle(2, 0xff0000);
        btn.setInteractive({ useHandCursor: true });
        
        this.add.text(640, 650, '← RETOUR', {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        btn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}

// La suite dans le prochain message car le code est trop long...
// ============================================
// SCÈNE: LOBBY (À SUIVRE)
// ============================================

// ============================================
// SCÈNE: LOBBY AMÉLIORÉ AVEC CHAT
// ============================================
class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Lobby' });
    }

    init(data) {
        this.lobbyData = data;
        this.isHost = true;
        this.chatMessages = [];
    }

    async create() {
        this.add.rectangle(640, 360, 1280, 720, 0x0a0e27);
        
        // Header
        this.add.text(640, 30, '🎮 LOBBY', {
            fontSize: '48px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        await this.createLobby();
        this.createUI();
        this.createChat();
        this.startListening();
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
            createdAt: Date.now(),
            players: {
                [user.uid]: {
                    name: window.gameState.userProfile.name,
                    team: 'ATK',
                    ready: false,
                    isBot: false
                }
            },
            chat: []
        });

        this.currentLobby = { code, ...this.lobbyData };
    }

    createUI() {
        // Info du lobby
        const infoBg = this.add.rectangle(200, 100, 350, 100, 0x1a1e3a, 0.9);
        infoBg.setStrokeStyle(2, 0x00ffff);
        
        this.add.text(60, 70, `📋 Code: ${this.currentLobby.code}`, {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffff00'
        });
        
        this.add.text(60, 100, `🎯 Mode: ${this.currentLobby.mode}`, {
            fontSize: '20px',
            color: '#ffffff'
        });
        
        this.add.text(60, 125, `🗺️ Map: Haven`, {
            fontSize: '20px',
            color: '#00ff88'
        });
        
        // Équipes
        this.createTeamDisplay('ATK', 60, 170, 0xff6666);
        this.createTeamDisplay('DEF', 680, 170, 0x6666ff);
        
        // Boutons
        this.createLobbyButtons();
    }

    createTeamDisplay(team, x, y, color) {
        const teamBg = this.add.rectangle(x + 250, y + 100, 480, 280, 0x1a1e3a, 0.9);
        teamBg.setStrokeStyle(3, color);
        
        this.add.text(x + 250, y, `⚔️ ÉQUIPE ${team}`, {
            fontSize: '28px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: `#${color.toString(16).padStart(6, '0')}`
        }).setOrigin(0.5);
        
        const maxPerTeam = this.currentLobby.maxPlayers / 2;
        this[`${team}Slots`] = [];
        
        for (let i = 0; i < maxPerTeam; i++) {
            const slotY = y + 40 + i * 50;
            const slotBg = this.add.rectangle(x + 250, slotY, 440, 40, 0x0a0e27);
            slotBg.setStrokeStyle(1, color, 0.3);
            
            const slotText = this.add.text(x + 70, slotY, `Slot ${i + 1}: ...`, {
                fontSize: '18px',
                fontFamily: 'Rajdhani',
                color: '#666666'
            }).setOrigin(0, 0.5);
            
            this[`${team}Slots`].push(slotText);
        }
    }

    createChat() {
        // Zone de chat
        const chatBg = this.add.rectangle(640, 520, 1160, 180, 0x1a1e3a, 0.9);
        chatBg.setStrokeStyle(2, 0x00ffff);
        
        this.add.text(640, 430, '💬 CHAT', {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Messages
        this.chatContainer = this.add.container(100, 460);
        
        // Input simulé
        const inputBg = this.add.rectangle(640, 610, 1000, 35, 0x0a0e27);
        inputBg.setStrokeStyle(2, 0x666666);
        
        this.add.text(200, 610, 'Tapez votre message...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0, 0.5);
        
        this.add.text(1080, 610, 'ENTER ↵', {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(0, 0.5);
    }

    createLobbyButtons() {
        // Bouton Prêt
        const readyBtn = this.add.rectangle(640, 680, 300, 50, 0x00ff88, 0.8);
        readyBtn.setStrokeStyle(3, 0x00ff88);
        readyBtn.setInteractive({ useHandCursor: true });
        
        this.add.text(640, 680, '✓ PRÊT', {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        readyBtn.on('pointerdown', () => this.toggleReady());
        
        // Bouton Démarrer (host)
        if (this.isHost) {
            const startBtn = this.add.rectangle(980, 680, 200, 50, 0xffaa00, 0.8);
            startBtn.setStrokeStyle(3, 0xffaa00);
            startBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(980, 680, '▶ LANCER', {
                fontSize: '22px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            startBtn.on('pointerdown', () => this.startMatch());
        }
        
        // Bouton Quitter
        const leaveBtn = this.add.rectangle(100, 680, 150, 50, 0xff0000, 0.8);
        leaveBtn.setStrokeStyle(2, 0xff0000);
        leaveBtn.setInteractive({ useHandCursor: true });
        
        this.add.text(100, 680, '← QUITTER', {
            fontSize: '18px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        leaveBtn.on('pointerdown', () => this.leaveLobby());
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
        const atkPlayers = [];
        const defPlayers = [];
        
        Object.entries(players).forEach(([uid, player]) => {
            if (player.team === 'ATK') atkPlayers.push(player);
            else defPlayers.push(player);
        });
        
        this.ATKSlots.forEach((slot, i) => {
            if (atkPlayers[i]) {
                const p = atkPlayers[i];
                const prefix = p.isBot ? '🤖 ' : '👤 ';
                const ready = p.ready ? '✓' : '○';
                slot.setText(`${ready} ${prefix}${p.name}`);
                slot.setColor('#ffffff');
            } else {
                slot.setText(`Slot ${i + 1}: ...`);
                slot.setColor('#666666');
            }
        });
        
        this.DEFSlots.forEach((slot, i) => {
            if (defPlayers[i]) {
                const p = defPlayers[i];
                const prefix = p.isBot ? '🤖 ' : '👤 ';
                const ready = p.ready ? '✓' : '○';
                slot.setText(`${ready} ${prefix}${p.name}`);
                slot.setColor('#ffffff');
            } else {
                slot.setText(`Slot ${i + 1}: ...`);
                slot.setColor('#666666');
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
                    name: `Bot-${Math.floor(Math.random() * 1000)}`,
                    team,
                    ready: true,
                    isBot: true
                });
            }
        }
    }

    async toggleReady() {
        const user = window.gameState.currentUser;
        const playerRef = this.lobbyRef.child(`players/${user.uid}`);
        const snapshot = await playerRef.once('value');
        const playerData = snapshot.val();
        
        await playerRef.update({ ready: !playerData.ready });
    }

    async startMatch() {
        if (!this.isHost) return;
        await this.lobbyRef.update({ state: 'running' });
    }

    async leaveLobby() {
        if (this.lobbyRef) {
            const user = window.gameState.currentUser;
            await this.lobbyRef.child(`players/${user.uid}`).remove();
            
            if (this.isHost) {
                await this.lobbyRef.remove();
            }
            
            this.lobbyRef.off();
        }
        
        this.scene.start('MainMenu');
    }
}

// ============================================
// SCÈNE: MATCH AMÉLIORÉ
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
        const mapData = window.gameData.maps.haven;
        this.mapData = mapData;
        
        // Background avec gradient
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1e3a, 0x1a1e3a, 1);
        graphics.fillRect(0, 0, mapData.width, mapData.height);
        
        this.physics.world.setBounds(0, 0, mapData.width, mapData.height);
        
        // Murs
        this.wallsGroup = this.physics.add.staticGroup();
        mapData.walls.forEach(wall => {
            const w = this.add.rectangle(wall.x, wall.y, wall.width, wall.height, 0x2a2e4a);
            w.setOrigin(0);
            w.setStrokeStyle(2, 0x3a3e5a);
            this.wallsGroup.add(w);
            this.physics.add.existing(w, true);
        });
        
        // Sites
        mapData.sites.forEach(site => {
            const color = site.name === 'A' ? 0xff6666 : 0x6666ff;
            const zone = this.add.circle(site.x, site.y, site.radius, color, 0.2);
            zone.setStrokeStyle(3, color, 0.5);
            
            this.add.text(site.x, site.y, `SITE ${site.name}`, {
                fontSize: '36px',
                fontFamily: 'Rajdhani',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
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
        // Corps du joueur
        const sprite = this.add.circle(spawn.x, spawn.y, 15, data.team === 'ATK' ? 0xff3333 : 0x3333ff);
        sprite.setStrokeStyle(3, 0xffffff);
        
        this.physics.add.existing(sprite);
        sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(sprite, this.wallsGroup);
        
        // Direction indicator
        const direction = this.add.triangle(0, 0, 0, -20, -10, -10, 10, -10, 0xffffff);
        
        // Nom
        const nameText = this.add.text(0, -35, data.name, {
            fontSize: '14px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5);
        
        // Barre de vie
        const healthBarBg = this.add.rectangle(0, -50, 50, 5, 0x000000);
        const healthBar = this.add.rectangle(0, -50, 50, 5, 0x00ff00);
        healthBar.setOrigin(0, 0.5);
        healthBarBg.setOrigin(0, 0.5);
        
        const equipped = window.gameState.inventory.equipped;
        
        this.players[uid] = {
            uid, sprite, direction, nameText, healthBar, healthBarBg, data,
            hp: 100, maxHp: 100, money: 800,
            inventory: {
                primary: null,
                secondary: { 
                    name: 'Classic', 
                    ...window.gameData.weapons.Classic,
                    skin: window.gameData.skins[equipped.secondary]
                }
            },
            currentWeapon: 'secondary',
            ammo: 12, maxAmmo: 12,
            isAlive: true
        };
    }

    createBot(uid, data, spawn) {
        const sprite = this.add.circle(spawn.x, spawn.y, 15, data.team === 'ATK' ? 0xff6666 : 0x6666ff);
        sprite.setStrokeStyle(3, 0xffffff, 0.7);
        
        this.physics.add.existing(sprite);
        sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(sprite, this.wallsGroup);
        
        const direction = this.add.triangle(0, 0, 0, -20, -10, -10, 10, -10, 0xffffff, 0.7);
        
        const nameText = this.add.text(0, -35, data.name, {
            fontSize: '14px',
            fontFamily: 'Rajdhani',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5);
        
        const healthBarBg = this.add.rectangle(0, -50, 50, 5, 0x000000);
        const healthBar = this.add.rectangle(0, -50, 50, 5, 0x00ff00);
        healthBar.setOrigin(0, 0.5);
        healthBarBg.setOrigin(0, 0.5);
        
        this.bots[uid] = {
            uid, sprite, direction, nameText, healthBar, healthBarBg, data,
            hp: 100, maxHp: 100, money: 800,
            inventory: {
                secondary: { name: 'Classic', ...window.gameData.weapons.Classic }
            },
            currentWeapon: 'secondary',
            ammo: 12, maxAmmo: 12,
            isAlive: true,
            ai: { target: null, lastShot: 0, lastThink: 0 }
        };
    }

    setupCamera() {
        const player = this.players[window.gameState.currentUser.uid];
        if (player) {
            this.cameras.main.startFollow(player.sprite, true, 0.1, 0.1);
            this.cameras.main.setBounds(0, 0, this.mapData.width, this.mapData.height);
            this.cameras.main.setZoom(1.2);
        }
    }

    setupInput() {
        this.keys = this.input.keyboard.addKeys({
            up: 'Z', down: 'S', left: 'Q', right: 'D', reload: 'R', buy: 'B'
        });

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButton) this.shoot();
        });
        
        this.input.keyboard.on('keydown-ONE', () => this.switchWeapon('secondary'));
        this.input.keyboard.on('keydown-TWO', () => this.switchWeapon('primary'));
    }

    switchWeapon(slot) {
        const player = this.players[window.gameState.currentUser.uid];
        if (!player || !player.isAlive) return;
        
        if (player.inventory[slot]) {
            player.currentWeapon = slot;
            const weapon = player.inventory[slot];
            player.ammo = weapon.magazine;
            player.maxAmmo = weapon.magazine;
        }
    }

    startRound() {
        this.roundPhase = 'pre';
        this.phaseTimer = 5;
        
        Object.values(this.players).concat(Object.values(this.bots)).forEach(p => {
            p.hp = p.maxHp;
            p.isAlive = true;
            p.sprite.setAlpha(1);
            p.healthBar.setFillStyle(0x00ff00);
            
            const spawns = this.mapData.spawns[p.data.team];
            const spawn = spawns[Math.floor(Math.random() * spawns.length)];
            p.sprite.setPosition(spawn.x, spawn.y);
        });
        
        this.showBigMessage(`ROUND ${this.currentRound}`, 0x00ffff);
        
        this.time.delayedCall(5000, () => {
            this.roundPhase = 'buy';
            this.phaseTimer = 25;
            this.showBigMessage('PHASE D\'ACHAT', 0xffaa00);
            
            this.time.delayedCall(25000, () => {
                this.roundPhase = 'action';
                this.phaseTimer = 120;
                this.showBigMessage('COMBAT !', 0xff0000);
            });
        });
    }

    update(time, delta) {
        this.updatePhaseTimer(delta);
        this.updatePlayers(time);
        this.updateBots(time);
        this.updateBullets();
        this.updateHealthBars();
        this.checkRoundEnd();
    }

    updatePhaseTimer(delta) {
        if (this.roundPhase === 'buy' || this.roundPhase === 'action') {
            this.phaseTimer -= delta / 1000;
            if (this.phaseTimer <= 0) {
                if (this.roundPhase === 'buy') {
                    this.roundPhase = 'action';
                    this.phaseTimer = 120;
                } else {
                    this.endRound('DEF');
                }
            }
        }
    }

    updatePlayers(time) {
        const player = this.players[window.gameState.currentUser.uid];
        if (!player || !player.isAlive) return;

        const speed = 220;
        let vx = 0, vy = 0;

        if (this.keys.left.isDown) vx = -speed;
        if (this.keys.right.isDown) vx = speed;
        if (this.keys.up.isDown) vy = -speed;
        if (this.keys.down.isDown) vy = speed;

        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        player.sprite.body.setVelocity(vx, vy);

        // Rotation
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            player.sprite.x, player.sprite.y,
            pointer.worldX, pointer.worldY
        );
        player.sprite.rotation = angle;
        player.direction.setPosition(player.sprite.x, player.sprite.y);
        player.direction.setRotation(angle);

        // UI update
        player.nameText.setPosition(player.sprite.x, player.sprite.y - 35);
        player.healthBarBg.setPosition(player.sprite.x - 25, player.sprite.y - 50);
        player.healthBar.setPosition(player.sprite.x - 25, player.sprite.y - 50);

        // Reload
        if (Phaser.Input.Keyboard.JustDown(this.keys.reload)) {
            const weapon = player.inventory[player.currentWeapon];
            if (weapon && player.ammo < weapon.magazine) {
                player.ammo = weapon.magazine;
                this.showFloatingText(player.sprite.x, player.sprite.y - 60, 'RECHARGÉ', 0x00ffff);
            }
        }
    }

    updateBots(time) {
        Object.values(this.bots).forEach(bot => {
            if (!bot.isAlive) return;

            if (time - bot.ai.lastThink < 100) return;
            bot.ai.lastThink = time;

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
                bot.direction.setPosition(bot.sprite.x, bot.sprite.y);
                bot.direction.setRotation(angle);

                if (dist > 350) {
                    bot.sprite.body.setVelocity(
                        Math.cos(angle) * 160,
                        Math.sin(angle) * 160
                    );
                } else {
                    bot.sprite.body.setVelocity(0, 0);
                    if (time - bot.ai.lastShot > 600 && dist < 800) {
                        this.botShoot(bot, time);
                    }
                }
            } else {
                if (Math.random() < 0.01) {
                    const angle = Math.random() * Math.PI * 2;
                    bot.sprite.body.setVelocity(
                        Math.cos(angle) * 100,
                        Math.sin(angle) * 100
                    );
                }
            }

            bot.nameText.setPosition(bot.sprite.x, bot.sprite.y - 35);
            bot.healthBarBg.setPosition(bot.sprite.x - 25, bot.sprite.y - 50);
            bot.healthBar.setPosition(bot.sprite.x - 25, bot.sprite.y - 50);
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
        
        this.createBullet(
            player.sprite.x + Math.cos(angle) * 20,
            player.sprite.y + Math.sin(angle) * 20,
            angle + spread, 
            weapon, 
            player.data.team
        );
        
        // Muzzle flash
        const flash = this.add.circle(
            player.sprite.x + Math.cos(angle) * 25,
            player.sprite.y + Math.sin(angle) * 25,
            8, 0xffff00
        );
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }

    botShoot(bot, time) {
        const weapon = bot.inventory[bot.currentWeapon];
        if (!weapon || bot.ammo <= 0) return;

        bot.ammo--;
        bot.ai.lastShot = time;
        
        const angle = bot.sprite.rotation;
        const spread = weapon.spread * (Math.random() - 0.5) * 2;
        
        this.createBullet(
            bot.sprite.x + Math.cos(angle) * 20,
            bot.sprite.y + Math.sin(angle) * 20,
            angle + spread,
            weapon,
            bot.data.team
        );
    }

    createBullet(x, y, angle, weapon, team) {
        const skinColor = weapon.skin ? weapon.skin.color : weapon.color;
        const bullet = this.add.circle(x, y, 4, skinColor);
        
        if (weapon.skin && weapon.skin.glow) {
            bullet.setStrokeStyle(2, skinColor, 0.8);
        }
        
        this.bullets.push({
            graphics: bullet,
            x, y, angle, weapon, team,
            vx: Math.cos(angle) * 1200,
            vy: Math.sin(angle) * 1200,
            distance: 0,
            maxDistance: weapon.range,
            damage: weapon.damage
        });
        
        // Trail effect
        if (weapon.skin && weapon.skin.particle) {
            this.time.delayedCall(50, () => {
                const trail = this.add.circle(x, y, 3, skinColor, 0.5);
                this.tweens.add({
                    targets: trail,
                    alpha: 0,
                    scale: 0.3,
                    duration: 300,
                    onComplete: () => trail.destroy()
                });
            });
        }
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
        if (hitWall) {
            this.createImpact(bullet.x, bullet.y);
            return true;
        }

        const allEntities = Object.values(this.players).concat(Object.values(this.bots));
        for (let entity of allEntities) {
            if (!entity.isAlive || entity.data.team === bullet.team) continue;
            
            const dist = Phaser.Math.Distance.Between(
                bullet.x, bullet.y, 
                entity.sprite.x, entity.sprite.y
            );
            
            if (dist < 20) {
                entity.hp -= bullet.damage;
                this.showFloatingText(
                    entity.sprite.x, 
                    entity.sprite.y - 40, 
                    `-${bullet.damage}`, 
                    0xff0000
                );
                
                if (entity.hp <= 0) {
                    entity.hp = 0;
                    entity.isAlive = false;
                    entity.sprite.setAlpha(0.3);
                    entity.direction.setAlpha(0);
                    this.createDeathEffect(entity.sprite.x, entity.sprite.y);
                }
                return true;
            }
        }
        return false;
    }

    createImpact(x, y) {
        const impact = this.add.circle(x, y, 5, 0xffffff);
        this.tweens.add({
            targets: impact,
            alpha: 0,
            scale: 2,
            duration: 200,
            onComplete: () => impact.destroy()
        });
    }

    createDeathEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = this.add.circle(x, y, 4, 0xff0000);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 50,
                y: y + Math.sin(angle) * 50,
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    updateHealthBars() {
        Object.values(this.players).concat(Object.values(this.bots)).forEach(entity => {
            if (!entity.isAlive) {
                entity.healthBar.setVisible(false);
                entity.healthBarBg.setVisible(false);
                return;
            }
            
            const healthPercent = entity.hp / entity.maxHp;
            entity.healthBar.setScale(healthPercent, 1);
            
            if (healthPercent > 0.6) {
                entity.healthBar.setFillStyle(0x00ff00);
            } else if (healthPercent > 0.3) {
                entity.healthBar.setFillStyle(0xffaa00);
            } else {
                entity.healthBar.setFillStyle(0xff0000);
            }
        });
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

        this.showBigMessage(`${winner} VICTOIRE!`, winner === 'ATK' ? 0xff3333 : 0x3333ff);

        this.time.delayedCall(4000, () => {
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
        this.showBigMessage(`${winner} REMPORTE LE MATCH!`, 0xffaa00);
        
        // Update stats
        this.updateStats(winner);
        
        this.time.delayedCall(5000, () => {
            this.scene.stop('HUD');
            this.scene.start('MainMenu');
        });
    }

    async updateStats(winner) {
        const user = window.gameState.currentUser;
        const player = this.players[user.uid];
        if (!player) return;
        
        const userRef = window.db.ref(`users/${user.uid}/stats`);
        const snapshot = await userRef.once('value');
        const stats = snapshot.val() || { kills: 0, deaths: 0, wins: 0, losses: 0, matches: 0 };
        
        stats.matches++;
        if (player.data.team === winner) {
            stats.wins++;
        } else {
            stats.losses++;
        }
        
        await userRef.set(stats);
    }

    showBigMessage(text, color) {
        const msg = this.add.text(640, 360, text, {
            fontSize: '64px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: `#${color.toString(16).padStart(6, '0')}`,
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setAlpha(0);
        
        this.tweens.add({
            targets: msg,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 500,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: msg,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => msg.destroy()
                    });
                });
            }
        });
    }

    showFloatingText(x, y, text, color) {
        const floatText = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: `#${color.toString(16).padStart(6, '0')}`,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: floatText,
            y: y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => floatText.destroy()
        });
    }
}

// ============================================
// SCÈNE: HUD PROFESSIONNEL
// ============================================
class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUD' });
    }

    init(data) {
        this.matchScene = data.match;
    }

    create() {
        // Santé
        const healthBg = this.add.rectangle(120, 670, 200, 40, 0x000000, 0.7).setScrollFactor(0);
        this.healthText = this.add.text(120, 670, '', {
            fontSize: '28px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#00ff00'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Munitions
        const ammoBg = this.add.rectangle(1160, 670, 200, 40, 0x000000, 0.7).setScrollFactor(0);
        this.ammoText = this.add.text(1160, 670, '', {
            fontSize: '28px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Timer
        const timerBg = this.add.rectangle(640, 30, 180, 50, 0x000000, 0.7).setScrollFactor(0);
        this.timerText = this.add.text(640, 30, '', {
            fontSize: '32px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Score
        this.scoreText = this.add.text(640, 70, '', {
            fontSize: '24px',
            fontFamily: 'Rajdhani',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Argent
        this.moneyText = this.add.text(30, 620, '', {
            fontSize: '20px',
            fontFamily: 'Rajdhani',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setScrollFactor(0);
        
        // Arme actuelle
        this.weaponText = this.add.text(1250, 620, '', {
            fontSize: '18px',
            fontFamily: 'Rajdhani',
            color: '#ffffff'
        }).setOrigin(1, 0).setScrollFactor(0);
    }

    update() {
        if (!this.matchScene) return;
        
        const player = this.matchScene.players[window.gameState.currentUser.uid];
        if (player) {
            this.healthText.setText(`❤️ ${Math.max(0, Math.floor(player.hp))}`);
            this.healthText.setColor(
                player.hp > 60 ? '#00ff00' : 
                player.hp > 30 ? '#ffaa00' : '#ff0000'
            );
            
            this.ammoText.setText(`🔫 ${player.ammo} / ${player.maxAmmo}`);
            this.moneyText.setText(`💰 $${player.money}`);
            
            const weapon = player.inventory[player.currentWeapon];
            if (weapon) {
                this.weaponText.setText(`${weapon.name}\n${weapon.type.toUpperCase()}`);
            }
        }
        
        const timer = Math.ceil(this.matchScene.phaseTimer);
        this.timerText.setText(`⏱️ ${timer}s`);
        this.timerText.setColor(timer <= 10 ? '#ff0000' : '#ffffff');
        
        this.scoreText.setText(
            `🔴 ATK ${this.matchScene.teamScores.ATK} - ${this.matchScene.teamScores.DEF} DEF 🔵`
        );
    }
}

// ============================================
// INITIALISATION ET LANCEMENT
// ============================================
document.getElementById('loading-status').textContent = 'Connexion à Firebase...';

window.auth.signInAnonymously().then(async (userCredential) => {
    window.gameState.currentUser = userCredential.user;
    console.log('✅ Auth:', userCredential.user.uid);
    
    document.getElementById('loading-status').textContent = 'Chargement du profil...';
    
    const userRef = window.db.ref(`users/${userCredential.user.uid}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || {};
    
    if (!userData.name) {
        userData.name = `Joueur${Math.floor(Math.random() * 9999)}`;
        userData.level = 1;
        userData.xp = 0;
        userData.currency = 5000;
        userData.inventory = { 
            skins: ['default'], 
            equipped: { primary: 'default', secondary: 'default' } 
        };
        userData.stats = { kills: 0, deaths: 0, wins: 0, losses: 0, matches: 0 };
        await userRef.set(userData);
    }
    
    window.gameState.userProfile = userData;
    window.gameState.inventory = userData.inventory || window.gameState.inventory;
    
    document.getElementById('loading-status').textContent = 'Initialisation du jeu...';
    
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
            scene: [MainMenuScene, ShopScene, InventoryScene, StatsScene, LobbyScene, MatchScene, HUDScene]
        };
        
        new Phaser.Game(config);
        document.getElementById('loading').style.display = 'none';
        console.log('✅ Jeu lancé!');
    }, 1000);
    
}).catch((error) => {
    console.error('❌ Erreur:', error);
    document.getElementById('loading-status').innerHTML = `
        ❌ Erreur d'authentification<br>
        <small style="color: #ff6666">${error.message}</small><br>
        <small>Activez l'auth anonyme dans Firebase Console</small>
    `;
});