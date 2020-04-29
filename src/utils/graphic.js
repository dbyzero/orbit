import * as PIXI from 'pixi.js';

// eslint-disable-next-line import/prefer-default-export
export const createAnimation = function (animationName, steps, speed) {
    const frames = [];
    for (let index = 0; index < steps; index = index + 1) {
        const textureCache = `${animationName}-${`0${ index }`.slice(-2)}.png`;
        frames.push(PIXI.utils.TextureCache[textureCache]);
    }
    const spriteAnimated = new PIXI.AnimatedSprite(frames);
    spriteAnimated.animationSpeed = speed;
    spriteAnimated.loop = true;
    spriteAnimated.play();
    return spriteAnimated;
};
