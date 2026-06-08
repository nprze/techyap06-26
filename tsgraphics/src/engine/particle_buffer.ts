import { vec3 } from "gl-matrix";

const FLOATS_PER_VERTEX = 6;
const FLOATS_PER_POINT = 6;

class ParticleVertexBuffer {
    constructor(size:number, device:GPUDevice) {
        this.internalBuffer = device.createBuffer({
            size: size * FLOATS_PER_VERTEX * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
        });
        this.size = size;
        this.lastIndex = 0;
        this.array = new Float32Array(size * FLOATS_PER_VERTEX);
    }
    draw(renderPass:GPURenderPassEncoder) {
        renderPass.setVertexBuffer(0, this.internalBuffer);
        renderPass.draw(this.size, 1, 0, 0);
    }

    array: Float32Array;
    lastIndex: number;
    size: number;
    internalBuffer: GPUBuffer;
}

class ParticleDataBuffer {
    constructor(size:number, device:GPUDevice) {
        this.size = 4 + size * FLOATS_PER_POINT * 4;
        this.internalBuffer = device.createBuffer({
            size: this.size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.lastIndex = 0;
        this.array = new Float32Array(1 + size * FLOATS_PER_POINT);
        this.initParticles(size);
        this.flush(device);
    }
    addParticle(pos:vec3, vel:vec3) {
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 0] = pos[0];
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 1] = pos[1];
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 2] = pos[2];
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 3] = vel[0];
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 4] = vel[1];
        this.array[1 + this.lastIndex * FLOATS_PER_POINT + 5] = vel[2];
        this.lastIndex++;
    }
    initParticles(size: number){
        const randomRange = (min: number, max: number) => { return Math.random() * (max - min) + min; };
        for(var i: number = 0; i < size; i++){
            let x: number = Math.random() * 2 - 1;
            let y: number = Math.sqrt(1.0 - x * x) * (Math.floor(Math.random() * 2) * 2 - 1);
            this.addParticle(vec3.fromValues(randomRange(-10, 10), randomRange(-10, 10), 0.0), vec3.fromValues(x, y, 0.0))
        }
    }
    flush(device:GPUDevice) {
        device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, 1 + this.lastIndex * FLOATS_PER_POINT);
    }
    setGlobalTime(gt: number){
        this.array[0] = gt;
    }

    size: number;
    lastIndex:number;
    array: Float32Array;
    internalBuffer: GPUBuffer;
}

export { ParticleVertexBuffer, ParticleDataBuffer };