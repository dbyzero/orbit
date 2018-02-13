import React from 'react';
import { connect } from 'react-redux';
import { moveCamera, zoomCamera, cameraResize } from '../../actions/cameraActions';
import { updateTotalDisplayShown } from '../../actions/gameSceneAction';
const PIXI = require('pixi.js');

class GameScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app: new PIXI.Application({
                backgroundColor: 0x333333,
                resolution: 1,
                antialias: false,
                forceFXAA: false,
                transparent: false
            }),
            container: new PIXI.particles.ParticleContainer(300*300, {
                scale: false,
                position: false,
                rotation: false,
                uvs: true,
                alpha: false
            }),
            lastFPSUpdate: 0,
            FPS: null,
            avgFPS: [],
            sprites: [],
            resources: [],
            spriteUnderMouse: null,
            updateCount: 0,
            lastCamera: Object.assign({}, props.camera)
        };
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        // call a resize to scene initial game scene size
        this.handleWindowResize();

        window.addEventListener('resize', this.handleWindowResize, false);
        if (!this.gameScene) {
            throw new Error('Cannot find game scene dom element');
        }

        // add some custom settings
        this.state.app.renderer.autoResize = true;
        this.state.container.autoResize = true;

        // append game scene in dom
        this.gameScene.appendChild(this.state.app.view);

        this.init();
        this.loadResources().then((resources) => {
            this.setState({
                resources: resources
            }, () => {
                this.start();
            });
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize, false);
    }

    init() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.state.app.ticker.add(this.update.bind(this));
        this.state.app.view.addEventListener('pointermove', (e) => {
            if (this.state.isBtnPushed) {
                this.moveCamera(e.movementX, e.movementY);
            }
        });
        this.state.app.view.addEventListener('pointerdown', this.onSceneClicked.bind(this));
        this.state.app.view.addEventListener('pointerup', this.onSceneNotClickedAnymore.bind(this));
        this.state.app.view.addEventListener('pointercancel', this.onSceneNotClickedAnymore.bind(this));
        this.state.app.view.addEventListener('pointerout', this.onSceneNotClickedAnymore.bind(this));
        this.state.app.view.addEventListener('mousewheel', this.onZoom.bind(this));
        this.state.app.view.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.state.app.view.addEventListener('gesturechange', this.onGestureChange.bind(this));
        this.state.app.stage.addChild(this.state.container);
    }

    moveCamera(dx, dy) {
        this.props.dispatch(moveCamera(dx, dy));
    }

    loadResources() {
        return new Promise(resolv => {
            // check if already loaded
            if (PIXI.loader.resources.spritesheet) {
                resolv(PIXI.loader.resources);
            } else {
                PIXI.loader
                    .add('spritesheet', '/assets/sprites/spritesheet.png')
                    .load((loader, resources) => {
                        resolv(resources);
                    });
            }
        }).then(resources => {
            return new Promise(resolv => {
                new PIXI.Spritesheet(
                    resources.spritesheet.texture.baseTexture,
                    require('../../../assets/sprites/spritesheet.json'),
                    'spritesheet'
                ).parse(() => {
                    resolv(resources);
                });
            });
        }).catch((err) => {
            throw Error(err);
        });
    }

    onSceneClicked() {
        this.setState({
            isBtnPushed: true
        });
    }

    onMouseMove(/* e */) {
    }

    onSceneNotClickedAnymore() {
        this.setState({
            isBtnPushed: false
        });
    }

    onZoom(e) {
        this.props.dispatch(zoomCamera(e.wheelDeltaY));
    }

    onGestureChange(e) {
        // TO TEST
        this.props.dispatch(zoomCamera(10 * (1 - e.scale)));
    }

    componentWillReceiveProps(props) {
        // check camera change
        const oldCamera = Object.assign({}, this.state.lastCamera);
        this.setState({
            lastCamera: Object.assign({}, props.camera)
        }, () => {
            if (oldCamera.x !== this.props.camera.x ||
                oldCamera.y !== this.props.camera.y ||
                oldCamera.zoom !== props.camera.zoom) {
                // we check before drawing to hide out of screen tiles
                this.move();
                // and we check in update (after render) to show reveal tiles
                this.state.app.ticker.addOnce(this.move.bind(this));
            }
        });
    }

    update() {
        const newState = Object.assign({}, this.state);

        // FPS
        if (this.state.FPS && this.state.lastFPSUpdate + 200 < newState.app.ticker.lastTime) {
            if (newState.avgFPS.length === 10) {
                newState.avgFPS.shift();
            }
            newState.avgFPS.push(newState.app.ticker.FPS);

            const FPS = newState.avgFPS.reduce((pv, cv) => pv+cv, 0)/newState.avgFPS.length;
            newState.FPS.text = Math.round(FPS) + ' FPS';

            newState.lastFPSUpdate = newState.app.ticker.lastTime;
        }

        this.setState(newState);
    }

    start() {
        // create FPS info
        const FPS = new PIXI.Text(this.state.app.ticker.FPS, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center'
        });
        FPS.x = 10;
        FPS.y = 30;
        this.state.app.stage.addChild(FPS);
        this.setState({
            FPS: FPS
        }, () => {
            this.move();
        });

        // test frames marines
        const frames = [];
        frames.push(PIXI.utils.TextureCache['marines_1.png']);
        frames.push(PIXI.utils.TextureCache['marines_2.png']);
        frames.push(PIXI.utils.TextureCache['marines_3.png']);
        frames.push(PIXI.utils.TextureCache['marines_4.png']);
        frames.push(PIXI.utils.TextureCache['marines_5.png']);
        frames.push(PIXI.utils.TextureCache['marines_6.png']);
        frames.push(PIXI.utils.TextureCache['marines_7.png']);
        frames.push(PIXI.utils.TextureCache['marines_8.png']);
        frames.push(PIXI.utils.TextureCache['marines_9.png']);
        frames.push(PIXI.utils.TextureCache['marines_10.png']);
        const spriteAnimated = new PIXI.extras.AnimatedSprite(frames);
        spriteAnimated.x = 200;
        spriteAnimated.y = 200;
        spriteAnimated.width = 48;
        spriteAnimated.height = 48;
        spriteAnimated.animationSpeed = 0.3;
        spriteAnimated.play();
        this.state.container.addChild(spriteAnimated);

        // test frames
        const frames2 = [];
        frames2.push(PIXI.utils.TextureCache['spaceship_0.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_1.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_2.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_3.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_4.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_5.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_6.png']);
        frames2.push(PIXI.utils.TextureCache['spaceship_7.png']);
        const spriteAnimated2 = new PIXI.extras.AnimatedSprite(frames2);
        spriteAnimated2.x = 200;
        spriteAnimated2.y = 100;
        spriteAnimated.width = 106;
        spriteAnimated.height = 77;
        spriteAnimated2.animationSpeed = 0.2;
        spriteAnimated2.play();
        this.state.container.addChild(spriteAnimated2);

        // set container status
        this.state.container.initialWidth = this.state.container.width;
        this.state.container.initialHeight = this.state.container.height;
        this.state.container.x = this.props.camera.x * this.props.camera.zoom;
        this.state.container.y = this.props.camera.y * this.props.camera.zoom;
        this.state.container.width = this.state.container.initialWidth * this.props.camera.zoom;
        this.state.container.height = this.state.container.initialHeight * this.props.camera.zoom;
    }

    stop() {
        this.state.app.stop();
    }

    handleWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.state.app.view.style.width = width+'px';
        this.state.app.view.style.height = height+'px';
        this.state.app.renderer.resize(width, height);
        this.props.dispatch(cameraResize(width, height));
    }

    move() {
        this.state.container.x = this.props.camera.zoom * this.props.camera.x;
        this.state.container.y = this.props.camera.zoom * this.props.camera.y;
        this.state.container.width = this.props.camera.zoom * this.state.container.initialWidth;
        this.state.container.height = this.props.camera.zoom * this.state.container.initialHeight;

        let spriteTotalShown = 0;
        for (let i = 0; i < this.state.sprites.length; i=i+1) {
            const sprite = this.state.sprites[i];
            const onScreenPositionX =
                this.state.container.x + (sprite.positionX/2 - sprite.positionY/2) * 64 * this.props.camera.zoom;
            const onScreenPositionY =
                this.state.container.y + (sprite.positionX/4 + sprite.positionY/4) * 64 * this.props.camera.zoom;
            const onScreenWidth = 64 * this.props.camera.zoom;
            const onScreenHeight = 64 * this.props.camera.zoom;
            // culling
            if (onScreenPositionX + onScreenWidth < 0 ||
                onScreenPositionY + onScreenHeight < 0 ||
                onScreenPositionX > this.props.camera.width ||
                onScreenPositionY > this.props.camera.height
            ) {
                sprite.renderable = false;
                sprite.visible = false;
            } else {
                sprite.renderable = true;
                sprite.visible = true;
                spriteTotalShown = spriteTotalShown + 1;
            }
        }
        this.props.dispatch(updateTotalDisplayShown(spriteTotalShown));
    }

    render() {
        return (
            <div id="game-scene" ref={(el) => {
                this.gameScene = el;
            }}/>
        );
    }
}

export default connect((store) => {
    return {
        camera: store.camera,
        gameScene: store.gameScene
    };
})(GameScene);
