// Variables globales pour les éléments du jeu
let dino;
let obstacles = [];
let birds = []; // Tableau séparé pour les obstacles volants (à sauter)
let lowObstacles = []; // Nouveau tableau pour les obstacles bas (à s'accroupir)
let ground;
let clouds = [];
let mountains = [];

// Variables d'état du jeu
let score = 0;
let highScore = 0;
let gameSpeed = 6; // Vitesse initiale du jeu
let difficulty = 1; // 1: Facile, 2: Moyen, 3: Difficile

const GAME_STATE = {
    START: 0,
    LEVEL_SELECT: 1, // Nouvel état pour la sélection du niveau
    PLAYING: 2,
    GAME_OVER: 3
};
let currentState = GAME_STATE.LEVEL_SELECT; // Commencer par la sélection du niveau

// Précharger les ressources (si nécessaire)
function preload() {
    // Aucune image externe n'est chargée pour la simplicité et pour rester autonome.
    // Tous les graphiques seront dessinés en utilisant les formes et les couleurs de p5.js pour obtenir un look pixélisé.
}

// Fonction setup : S'exécute une fois au démarrage du programme
function setup() {
    // Créer le canevas, le rendant réactif à la taille de la fenêtre
    // Augmentation de la taille maximale du canevas pour un espace de jeu plus grand
    createCanvas(min(windowWidth * 0.95, 1200), min(windowHeight * 0.9, 600));
    pixelDensity(1); // Assurer un aspect pixélisé en définissant la densité de pixels à 1

    // Initialiser les éléments du jeu
    dino = new Dino();
    ground = new Ground();

    // Initialiser les éléments d'arrière-plan
    for (let i = 0; i < 7; i++) { // Plus de nuages
        clouds.push(new Cloud(random(width), random(height / 3)));
    }
    for (let i = 0; i < 4; i++) { // Plus de montagnes
        mountains.push(new Mountain(random(width), height - 150)); // Ajuster la base des montagnes
    }
}

// Fonction draw : S'exécute en continu après setup()
function draw() {
    // Dessiner un arrière-plan avec un dégradé subtil pour un look plus moderne
    setGradient(0, 0, width, height, color(173, 216, 230), color(135, 206, 235), Y_AXIS); // Du bleu clair au bleu ciel

    // Mettre à jour et afficher les éléments d'arrière-plan quelle que soit l'état du jeu
    for (let cloud of clouds) {
        cloud.update(gameSpeed * 0.1); // Les nuages se déplacent plus lentement pour l'effet de parallaxe
        cloud.show();
    }
    for (let mountain of mountains) {
        mountain.update(gameSpeed * 0.05); // Les montagnes se déplacent encore plus lentement
        mountain.show();
    }

    ground.show(); // Afficher le sol

    switch (currentState) {
        case GAME_STATE.START:
            displayStartScreen();
            break;
        case GAME_STATE.LEVEL_SELECT:
            displayLevelSelectScreen();
            break;
        case GAME_STATE.PLAYING:
            playGame();
            break;
        case GAME_STATE.GAME_OVER:
            displayGameOverScreen();
            break;
    }
}

// Gère les pressions de touches pour les actions du jeu
function keyPressed() {
    if (currentState === GAME_STATE.LEVEL_SELECT) {
        if (key === '1') {
            difficulty = 1; // Facile
            startGame();
        } else if (key === '2') {
            difficulty = 2; // Moyen
            startGame();
        } else if (key === '3') {
            difficulty = 3; // Difficile
            startGame();
        }
    } else if (currentState === GAME_STATE.PLAYING) {
        // Permet de sauter avec la flèche HAUT ou la barre d'ESPACE
        if (keyCode === UP_ARROW || key === ' ') {
            dino.jump();
        } else if (keyCode === DOWN_ARROW) { // Flèche BAS pour s'accroupir
            dino.duck();
        }
    } else if (currentState === GAME_STATE.GAME_OVER) {
        if (key === ' ') { // Barre d'espace pour redémarrer
            resetGame();
        }
    }
}

// Gère le relâchement des touches
function keyReleased() {
    if (currentState === GAME_STATE.PLAYING) {
        if (keyCode === DOWN_ARROW) { // Relâcher la flèche BAS pour se relever
            dino.standUp();
        }
    }
}

