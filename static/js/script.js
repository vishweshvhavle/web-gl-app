let scene, camera, renderer, sphere, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.set(0, 0, 20);

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 200, 0);
    scene.add(pointLight);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
}

function setParams(vars) {
    if (vars.radius !== undefined) {
        sphere.geometry.dispose();
        sphere.geometry = new THREE.SphereGeometry(vars.radius, 32, 32);
    }
    // Other parameters like color, material properties, etc., can be updated similarly
}

// Initialize the scene
init();
