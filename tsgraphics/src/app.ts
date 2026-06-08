import { input } from "./input";
import { renderer } from "./renderer/renderer";
import { Engine } from "./engine/engine";

class app {
    static instance: app;
    static get(): app { return app.instance; }

    async initApp() {
        const mainViewportCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
        const aspectRatio = (mainViewportCanvas.clientWidth / 2) / (mainViewportCanvas.clientHeight * 0.6);
        mainViewportCanvas.width = 1000; 
        mainViewportCanvas.height = 1000 / aspectRatio; 
        
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error("WebGPU not supported");
        const device = await adapter.requestDevice();
        const context = mainViewportCanvas.getContext("webgpu") as GPUCanvasContext;
        const format = navigator.gpu.getPreferredCanvasFormat();

        this.device = device;

        input.get().initInput(mainViewportCanvas);
        await renderer.create(mainViewportCanvas, device, context, format);
        
        Engine.engineInstance = new Engine(device);
        await Engine.engineInstance.initEngine(device);
    }
    frame() {
        const nowTime = Date.now();
        const deltaTime = (nowTime - this.lastTime) / 1000;
        this.lastTime = nowTime;
        this.globalTime += deltaTime;

        renderer.get().uBuffer.camera.update();
        renderer.get().drawFrame(this.globalTime);
    }
    async run() {
        this.lastTime = Date.now();
        this.globalTime = 0;
        
        function loop() {
            app.get().frame();
            requestAnimationFrame(loop);
            input.get().resetMouseDelta();
        }
        loop();
    }

    device!: GPUDevice;
    lastTime: number = 0;
    globalTime: number = 0;
}

export { app };