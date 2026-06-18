import { vec2, vec3 } from "gl-matrix";

// key and mouse input
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

// cookie helpers
function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function getCameraPosition(): vec3 {
    const position = getCookie("cameraPosition");
    const [x, y, z] = position ? position.split(",").map(Number) : [0, 0, 0];
    return vec3.fromValues(x, y, z);
}

function getCameraOrientation(): vec2 {
    const orientation = getCookie("cameraOrientation");
    const [x, y] = orientation ? orientation.split(",").map(Number) : [0, 0];
    return vec2.fromValues(x, y);
}

export { input, getCameraPosition, getCameraOrientation };