// Gère les clics de souris pour la sélection de niveau
function mousePressed() {
    if (currentState === GAME_STATE.LEVEL_SELECT) {
        let buttonWidth = 180;
        let buttonHeight = 50;
        let buttonYStart = height / 2 + 0;
        let buttonSpacing = 20;

        let buttonX = width / 2 - buttonWidth / 2;

        // Check for Easy button click
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonYStart && mouseY < buttonYStart + buttonHeight) {
            difficulty = 1;
            startGame();
        }
        // Check for Medium button click
        else if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonYStart + buttonHeight + buttonSpacing &&
            mouseY < buttonYStart + buttonHeight * 2 + buttonSpacing) {
            difficulty = 2;
            startGame();
        }
        // Check for Hard button click
        else if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonYStart + buttonHeight * 2 + buttonSpacing * 2 &&
            mouseY < buttonYStart + buttonHeight * 3 + buttonSpacing * 2) {
            difficulty = 3;
            startGame();
        }
    }
}


// Fonction pour afficher l'écran de démarrage (non utilisé actuellement, remplacé par LEVEL_SELECT)
function displayStartScreen() {
    // This state is currently skipped, but keeping the function for completeness.
    // The game transitions directly from LEVEL_SELECT to PLAYING.
}

// Fonction pour afficher l'écran de sélection de niveau
function displayLevelSelectScreen() {
    textAlign(CENTER, CENTER);
    fill(255); // White text

    // Titre du jeu
    textSize(48);
    text("PIXEL DINO RUN", width / 2, height / 2 - 150);

    // Instructions
    textSize(20);
    text("Choisissez votre niveau de difficulté :", width / 2, height / 2 - 70);

    let buttonWidth = 180;
    let buttonHeight = 50;
    let buttonYStart = height / 2 + 0;
    let buttonSpacing = 20;

    // Bouton Facile
    drawButton("Facile (1)", width / 2, buttonYStart, buttonWidth, buttonHeight, color(100, 200, 100), 1);
    // Bouton Moyen
    drawButton("Moyen (2)", width / 2, buttonYStart + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, color(255, 180, 0), 2);
    // Bouton Difficile
    drawButton("Difficile (3)", width / 2, buttonYStart + buttonHeight * 2 + buttonSpacing * 2, buttonWidth, buttonHeight, color(255, 80, 80), 3);

    // Contrôles hint
    textSize(16);
    fill(255); // White
    text("Utilisez les flèches HAUT/BAS pour sauter/s'accroupir", width / 2, height - 50);
}

// Fonction utilitaire pour dessiner un bouton
function drawButton(textLabel, centerX, centerY, w, h, baseColor, level) {
    let x = centerX - w / 2;
    let y = centerY - h / 2;

    let buttonColor = baseColor;
    // Check for hover effect
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        buttonColor = lerpColor(baseColor, color(255, 255, 255), 0.3); // Lighter on hover
        cursor(HAND); // Change cursor to hand
    } else {
        cursor(ARROW); // Default cursor
    }

    fill(buttonColor);
    stroke(255);
    strokeWeight(2);
    rect(x, y, w, h, 10); // Rounded rectangle button

    fill(0); // Black text
    textSize(22);
    noStroke();
    text(textLabel, centerX, centerY);
}


// Fonction pour démarrer le jeu
function startGame() {
    currentState = GAME_STATE.PLAYING;
    score = 0;
    obstacles = [];
    birds = [];
    lowObstacles = []; // Clear low obstacles
    dino.reset(); // Réinitialiser la position du dinosaure

    // Ajuster la vitesse du jeu en fonction de la difficulté
    if (difficulty === 1) { // Facile
        gameSpeed = 5;
    } else if (difficulty === 2) { // Moyen
        gameSpeed = 7;
    } else if (difficulty === 3) { // Difficile
        gameSpeed = 9;
    }
}

