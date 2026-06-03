import { vec3, mat4, vec2 } from "gl-matrix";
import { input } from "../input";

// settings
const speed:number = 0.1; 
const mouse_sensitivity:number = 0.002; 
const max_pitch = Math.PI / 2 - 0.01;

class cameraMatrix {
  constructor(aspectRatio:number) {
    this.position = vec3.fromValues(0, 3, -5);
    this.orientation = vec3.fromValues(0, 0, 1);
    this.up = vec3.fromValues(0, 1, 0);

    this.fov = Math.PI * 0.25;
    this.aspect = aspectRatio;
    this.near = 0.1;
    this.far = 1000.0;

    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.vpMatrix = mat4.create();

    this.updateProjection();
  }
  get(): mat4 {
    mat4.multiply(this.vpMatrix, this.projectionMatrix, this.viewMatrix);
    return this.vpMatrix;
  }
  getPosition(): vec3 {
    return vec3.clone(this.position);
  }
  getOrientation(): vec2 {
    return vec2.fromValues(this.yaw, this.pitch);
  }
  update() {
    // orientation
    this.yaw   -= input.get().mouseDeltaX * mouse_sensitivity;
    this.pitch -= input.get().mouseDeltaY * mouse_sensitivity;
    this.pitch = Math.max(-max_pitch, Math.min(max_pitch, this.pitch));
    this.orientation[0] = Math.cos(this.pitch) * Math.sin(this.yaw);
    this.orientation[1] = Math.sin(this.pitch);
    this.orientation[2] = Math.cos(this.pitch) * Math.cos(this.yaw);

    // movement
    const forward = vec3.clone(this.orientation);
    forward[1] = 0;
    vec3.normalize(forward, forward);
    const right = vec3.create();
    vec3.cross(right, forward, this.up);
    vec3.normalize(right, right);
    if (input.get().keys["w"]) vec3.scaleAndAdd(this.position, this.position, forward, speed);
    if (input.get().keys["s"]) vec3.scaleAndAdd(this.position, this.position, forward, -speed);
    if (input.get().keys["a"]) vec3.scaleAndAdd(this.position, this.position, right, -speed);
    if (input.get().keys["d"]) vec3.scaleAndAdd(this.position, this.position, right, speed);
    if (input.get().keys[" "]) vec3.scaleAndAdd(this.position, this.position, this.up, speed);
    if (input.get().keys["shift"]) vec3.scaleAndAdd(this.position, this.position, this.up, -speed);

    mat4.lookAt(this.viewMatrix, this.position, vec3.add(vec3.create(), this.position, this.orientation), this.up);
  }
  updateProjection() {
    mat4.perspective(
      this.projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }

  position: vec3;
  orientation: vec3;
  up: vec3;

  fov: number;
  aspect: number;
  near: number;
  far: number;

  yaw: number = 0;
  pitch: number = -0.5;

  private viewMatrix: mat4;
  private projectionMatrix: mat4;
  private vpMatrix: mat4;
}

export { cameraMatrix };