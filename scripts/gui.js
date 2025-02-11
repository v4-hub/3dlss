import { updateTerrainGeometry } from './terrain.js';
import { addObjectsRegion, updateCohesionForObjects } from './objects.js';
import { addPlantsRegion, updateSoilForObjects } from './plants.js';
import { setupRain } from './rain.js';
import { saveRegionsData, loadRegionsData } from './project.js';

function createGUI() {
    gui = new dat.GUI({ autoPlace: false });
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = "fixed";
    gui.domElement.style.top = "60px";
    gui.domElement.style.left = "10px";
    gui.domElement.style.opacity = "0.8";
    gui.domElement.style.background = "rgba(255,255,255,0.5)";

    terrainFolder = gui.addFolder("地形控件");
    terrainFolder.add(terrainControls, "scale", 0.01, 1, 0.01).name("垂直缩放").onChange(function (value) { updateTerrainGeometry(value); });
    terrainFolder.addColor(terrainControls, "color").name("地形颜色").onChange(function (value) { terrainMesh.material.color.set(value); });
    terrainFolder.open();

    objectFolder = gui.addFolder("物体控件");
    objectFolder.add(objectParams, "type", ["Random", "Sphere", "Box", "Cylinder", "Cone"]).name("物体类型");
    objectFolder.add(objectParams, "count", 1, 100, 1).name("物体数量").onChange(function (value) { maxNumObjects = value; });
    objectFolder.add(objectParams, "size", 0.01, 1, 0.01).name("物体大小");
    objectFolder.addColor(objectParams, "color").name("物体颜色");
    objectFolder.add(objectParams, "cohesion", 0, 1, 0.01).name("物源凝聚力").onChange(function (value) { updateCohesionForObjects(); });
    objectFolder.add({ addObjects: addObjectsRegion }, "addObjects").name("添加物源");
    objectFolder.open();

    regionFolder = gui.addFolder("区域控件");
    regionFolder.add({ startDrawing: startDrawingRegion }, "startDrawing").name("新建区域");
    regionController = regionFolder.add(regionControlData, "activeRegion", ["未选择"]).name("选择区域").onChange(function (value) {
        activeRegion = regions.find(r => r.name === value);
        drawRegions();
    });
    regionFolder.open();

    plantFolder = gui.addFolder("植物控件");
    plantFolder.add(plantParams, "count", 1, 50, 1).name("植物数量");
    plantFolder.addColor(plantParams, "color").name("植物颜色");
    plantFolder.add(plantParams, "size", 0.5, 3, 0.1).name("植物大小");
    plantFolder.add(plantParams, "height", 2, 10, 0.5).name("植物高度");
    plantFolder.add(plantParams, "weight", 1, 20, 1).name("植物重量");
    plantFolder.add({ addPlants: addPlantsRegion }, "addPlants").name("添加植物");
    plantFolder.open();

    rainFolder = gui.addFolder("降雨设置");
    rainFolder.add(rainSettings, "enabled").name("启用降雨");
    rainFolder.add(rainSettings, "rainSpeed", 0, 5, 0.1).name("降雨速度");
    rainFolder.add(rainSettings, "rainCount", 1000, 20000, 1000).name("雨滴数量").onFinishChange(function (value) {
        scene.remove(rainParticles);
        rainSettings.rainCount = value;
        setupRain();
    });
    rainFolder.add(rainSettings, "rainSize", 0.1, 5, 0.1).name("雨滴大小").onChange(function (value) {
        if (rainParticles) {
            rainParticles.material.size = value;
        }
    });
    rainFolder.open();

    soilFolder = gui.addFolder("土壤参数");
    soilFolder.add(soilParams, "cohesion", 0, 10, 0.1).name("凝聚力").onChange(function () { updateSoilForObjects(); });
    soilFolder.add(soilParams, "adhesion", 0, 10, 0.1).name("附着力").onChange(function () { updateSoilForObjects(); });
    soilFolder.add(soilParams, "porePressure", 0, 10, 0.1).name("孔隙水压力").onChange(function () { updateSoilForObjects(); });
    soilFolder.open();
}

export { createGUI };
