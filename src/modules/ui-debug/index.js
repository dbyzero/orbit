import { connect } from 'react-redux';
import React from 'react';

class GameUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div id="game-ui">
                <div id="menu-debug">
                    Camera:<br/>
                    x: {this.props.camera.x}<br/>
                    y: {this.props.camera.y}<br/>
                    width: {this.props.camera.width}<br/>
                    height: {this.props.camera.height}<br/>
                    zoom: {this.props.camera.zoom}<br/>
                    <br/>
                    visibleWidth: {this.props.camera.width / this.props.camera.zoom}<br/>
                    visibleHeight: {this.props.camera.height / this.props.camera.zoom}
                </div>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        camera: store.camera,
        scene: store.scene
    };
})(GameUI);
