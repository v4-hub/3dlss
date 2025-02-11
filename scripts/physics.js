import { createTerrainShape } from './terrain.js';
import { collisionConfiguration, dispatcher, broadphase, solver, physicsWorld, transformAux1, terrainBody } from './init.js';

function initPhysics() {
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -6, 0));

    const groundShape = createTerrainShape();
    const groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
    const groundMass = 0;
    const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
    const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia);
    terrainBody = new Ammo.btRigidBody(rbInfo);
    physicsWorld.addRigidBody(terrainBody);
    transformAux1 = new Ammo.btTransform();
}

export { initPhysics };