// Logique principale du jeu en cours
function playGame() {
    // Mettre à jour et afficher le dinosaure
    dino.update();
    dino.show();

    // Générer des obstacles
    let obstacleFrequency = 100; // Fréquence de base
    if (difficulty === 2) obstacleFrequency = 80;
    if (difficulty === 3) obstacleFrequency = 60;

    if (frameCount % obstacleFrequency === 0) {
        let obstacleType = random(1);
        if (obstacleType < 0.4) { // 40% chance for ground obstacle
            obstacles.push(new Obstacle());
        } else if (obstacleType < 0.7) { // 30% chance for high bird obstacle (jump over)
            birds.push(new Bird());
        } else { // 30% chance for low obstacle (duck under)
            lowObstacles.push(new LowObstacle());
        }
    }

    // Update and display ground obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].show();
        if (dino.hits(obstacles[i])) {
            endGame();
        }
        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1); // Remove off-screen obstacles
        }
    }

    // Update and display high birds
    for (let i = birds.length - 1; i >= 0; i--) {
        birds[i].update();
        birds[i].show();
        if (dino.hits(birds[i])) {
            endGame();
        }
        if (birds[i].offscreen()) {
            birds.splice(i, 1); // Remove off-screen birds
        }
    }

    // Update and display low obstacles (duck under)
    for (let i = lowObstacles.length - 1; i >= 0; i--) {
        lowObstacles[i].update();
        lowObstacles[i].show();
        if (dino.hits(lowObstacles[i])) {
            endGame();
        }
        if (lowObstacles[i].offscreen()) {
            lowObstacles.splice(i, 1); // Remove off-screen low obstacles
        }
    }

    // Augmenter le score et la vitesse du jeu au fil du temps
    score++;
    gameSpeed += 0.0005 * difficulty; // Augmenter la vitesse progressivement selon la difficulté

    // Afficher le score, le meilleur score et la vitesse dans des bulles
    displayGameInfoBubbles();
}

// Fonction pour terminer le jeu
function endGame() {
    currentState = GAME_STATE.GAME_OVER;
    if (score > highScore) {
        highScore = score;
    }
}

// Fonction pour afficher l'écran de fin de jeu
function displayGameOverScreen() {
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); // Red color for "Game Over"
    textSize(48);
    text("GAME OVER", width / 2, height / 2 - 50);

    fill(255); // White text for scores
    textSize(24);
    text("Score: " + floor(score / 10), width / 2, height / 2);
    text("Meilleur Score: " + floor(highScore / 10), width / 2, height / 2 + 30);

    textSize(18);
    fill(255, 255, 0); // Yellow for restart instruction
    text("Appuyez sur ESPACE pour recommencer", width / 2, height / 2 + 70);

    // Simple animation for "GAME OVER"
    if (frameCount % 30 < 15) {
        fill(255, 0, 0, 150); // Pulsating red glow
        textSize(50);
        text("GAME OVER", width / 2, height / 2 - 50);
    }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    currentState = GAME_STATE.LEVEL_SELECT; // Retourner à la sélection du niveau
    dino.standUp(); // S'assurer que le dinosaure est debout
}

// Fonction pour afficher les bulles d'informations de jeu
function displayGameInfoBubbles() {
    let boxWidth = 160;
    let boxHeight = 30;
    let padding = 10;
    let startX = 10;
    let startY = 10;
    let lineHeight = 30; // Increased for better spacing

    // Background box for score
    fill(0, 0, 0, 180); // More opaque black
    noStroke();
    rect(startX, startY, boxWidth, boxHeight, 8); // More rounded corners
    fill(255, 255, 0); // Yellow text for score
    textSize(18); // Slightly larger text
    textAlign(LEFT, CENTER); // Center text vertically
    text("Score: " + floor(score / 10), startX + padding, startY + boxHeight / 2);

    // Background box for high score
    startY += lineHeight + padding;
    fill(0, 0, 0, 180);
    rect(startX, startY, boxWidth, boxHeight, 8);
    fill(255, 165, 0); // Orange text for high score
    text("Meilleur Score: " + floor(highScore / 10), startX + padding, startY + boxHeight / 2);

    // Background box for speed
    startY += lineHeight + padding;
    fill(0, 0, 0, 180);
    rect(startX, startY, boxWidth, boxHeight, 8);
    fill(100, 255, 100); // Green text for speed
    text("Distance: " + gameSpeed.toFixed(1), startX + padding, startY + boxHeight / 2);
}


