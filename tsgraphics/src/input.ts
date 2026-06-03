class input {
    private static instance: input = new input();
    static get() { return this.instance; }
    
    initInput(canvas: HTMLCanvasElement) {
        canvas.tabIndex = 0;
        canvas.style.outline = "none";
        canvas.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;
        });
        canvas.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });
        canvas.addEventListener("mousedown", e => {
            if (e.button === 0) this.leftMouseDown = true;
        });
        canvas.addEventListener("mouseup", e => {
            if (e.button === 0) this.leftMouseDown = false;
        });
        canvas.addEventListener("mousemove", e => {
            if (this.leftMouseDown) {
                this.mouseDeltaX = e.movementX;
                this.mouseDeltaY = e.movementY;
            }
        });
        canvas.addEventListener("click", () => {
            canvas.focus();
        });
    }
    resetMouseDelta() {
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
    }

    keys: Record<string, boolean> = {};
    mouseDeltaX: number = 0;
    mouseDeltaY: number = 0;
    leftMouseDown: boolean = false;
}

export { input };