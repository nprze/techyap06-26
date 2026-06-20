enum format {
    RGBA8,
    RGBA16F,
    R8,
    D32F
}

type resourceIndex = number; 

class resourceDesc {
    constructor(width: number, height: number, formatArg: format) {
        this.width = width;
        this.height = height;
        this.format = formatArg;
    }

    width: number;
    height: number;
    format: format;
}

class resourceHandle {
    index: resourceIndex;

    constructor(index: resourceIndex = 0xFFFFFFFF) {
        this.index = index;
    }

    isValid(): boolean {
        return this.index !== 0xFFFFFFFF;
    }
}
export { format, resourceDesc, resourceHandle };