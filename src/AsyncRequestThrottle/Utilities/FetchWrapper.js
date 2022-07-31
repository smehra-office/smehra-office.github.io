import CustomPromise from "../../CustomPromise/CustomPromise.js";
import { AsyncRequestGenerator } from "./AsyncRequestGenerator.js";
import { ObserverModel } from "../Models/ObserverModel.js";

export function CreateFetchWrapper(maxLimitOfTasks, subscriberList = []) {
    const maxWorkers = maxLimitOfTasks;

    let PENDING = []; let PROGRESS = []; const COMPLETED = [];
    /* list of observers that have subscribed to state changes */
    const subscribers = [...subscriberList];
    /* Mocks Async requests via setTimeout */
    const asyncRequest = new AsyncRequestGenerator();

    /* Callback post promise is resolved */
    const onRequestCompletion = (resolvedData) => {
        const item = PROGRESS.find(item => item.KEY == resolvedData);

        postResolveActions(item, resolvedData);
        movePendingToProgress();
    }

    const postResolveActions = (item, resolvedData) => {
        const { KEY: key, VALUE: callback } = item;

        // triggers callbacks attached to then() if any
        callback(resolvedData)
        // update progress array by removing resolved promise.
        PROGRESS = PROGRESS.filter(item => item.KEY !== key);
        notify(new ObserverModel('POP', key, 'PROGRESS'));
        // update completed array to include new resolved promise.
        COMPLETED.push(key);
        notify(new ObserverModel('PUSH', key, 'COMPLETED'));
    }

    /* Moves promise stored in PENDING queue to PROGRESS queue */
    const movePendingToProgress = () => {
        if (PENDING.length) {
            const item = PENDING.shift();
            notify(new ObserverModel('POP', item.KEY, 'PENDING'));

            PROGRESS.push(item);
            notify(new ObserverModel('PUSH', item.KEY, 'PROGRESS'));

            startAsyncAction(item.KEY)
        }
    }

    /* Triggers Mock Async Action */
    const startAsyncAction = (url) => {
        asyncRequest.mockAsyncRequest(url).then(data => onRequestCompletion(data));
    }

    const createEntry = (key, value) => {
        return { KEY: key, VALUE: value };
    }

    /* Public method that will be used to trigger fetch requests by the user */
    this.fetchWrapper = (url) => {
        const promiseToReturn = new CustomPromise();
        const resolve = promiseToReturn.resolve;

        /* We store resolve() method before returning the promise, so it can be called later when workers are available */
        const entry = createEntry(url, resolve);

        // checks if all workers are busy
        if (maxWorkers == PROGRESS.length) {
            PENDING.push(entry);
            notify(new ObserverModel('PUSH', entry.KEY, 'PENDING'));
        }
        else {
            PROGRESS.push(entry);
            startAsyncAction(entry.KEY);
            notify(new ObserverModel('PUSH', entry.KEY, 'PROGRESS'));
        }

        return promiseToReturn;
    }

    /* Clears all observers, preventing memory leaks*/
    this.unsubscribeAll = () => {
        subscribers.length = 0;
    }

    /* Notify all observers for an event/action */
    const notify = (data) => {
        if (Array.isArray(subscribers))
            subscribers.forEach(subscriber => subscriber(data))
    };
};
