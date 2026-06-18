struct uniformData {
    viewProj : mat4x4<f32>,
    globalTime : f32,
};

@group(0) @binding(0)
var<uniform> unis : uniformData;

struct VSOut {
    @builtin(position) position : vec4<f32>,
    @location(0) intensity: f32
};

@vertex fn vs_main(@location(0) pos : vec3<f32>, @location(1) intensity: f32) -> VSOut {
    return VSOut(unis.viewProj * vec4<f32>(pos.xyz, 1.0), intensity);
}

@fragment fn fs_main(@location(0) intensity: f32) -> @location(0) vec4<f32> {
    return vec4<f32>((intensity * vec3<f32>(1.0, 1.0, 0.6)), 1.0);
}
