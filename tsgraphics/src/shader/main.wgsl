struct uniformData {
    viewProj : mat4x4<f32>,
    globalTime : f32,
};

@group(0) @binding(0)
var<uniform> unis : uniformData;

struct VSOut {
    @builtin(position) position : vec4<f32>,
    @location(0) screenPos : vec2<f32>,
    @location(1) worldY : f32,
    @location(2) boioid: f32
};

@vertex fn vs_main(@location(0) pos : vec3<f32>, @location(1) screenPos: vec2<f32>, @location(2) boioid: f32) -> VSOut {
    var out : VSOut;
    out.position = unis.viewProj * vec4<f32>(pos.xyz, 1.0);
    out.screenPos = screenPos * 2.0 - vec2<f32>(1.0, 1.0);
    out.worldY = pos.y;
    out.boioid = boioid;
    return out;
}

@fragment fn fs_main(@location(0) screenPos : vec2<f32>, @location(1) worldY : f32, @location(2) boioid: f32) -> @location(0) vec4<f32> {
    let intensity = clamp(worldY / 1.5, 0.0, 1.0);
    return vec4<f32>(boioid, 0.0, 1.0 - boioid, 1.0);
}
