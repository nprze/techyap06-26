import { uniformBuffer } from './ubo.ts';
import { vertexBuffer } from './vertex_buffer.ts';

async function fetchFileAsString(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

const MAX_SCENE_VERTICES = 30000;

class renderer {
    private static instance: renderer;
    static get(): renderer { return renderer.instance; }
    
    static async create(canvas: HTMLCanvasElement, device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat) {
        context.configure({ device, format, alphaMode: "opaque" });

        renderer.instance = new renderer(device, context, canvas, format); 
        await renderer.instance.initRenderer();
    }
    constructor(device:GPUDevice, webgpuContext:GPUCanvasContext, canvas: HTMLCanvasElement, format: GPUTextureFormat){
        this.device = device;
        this.webgpuContext = webgpuContext;
        this.canvas = canvas;
        this.preferedCanvasTextureFormat = format;
        this.vBuffer = new vertexBuffer(MAX_SCENE_VERTICES, this.device);
        this.uBuffer = new uniformBuffer(this.device);
    }
    private async initRenderer(){
        const renderShader: string = await fetchFileAsString("src/shader/main.wgsl");
        this.shadersModule = this.device.createShaderModule({ code: renderShader });

        this.pipeline = this.device.createRenderPipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [this.uBuffer.bindGroupLayout]
            }),
            vertex: {
                module: this.shadersModule,
                entryPoint: 'vs_main',
                buffers: [
                {
                    arrayStride: 4 * 3 + 4 * 3,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3',
                        },
                        {
                            shaderLocation: 1,
                            offset: 12,
                            format: 'float32x3',
                        }
                    ],
                },
                ],
            },
            fragment: {
                module: this.shadersModule,
                entryPoint: 'fs_main',
                targets: [{ format: this.preferedCanvasTextureFormat }],
            },
            depthStencil: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less",
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        this.depthTexture = this.device.createTexture({
            size: [this.canvas.width, this.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.depthTextureView = this.depthTexture.createView();
    }
    public drawFrame(gt:number) {
        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.webgpuContext.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
        {
        view: textureView,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
        },
        ],
        depthStencilAttachment: {
            view: this.depthTextureView,
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "store",
        },
        });

        renderPass.setPipeline(this.pipeline);

        this.vBuffer.flush(this.device);
        this.uBuffer.flush(this.device, gt);

        this.uBuffer.bind(renderPass);
        this.vBuffer.draw(renderPass);
        
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);  
    }

    device: GPUDevice;
    webgpuContext:GPUCanvasContext;
    canvas: HTMLCanvasElement;
    preferedCanvasTextureFormat: GPUTextureFormat;

    vBuffer: vertexBuffer;
    uBuffer: uniformBuffer;

    shadersModule!: GPUShaderModule;

    pipeline!: GPURenderPipeline;

    depthTexture!: GPUTexture;
    depthTextureView!: GPUTextureView;
}

export { renderer, fetchFileAsString };