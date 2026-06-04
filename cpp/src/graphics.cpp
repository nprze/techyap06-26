#include "graphics.h"
#include <stdio.h>
#include <cmath>

f32 clamp(f32 value, f32 min, f32 max) { 
    if (value < min) return min; 
    if (value > max) return max; 
    return value; 
}

f32 max(f32 a, f32 b) {
    return (a > b) ? a : b;
}

f32 length(f32 x, f32 y) {
    return std::sqrt(x * x + y * y);
}

rgb gr_parashader(f32 inX, f32 inY) {
    f32 intensityX = std::sin(inX * 20.f);
    f32 intensityY = std::sin(inY * 20.f);
    f32 intensity = max(intensityX, intensityY);
    return { intensity , intensity, intensity };
}

void gr_render(FILE* f, i32 width, i32 height) {
    for (i32 i = 0; i < width; i++) {
        for (i32 j = 0; j < height; j++) {
            f32 x = (f32(j) / f32(width)) * 2.f - 1.f;
            f32 y = (f32(i) / f32(height)) * 2.f - 1.f;

            rgb res = gr_parashader(x, y);

            fputc(clamp(res.b, 0.f, 1.f) * 255, f); // b
            fputc(clamp(res.g, 0.f, 1.f) * 255, f); // g
            fputc(clamp(res.r, 0.f, 1.f) * 255, f); // r
        }
    }
}
