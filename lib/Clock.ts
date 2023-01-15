import {EventEmitter} from "./EventEmitter";

export class Clock extends EventEmitter{
    private isRunning: boolean;
    constructor() {
        super();
        this.isRunning = true;

        this.tick = this.tick.bind(this);
        this.tick();

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
    }
}
