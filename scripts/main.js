import { init } from './init.js';
import { setupRain } from './rain.js';
import { createGUI } from './gui.js';

Ammo().then(function(AmmoLib) {
    Ammo = AmmoLib;
    init();
});

export { setupRain, createGUI };
