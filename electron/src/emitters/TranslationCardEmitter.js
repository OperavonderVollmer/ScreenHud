class _translationCardEmitter {
    eventMap = {};

    subscribe(event, callback) {
        if (this.eventMap[event] === undefined) {
            this.eventMap[event] = new Set();
        }

        this.eventMap[event].add(callback);

        return {
            unsubscribe: () => {
                this.eventMap[event].delete(callback);
            },
        };
    }

    publish(event, args = []) {
        const res = [];

        (this.eventMap[event] ?? []).forEach(callback => res.push(callback(...args)));

        return res;
    }

    publishList(event, args = []) {
        const res = [];
        (this.eventMap[event] ?? []).forEach(callback => res.push(callback(args)));

        return res;
    }
}

const TranslationCardEmitter = new _translationCardEmitter();

export default TranslationCardEmitter;
