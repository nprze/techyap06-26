import { vec3 } from "gl-matrix";

const FLOATS_PER_VERTEX = 6;
const FLOATS_PER_SHEEP = 6;

class ParticleVertexBuffer {
    constructor(size:number, device:GPUDevice){
        this.internalBuffer = device.createBuffer({
            size: size * FLOATS_PER_VERTEX * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE 
        });
        this.size = size;
    }
    draw(renderPass:GPURenderPassEncoder){
        renderPass.setVertexBuffer(0, this.internalBuffer);
        renderPass.draw(this.size, 1, 0, 0);
    }
    size:number;
    internalBuffer: GPUBuffer;
}

class ParticleDataBuffer {
    constructor(size:number, device:GPUDevice){
        this.internalBuffer = device.createBuffer({
            size: size * FLOATS_PER_VERTEX * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.lastIndex = 0;
        this.array = new Float32Array(size * FLOATS_PER_SHEEP);
    }
    addSheep(pos:vec3, vel:vec3){
        this.array[this.lastIndex*FLOATS_PER_SHEEP+0] = pos[0];
        this.array[this.lastIndex*FLOATS_PER_SHEEP+1] = pos[1];
        this.array[this.lastIndex*FLOATS_PER_SHEEP+2] = pos[2];
        this.array[this.lastIndex*FLOATS_PER_SHEEP+3] = vel[0];
        this.array[this.lastIndex*FLOATS_PER_SHEEP+4] = vel[1];
        this.array[this.lastIndex*FLOATS_PER_SHEEP+5] = vel[2];
        this.lastIndex++;
    }
    flush(device:GPUDevice){
        device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, this.lastIndex * FLOATS_PER_SHEEP);
    }

    lastIndex:number;
    array: Float32Array;

    internalBuffer: GPUBuffer;
}

export { ParticleVertexBuffer, ParticleDataBuffer };