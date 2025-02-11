import * as THREE from 'three';
import { loadDEMHeightData, createTerrainShape } from './terrain.js';
import { initGraphics } from './graphics.js';
import { initPhysics } from './physics.js';

let container, stats, camera, scene, renderer, terrainMesh;
const clock = new THREE.Clock();
let collisionConfiguration, dispatcher, broadphase, solver, physicsWorld;
let transformAux1, terrainBody;
const dynamicObjects = [];
let heightData = null, ammoHeightData = null;

async function init() {
    const dem = await loadDEMHeightData();
    terrainWidth = dem.width;
    terrainDepth = dem.height;
    heightData = dem.heightData;
    terrainMinHeight = dem.minHeight;
    terrainMaxHeight = dem.maxHeight;
    terrainHalfWidth = terrainWidth / 2;
    terrainHalfDepth = terrainDepth / 2;

    initGraphics();
    initPhysics();
    createGUI();
    setupRain();
}

export { init, container, stats, camera, scene, renderer, terrainMesh, clock, collisionConfiguration, dispatcher, broadphase, solver, physicsWorld, transformAux1, terrainBody, dynamicObjects, heightData, ammoHeightData };
