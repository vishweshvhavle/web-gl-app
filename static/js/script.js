// script.js
let scene, camera, renderer, spaceship, planet, asteroids = [], stars = [];
let gameOver = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Stars background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Spaceship (player)
    const spaceshipGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const spaceshipMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.position.z = 10;
    scene.add(spaceship);

    // Planet (goal)
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.2,
        shininess: 50
    });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.z = -50;
    scene.add(planet);

    // Asteroids
    const asteroidGeometry = new THREE.IcosahedronGeometry(1, 0);
    const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        flatShading: true
    });

    for (let i = 0; i < 50; i++) {
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * -40 - 10
        );
        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        asteroid.scale.setScalar(Math.random() * 0.5 + 0.5);
        asteroids.push(asteroid);
        scene.add(asteroid);
    }

    camera.position.z = 15;
}

function animate() {
    if (!gameOver) {
        requestAnimationFrame(animate);

        // Move spaceship towards the planet
        spaceship.position.z -= 0.1;

        // Rotate asteroids
        asteroids.forEach(asteroid => {
            asteroid.rotation.x += 0.01;
            asteroid.rotation.y += 0.01;
        });

        // Move stars
        const positions = stars.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += 0.1;
            if (positions[i] > 0) {
                positions[i] = -1000;
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        // Check for collisions
        asteroids.forEach(asteroid => {
            if (spaceship.position.distanceTo(asteroid.position) < 1) {
                gameOver = true;
                document.getElementById('info').innerHTML = 'Game Over! Refresh to play again.';
            }
        });

        // Check for reaching the planet
        if (spaceship.position.distanceTo(planet.position) < 3) {
            gameOver = true;
            document.getElementById('info').innerHTML = 'You Win! Humanity is saved! Refresh to play again.';
        }

        renderer.render(scene, camera);
    }
}

function moveSpaceship(direction) {
    const speed = 0.5;
    switch (direction) {
        case 'up':
            spaceship.position.y += speed;
            break;
        case 'down':
            spaceship.position.y -= speed;
            break;
        case 'left':
            spaceship.position.x -= speed;
            break;
        case 'right':
            spaceship.position.x += speed;
            break;
    }
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveSpaceship('up');
            break;
        case 'ArrowDown':
            moveSpaceship('down');
            break;
        case 'ArrowLeft':
            moveSpaceship('left');
            break;
        case 'ArrowRight':
            moveSpaceship('right');
            break;
    }
}

window.addEventListener('keydown', onKeyDown);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Virtual keypad setup
const virtualKeypad = document.getElementById('virtual-keypad');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

function setupVirtualKeypad() {
    virtualKeypad.style.display = 'block';
    
    upBtn.addEventListener('touchstart', () => moveSpaceship('up'));
    downBtn.addEventListener('touchstart', () => moveSpaceship('down'));
    leftBtn.addEventListener('touchstart', () => moveSpaceship('left'));
    rightBtn.addEventListener('touchstart', () => moveSpaceship('right'));
}

// Check if it's a touch device and set up virtual keypad if necessary
if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
    setupVirtualKeypad();
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});

// Function to handle game over
function gameOverMessage(message) {
    gameOver = true;
    document.getElementById('info').innerHTML = message + ' Refresh to play again.';
}

// Function to detect collisions with asteroids and planet
function detectCollisions() {
    // Check for collisions with asteroids
    asteroids.forEach(asteroid => {
        if (spaceship.position.distanceTo(asteroid.position) < 1) {
            gameOverMessage('Game Over!');
        }
    });

    // Check for reaching the planet
    if (spaceship.position.distanceTo(planet.position) < 3) {
        gameOverMessage('You Win! Humanity is saved!');
    }
}

// Animation loop
function animate() {
    if (!gameOver) {
        requestAnimationFrame(animate);

        // Move spaceship towards the planet
        spaceship.position.z -= 0.1;

        // Rotate asteroids
        asteroids.forEach(asteroid => {
            asteroid.rotation.x += 0.01;
            asteroid.rotation.y += 0.01;
        });

        // Move stars
        const positions = stars.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += 0.1;
            if (positions[i] > 0) {
                positions[i] = -1000;
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        // Check for collisions
        detectCollisions();

        renderer.render(scene, camera);
    }
}

// Function to move the spaceship based on keyboard input
function moveSpaceship(direction) {
    const speed = 0.5;
    switch (direction) {
        case 'up':
            spaceship.position.y += speed;
            break;
        case 'down':
            spaceship.position.y -= speed;
            break;
        case 'left':
            spaceship.position.x -= speed;
            break;
        case 'right':
            spaceship.position.x += speed;
            break;
    }
}

// Event listener for keyboard input
function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveSpaceship('up');
            break;
        case 'ArrowDown':
            moveSpaceship('down');
            break;
        case 'ArrowLeft':
            moveSpaceship('left');
            break;
        case 'ArrowRight':
            moveSpaceship('right');
            break;
    }
}

window.addEventListener('keydown', onKeyDown);

// Function to handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

function setupVirtualKeypad() {
    virtualKeypad.style.display = 'block';
    
    upBtn.addEventListener('touchstart', () => moveSpaceship('up'));
    downBtn.addEventListener('touchstart', () => moveSpaceship('down'));
    leftBtn.addEventListener('touchstart', () => moveSpaceship('left'));
    rightBtn.addEventListener('touchstart', () => moveSpaceship('right'));
}

// Check if it's a touch device and set up virtual keypad if necessary
if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
    setupVirtualKeypad();
}