// Ajuster la taille du canevas lors du redimensionnement de la fenêtre
function windowResized() {
    resizeCanvas(min(windowWidth * 0.95, 1200), min(windowHeight * 0.9, 600)); // Nouvelle taille maximale
    // Recenter les éléments si nécessaire, ou se fier au positionnement relatif
    dino.y = height - dino.h; // S'assurer que le dino est sur le sol après redimensionnement
    dino.baseY = height - 50; // Update base Y for dino
}

// --- Classe Dino ---
class Dino {
    constructor() {
        this.baseY = height - 50; // Position de base sur le sol
        this.x = 50;
        this.y = this.baseY;
        this.w = 30; // Largeur du dinosaure
        this.h = 40; // Hauteur du dinosaure
        this.vy = 0; // Vitesse verticale
        this.gravity = 0.8; // Effet de gravité
        this.jumpForce = -15; // Force de saut du dinosaure
        this.onGround = true; // Pour éviter les sauts multiples en l'air
        this.isDucking = false; // Pour l'action de s'accroupir
        this.duckHeight = 20; // Hauteur du dinosaure lorsqu'il est accroupi
    }

    // Réinitialiser la position du dinosaure
    reset() {
        this.y = this.baseY;
        this.vy = 0;
        this.onGround = true;
        this.isDucking = false;
    }

    // Faire sauter le dinosaure
    jump() {
        if (this.onGround && !this.isDucking) { // Ne peut pas sauter en s'accroupissant
            this.vy = this.jumpForce;
            this.onGround = false;
        }
    }

    // Faire s'accroupir le dinosaure
    duck() {
        if (this.onGround) { // Ne peut s'accroupir que sur le sol
            this.isDucking = true;
            this.h = this.duckHeight; // Réduire la hauteur
            this.y = this.baseY + (40 - this.duckHeight); // Ajuster la position Y pour rester sur le sol
        }
    }

    // Faire se relever le dinosaure
    standUp() {
        this.isDucking = false;
        this.h = 40; // Rétablir la hauteur normale
        this.y = this.baseY; // Rétablir la position Y normale
    }

    // Mettre à jour la position du dinosaure et appliquer la gravité
    update() {
        if (!this.isDucking) { // Seulement appliquer la gravité si le dinosaure ne s'accroupit pas
            this.y += this.vy;
            this.vy += this.gravity;
        }

        // Empêcher le dinosaure de tomber à travers le sol
        if (this.y >= this.baseY) {
            this.y = this.baseY;
            this.vy = 0;
            this.onGround = true;
        }
    }

    // Afficher le dinosaure (forme pixélisée améliorée)
    show() {
        fill(60, 179, 113); // Couleur verte pour le dinosaure
        noStroke();

        if (this.isDucking) {
            // Forme accroupie
            // Corps principal
            rect(this.x, this.y + 10, 35, 20);
            // Tête
            rect(this.x + 25, this.y + 5, 10, 5);
            // Jambes (simples)
            rect(this.x + 5, this.y + 30, 5, 5);
            rect(this.x + 25, this.y + 30, 5, 5);
        } else {
            // Forme normale (debout)
            // Corps principal
            rect(this.x, this.y, 30, 40);
            // Tête
            rect(this.x + 25, this.y - 10, 15, 15);
            // Queue
            rect(this.x - 10, this.y + 20, 15, 10);
            // Jambes (simples)
            rect(this.x + 5, this.y + 40, 5, 10);
            rect(this.x + 20, this.y + 40, 5, 10);
        }
    }

    // Vérifier la collision avec un obstacle
    hits(obstacle) {
        // Détection de collision simple par boîte englobante
        let dinoX = this.x;
        let dinoY = this.y;
        let dinoW = this.w;
        let dinoH = this.h;

        if (this.isDucking) {
            // Ajuster la hitbox lorsque le dinosaure est accroupi
            dinoY = this.baseY + (40 - this.duckHeight); // Utiliser la position Y ajustée pour l'accroupissement
            dinoH = this.duckHeight;
            dinoW = 35; // Largeur de la forme accroupie
        }

        return collideRectRect(
            dinoX, dinoY, dinoW, dinoH,
            obstacle.x, obstacle.y, obstacle.w, obstacle.h
        );
    }
}

