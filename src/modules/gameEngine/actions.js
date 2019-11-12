export function moveCamera(dX, dY) {
    return {
        type: 'MOVE_CAMERA',
        payload: {
            dX,
            dY
        }
    };
}

export function zoomCamera(dZ) {
    return {
        type: 'ZOOM_CAMERA',
        payload: {
            dZ
        }
    };
}

export function cameraResize(width, height) {
    return {
        type: 'CAMERA_RESIZE',
        payload: {
            width,
            height
        }
    };
}
