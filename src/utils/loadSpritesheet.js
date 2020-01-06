const PIXI = require('pixi.js');

export default spritesheet => new Promise(
    resolv => {
        PIXI.loader
            .add(spritesheet.name, spritesheet.pngFile)
            .load((loader, res) => {
                resolv(res);
            });
    }).then(res => new Promise(
    resolv => {
        new PIXI.Spritesheet(
            res[spritesheet.name].texture.baseTexture,
            spritesheet.jsonFile
        ).parse(resolv);
    }).catch(err => {
    throw Error(err);
}));
