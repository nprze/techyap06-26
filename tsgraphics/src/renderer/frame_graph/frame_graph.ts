import { resourceDesc } from "./resource";

class renderPass {
    constructor(name: string, setup: () => void, execute: () => void){
        this.name = name;
        this.setup = setup;
        this.execute = execute;
    }

    name: string;
    setup: () => void;
    execute: () => void;
}

class frameGraph {
    constructor() {
        this.renderPasses = [];
        this.resources = [];
    }
    
    renderPasses: renderPass[];
    resources: resourceDesc[];
}