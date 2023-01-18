import { vec3, vec4 } from "gl-matrix";
import { Scene } from "./Scene";
import { Camera } from "./Camera";
import { Controls } from "./Controls";

export class Picker {
    private pickedList: any[];
    private texture: WebGLTexture | null;
    private renderBuffer: WebGLRenderbuffer | null;
    private frameBuffer: WebGLFramebuffer | null;
    private scene: Scene | undefined;
    private hitPropertyCallback: any;
    private processHitsCallback: any;
    private addHitCallback: any;
    private removeHitCallback: any;
    private camera: Camera | undefined;
    private controls: Controls | undefined;
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private gl: WebGL2RenderingContext,
        callbacks: Function,
    ) {
        this.pickedList = [];
        this.canvas = canvas;
        this.texture = null;
        this.frameBuffer = null;
        this.renderBuffer = null;
        this.gl = gl;

        Object.assign(this, callbacks);

        this.configure();
    };

    configure() {
        const { width, height } = this.canvas;
        const { gl } = this;

        this.texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        //clean
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    getHits() {
        return this.pickedList;
    };

    update() {
        const { width, height } = this.canvas;
        const { gl } = this;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    };

    compare(readout: vec4, color: vec4) {
        return (
            Math.abs(Math.round(color[0] * 255) - readout[0]) <= 1 &&
            Math.abs(Math.round(color[1] * 255) - readout[1]) <= 1 &&
            Math.abs(Math.round(color[2] * 255) - readout[2]) <=1
        );
    };

    find(coords) {
        const { gl } = this;
        const readout = new Uint8Array(4) as unknown as vec4;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.readPixels(coords.x, coords.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, readout);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        let found = false;

        this.scene?.traverse((obj) => {
            if (obj.alias === 'floor') return;

            const property: vec4 = this.hitPropertyCallback && this.hitPropertyCallback(obj);
            if (!property) return false;

            if (this.compare(readout, property)) {
                const idx = this.pickedList.indexOf(obj);
                if(~idx) {
                    this.pickedList.splice(idx, 1);
                    if (this.removeHitCallback) {
                        this.removeHitCallback(obj);
                    }
                } else {
                    this.pickedList.push(obj);
                    if (this.addHitCallback) {
                        this.addHitCallback(obj);
                    }
                }
                return found = true;
            }
        });
        return found;
    };

    stop() {
        if (this.processHitsCallback && this.pickedList.length) {
            this.processHitsCallback(this.pickedList);
        }
        this.pickedList = [];
    };

    // hitProperty(obj) {
    //     return obj.diffuse
    // };
    // addHit(obj) {
    //     obj.previous = obj.diffuse.slice(0);
    //     obj.diffuse[3] = 0.5;
    // };
    // removeHit(obj) {
    //     obj.diffuse = obj.previous.slice(0);
    // };
    // processHit(hits) {
    //     hits.forEach(hit => hit.diffuse = hit.previous);
    // };
    // movePickedObjects(dx: number, dy: number) {
    //     const hits = this.getHits();
    //     if (!hits) return;
    //     if (!this.camera) return;
    //     const factor = Math.max(
    //         Math.max(this.camera.position[0], this.camera.position[1]), this.camera.position[2]
    //     ) / 2000;
    //
    //     hits.forEach(hit => {
    //         const scaleX = vec3.create();
    //         const scaleY = vec3.create();
    //         if (!(this.controls && this.camera)) return;
    //         if (this.controls.alt) {
    //             vec3.scale(scaleY, this.camera.normal, dy * factor);
    //         } else {
    //             vec3.scale(scaleY, this.camera.up, -dy * factor);
    //             vec3.scale(scaleX, this.camera.right, dx * factor);
    //         }
    //         vec3.add(hit.position, hit.position, scaleY);
    //         vec3.add(hit.position, hit.position, scaleX);
    //     });
    // };
}
