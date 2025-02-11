import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { container, terrainMesh, heightData, terrainControls, scene, camera, renderer } from './init.js';

function initGraphics() {
    container = document.getElementById("container");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = "fixed";
    stats.domElement.style.top = "60px";
    stats.domElement.style.right = "10px";
    stats.domElement.style.left = "auto";
    document.body.appendChild(stats.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
    const midIndex = Math.floor(terrainHalfWidth + terrainHalfDepth * terrainWidth);
    camera.position.y = heightData[midIndex] * terrainControls.scale + 5;
    camera.position.z = terrainDepthExtents / 2;
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    const geometry = new THREE.PlaneGeometry(
        terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1
    );
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position.array;
    for (let i = 0, l = heightData.length; i < l; i++) {
        vertices[i * 3 + 1] = heightData[i] * terrainControls.scale;
    }
    geometry.computeVertexNormals();
    const groundMaterial = new THREE.MeshPhongMaterial({ color: terrainControls.color });
    terrainMesh = new THREE.Mesh(geometry, groundMaterial);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);
    scene.add(terrainMesh);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("textures/grid.png", function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(terrainWidth - 1, terrainDepth - 1);
        groundMaterial.map = texture;
        groundMaterial.needsUpdate = true;
    });
    // 添加环境光与定向光
    scene.add(new THREE.AmbientLight(0x222222));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    const dLight = 200, sLight = dLight * 0.25;
    directionalLight.shadow.camera.left = -sLight;
    directionalLight.shadow.camera.right = sLight;
    directionalLight.shadow.camera.top = sLight;
    directionalLight.shadow.camera.bottom = -sLight;
    directionalLight.shadow.camera.near = dLight / 30;
    directionalLight.shadow.camera.far = dLight;
    directionalLight.shadow.mapSize.x = 2048;
    directionalLight.shadow.mapSize.y = 2048;
    scene.add(directionalLight);

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export { initGraphics };
