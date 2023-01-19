import { Camera } from "./Camera";
import { Picker } from "./Picker";

export class Controls {
    private camera: Camera;
    private readonly canvas: HTMLCanvasElement;
    // private picker: Picker | null;
    private dragging: boolean;
    private picking: boolean;
    private ctrl: boolean;
    alt: boolean;
    private x: number;
    private y: number;
    private lastX: number;
    private lastY: number;
    private button: number;
    private key: string | null;
    private dLock: number;
    private dStep: number;
    private readonly motionFactor: number;
    private readonly keyIncrement: number;
    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;
        // this.picker = null;
        this.dragging = false;
        this.picking = false;
        this.ctrl = false;
        this.alt = false;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.button = 0;
        this.key = null;
        this.dLock = 0;
        this.dStep = 0;
        this.motionFactor = 10;
        this.keyIncrement = 5;

        canvas.onmousedown = event => this.onMouseDown(event);
        canvas.onmouseup = event => this.onMouseUp(event);
        canvas.onmousemove = event => this.onMouseMove(event);
        window.onkeydown = event => this.onKeyDown(event);
        window.onkeyup = event => this.onKeyUp(event);
    }

    // setPicker(picker: Picker) {
    //     this.picker = picker;
    // }

    get2DCords(event: MouseEvent) {
        let top = 0,
            left = 0,
            canvas = this.canvas;

        while (canvas && canvas.tagName !== 'BODY') {
            top += canvas.offsetTop;
            left += canvas.offsetLeft;
            canvas = canvas.offsetParent as HTMLCanvasElement;
        }

        left += window.scrollX;
        top -= window.scrollY;

        return {
            x: event.clientX - left,
            y: this.canvas.height - (event.clientY - top),
        };
    }

    onMouseUp(event: MouseEvent) {
        this.dragging = false;

        // if (!event.shiftKey && this.picker) {
        //     this.picking = false;
        //     this.picker.stop();
        // }
    };

    onMouseDown(event: MouseEvent) {
        this.dragging = true;

        this.x = event.clientX;
        this.y = event.clientY;
        this.button = event.button;

        this.dStep = Math.max(
            this.camera.position[0],
            this.camera.position[1],
            this.camera.position[2]
        ) / 100;

        // if (!this.picker) return;

        // const coordinates = this.get2DCords(event);
        // this.picking = this.picker.find(coordinates);

        // if (!this.picking) this.picker.stop();
    };

    onMouseMove(event: MouseEvent) {
        this.lastX = this.x;
        this.lastY = this.y;

        this.x = event.clientX;
        this.y = event.clientY;

        if (!this.dragging) return;

        this.ctrl = event.ctrlKey;
        this.alt = event.altKey;

        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;

        // if (this.picking && this.picker?.moveCallback) {
        //     this.picker.moveCallback(dx, dy);
        //     return;
        // }

        if (!this.button) {
            this.alt
            ? this.dolly(dy)
            : this.rotate(dx, dy);
        }
    };

    onKeyDown(event: KeyboardEvent) {
        this.key = event.key;
        this.ctrl = event.ctrlKey;

        if (this.ctrl) return;

        switch (this.key) {
            case 'ArrowLeft':
                return this.camera.changeAzimuth(-this.keyIncrement);
            case 'ArrowUp':
                return this.camera.changeElevation(this.keyIncrement);
            case 'ArrowRight':
                return this.camera.changeAzimuth(this.keyIncrement);
            case 'ArrowDown':
                return this.camera.changeElevation(-this.keyIncrement);
        }
    };

    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Control') {
            this.ctrl = false;
        }
    };

    dolly(value: number) {
        if (value > 0) {
            this.dLock += this.dStep;
        } else {
            this.dLock -= this.dStep;
        }

        this.camera.dolly(this.dLock);
    };

    rotate(dx: number, dy: number) {
        const { width, height } = this.canvas;

        const deltaAzimuth = -20 / width;
        const deltaElevation = -20 / height;

        const azimuth = dx * deltaAzimuth * this.motionFactor;
        const elevation = dy * deltaElevation * this.motionFactor;

        this.camera.changeAzimuth(azimuth);
        this.camera.changeElevation(elevation);
    }
}