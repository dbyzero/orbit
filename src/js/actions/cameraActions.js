export function moveCamera(dx, dy) {
    return {
        type: 'MOVE_CAMERA',
        value: {
            dx: dx,
            dy: dy
        }
    };
}

export function zoomCamera(dz) {
    return {
        type: 'ZOOM_CAMERA',
        value: {
            dz: dz
        }
    };
}

export function cameraResize(width, height) {
    return {
        type: 'CAMERA_RESIZE',
        value: {
            width: width,
            height: height
        }
    };
}
