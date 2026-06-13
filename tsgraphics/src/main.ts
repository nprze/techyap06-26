import { app } from "./app";
import { UI } from "./UI/ui";
import { vec2, vec3 } from "gl-matrix";
import { renderer } from "./renderer/renderer";

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

window.addEventListener("DOMContentLoaded", async ()=>{
    app.instance = new app();
    await app.get().initApp();
    renderer.get().uBuffer.camera.position = getCameraPosition();
    const yawPitch = getCameraOrientation();
    renderer.get().uBuffer.camera.yaw = yawPitch[0];
    renderer.get().uBuffer.camera.pitch = yawPitch[1];
    app.get().run();
});

function saveCameraState() {
    const pos = renderer.get().uBuffer.camera.getPosition();
    document.cookie = `cameraPosition=${pos[0]},${pos[1]},${pos[2]}; path=/; max-age=3600`;
    document.cookie = `cameraOrientation=${renderer.get().uBuffer.camera.yaw},${renderer.get().uBuffer.camera.pitch}; path=/; max-age=3600`;
}
window.addEventListener("beforeunload", () => {
    saveCameraState();
});

function resetCamera() {
    renderer.get().uBuffer.camera.position = vec3.fromValues(0, 0, -2.4);
    renderer.get().uBuffer.camera.yaw = 0;
    renderer.get().uBuffer.camera.pitch = 0;
    saveCameraState();
}

const button = document.getElementById("resetCameraButton");

button?.addEventListener("click", resetCamera);

const appl = document.querySelector("#app")! as HTMLElement;

const ui = new UI(appl);


// these are your "variables"
const speed = { current: 3.5 };
const health = { current: 100 };
const gravity = { current: 9.81 };


ui.sliderFloat(
  "Speed",
  speed,
  0,
  20
);

ui.sliderFloat(
  "Gravity",
  gravity,
  0,
  30,
  0.01
);

ui.sliderInt(
  "Health",
  health,
  0,
  200
);


// somewhere else in your code:
setInterval(() => {
  console.log({
    speed: speed.current,
    health: health.current,
    gravity: gravity.current
  });
}, 1000);