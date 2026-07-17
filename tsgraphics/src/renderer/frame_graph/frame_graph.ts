import { format, resourceDesc, resourceHandle } from "./resource";

const FG_RENDERPASS_MAX_COUNT = 5;
const FG_RESOURCE_MAX_COUNT = 10;

class renderPass {
    constructor(name: string, setup: () => void, execute: (encoder: GPUCommandEncoder) => void){
        this.name = name;
        this.setup = setup;
        this.execute = execute;
    }

    name: string;
    setup: () => void;
    execute: (encoder: GPUCommandEncoder) => void;
}

class frameGraph {
    constructor() {
        let consPass : () => renderPass = () => ({ name:"", setup: ()=>{}, execute: ()=>{}});
        for (let i = 0; i < FG_RENDERPASS_MAX_COUNT; i++) {
            this.renderPasses.push(consPass());
        }
        let consRes : () => resourceDesc = () => ({ width:0, height:0, format: format.RGBA8});
        for (let i = 0; i < FG_RESOURCE_MAX_COUNT; i++) {
            this.resources.push(consRes());
        }
    }

    createResource(desc: resourceDesc): resourceHandle {
        this.resources[this.resourceCount] = desc;
        this.resourceCount++;
        if (this.resourceCount >= FG_RESOURCE_MAX_COUNT) {
            console.log("FRAMEGRAPH: MORE RESOURCES THAN EXPECTED.");
        } 
        return new resourceHandle();
    }

    addPass(pass: renderPass) {
        this.renderPasses[this.renderPassCount] = pass;
        this.renderPasses[this.renderPassCount].setup();
        this.renderPassCount++;
        if (this.renderPassCount >= FG_RENDERPASS_MAX_COUNT) {
            console.log("FRAMEGRAPH: MORE PASSES THAN EXPECTED.");
        }
    }
    
    execute() {
    }

    renderPasses: renderPass[] = [];
    renderPassCount: number = 0;
    resources: resourceDesc[] = [];
    resourceCount: number = 0;
}

export { renderPass, frameGraph }