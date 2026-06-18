// structures
struct inputData {
    cameraPosition: vec3<f32>,
    globalTime: f32,
    firefliesBase: vec3<f32>,
    deltaTime: f32,
    firefliesFlyRadius: f32, 
    firefliesLimitRadius: f32,
    particlePositions: array<vec3<f32>, NUM_PARTICLES>,
    particleVelocities: array<vec3<f32>, NUM_PARTICLES>
};

struct VertexBuffer {
    vertices: array<f32, NUM_PARTICLES * 3 * 4> // num_particles * vectices_per_particle * floats_per_vertex
};

// data
@group(0) @binding(0) var<storage, read_write> input: inputData;
@group(0) @binding(1) var<storage, read_write> vb: VertexBuffer;

// buffer helper functions
fn triangleFromPoint(point: vec3<f32>, id: u32, intensity: f32) {
    let cameraToPointDirection: vec3<f32> = normalize(point - input.cameraPosition);
    let axisRight: vec3<f32> = cross(cameraToPointDirection, vec3<f32>(0, 1, 0));
    let up: vec3<f32> = cross(axisRight, cameraToPointDirection);

    let R: f32 = 0.1;
    let p0 = point + axisRight * R; 
    let p1 = point - R * 0.5 * axisRight + R * 0.8660254 * up; 
    let p2 = point - R * 0.5 * axisRight - R * 0.8660254 * up;

    vb.vertices[id * 12 + 0] = p0.x;
    vb.vertices[id * 12 + 1] = p0.y;
    vb.vertices[id * 12 + 2] = p0.z;
    vb.vertices[id * 12 + 3] = intensity;

    vb.vertices[id * 12 + 4] = p1.x;
    vb.vertices[id * 12 + 5] = p1.y;
    vb.vertices[id * 12 + 6] = p1.z;
    vb.vertices[id * 12 + 7] = intensity;

    vb.vertices[id * 12 + 8] = p2.x;
    vb.vertices[id * 12 + 9] = p2.y;
    vb.vertices[id * 12 + 10] = p2.z;
    vb.vertices[id * 12 + 11] = intensity;
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
fn randomVec3(id: u32, addition: u32) -> vec3<f32> {
    let seed = hash(id) ^ hash(addition) ^ hash(bitcast<u32>(input.globalTime * 1000000.0));

    let r1 = random(seed);
    let r2 = random(hash(seed));

    // uniform sphere
    let z = r1 * 2.0 - 1.0;
    let a = r2 * 6.28318530718;

    let s = sqrt(1.0 - z * z);

    return vec3<f32>(
        s * cos(a),
        s * sin(a),
        z
    );
}
fn mag2(vector: vec3<f32>) -> f32 {
    return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
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
fn correctiveVelocity(position: vec3<f32>) -> vec3<f32> {
    // if mag^2 of the vector (pos - firefliesBase) < firefliesFlyRadius, then let it roam, 
    // if mag^2 > firefliesFlyRadius and less than firefliesLimitRadius, bring it to the middle, 
    // if mag^2 > firefliesLimitRadius then clamp
    let distToBase: vec3<f32> = input.firefliesBase - position;
    let toBaseMag = length(distToBase);
    if (toBaseMag < input.firefliesFlyRadius) {
        return vec3<f32>(0, 0, 0);
    }
    if (toBaseMag < input.firefliesLimitRadius) {
        let strength = (toBaseMag - input.firefliesFlyRadius) / (input.firefliesLimitRadius - input.firefliesFlyRadius);
        return (strength) * (distToBase / toBaseMag);
    }
    return (distToBase / toBaseMag) * 2;
}

// main
@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    var pPos: vec3<f32> = input.particlePositions[id.x];
    var pVel: vec3<f32> = input.particleVelocities[id.x];

    var avgPosition = vec3<f32>(0, 0, 0);
    var avgVelocity = vec3<f32>(0, 0, 0);
    var avgSeparate = vec3<f32>(0, 0, 0);
    var numClose: f32 = 0;

    for (var i: u32 = 0; i < NUM_PARTICLES; i++) {
        if (i != id.x) {
            let nPos: vec3<f32> = input.particlePositions[i];
            let nVel: vec3<f32> = input.particleVelocities[i];
            let dirToNeighbour: vec3<f32> = nPos - pPos;
            var distToNeighbour: f32 = length(dirToNeighbour);
            if (distToNeighbour < 0.01) {
                distToNeighbour = 0.01;
            }
            if (distToNeighbour < 1.0) {
                avgPosition += nPos;
                avgVelocity += nVel;
                avgSeparate -= dirToNeighbour / (distToNeighbour * distToNeighbour);
                numClose += 1;
            }
        } 
    }
    if (numClose > 0) {
        avgPosition /= numClose;
        avgVelocity /= numClose;
        avgSeparate /= numClose;
        avgVelocity = normalize(avgVelocity);
    }

    let wander: vec3<f32> = vec3<f32>(randomVec3(id.x, 1).xy, 0);

    let cohesion: vec3<f32> = normalize(vec3<f32>(avgPosition - pPos)) * input.deltaTime;

    let limiting: vec3<f32> = correctiveVelocity(pPos);

    pVel = 5.0 * normalize(10 * pVel + 20.0 * cohesion + 2.0 * wander + 7.0 * avgVelocity + 0.3 * avgSeparate + 2 * limiting);

    pPos += pVel * input.deltaTime;

    let intensity: f32 = 0.3 + 0.7 * (sin((random(id.x * id.x) + 0.5) * input.globalTime + f32(id.x)) + 1.0) * 0.5;

    triangleFromPoint(pPos, id.x, intensity);

    input.particlePositions[id.x] = pPos;
    input.particleVelocities[id.x] = pVel;
}