// --- Classe Obstacle (Cactus) ---
class Obstacle {
    constructor() {
        this.x = width; // Commencer hors écran à droite
        this.w = random(15, 30); // Largeur aléatoire pour la variété
        this.h = random(20, 50); // Hauteur aléatoire pour la variété
        this.y = height - this.h; // Position sur le sol
    }

    // Mettre à jour la position de l'obstacle
    update() {
        this.x -= gameSpeed;
    }

    // Afficher l'obstacle (cactus pixélisé)
    show() {
        fill(34, 139, 34); // Vert forêt pour le cactus
        noStroke();
        // Dessiner une forme de cactus simple
        rect(this.x, this.y, this.w, this.h); // Corps principal
        rect(this.x - 5, this.y + this.h / 4, 10, 15); // Bras gauche
        rect(this.x + this.w - 5, this.y + this.h / 3, 10, 10); // Bras droit
    }

    // Vérifier si l'obstacle est hors écran
    offscreen() {
        return this.x < -this.w;
    }
}

// --- Classe Oiseau (Obstacle volant - à sauter) ---
class Bird {
    constructor() {
        this.x = width; // Commencer hors écran à droite
        this.y = random(height - 180, height - 120); // Hauteur de vol aléatoire (plus haute pour le saut)
        this.w = 30;
        this.h = 20;
    }

    // Mettre à jour la position de l'oiseau
    update() {
        this.x -= gameSpeed * 1.2; // Les oiseaux volent un peu plus vite
    }

    // Afficher l'oiseau (oiseau pixélisé simple)
    show() {
        fill(178, 34, 34); // Couleur rouge pour l'oiseau
        noStroke();
        // Corps de l'oiseau
        rect(this.x, this.y, this.w, this.h);
        // Ailes
        rect(this.x - 5, this.y + 5, 10, 5);
        rect(this.x + this.w - 5, this.y + 5, 10, 5);
        // Tête
        rect(this.x + this.w, this.y + 5, 5, 5);
    }

    // Vérifier si l'oiseau est hors écran
    offscreen() {
        return this.x < -this.w;
    }
}

// --- Nouvelle Classe Obstacle Bas (à s'accroupir) ---
class LowObstacle {
    constructor() {
        this.x = width; // Start off-screen to the right
        this.w = random(40, 60); // Wider for more challenge
        this.h = random(15, 25); // Lower height
        this.y = height - 70 - this.h; // Positioned to require ducking, above ground
    }

    update() {
        this.x -= gameSpeed;
    }

    show() {
        fill(102, 51, 0); // Brown for a branch or low structure
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        // Add some pixelated details
        fill(139, 69, 19);
        rect(this.x + this.w / 4, this.y + this.h, 5, 10);
        rect(this.x + this.w * 0.75, this.y + this.h, 5, 10);
    }

    offscreen() {
        return this.x < -this.w;
    }
}


// --- Classe Sol ---
class Ground {
    constructor() {
        this.x = 0;
        this.y = height - 10; // Ligne du sol
        this.w = width;
        this.h = 10;
        this.color = color(139, 69, 19); // Couleur marron pour le sol
    }

    // Afficher le sol
    show() {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        // Ajouter des détails pixélisés sur le sol
        for (let i = 0; i < width; i += 10) {
            fill(160, 82, 45); // Marron plus clair pour les détails
            if (random(1) < 0.3) { // Ajouter des "rochers" occasionnels
                rect(i + random(-5, 5), this.y + random(0, 5), random(3, 10), random(3, 7));
            } else {
                rect(i + random(-5, 5), this.y + random(0, 5), random(1, 3), random(1, 3));
            }
        }
    }
}

