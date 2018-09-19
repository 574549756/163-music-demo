window.eventHub = {
    events: {
        羊城晚报: [],
        人民日报: []
    },
    emit(eventName, data) {
        for (let key in this.events) {
            if (key === eventName) {
                let fnList = this.events[key]
                fnList.map(() => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn) {
        for (let key in this.events.length) {
            if (key === eventName) {
                if (this.events[key]) {
                    this.events[key] = []
                }
                this.events[key].push(fn)
            }
        }
    },
    off() {}
}
