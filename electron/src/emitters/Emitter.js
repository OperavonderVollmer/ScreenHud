class _Emitter {
    eventMap = {};

    /**
     * Registers a callback to be called when the specified event is published.
     * The callback will be passed the arguments that were published.
     * The callback will be called only once for each call to publish.
     * @param {string} event - The name of the event to subscribe to.
     * @param {Function} callback - The callback to be called when the event is published.
     * @returns {Object} An object with an unsubscribe method.
     */

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

    /**
     * Publishes an event and calls all the callbacks that were registered under it, passing a single object argument.
     * @param {string} event - The name of the event to publish.
     * @param {Object} arg - The single object argument to be passed to the callbacks.
     * @returns {Array} An array of the results returned by each callback.
     */

    publish(event, args = []) {
        console.log(event, args);
        const res = [];
        (this.eventMap[event] ?? []).forEach(callback => res.push(callback(...args)));

        return res;
    }

    /**
     * Publishes an event and calls all the callbacks that were registered under it, passing a single list argument.
     * @param {string} event - The name of the event to publish.
     * @param {Array} args - The single list argument to be passed to the callbacks.
     * @returns {Array} An array of the results returned by each callback.
     */
    publishList(event, args = []) {
        console.log(event, args);
        const res = [];
        (this.eventMap[event] ?? []).forEach(callback => res.push(callback(args)));

        return res;
    }
}

const Emitter = new _Emitter();

export default Emitter;
