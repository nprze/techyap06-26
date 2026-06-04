struct Point {
    position: vec3<f32>,
    velocity: vec3<f32>,
}

struct PointData {
    globalTime: f32,
    points: array<Point, MAX_POINT>
};

struct VertexBuffer {
    vertices: array<f32, 6 * 3 * MAX_POINT>
};

@group(0) @binding(0) var<storage, read_write> pointData: PointData;
@group(0) @binding(1) var<storage, read_write> vb: VertexBuffer;

fn triangleFromPoint(point: vec3<f32>, id: u32) {
    let R: f32 = 0.1; 
    let p0 = point + vec3<f32>( R, 0.0, 0.0); 
    let p1 = point + vec3<f32>(-R * 0.5, R * 0.8660254, 0.0); 
    let p2 = point + vec3<f32>(-R * 0.5, -R * 0.8660254, 0.0);

    vb.vertices[id * 18 + 0] = p0.x;
    vb.vertices[id * 18 + 1] = p0.y;
    vb.vertices[id * 18 + 2] = p0.z;
    vb.vertices[id * 18 + 3] = 0;
    vb.vertices[id * 18 + 4] = 1;

    vb.vertices[id * 18 + 6] = p1.x;
    vb.vertices[id * 18 + 7] = p1.y;
    vb.vertices[id * 18 + 8] = p1.z;
    vb.vertices[id * 18 + 9] = 1;
    vb.vertices[id * 18 + 10] = 1;

    vb.vertices[id * 18 + 12] = p2.x;
    vb.vertices[id * 18 + 13] = p2.y;
    vb.vertices[id * 18 + 14] = p2.z;
    vb.vertices[id * 18 + 15] = 1;
    vb.vertices[id * 18 + 16] = 0;
}

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

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    const fromWhere: vec3<f32> = vec3<f32>(0, 0, -20);
    var point: vec3<f32>;
    let theta = 3.14 * 2 * random(id.x);
    let dir = vec3<f32>(sin(theta) , 0, cos(theta));
    point = fromWhere + dir;
    //point = vec3<f32>(0, sin(pointData.globalTime * 10), 3 + f32(id.x) * 2);
    triangleFromPoint(point, id.x);
}