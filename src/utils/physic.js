import { Material, ContactMaterial, vec2 } from 'p2';

export const COLLISION_GROUP_PLAYER = 2 ** 0;
export const COLLISION_GROUP_ENEMY = 2 ** 1;
export const COLLISION_GROUP_GROUND = 2 ** 2;
export const COLLISION_GROUP_RAMP = 2 ** 3;
export const COLLISION_GROUP_ENEMY_PROJECTILE = 2 ** 4;
export const COLLISION_GROUP_PLAYER_PROJECTILE = 2 ** 5;

export const GROUND_MATERIAL = new Material();
export const PLAYER_MATERIAL = new Material();
export const CONTACT_MATERIAL_PLAYER_GROUND = new ContactMaterial(
    GROUND_MATERIAL,
    PLAYER_MATERIAL,
    {
        friction: 0.5
    }
);

const addSubSub = (out, a, b, c, d) => {
    out[0] = a[0] + b[0] - c[0] - d[0];
    out[1] = a[1] + b[1] - c[1] - d[1];
};

export const computeBForRamp = function (a, b, h) {
    const bi = this.bodyA;
    const bj = this.bodyB;
    const ri = this.contactPointA;
    const rj = this.contactPointB;
    const xi = bi.position;
    const xj = bj.position;

    const n = this.normalA;
    const G = this.G;

    // Caluclate cross products
    const rixn = vec2.crossLength(ri, n);
    const rjxn = vec2.crossLength(rj, n);

    // HERE IS THE CUSTOM TRICK
    const isRamp = (bi.shapes[0].collisionGroup | bj.shapes[0].collisionGroup)
        === (COLLISION_GROUP_RAMP | COLLISION_GROUP_PLAYER);
    // G = [-n -rixn n rjxn]
    G[0] = isRamp ? 0 : -n[0]; // HACK
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = isRamp ? 0 : n[0]; // HACK
    G[4] = n[1];
    G[5] = rjxn;

    // Compute iteration
    let GW; let
        Gq;
    if (this.firstImpact && this.restitution !== 0) {
        Gq = 0;
        GW = 1 / b * (1 + this.restitution) * this.computeGW();
    } else {
        // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
        const penetrationVec = this.penetrationVec;
        addSubSub(penetrationVec, xj, rj, xi, ri);
        Gq = vec2.dot(n, penetrationVec) + this.offset;
        GW = this.computeGW();
    }

    const GiMf = this.computeGiMf();
    const B = -Gq * a - GW * b - h * GiMf;

    return B;
};