// --- Classe Nuage (Élément d'arrière-plan) ---
class Cloud {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = random(50, 100); // Nuages un peu plus grands
        this.h = random(25, 50); // Nuages un peu plus grands
        this.speed = random(0.5, 1.5);
    }

    // Mettre à jour la position du nuage pour l'effet de parallaxe
    update(baseSpeed) {
        this.x -= baseSpeed * this.speed;
        if (this.x < -this.w) {
            this.x = width + random(50, 200); // Réinitialiser hors écran à droite
            this.y = random(height / 4); // Nouvelle hauteur aléatoire
        }
    }

    // Afficher le nuage (nuage pixélisé simple)
    show() {
        fill(255, 255, 255, 180); // Blanc semi-transparent
        noStroke();
        // Dessiner plusieurs rectangles qui se chevauchent pour une forme de nuage plus "fluffy"
        rect(this.x, this.y, this.w, this.h);
        rect(this.x + this.w * 0.1, this.y - this.h * 0.3, this.w * 0.8, this.h * 0.6);
        rect(this.x - this.w * 0.1, this.y + this.h * 0.2, this.w * 0.4, this.h * 0.7);
        rect(this.x + this.w * 0.6, this.y + this.h * 0.1, this.w * 0.3, this.h * 0.8);
        rect(this.x + this.w * 0.3, this.y + this.h * 0.5, this.w * 0.4, this.h * 0.5);
    }
}

// --- Classe Montagne (Élément d'arrière-plan) ---
class Mountain {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = random(180, 350); // Montagnes plus grandes
        this.h = random(90, 180); // Montagnes plus hautes
        this.speed = random(0.1, 0.3);
        this.baseColor = color(70, 70, 70, 180); // Couleur de base plus foncée
        this.snowColor = color(220, 220, 220, 200); // Couleur de la neige
    }

    // Mettre à jour la position de la montagne pour un effet de parallaxe profond
    update(baseSpeed) {
        this.x -= baseSpeed * this.speed;
        if (this.x < -this.w) {
            this.x = width + random(100, 300); // Réinitialiser hors écran à droite
        }
    }

    // Afficher la montagne (triangle pixélisé amélioré)
    show() {
        noStroke();

        // Corps principal de la montagne
        fill(this.baseColor);
        triangle(this.x, this.y, this.x + this.w / 2, this.y - this.h, this.x + this.w, this.y);

        // Sommets enneigés (plus détaillés)
        fill(this.snowColor);
        beginShape();
        vertex(this.x + this.w * 0.4, this.y - this.h * 0.8);
        vertex(this.x + this.w / 2, this.y - this.h);
        vertex(this.x + this.w * 0.6, this.y - this.h * 0.8);
        vertex(this.x + this.w * 0.55, this.y - this.h * 0.7);
        vertex(this.x + this.w * 0.45, this.y - this.h * 0.7);
        endShape(CLOSE);

        // Quelques rochers ou détails d'ombre (plus de profondeur)
        fill(lerpColor(this.baseColor, color(0), 0.2)); // Couleur plus foncée pour l'ombre
        triangle(this.x + this.w * 0.1, this.y - this.h * 0.3, this.x + this.w * 0.3, this.y - this.h * 0.5, this.x + this.w * 0.2, this.y);
        triangle(this.x + this.w * 0.7, this.y - this.h * 0.4, this.x + this.w * 0.9, this.y - this.h * 0.2, this.x + this.w * 0.8, this.y);

        // Ajouter une petite touche de lumière sur un côté
        fill(lerpColor(this.baseColor, color(255), 0.2)); // Couleur plus claire pour la lumière
        triangle(this.x, this.y, this.x + this.w * 0.15, this.y - this.h * 0.1, this.x + this.w * 0.05, this.y - this.h * 0.05);
    }
}

// --- Fonction utilitaire de détection de collision ---
// Une simple vérification de collision AABB (Axis-Aligned Bounding Box)
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Vérifier si les rectangles se chevauchent sur les deux axes
    return (x1 < x2 + w2 &&
            x1 + w1 > x2 &&
            y1 < y2 + h2 &&
            y1 + h1 > y2);
}

// --- Fonctions utilitaires pour un arrière-plan dégradé ---
const Y_AXIS = 1;
const X_AXIS = 2;

function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();

    if (axis === Y_AXIS) {
        // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            let inter = map(i, y, y + h, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis === X_AXIS) {
        // Left to right gradient
        for (let i = x; i <= x + w; i++) {
            let inter = map(i, x, x + w, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}
