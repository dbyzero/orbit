import React from 'react';
import { connect } from 'react-redux';

import { moveCamera, zoomCamera, cameraResize } from './actions';
import UI from '../ui-debug';
const PIXI = require('pixi.js');

import './style.scss';

class GameScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastFPSUpdate: 0,
            FPS: null,
            avgFPS: [],
            spriteUnderMouse: null,
            lastCamera: Object.assign({}, props.camera)
        };
        // tricks to have callback function bind to "this" when function is added as a listener
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.onSceneClicked = this.onSceneClicked.bind(this);
        this.onSceneNotClickedAnymore = this.onSceneNotClickedAnymore.bind(this);
        this.onZoom = this.onZoom.bind(this);
        this.onMouseMove= this.onMouseMove.bind(this);

        this.container = new PIXI.particles.ParticleContainer(300*300, {
            scale: false,
            position: false,
            rotation: false,
            uvs: true,
            alpha: false
        });

        this.app = new PIXI.Application({
            backgroundColor: 0x333333,
            resolution: 1,
            antialias: false,
            forceFXAA: false,
            transparent: false
        });
    }

    /**
     * React lifecyle functions
     */

    componentDidMount() {
        // initial resize
        this.handleWindowResize();

        window.addEventListener('resize', this.handleWindowResize, false);
        if (!this.gameScene) {
            throw new Error('Cannot find game scene dom element');
        }

        // add some custom settings
        this.app.renderer.autoResize = true;
        this.container.autoResize = true;

        // append game scene in dom
        this.gameScene.appendChild(this.app.view);

        this.init();
        this.loadResources().then((resources) => {
            this.setState({
                resources: resources
            }, () => {
                this.start();
            });
        });
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
                this.app.ticker.addOnce(this.move.bind(this));
            }
        });
    }

    render() {
        return <div>
            <UI/>
            <div id="game-scene" ref={(el) => {
                this.gameScene = el;
            }}/>
        </div>;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize, false);
        this.app.view.removeEventListener('pointerdown', this.onSceneClicked, false);
        this.app.view.removeEventListener('pointerup', this.onSceneNotClickedAnymore, false);
        this.app.view.removeEventListener('pointercancel', this.onSceneNotClickedAnymore, false);
        this.app.view.removeEventListener('pointerout', this.onSceneNotClickedAnymore, false);
        this.app.view.removeEventListener('mousewheel', this.onZoom, false);
        this.app.view.removeEventListener('mousemove', this.onMouseMove, false);

        // destrop PIXI application
        this.app.stop();
        this.app.destroy();

        // PixiJS is a state machine, so we reset loader..
        PIXI.loader.destroy();
        PIXI.loader = new PIXI.loaders.Loader();
        // ... and reset scale mode
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    }


    /**
     * PixiJS lifecycle functions
     */
    init() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.app.ticker.add(this.update.bind(this));
        this.app.view.addEventListener('pointermove', (e) => {
            if (this.state.isBtnPushed) {
                this.props.dispatch(moveCamera(e.movementX, e.movementY));
            }
        });
        this.app.view.addEventListener('pointerdown', this.onSceneClicked, false);
        this.app.view.addEventListener('pointerup', this.onSceneNotClickedAnymore, false);
        this.app.view.addEventListener('pointercancel', this.onSceneNotClickedAnymore, false);
        this.app.view.addEventListener('pointerout', this.onSceneNotClickedAnymore, false);
        this.app.view.addEventListener('mousewheel', this.onZoom, false);
        this.app.view.addEventListener('mousemove', this.onMouseMove, false);
        this.app.stage.addChild(this.container);
    }

    start() {
        // create FPS info
        const FPS = new PIXI.Text(this.app.ticker.FPS, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center'
        });
        FPS.x = 10;
        FPS.y = 30;
        this.app.stage.addChild(FPS);
        this.setState({
            FPS: FPS
        }, () => {
            this.move();
        });

        // test frames marines
        const frames = [];
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack1-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack1-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack1-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack1-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack1-04.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-04.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack2-05.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-03.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-04.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-attack3-05.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-00.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-01.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-02.png']);
        frames.push(PIXI.utils.TextureCache['adventurer-swrd-shte-03.png']);
        const spriteAnimated = new PIXI.extras.AnimatedSprite(frames);
        spriteAnimated.x = 200;
        spriteAnimated.loop = false;
        spriteAnimated.y = 200;
        spriteAnimated.width = 100;
        spriteAnimated.height = 74;
        spriteAnimated.animationSpeed = 0.3;
        spriteAnimated.play();
        this.container.addChild(spriteAnimated);

        // test frames
        const frames2 = [];
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-02.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack1-03.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack2-02.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-loop-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack3-rdy-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-00.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-01.png']);
        frames2.push(PIXI.utils.TextureCache['adventurer-air-attack-3-end-02.png']);
        const spriteAnimated2 = new PIXI.extras.AnimatedSprite(frames2);
        spriteAnimated2.x = 200;
        spriteAnimated2.y = 100;
        spriteAnimated2.width = 100;
        spriteAnimated2.height = 74;
        spriteAnimated2.animationSpeed = 0.2;
        spriteAnimated2.play();
        this.container.addChild(spriteAnimated2);

        // test frames
        const frames3 = [];
        frames3.push(PIXI.utils.TextureCache['adventurer-die-00.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-01.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-02.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-03.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-04.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-05.png']);
        frames3.push(PIXI.utils.TextureCache['adventurer-die-06.png']);
        const spriteAnimated3 = new PIXI.extras.AnimatedSprite(frames3);
        spriteAnimated3.x = 200;
        spriteAnimated3.y = 300;
        spriteAnimated3.width = 100;
        spriteAnimated3.height = 74;
        spriteAnimated3.animationSpeed = 0.15;
        spriteAnimated3.play();
        this.container.addChild(spriteAnimated3);

        // test frames
        const frames4 = [];
        frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-00.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-01.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-02.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-swrd-drw-03.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-00.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-01.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-02.png']);
        frames4.push(PIXI.utils.TextureCache['adventurer-idle-2-03.png']);
        const spriteAnimated4 = new PIXI.extras.AnimatedSprite(frames4);
        spriteAnimated4.x = 200;
        spriteAnimated4.y = 400;
        spriteAnimated4.width = 100;
        spriteAnimated4.height = 74;
        spriteAnimated4.animationSpeed = 0.2;
        spriteAnimated4.play();
        this.container.addChild(spriteAnimated4);

        // test frames
        const frames5 = [];
        frames5.push(PIXI.utils.TextureCache['adventurer-run-00.png']);
        frames5.push(PIXI.utils.TextureCache['adventurer-run-01.png']);
        frames5.push(PIXI.utils.TextureCache['adventurer-run-02.png']);
        frames5.push(PIXI.utils.TextureCache['adventurer-run-03.png']);
        frames5.push(PIXI.utils.TextureCache['adventurer-run-04.png']);
        frames5.push(PIXI.utils.TextureCache['adventurer-run-05.png']);
        const spriteAnimated5 = new PIXI.extras.AnimatedSprite(frames5);
        spriteAnimated5.x = 200;
        spriteAnimated5.y = 500;
        spriteAnimated5.width = 100;
        spriteAnimated5.height = 74;
        spriteAnimated5.animationSpeed = 0.15;
        spriteAnimated5.play();
        this.container.addChild(spriteAnimated5);

        // test frames
        const frames6 = [];
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-00.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-01.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-02.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-03.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-00.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-01.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-02.png']);
        frames6.push(PIXI.utils.TextureCache['adventurer-cast-loop-03.png']);
        const spriteAnimated6 = new PIXI.extras.AnimatedSprite(frames6);
        spriteAnimated6.x = 100;
        spriteAnimated6.y = 100;
        spriteAnimated6.width = 100;
        spriteAnimated6.height = 74;
        spriteAnimated6.animationSpeed = 0.2;
        spriteAnimated6.play();
        this.container.addChild(spriteAnimated6);

        // test frames
        const frames7 = [];
        frames7.push(PIXI.utils.TextureCache['adventurer-items-00.png']);
        frames7.push(PIXI.utils.TextureCache['adventurer-items-01.png']);
        frames7.push(PIXI.utils.TextureCache['adventurer-items-02.png']);
        const spriteAnimated7 = new PIXI.extras.AnimatedSprite(frames7);
        spriteAnimated7.x = 100;
        spriteAnimated7.y = 200;
        spriteAnimated7.width = 100;
        spriteAnimated7.height = 74;
        spriteAnimated7.animationSpeed = 0.2;
        spriteAnimated7.play();
        this.container.addChild(spriteAnimated7);

        // test frames
        const frames8 = [];
        frames8.push(PIXI.utils.TextureCache['adventurer-jump-00.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-jump-01.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-jump-02.png']);
        // frames8.push(PIXI.utils.TextureCache['adventurer-jump-03.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-00.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-01.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-02.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-03.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-00.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-01.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-02.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-smrslt-03.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-stand-00.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-stand-01.png']);
        frames8.push(PIXI.utils.TextureCache['adventurer-stand-02.png']);
        const spriteAnimated8 = new PIXI.extras.AnimatedSprite(frames8);
        spriteAnimated8.x = 100;
        spriteAnimated8.y = 500;
        spriteAnimated8.width = 100;
        spriteAnimated8.height = 74;
        spriteAnimated8.animationSpeed = 0.2;
        spriteAnimated8.play();
        this.container.addChild(spriteAnimated8);

        // test frames
        const frames9 = [];
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-00.png']);
        frames9.push(PIXI.utils.TextureCache['adventurer-fall-01.png']);
        const spriteAnimated9 = new PIXI.extras.AnimatedSprite(frames9);
        spriteAnimated9.x = 100;
        spriteAnimated9.y = 400;
        spriteAnimated9.width = 100;
        spriteAnimated9.height = 74;
        spriteAnimated9.animationSpeed = 0.2;
        spriteAnimated9.play();
        this.container.addChild(spriteAnimated9);

        // test frames
        const frames10 = [];
        frames10.push(PIXI.utils.TextureCache['adventurer-wall-slide-00.png']);
        frames10.push(PIXI.utils.TextureCache['adventurer-wall-slide-01.png']);
        const spriteAnimated10 = new PIXI.extras.AnimatedSprite(frames10);
        spriteAnimated10.x = 100;
        spriteAnimated10.y = 300;
        spriteAnimated10.width = 100;
        spriteAnimated10.height = 74;
        spriteAnimated10.animationSpeed = 0.2;
        spriteAnimated10.play();
        this.container.addChild(spriteAnimated10);

        // set container status
        this.container.initialWidth = this.container.width;
        this.container.initialHeight = this.container.height;
        this.container.x = this.props.camera.x * this.props.camera.zoom;
        this.container.y = this.props.camera.y * this.props.camera.zoom;
        this.container.width = this.container.initialWidth * this.props.camera.zoom;
        this.container.height = this.container.initialHeight * this.props.camera.zoom;
    }

    update() {
        const newState = Object.assign({}, this.state);

        // FPS
        if (this.state.FPS && this.state.lastFPSUpdate + 200 < this.app.ticker.lastTime) {
            if (newState.avgFPS.length === 10) {
                newState.avgFPS.shift();
            }
            newState.avgFPS.push(this.app.ticker.FPS);

            const FPS = newState.avgFPS.reduce((pv, cv) => pv+cv, 0)/newState.avgFPS.length;
            newState.FPS.text = Math.round(FPS) + ' FPS';

            newState.lastFPSUpdate = this.app.ticker.lastTime;
        }

        this.setState(newState);
    }


    /**
     * Custom functions
     */
    loadResources() {
        return new Promise(resolv => {
            PIXI.loader
                .add('spritesheet', '/assets/sprites/spritesheet.png')
                .load((loader, resources) => {
                    resolv(resources);
                });
        }).then(resources => {
            return new Promise(resolv => {
                new PIXI.Spritesheet(
                    resources.spritesheet.texture.baseTexture,
                    require('../../assets/sprites/spritesheet.json'),
                    'spritesheet'
                ).parse(() => {
                    resolv(resources);
                });
            });
        }).catch((err) => {
            throw Error(err);
        });
    }

    move() {
        this.container.x = this.props.camera.zoom * this.props.camera.x;
        this.container.y = this.props.camera.zoom * this.props.camera.y;
        this.container.width = this.props.camera.zoom * this.container.initialWidth;
        this.container.height = this.props.camera.zoom * this.container.initialHeight;
    }

    /**
     * handler functions
     */

    onMouseMove(/* e */) {
    }

    handleWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.app.view.style.width = width+'px';
        this.app.view.style.height = height+'px';
        this.app.renderer.resize(width, height);
        this.props.dispatch(cameraResize(width, height));
    }

    onSceneClicked() {
        this.setState({
            isBtnPushed: true
        });
    }

    onSceneNotClickedAnymore() {
        this.setState({
            isBtnPushed: false
        });
    }

    onZoom(e) {
        this.props.dispatch(zoomCamera(e.wheelDeltaY));
    }
}

export default connect((store) => {
    return {
        camera: store.camera,
        scene: store.scene
    };
})(GameScene);
