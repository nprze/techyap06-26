import { ComputePipeline } from "./compute_pipeline";
import { ParticleVertexBuffer, ParticleDataBuffer } from "./particle_buffer";

const objNum = 100;

class Engine {
    static engineInstance: Engine;
    static get() { return Engine.engineInstance; }
    
    constructor(device: GPUDevice) {
        this.dataBuffer = new ParticleDataBuffer(objNum * 3, device);
        this.vertexBuffer = new ParticleVertexBuffer(objNum * 3, device);
        this.computePipeline = new ComputePipeline();
    }
    async initEngine(device: GPUDevice) {
        await this.computePipeline.createComputePipeline(device, objNum);
    }
    runCompute(device: GPUDevice) {
        let cmdBuffer = this.computePipeline.recordCommandBuffer(device, objNum);
        device.queue.submit([cmdBuffer]);

        return device.queue.onSubmittedWorkDone();
    }

    computePipeline: ComputePipeline;
    dataBuffer: ParticleDataBuffer;
    vertexBuffer: ParticleVertexBuffer;
}

export { Engine };