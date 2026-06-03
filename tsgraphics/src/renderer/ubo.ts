import { cameraMatrix } from "./camera.ts";

class uniformBuffer { // also holds bind group
    constructor(device:GPUDevice){
        this.array = new Float32Array(20); // 16 for viewProj, 1 for globalTime

        this.internalBuffer = device.createBuffer({
            size: this.array.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        let width :number = document.getElementById("main_canvas")!.clientWidth;
        let height :number = document.getElementById("main_canvas")!.clientHeight;
        this.camera = new cameraMatrix(width/height);

        this.bindGroupLayout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" },
            }],
        });
        this.bindGroup = device.createBindGroup({
            layout: this.bindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                buffer: this.internalBuffer
                }
            }],
        });
    }
    flush(device:GPUDevice, globalTime:number){
        this.array.set(this.camera.get(), 0)
        this.array[16] = globalTime;
        device.queue.writeBuffer(this.internalBuffer, 0, this.array as GPUAllowSharedBufferSource, 0, 17);
    }
    bind(renderPass:GPURenderPassEncoder){
        renderPass.setBindGroup(0, this.bindGroup);
    }

    bindGroupLayout: GPUBindGroupLayout;
    bindGroup: GPUBindGroup;

    array: Float32Array;
    internalBuffer: GPUBuffer;

    camera: cameraMatrix;
}

export { uniformBuffer };