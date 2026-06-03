const MAX_SHEEP = 100;

struct Sheep {
    position: vec3<f32>,
    velocity: vec3<f32>,
}

struct SheepData {
    num_sheep: i32,
    sheep: array<Sheep, MAX_SHEEP>
};

struct Vertex {
    position: vec3<f32>,
    uv: vec2<f32>,
};

struct VertexBuffer {
    vertices: array<Vertex, 3 * MAX_SHEEP>
};

@group(0) @binding(0) var<storage, read_write> sheepData: SheepData;
@group(0) @binding(1) var<storage, read_write> vb: VertexBuffer;

@compute @workgroup_size(16,16)
fn main(
    @builtin(global_invocation_id) id: vec3<u32>
) {
    var i: u32 = 0;
    for (i = 0u; i32(i) < sheepData.num_sheep; i = i + 1u) {
        let sheep = sheepData.sheep[i];
        let base_index = i * 3u;
        vb.vertices[base_index] = Vertex(sheep.position, vec2<f32>(0.0, 0.0));
        vb.vertices[base_index + 1u] = Vertex(sheep.position + vec3<f32>(0.0, 1.0, 0.0), vec2<f32>(0.0, 1.0));
        vb.vertices[base_index + 2u] = Vertex(sheep.position + vec3<f32>(1.0, 1.0, 0.0), vec2<f32>(1.0, 1.0));
    }
}