import { app } from "./app";
import { vec3 } from "gl-matrix";
import { renderer } from "./renderer/renderer";
import { getCameraPosition, getCameraOrientation } from "./input";

window.addEventListener("DOMContentLoaded", async ()=>{
    app.instance = new app();
    await app.get().initApp();
    renderer.get().uBuffer.camera.position = getCameraPosition();
    const yawPitch = getCameraOrientation();
    renderer.get().uBuffer.camera.yaw = yawPitch[0];
    renderer.get().uBuffer.camera.pitch = yawPitch[1];
    app.get().run();
});

window.addEventListener("beforeunload", () => {
  // save cookies
    const pos = renderer.get().uBuffer.camera.getPosition();
    document.cookie = `cameraPosition=${pos[0]},${pos[1]},${pos[2]}; path=/; max-age=3600`;
    document.cookie = `cameraOrientation=${renderer.get().uBuffer.camera.yaw},${renderer.get().uBuffer.camera.pitch}; path=/; max-age=3600`;
});

function resetCamera() {
    renderer.get().uBuffer.camera.position = vec3.fromValues(0, 0, -2.4);
    renderer.get().uBuffer.camera.yaw = 0;
    renderer.get().uBuffer.camera.pitch = 0;
}

const button = document.getElementById("resetCameraButton")!;
button.addEventListener("click", resetCamera);
