import {
    nextQueuedProcess,
} from './../services/accessors';

/**
 * Process Queue
 */
export function ProcessQueue() {
    /**
     * Current process being run
     * @type {null}
     */
    let processing = null;

    /**
     * Process
     *
     * Handles processing of current queue
     *
     * @return {Promise<boolean>}
     */
    this.process = async () => {
        if (processing === null) { // If it is not null, then the process queue is already running
            // If the process queue needs to be started, get the next process, run, then loop
            // until getNextQueuedProcess() returns null
            while ((processing = await nextQueuedProcess())) {
                await run(processing);
            }
        }
        return true;
    };

    /**
     * Run Process
     *
     * @param {object} process
     * @return {Promise}
     */
    async function run(process) {
        // console.log('ProcessQueue RUN', process.method, process.args);
        await process.method(...process.args);
        return true;
    }
}
