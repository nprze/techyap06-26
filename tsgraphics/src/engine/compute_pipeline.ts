import { fetchFileAsString } from "../renderer/renderer";

class ComputePipeline {
    async createComputePipeline(device:GPUDevice):Promise<GPUComputePipeline>{
        const computeShader: string = await fetchFileAsString("src/shader/compute.wgsl");
        const computeModule = device.createShaderModule({ code: computeShader });
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

        return device.createComputePipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
        compute: { module: computeModule, entryPoint: "main" }
        });
    }
}

export { ComputePipeline };