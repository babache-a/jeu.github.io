// Titre du jeu : "Délégués Galactiques : La Conquête des Licornes et Dauphins !"

// Configuration du jeu
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Variables globales
let player;
let platforms;
let cursors;
let votes;
let score = 0;
let scoreText;

function preload() {
    this.load.image('ciel', 'assets/ciel_arc_en_ciel.png');
    this.load.image('sol', 'assets/sol_guimauve.png');
    this.load.image('vote', 'assets/vote_mystique.png');
    this.load.spritesheet('albara', 'assets/albara_sprite.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Ajout du fond
    this.add.image(400, 300, 'ciel');

    // Création des plateformes
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'sol').setScale(2).refreshBody();
    platforms.create(600, 400, 'sol');
    platforms.create(50, 250, 'sol');
    platforms.create(750, 220, 'sol');

    // Création du joueur
    player = this.physics.add.sprite(100, 450, 'albara');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animations du joueur
    this.anims.create({
        key: 'gauche',
        frames: this.anims.generateFrameNumbers('albara', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'arret',
        frames: [{ key: 'albara', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'droite',
        frames: this.anims.generateFrameNumbers('albara', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Contrôles
    cursors = this.input.keyboard.createCursorKeys();

    // Votes à collecter
    votes = this.physics.add.group({
        key: 'vote',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    votes.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Score
    scoreText = this.add.text(16, 16, 'Votes: 0', { fontSize: '32px', fill: '#000' });

    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(votes, platforms);
    this.physics.add.overlap(player, votes, collectVote, null, this);
}

function update() {
    // Contrôles du joueur
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('gauche', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('droite', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('arret');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectVote(player, vote) {
    vote.disableBody(true, true);
    score += 1;
    scoreText.setText('Votes: ' + score);
}

