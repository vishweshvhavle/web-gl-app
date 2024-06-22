let scene, camera, renderer, spaceship, planet, asteroids = [];
let gameOver = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Background
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/api/placeholder/2048/1024');
    scene.background = texture;

    // Spaceship (player)
    const spaceshipGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const spaceshipMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.position.z = 10;
    scene.add(spaceship);

    // Planet (goal)
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.z = -50;
    scene.add(planet);

    // Asteroids
    for (let i = 0; i < 50; i++) {
        const asteroidGeometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.5, 32, 32);
        const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * -40 - 10
        );
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
            document.getElementById('info').innerHTML = 'You Win! Refresh to play again.';
        }

        renderer.render(scene, camera);
    }
}

function onKeyDown(event) {
    const speed = 0.5;
    switch (event.key) {
        case 'ArrowUp':
            spaceship.position.y += speed;
            break;
        case 'ArrowDown':
            spaceship.position.y -= speed;
            break;
        case 'ArrowLeft':
            spaceship.position.x -= speed;
            break;
        case 'ArrowRight':
            spaceship.position.x += speed;
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

init();
animate();