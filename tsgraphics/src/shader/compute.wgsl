// structures
struct ParticleData {
    globalTime: f32,
    deltaTime: f32,
    padding: vec2<f32>,
    particlePositions: array<vec3<f32>, NUM_PARTICLES>,
    particleVelocities: array<vec3<f32>, NUM_PARTICLES>
};

struct VertexBuffer {
    vertices: array<f32, 6 * 3 * NUM_PARTICLES>
};

// data
@group(0) @binding(0) var<storage, read_write> particleData: ParticleData;
@group(0) @binding(1) var<storage, read_write> vb: VertexBuffer;

// buffer helper functions
fn triangleFromPoint(point: vec3<f32>, id: u32, boioid: f32) {
    let R: f32 = 0.1; 
    let p0 = point + vec3<f32>( R, 0.0, 0.0); 
    let p1 = point + vec3<f32>(-R * 0.5, R * 0.8660254, 0.0); 
    let p2 = point + vec3<f32>(-R * 0.5, -R * 0.8660254, 0.0);

    vb.vertices[id * 18 + 0] = p0.x;
    vb.vertices[id * 18 + 1] = p0.y;
    vb.vertices[id * 18 + 2] = p0.z;
    vb.vertices[id * 18 + 3] = 0;
    vb.vertices[id * 18 + 4] = 1;
    vb.vertices[id * 18 + 5] = boioid;

    vb.vertices[id * 18 + 6] = p1.x;
    vb.vertices[id * 18 + 7] = p1.y;
    vb.vertices[id * 18 + 8] = p1.z;
    vb.vertices[id * 18 + 9] = 1;
    vb.vertices[id * 18 + 10] = 1;
    vb.vertices[id * 18 + 11] = boioid;

    vb.vertices[id * 18 + 12] = p2.x;
    vb.vertices[id * 18 + 13] = p2.y;
    vb.vertices[id * 18 + 14] = p2.z;
    vb.vertices[id * 18 + 15] = 1;
    vb.vertices[id * 18 + 16] = 0;
    vb.vertices[id * 18 + 17] = boioid;
}

// random helper functions
fn hash(x: u32) -> u32 {
    var h = x;
    h ^= h >> 16u;
    h *= 0x7feb352du;
    h ^= h >> 15u;
    h *= 0x846ca68bu;
    h ^= h >> 16u;
    return h;
}
fn random(x: u32) -> f32 {
    return f32(hash(x)) / 4294967295.0;
}

// vectors helper functions
fn limitVector(vector: vec3<f32>, bounds: f32) -> vec3<f32> {
    var v = vector;
    if (v.x < -bounds) {
        v.x += 2 * bounds;
    }
    if (v.y < -bounds) {
        v.y += 2 * bounds;
    }
    if (v.z < -bounds) {
        v.z += 2 * bounds;
    }
    if (v.x > bounds) {
        v.x -= 2 * bounds;
    }
    if (v.y > bounds) {
        v.y -= 2 * bounds;
    }
    if (v.z > bounds) {
        v.z -= 2 * bounds;
    }
    return v;
}

// main
@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    var pPos: vec3<f32> = particleData.particlePositions[id.x];
    var pVel: vec3<f32> = particleData.particleVelocities[id.x];
    /*

    var avgPosition = vec3<f32>(0, 0, 0);
    var avgVelocity = vec3<f32>(0, 0, 0);
    var avgSeparate = vec3<f32>(0, 0, 0);
    var numClose: f32 = 0;

    for (var i: u32 = 0; i < NUM_PREY; i++) {
        if (i != id.x) {
        } 
    }

    pPos += pVel * particleData.deltaTime;
    pPos = limitVector(pPos, 10.0);
    if (id.x < NUM_PREY) {
        // simulate prey
        triangleFromPoint(pPos, id.x, 0.0);
    } else {
        // simulate predators
        triangleFromPoint(pPos, id.x, 1.0);
    }*/
    triangleFromPoint(pVel, id.x, 1.0);
    particleData.particlePositions[id.x] = pPos;
    particleData.particleVelocities[id.x] = pVel;
}