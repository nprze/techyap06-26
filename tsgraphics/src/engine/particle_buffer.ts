import { vec3 } from "gl-matrix";

const FLOATS_PER_VERTEX = 6;
const FLOATS_PER_POINT = 8;
const FLOATS_UNIFORM_DATA = 12;

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
    constructor(size: number, device: GPUDevice) {
        this.floatCount = FLOATS_UNIFORM_DATA + size * FLOATS_PER_POINT;
        this.particleCount = size;
        this.internalBuffer = device.createBuffer({
            size: this.floatCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.lastIndex = 0;
        this.array = new Float32Array(FLOATS_UNIFORM_DATA + size * FLOATS_PER_POINT);
        this.initParticles(size);
        this.flush(device, true);
    }
    addParticle(pos: vec3, vel: vec3) {
        let initialOffsetPositions: number = FLOATS_UNIFORM_DATA;
        let initialOffsetVelocities: number = FLOATS_UNIFORM_DATA + (this.particleCount * (FLOATS_PER_POINT * 0.5));
        this.array[initialOffsetPositions + this.lastIndex * (FLOATS_PER_POINT * 0.5) + 0] = pos[0];
        this.array[initialOffsetPositions + this.lastIndex * (FLOATS_PER_POINT * 0.5) + 1] = pos[1];
        this.array[initialOffsetPositions + this.lastIndex * (FLOATS_PER_POINT * 0.5) + 2] = pos[2];
        this.array[initialOffsetVelocities + (this.lastIndex * (FLOATS_PER_POINT * 0.5)) + 0] = vel[0];
        this.array[initialOffsetVelocities + (this.lastIndex * (FLOATS_PER_POINT * 0.5)) + 1] = vel[1];
        this.array[initialOffsetVelocities + (this.lastIndex * (FLOATS_PER_POINT * 0.5)) + 2] = vel[2];
        this.lastIndex++;
    }
    initParticles(size: number){
        const randomRange = (min: number, max: number) => { return Math.random() * (max - min) + min; };
        for(var i: number = 0; i < size; i++){
            let x: number = Math.random() * 2 - 1;
            let y: number = Math.sqrt(1.0 - x * x) * (Math.floor(Math.random() * 2) * 2 - 1);
            //this.addParticle(vec3.fromValues(x, y, 0.0), vec3.fromValues(x, y, 0.0));
            this.addParticle(vec3.fromValues(randomRange(-10, 10), randomRange(-10, 10), randomRange(-10, 10)), vec3.fromValues(x, y, 0.0))
        }
    }
    flush(device:GPUDevice, all: boolean = false) {
        if (all) {
            // flush both the particles data and uniform data (probably initialization)
            device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, this.floatCount);
        } else {
            // flush only the uniform data that changes frame to frame
            device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, FLOATS_UNIFORM_DATA);
        }
    }
    setUniformData(gt: number, dt: number, cameraPos: vec3, basePosition: vec3 = vec3.fromValues(0, 0, 0), firefliesFlyRadius: number = 10, firefliesLimitRadius: number = 20) {
        this.array[0] = cameraPos[0];
        this.array[1] = cameraPos[1];
        this.array[2] = cameraPos[2];
        this.array[3] = gt;
        this.array[4] = basePosition[0];
        this.array[5] = basePosition[1];
        this.array[6] = basePosition[2];
        this.array[7] = dt;
        this.array[8] = firefliesFlyRadius;
        this.array[9] = firefliesLimitRadius;
    }

    floatCount: number; // in float count
    particleCount: number; // in float count
    lastIndex:number;
    array: Float32Array;
    internalBuffer: GPUBuffer;
}

export { ParticleVertexBuffer, ParticleDataBuffer };