let scene, camera, renderer, sphere, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/world.jpg', render);
    const normalMap = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/earth_normalmap_8192x4096.jpg', render);
    const specularMap = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/earth_specular_2048x1024.jpg', render);
    
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        normalMap: normalMap,
        specularMap: specularMap,
        shininess: 50
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    camera.position.set(0, 0, 20);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);
    
    // Add stars
    addStars();
    
    animate();
}

function addStars() {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        scene.add(star);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    sphere.rotation.y += 0.002;
    
    controls.update();
    
    render();
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

window.addEventListener('resize', onWindowResize, false);

// Initialize the scene
init();