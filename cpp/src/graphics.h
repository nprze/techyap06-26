#pragma once
#include <stdio.h>
#include <stdint.h>

typedef int32_t i32;
typedef float f32;
typedef uint8_t u8;

typedef struct {
	f32 r, g, b;
} rgb;

rgb gr_parashader(f32 inX, f32 inY);

void gr_render(FILE* f, i32 width, i32 height);