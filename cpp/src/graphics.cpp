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
    return {1.f, 1.f, 1.f};
}

void gr_render(FILE* f, i32 width, i32 height) {
    for (i32 y = 0; y < height; y++) {
        for (i32 x = 0; x < width; x++) {
			f32 xNorm = (f32(x) / f32(width)) * 2.f - 1.f;
			f32 yNorm = (f32(y) / f32(height)) * 2.f - 1.f;

            rgb color = gr_parashader(xNorm, yNorm);
            
            fputc(clamp(color.b, 0.f, 1.f) * 255, f);
            fputc(clamp(color.g, 0.f, 1.f) * 255, f);
            fputc(clamp(color.r, 0.f, 1.f) * 255, f);
        }
    }
}
