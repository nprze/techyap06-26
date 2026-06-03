import { ComputePipeline } from "./compute_pipeline";
import { ParticleVertexBuffer, ParticleDataBuffer } from "./particle_buffer";

class Engine {
    static engineInstance: Engine;
    static get() { return Engine.engineInstance; }
    
    constructor(device: GPUDevice) {
        this.computePipeline = new ComputePipeline();
        this.dataBuffer = new ParticleDataBuffer(100, device);
        this.vertexBuffer = new ParticleVertexBuffer(100, device);
    }

    initEngine(device: GPUDevice) {
        this.computePipeline.createComputePipeline(device);
    }

    computePipeline: ComputePipeline;
    dataBuffer: ParticleDataBuffer;
    vertexBuffer: ParticleVertexBuffer;
}

export { Engine };