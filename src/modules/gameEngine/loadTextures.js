const PIXI = require('pixi.js');
const spritesheetJson = require('../../assets/sprites/spritesheet.json');

export default () => new Promise(
    resolv => {
        PIXI.loader
            .add('spritesheet', '/assets/sprites/spritesheet.png')
            .load((loader, res) => {
                resolv(res);
            });
    }).then(res => new Promise(
    resolv => {
        new PIXI.Spritesheet(
            res.spritesheet.texture.baseTexture,
            spritesheetJson,
            'spritesheet'
        ).parse(resolv);
    }).catch(err => {
    throw Error(err);
}));
