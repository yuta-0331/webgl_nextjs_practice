import { Camera } from "./Camera";
import {mat4, vec3} from "gl-matrix";
import { ProgramProps } from "../type";

export class Transforms {
    private modelViewMatrix: mat4;
    private readonly projectionMatrix: mat4;
    private readonly normalMatrix: mat4;
    private stack: Array<mat4>;
    constructor(
        private gl: WebGL2RenderingContext,
        private program: ProgramProps,
        private camera: Camera,
        private canvas: HTMLCanvasElement,
    ) {
        this.stack = [];

        this.canvas = canvas;
        this.gl = gl;
        this.program = program;
        this.camera = camera;

        this.modelViewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.normalMatrix = mat4.create();

        this.calculateModelView();
        this.updatePerspective();
        this.calculateNormal();
    };

    calculateModelView() {
        this.modelViewMatrix = this.camera.getViewTransform();
    };

    calculateNormal() {
        mat4.copy(this.normalMatrix, this.modelViewMatrix);
        mat4.invert(this.normalMatrix, this.normalMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
    };

    updatePerspective() {
        mat4.perspective(
            this.projectionMatrix,
            this.camera.fov,
            this.canvas.width / this.canvas.height,
            this.camera.minZ,
            this.camera.maxZ
        );
    };

    setMatrixUniforms() {
        this.calculateNormal();
        this.gl.uniformMatrix4fv(this.program.uModelViewMatrix, false, this.modelViewMatrix);
        this.gl.uniformMatrix4fv(this.program.uProjectionMatrix, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.program.uNormalMatrix, false, this.normalMatrix);
    };

    push() {
        const matrix = mat4.create();
        mat4.copy(matrix, this.modelViewMatrix);
        this.stack.push(matrix);
    };

    pop() {
        return this.stack.length
            ? this.modelViewMatrix = this.stack.pop() as mat4
            : null;
    };
    rotate(angle: number, axis: vec3) {
        this.push();
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, axis);
    };

}
