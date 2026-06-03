struct uniforms {
    viewProj : mat4x4<f32>,
    globalTime : f32,
};

@group(0) @binding(0)
var<uniform> unis : uniforms;

struct VSOut {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>
};

@vertex fn vs_main(@location(0) pos : vec3<f32>, @location(1) uv: vec2<f32>) -> VSOut {
    var out : VSOut;
    out.position = unis.viewProj * vec4<f32>(pos.xyz, 1.0);
    out.uv = uv * 2.0 - vec2<f32>(1.0, 1.0);
    return out;
}

@fragment fn fs_main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
    var intensityR:f32 = abs(sin(length(uv) * 10.0 - unis.globalTime));
    var intensityG:f32 = abs(sin(length(uv) * 10.0 - unis.globalTime));
    var intensityB:f32 = abs(sin(length(uv) * 10.0 - unis.globalTime));
    return vec4<f32>(intensityR, intensityG, intensityB, 1.0);
}
