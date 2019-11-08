import {
    Box,
    Body,
    // Plane,
    Convex
} from 'p2';
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_RAMP,
    GROUND_MATERIAL
} from '../../utils/physic';

import collisionItems from './collisionItems.json';

const PIXI = require('pixi.js');

const loadCollision = (scene, physicWorld, collisionLayer) => {
    collisionItems.list.forEach(item => {
        // debug view
        let body;
        let shape;
        switch (item.type) {
            case 'rectangle':
                body = new Body({
                    position: [item.x, item.y],
                    mass: 0,
                    type: Body.STATIC
                });

                shape = new Box({
                    width: item.width,
                    height: item.height,
                    collisionGroup: COLLISION_GROUP_GROUND,
                    collisionMask: COLLISION_GROUP_PLAYER | COLLISION_GROUP_ENEMY,
                    material: GROUND_MATERIAL
                });

                // move shape to start at coord origin
                body.addShape(shape);
                physicWorld.addBody(body);

                // draw debug form
                collisionLayer.beginFill(0xFF0000, 0.50);
                collisionLayer.drawRect(
                    item.x - item.width / 2,
                    item.y - item.height / 2,
                    item.width,
                    item.height
                );
                collisionLayer.endFill();
                break;

            case 'polygone':
                body = new Body({
                    position: [item.x, item.y],
                    mass: 0,
                    type: Body.STATIC
                });

                shape = new Convex({
                    vertices: item.vertices,
                    collisionGroup: COLLISION_GROUP_RAMP,
                    collisionMask: COLLISION_GROUP_PLAYER | COLLISION_GROUP_ENEMY,
                    material: GROUND_MATERIAL
                });

                body.addShape(shape);
                physicWorld.addBody(body);

                // draw debug form
                collisionLayer.beginFill(0xFF7700, 0.50);
                collisionLayer.moveTo(
                    item.vertices[0][0] + item.x,
                    item.vertices[0][1] + item.y
                );
                item.vertices.slice(1).forEach(vertice => {
                    collisionLayer.lineTo(
                        vertice[0] + item.x,
                        vertice[1] + item.y
                    );
                });
                collisionLayer.closePath();
                collisionLayer.endFill();
                break;

            default:
                throw new Error('Unknow collision type');
        }
    });

    scene.addChild(collisionLayer);
};

