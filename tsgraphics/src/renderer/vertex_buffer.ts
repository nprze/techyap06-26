import { vec3 } from "gl-matrix";

const FLOATS_PER_VERTEX = 6;

class vertexBuffer{
    constructor(size:number, device:GPUDevice){
        this.array = new Float32Array(size * FLOATS_PER_VERTEX)
        this.lastIndex = 0;

        this.internalBuffer = device.createBuffer({
            size: this.array.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
    }
    addVertex(pos:vec3, uv:vec3){
        this.array[this.lastIndex*FLOATS_PER_VERTEX+0] = pos[0];
        this.array[this.lastIndex*FLOATS_PER_VERTEX+1] = pos[1];
        this.array[this.lastIndex*FLOATS_PER_VERTEX+2] = pos[2];
        this.array[this.lastIndex*FLOATS_PER_VERTEX+3] = uv[0];
        this.array[this.lastIndex*FLOATS_PER_VERTEX+4] = uv[1];
        this.array[this.lastIndex*FLOATS_PER_VERTEX+5] = uv[2];
        this.lastIndex++;
    }
    flush(device:GPUDevice){
        device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, this.lastIndex * FLOATS_PER_VERTEX);
    }
    draw(renderPass:GPURenderPassEncoder){
        renderPass.setVertexBuffer(0, this.internalBuffer);
        renderPass.draw(this.lastIndex, 1, 0, 0);
    }
    lastIndex:number;
    array: Float32Array;

    internalBuffer: GPUBuffer;
}

export { vertexBuffer };