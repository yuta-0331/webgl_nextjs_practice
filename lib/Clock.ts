import { EventEmitter } from "./EventEmitter";

export class Clock extends EventEmitter{
    private isRunning: boolean;
    private lastFlameTime: number;
    constructor() {
        super();
        this.isRunning = true;

        this.tick = this.tick.bind(this);
        this.tick();

        this.lastFlameTime = Date.now();

        window.onblur = () => {
            this.stop();
            console.info('Clock stopped');
        };
        window.onfocus = () => {
            this.start();
            console.info('Clock resumed');
        };
    };
    tick() {
        if(this.isRunning) {
            this.emit('tick');
        }
        requestAnimationFrame(this.tick);
    };
    start() {
        this.isRunning = true;
    };
    stop() {
        this.isRunning = false;
    };

    getDelta() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFlameTime;
        this.lastFlameTime = currentTime;
        return deltaTime;
    }
}