export function loadScene(scene, physicWorld, collisionLayer) {
    const bgLevel = PIXI.Sprite.from('level.png');
    bgLevel.x = 0;
    bgLevel.y = 0;
    bgLevel.width = 1968;
    bgLevel.height = 304;
    bgLevel.zIndex = 0;
    scene.addChild(bgLevel);

    // const ceil = new Body();
    // ceil.addShape(new Plane());
    // physicWorld.addBody(ceil);

    // const floor = new Body({
    //     position: [bgLevel.x, bgLevel.height],
    //     angle: Math.PI
    // });
    // floor.addShape(new Plane());
    // physicWorld.addBody(floor);

    // const left = new Body({
    //     position: [bgLevel.x, bgLevel.y],
    //     angle: 3 * Math.PI / 2
    // });
    // left.addShape(new Plane());
    // physicWorld.addBody(left);

    // const right = new Body({
    //     position: [bgLevel.width, bgLevel.y],
    //     angle: Math.PI / 2
    // });
    // right.addShape(new Plane());
    // physicWorld.addBody(right);

    // });
    // ceil.addShape(new Plane());
    // physicWorld.addBody(ceil);

    // const frames = [];
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack1-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack1-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack1-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack1-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack1-04.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-04.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack2-05.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-04.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-attack3-05.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-00.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-01.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-02.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-03.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-04.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-05.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-06.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-07.png']);
    // frames.push(PIXI.utils.TextureCache['adventurer-bow-08.png']);
    // const spriteAnimated = new PIXI.AnimatedSprite(frames);
    // spriteAnimated.x = 200;
    // spriteAnimated.loop = true;
    // spriteAnimated.y = 200;
    // spriteAnimated.width = 100;
    // spriteAnimated.height = 74;
    // spriteAnimated.animationSpeed = 0.3;
    // spriteAnimated.play();
    // scene.addChild(spriteAnimated);

    // // test frames
    // const frames2 = [];
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-02.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-03.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-02.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-rdy-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-00.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-01.png']);
    // frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-02.png']);
    // const spriteAnimated2 = new PIXI.AnimatedSprite(frames2);
    // spriteAnimated2.x = 200;
    // spriteAnimated2.y = 100;
    // spriteAnimated2.width = 100;
    // spriteAnimated2.height = 74;
    // spriteAnimated2.animationSpeed = 0.2;
    // spriteAnimated2.play();
    // scene.addChild(spriteAnimated2);

    // // test frames
    // const frames3 = [];
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-00.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-01.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-02.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-03.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-04.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-05.png']);
    // frames3.push(PIXI.utils.TextureCache['adventurer-die-06.png']);
    // const spriteAnimated3 = new PIXI.AnimatedSprite(frames3);
    // spriteAnimated3.x = 200;
    // spriteAnimated3.y = 300;
    // spriteAnimated3.width = 100;
    // spriteAnimated3.height = 74;
    // spriteAnimated3.animationSpeed = 0.15;
    // spriteAnimated3.play();
    // scene.addChild(spriteAnimated3);

    // // test frames
    // const frames4 = [];
    // frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
    // frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
    // const spriteAnimated4 = new PIXI.AnimatedSprite(frames4);
    // spriteAnimated4.x = 200;
    // spriteAnimated4.y = 400;
    // spriteAnimated4.width = 100;
    // spriteAnimated4.height = 74;
    // spriteAnimated4.animationSpeed = 0.2;
    // spriteAnimated4.play();
    // scene.addChild(spriteAnimated4);

    // // test frames
    // const frames5 = [];
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-00.png']);
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-01.png']);
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-02.png']);
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-03.png']);
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-04.png']);
    // frames5.push(PIXI.utils.TextureCache['adventurer-run-05.png']);
    // const spriteAnimated5 = new PIXI.AnimatedSprite(frames5);
    // spriteAnimated5.x = 300;
    // spriteAnimated5.y = 0;
    // spriteAnimated5.width = 100;
    // spriteAnimated5.height = 74;
    // spriteAnimated5.animationSpeed = 0.15;
    // spriteAnimated5.play();
    // scene.addChild(spriteAnimated5);

    // // test frames
    // const frames6 = [];
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-00.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-01.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-02.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-03.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
    // frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
    // const spriteAnimated6 = new PIXI.AnimatedSprite(frames6);
    // spriteAnimated6.x = 100;
    // spriteAnimated6.y = 100;
    // spriteAnimated6.width = 100;
    // spriteAnimated6.height = 74;
    // spriteAnimated6.animationSpeed = 0.2;
    // spriteAnimated6.play();
    // scene.addChild(spriteAnimated6);

    // // test frames
    // const frames7 = [];
    // frames7.push(PIXI.utils.TextureCache['adventurer-items-00.png']);
    // frames7.push(PIXI.utils.TextureCache['adventurer-items-01.png']);
    // frames7.push(PIXI.utils.TextureCache['adventurer-items-02.png']);
    // const spriteAnimated7 = new PIXI.AnimatedSprite(frames7);
    // spriteAnimated7.x = 100;
    // spriteAnimated7.y = 200;
    // spriteAnimated7.width = 100;
    // spriteAnimated7.height = 74;
    // spriteAnimated7.animationSpeed = 0.2;
    // spriteAnimated7.play();
    // scene.addChild(spriteAnimated7);

    // // test frames
    // const frames8 = [];
    // frames8.push(PIXI.utils.TextureCache['adventurer-jump-00.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-jump-01.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-jump-02.png']);
    // // frames8.push(PIXI.utils.TextureCache['adventurer-jump-03.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-00.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-01.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-02.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-03.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-00.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-01.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-02.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-03.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-stand-00.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-stand-01.png']);
    // frames8.push(PIXI.utils.TextureCache['adventurer-stand-02.png']);
    // const spriteAnimated8 = new PIXI.AnimatedSprite(frames8);
    // spriteAnimated8.x = 100;
    // spriteAnimated8.y = 0;
    // spriteAnimated8.width = 100;
    // spriteAnimated8.height = 74;
    // spriteAnimated8.animationSpeed = 0.2;
    // spriteAnimated8.play();
    // scene.addChild(spriteAnimated8);

    // // test frames
    // const frames9 = [];
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
    // frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
    // const spriteAnimated9 = new PIXI.AnimatedSprite(frames9);
    // spriteAnimated9.x = 100;
    // spriteAnimated9.y = 400;
    // spriteAnimated9.width = 100;
    // spriteAnimated9.height = 74;
    // spriteAnimated9.animationSpeed = 0.2;
    // spriteAnimated9.play();
    // scene.addChild(spriteAnimated9);

    // // test frames
    // const frames10 = [];
    // frames10.push(PIXI.utils.TextureCache['adventurer-wall-slide-00.png']);
    // frames10.push(PIXI.utils.TextureCache['adventurer-wall-slide-01.png']);
    // const spriteAnimated10 = new PIXI.AnimatedSprite(frames10);
    // spriteAnimated10.x = 100;
    // spriteAnimated10.y = 300;
    // spriteAnimated10.width = 100;
    // spriteAnimated10.height = 74;
    // spriteAnimated10.animationSpeed = 0.2;
    // spriteAnimated10.play();
    // scene.addChild(spriteAnimated10);

    // // test frames
    // const frames11 = [];
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-00.png']);
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-01.png']);
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-02.png']);
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-03.png']);
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-04.png']);
    // frames11.push(PIXI.utils.TextureCache['adventurer-run2-05.png']);
    // const spriteAnimated11 = new PIXI.AnimatedSprite(frames11);
    // spriteAnimated11.x = 300;
    // spriteAnimated11.y = 200;
    // spriteAnimated11.width = 100;
    // spriteAnimated11.height = 74;
    // spriteAnimated11.animationSpeed = 0.15;
    // spriteAnimated11.play();
    // scene.addChild(spriteAnimated11);

    // // test frames
    // const frames12 = [];
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-00.png']);
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-01.png']);
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-02.png']);
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-03.png']);
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-04.png']);
    // frames12.push(PIXI.utils.TextureCache['adventurer-run3-05.png']);
    // const spriteAnimated12 = new PIXI.AnimatedSprite(frames12);
    // spriteAnimated12.x = 300;
    // spriteAnimated12.y = 300;
    // spriteAnimated12.width = 100;
    // spriteAnimated12.height = 74;
    // spriteAnimated12.animationSpeed = 0.15;
    // spriteAnimated12.play();
    // scene.addChild(spriteAnimated12);

    // // test frames
    // const frames13 = [];
    // frames13.push(PIXI.utils.TextureCache['adventurer-jump-00.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-jump-01.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-jump-02.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-jump-03.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-bow-jump-01.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-bow-jump-02.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-bow-jump-03.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-bow-jump-04.png']);
    // frames13.push(PIXI.utils.TextureCache['adventurer-bow-jump-05.png']);
    // const spriteAnimated13 = new PIXI.AnimatedSprite(frames13);
    // spriteAnimated13.x = 300;
    // spriteAnimated13.y = 100;
    // spriteAnimated13.width = 100;
    // spriteAnimated13.height = 74;
    // spriteAnimated13.animationSpeed = 0.15;
    // spriteAnimated13.play();
    // scene.addChild(spriteAnimated13);

    // // test frames
    // const frames14 = [];
    // frames14.push(PIXI.utils.TextureCache['adventurer-cast-00.png']);
    // frames14.push(PIXI.utils.TextureCache['adventurer-cast-01.png']);
    // frames14.push(PIXI.utils.TextureCache['adventurer-cast-02.png']);
    // frames14.push(PIXI.utils.TextureCache['adventurer-cast-03.png']);
    // const spriteAnimated14 = new PIXI.AnimatedSprite(frames14);
    // spriteAnimated14.x = 300;
    // spriteAnimated14.y = 400;
    // spriteAnimated14.width = 100;
    // spriteAnimated14.height = 74;
    // spriteAnimated14.animationSpeed = 0.20;
    // spriteAnimated14.play();
    // scene.addChild(spriteAnimated14);

    // // test frames
    // const frames15 = [];
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-00.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-01.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-02.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-03.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-04.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-05.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-06.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-07.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-08.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-09.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-10.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-11.png']);
    // frames15.push(PIXI.utils.TextureCache['adventurer-punch-12.png']);
    // const spriteAnimated15 = new PIXI.AnimatedSprite(frames15);
    // spriteAnimated15.x = 400;
    // spriteAnimated15.y = 100;
    // spriteAnimated15.width = 100;
    // spriteAnimated15.height = 74;
    // spriteAnimated15.animationSpeed = 0.20;
    // spriteAnimated15.play();
    // scene.addChild(spriteAnimated15);

    // // test frames
    // const frames16 = [];
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-00.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-01.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-02.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-03.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-04.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-05.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-06.png']);
    // frames16.push(PIXI.utils.TextureCache['adventurer-kick-07.png']);
    // const spriteAnimated16 = new PIXI.AnimatedSprite(frames16);
    // spriteAnimated16.x = 400;
    // spriteAnimated16.y = 200;
    // spriteAnimated16.width = 100;
    // spriteAnimated16.height = 74;
    // spriteAnimated16.animationSpeed = 0.20;
    // spriteAnimated16.play();
    // scene.addChild(spriteAnimated16);

    // // test frames
    // const frames17 = [];
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-00.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-01.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-02.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-03.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-04.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-05.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-knock-dwn-06.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-stand-00.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-stand-01.png']);
    // frames17.push(PIXI.utils.TextureCache['adventurer-stand-02.png']);
    // const spriteAnimated17 = new PIXI.AnimatedSprite(frames17);
    // spriteAnimated17.x = 400;
    // spriteAnimated17.y = 300;
    // spriteAnimated17.width = 100;
    // spriteAnimated17.height = 74;
    // spriteAnimated17.animationSpeed = 0.20;
    // spriteAnimated17.play();
    // scene.addChild(spriteAnimated17);

    // // test frames
    // const frames18 = [];
    // frames18.push(PIXI.utils.TextureCache['torch-anim-00.png']);
    // frames18.push(PIXI.utils.TextureCache['torch-anim-01.png']);
    // frames18.push(PIXI.utils.TextureCache['torch-anim-02.png']);
    // frames18.push(PIXI.utils.TextureCache['torch-anim-03.png']);
    // frames18.push(PIXI.utils.TextureCache['torch-anim-04.png']);
    // const spriteAnimated18 = new PIXI.AnimatedSprite(frames18);
    // spriteAnimated18.x = 500;
    // spriteAnimated18.y = 200;
    // spriteAnimated18.width = 16;
    // spriteAnimated18.height = 32;
    // spriteAnimated18.animationSpeed = 0.20;
    // spriteAnimated18.play();
    // scene.addChild(spriteAnimated18);
    // const frames18_1 = [];
    // frames18_1.push(PIXI.utils.TextureCache['torch-anim-00.png']);
    // frames18_1.push(PIXI.utils.TextureCache['torch-anim-01.png']);
    // frames18_1.push(PIXI.utils.TextureCache['torch-anim-02.png']);
    // frames18_1.push(PIXI.utils.TextureCache['torch-anim-03.png']);
    // frames18_1.push(PIXI.utils.TextureCache['torch-anim-04.png']);
    // const spriteAnimated18_1 = new PIXI.AnimatedSprite(frames18_1);
    // spriteAnimated18_1.x = 520;
    // spriteAnimated18_1.y = 200;
    // spriteAnimated18_1.width = 16;
    // spriteAnimated18_1.height = 32;
    // spriteAnimated18_1.animationSpeed = 0.20;
    // spriteAnimated18_1.play();
    // scene.addChild(spriteAnimated18_1);
    // const frames18_2 = [];
    // frames18_2.push(PIXI.utils.TextureCache['torch-anim-00.png']);
    // frames18_2.push(PIXI.utils.TextureCache['torch-anim-01.png']);
    // frames18_2.push(PIXI.utils.TextureCache['torch-anim-02.png']);
    // frames18_2.push(PIXI.utils.TextureCache['torch-anim-03.png']);
    // frames18_2.push(PIXI.utils.TextureCache['torch-anim-04.png']);
    // const spriteAnimated18_2 = new PIXI.AnimatedSprite(frames18_2);
    // spriteAnimated18_2.x = 540;
    // spriteAnimated18_2.y = 200;
    // spriteAnimated18_2.width = 16;
    // spriteAnimated18_2.height = 32;
    // spriteAnimated18_2.animationSpeed = 0.20;
    // spriteAnimated18_2.play();
    // scene.addChild(spriteAnimated18_2);

    // // test frames
    // const frames19 = [];
    // frames19.push(PIXI.utils.TextureCache['torch-anim-with-bg-00.png']);
    // frames19.push(PIXI.utils.TextureCache['torch-anim-with-bg-01.png']);
    // frames19.push(PIXI.utils.TextureCache['torch-anim-with-bg-02.png']);
    // frames19.push(PIXI.utils.TextureCache['torch-anim-with-bg-03.png']);
    // frames19.push(PIXI.utils.TextureCache['torch-anim-with-bg-04.png']);
    // const spriteAnimated19 = new PIXI.AnimatedSprite(frames19);
    // spriteAnimated19.x = 500;
    // spriteAnimated19.y = 0;
    // spriteAnimated19.width = 48;
    // spriteAnimated19.height = 48;
    // spriteAnimated19.animationSpeed = 0.20;
    // spriteAnimated19.play();
    // scene.addChild(spriteAnimated19);

    // // test frames
    // const frames20 = [];
    // frames20.push(PIXI.utils.TextureCache['water-anim-00.png']);
    // frames20.push(PIXI.utils.TextureCache['water-anim-01.png']);
    // frames20.push(PIXI.utils.TextureCache['water-anim-02.png']);
    // frames20.push(PIXI.utils.TextureCache['water-anim-03.png']);
    // const spriteAnimated20 = new PIXI.AnimatedSprite(frames20);
    // spriteAnimated20.x = 500;
    // spriteAnimated20.y = 400;
    // spriteAnimated20.width = 64;
    // spriteAnimated20.height = 64;
    // spriteAnimated20.animationSpeed = 0.10;
    // spriteAnimated20.play();
    // scene.addChild(spriteAnimated20);

    loadCollision(scene, physicWorld, collisionLayer);
}
