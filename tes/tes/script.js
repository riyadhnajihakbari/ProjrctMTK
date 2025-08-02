document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Get input values
    const funcStr = document.getElementById('function').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);

    // Validate inputs
    if (a >= b) {
        alert("Batas bawah harus lebih kecil dari batas atas.");
        return;
    }

    // Calculate the volume
    const volume = calculateVolume(funcStr, a, b);

    // Display the solution steps
    document.getElementById('rumus').innerText = `Rumus: V = π ∫[${a} to ${b}] (f(x))^2 dx`;
    document.getElementById('hasil').innerText = `Volume: ${volume.toFixed(2)} cubic units`;

    // Render 3D visualization
    render3DVisualization(funcStr, a, b);

    // Render 2D graph visualization
    render2DGraph(funcStr, a, b);

    // Show the visualization container
    document.querySelector('.visualization-container').style.display = 'flex';
});

function render3DVisualization(funcStr, a, b) {
    const func = new Function('x', `return ${funcStr}`);

    // Create the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 400);
    renderer.setClearColor(0xffffff, 1); // Set background color to white

    // Append the renderer to the container
    const canvasContainer = document.querySelector('#threejs-canvas-container');
    canvasContainer.innerHTML = ''; // Clear any previous renderings
    canvasContainer.appendChild(renderer.domElement);

    // Add geometry for volume of revolution
    const points = generate3DPoints(func, a, b);
    if (points.length === 0) {
        alert("Tidak dapat membuat geometri. Periksa fungsi atau intervalnya.");
        return;
    }
    const geometry = new THREE.LatheGeometry(points, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x8cc8ff, roughness: 0.5 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Rotate the mesh to face sideways
    mesh.rotation.x = Math.PI / 2;

    // Add grid and axes helpers
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add OrbitControls for interaction
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Position the camera to have a better view
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, 0);

    // Ensure the controls are updated
    controls.target.set(0, 0, 0);
    controls.update();

    // Add labels to axes
    addLabelToAxes(scene, 'X', { x: 10, y: 0, z: 0 });
    addLabelToAxes(scene, 'Y', { x: 0, y: 10, z: 0 });
    addLabelToAxes(scene, 'Z', { x: 0, y: 0, z: 10 });

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

function addLabelToAxes(scene, label, position) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(label, {
            font: font,
            size: 1,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        scene.add(textMesh);
    });
}

function render2DGraph(funcStr, a, b) {
    const func = new Function('x', `return ${funcStr}`);

    // Get the 2D canvas context
    const canvas = document.getElementById('canvas-2d');
    const ctx = canvas.getContext('2d');

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up the graph area
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50); // Start at (50, 350)
    ctx.lineTo(canvas.width - 50, canvas.height - 50); // End at (550, 350) on x-axis
    ctx.lineTo(canvas.width - 50, 50); // End at (550, 50) on y-axis
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Add X and Y labels with adjusted positions
    ctx.font = '16px Arial';
    ctx.fillText('X', canvas.width - 30, canvas.height - 20); // X label on the right side
    ctx.fillText('Y', canvas.width - 30, 40); // Y label on the top right

    // Add numbers on the X axis (adjusted position)
    const xStep = (b - a) / 5;
    for (let i = 0; i <= 5; i++) {
        const x = a + i * xStep;
        const canvasX = 50 + ((x - a) / (b - a)) * (canvas.width - 100);
        const canvasY = canvas.height - 30;
        ctx.fillText(x.toFixed(2), canvasX - 10, canvasY);
    }

    // Plot the function points on the graph
    ctx.beginPath();
    for (let x = a; x <= b; x += 0.01) {
        const canvasX = 50 + ((x - a) / (b - a)) * (canvas.width - 100);
        const canvasY = canvas.height - 50 - func(x) * 50;
        ctx.lineTo(canvasX, canvasY);
    }
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
}

function calculateVolume(funcStr, a, b) {
    const func = new Function('x', `return ${funcStr}`);
    let volume = 0;
    const steps = 1000;
    const deltaX = (b - a) / steps;

    for (let i = 0; i < steps; i++) {
        const x = a + i * deltaX;
        volume += Math.PI * Math.pow(func(x), 2) * deltaX;
    }

    return volume;
}

function generate3DPoints(func, a, b) {
    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
        const x = a + i * (b - a) / steps;
        const y = func(x);
        points.push(new THREE.Vector2(x, y));
    }
    return points;
}
