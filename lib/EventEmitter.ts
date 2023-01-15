export class EventEmitter {
    private readonly events: any;
    constructor() {
        this.events = {};
    }
    on(event: string, callback: string) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };
    remove(event: string, listener: string) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(listener);
            if(~index) {
                this.events[event].splice(index, 1);
            }
        }
    };
    emit(event: string) {
        const events = this.events[event];
        if (events) {
            events.forEach((event: any) => event());
        }
    };
}
