import * as THREE from 'three';
import parseGeoraster from 'https://esm.sh/georaster@1.6.0';

async function loadDEMHeightData() {
    const response = await fetch("/data/jiangwan_dem1.tif");
    const arrayBuffer = await response.arrayBuffer();
    const georaster = await parseGeoraster(arrayBuffer);
    console.log("加载服务器 DEM 成功：", georaster);
    const demWidth = georaster.width, demHeight = georaster.height;
    const values = georaster.values[0];
    let minEl = Infinity, maxEl = -Infinity;
    for (let r = 0; r < demHeight; r++) {
        for (let c = 0; c < demWidth; c++) {
            const v = values[r][c];
            if (v === georaster.noDataValue) continue;
            if (v < minEl) minEl = v;
            if (v > maxEl) maxEl = v;
        }
    }
    const amplitude = 200;
    const heightDataArray = new Float32Array(demWidth * demHeight);
    for (let r = 0; r < demHeight; r++) {
        for (let c = 0; c < demWidth; c++) {
            const v = values[r][c];
            let normalized = (v === georaster.noDataValue || maxEl === minEl) ? 0 : (v - minEl) / (maxEl - minEl);
            heightDataArray[r * demWidth + c] = normalized * amplitude - amplitude / 2;
        }
    }
    return { width: demWidth, height: demHeight, heightData: heightDataArray, minHeight: -amplitude/2, maxHeight: amplitude/2 };
}

function createTerrainShape() {
    ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);
    let p2 = 0;
    for (let i = 0; i < heightData.length; i++) {
        Ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[i] * terrainControls.scale;
        p2 += 4;
    }
    const heightScale = 1, upAxis = 1, hdt = "PHY_FLOAT", flipQuadEdges = false;
    const heightFieldShape = new Ammo.btHeightfieldTerrainShape(
        terrainWidth, terrainDepth, ammoHeightData, heightScale,
        terrainMinHeight * terrainControls.scale,
        terrainMaxHeight * terrainControls.scale,
        upAxis, hdt, flipQuadEdges
    );
    const scaleX = terrainWidthExtents / (terrainWidth - 1);
    const scaleZ = terrainDepthExtents / (terrainDepth - 1);
    heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));
    heightFieldShape.setMargin(0.05);
    return heightFieldShape;
}

export { loadDEMHeightData, createTerrainShape };
