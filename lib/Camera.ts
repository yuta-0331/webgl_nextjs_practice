import { mat4, vec3, vec4 } from "gl-matrix";

export class Camera {
    static TYPES: Array<string>;
    private static ORBITING_TYPE: ;
    constructor(type = Camera.ORBITING_TYPE) {
    }
}


Camera.TYPES = ['ORBITING_TYPE', 'TRACKING_TYPE'];
Camera.TYPES.forEach(type => Camera[type] = type)