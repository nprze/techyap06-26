import { fetchFileAsString } from "../renderer/renderer";
import { Engine } from './engine.ts'

class ComputePipeline {
    async createComputePipeline(device:GPUDevice, numParticles: number) {
        const computeShader: string = await fetchFileAsString("src/shader/compute.wgsl");
        let additionalInfo: string = "const MAX_POINT = " + numParticles + ";\n";
        console.log(additionalInfo);
        const computeModule = device.createShaderModule({ code: additionalInfo + computeShader });
        const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: "storage"
            },
            },
            {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { 
                type: "storage" 
            }
            }
        ]
        });

        this.pipeline = await device.createComputePipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [ bindGroupLayout ] }),
        compute: { module: computeModule, entryPoint: "main" }
        });

        this.bindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: Engine.get().dataBuffer.internalBuffer },
                { binding: 1, resource: Engine.get().vertexBuffer.internalBuffer }
            ],
        });
    }
    recordCommandBuffer(device: GPUDevice, workgroupCount: number) : GPUCommandBuffer{
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.bindGroup);
        passEncoder.dispatchWorkgroups(workgroupCount);
        passEncoder.end();
        return commandEncoder.finish();
    }
    
    bindGroup!: GPUBindGroup;
    pipeline!: GPUComputePipeline;
}

export { ComputePipeline };