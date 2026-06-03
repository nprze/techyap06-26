#include "src/graphics.h"
#include <filesystem>

int main() {
	const char* outputDir = "out";
	const char* outputFile = "img.bmp";

    std::filesystem::create_directories(outputDir);
    std::filesystem::path path = std::filesystem::path(outputDir) / outputFile;

    FILE* f = fopen(path.string().c_str(), "wb");

    constexpr i32 width = 256;
    constexpr i32 height = 256;
    const i32 pixelDataSize = width * height * 3;
    const i32 fileSize = 54 + pixelDataSize;

    u8 header[54] = {
        'B','M',
        0,0,0,0,
        0,0,0,0,
        54,0,0,0,

        40,0,0,0,
        0,0,0,0,
        0,0,0,0,
        1,0,
        24,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0
    };
    *(i32*)(header + 2) = fileSize;
    *(i32*)(header + 18) = width;
    *(i32*)(header + 22) = height;
    *(i32*)(header + 34) = pixelDataSize;

    fwrite(header, 1, 54, f);

	gr_render(f, width, height);

    fclose(f);
	printf("generated file: %s\n", path.string().c_str());
    return 0;
}