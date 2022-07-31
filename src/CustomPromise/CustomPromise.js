function CustomPromise(callback) {
    this.data = null;
    this.successCallbackQueue = [];
    this.failCallbackQueue = [];

    this.isResolveCalled = false;

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    if (callback)
        callback(this.resolve, this.reject);
}

CustomPromise.prototype.then = function (successCallback) {

    if (this.isResolveCalled) {
        const newPromise = new CustomPromise(res => res(this.data));

        const newCallbackQueue = [];
        newCallbackQueue.push(successCallback);
        newPromise.successCallbackQueue = newCallbackQueue;

        newPromise.isResolveCalled = this.isResolveCalled;

        newPromise.executeCallbacks(newPromise.successCallbackQueue);
        return newPromise;
    }
    else {
        const newPromise = new CustomPromise();

        newPromise.successCallbackQueue.push(successCallback);
        this.successCallbackQueue.push(newPromise.resolve);

        return newPromise;
    }
}

CustomPromise.prototype.catch = function (failCallback) {
    this.failQueue.push(failCallback);
}

CustomPromise.prototype.resolve = function (value) {
    if (value)
        this.data = value;  // initialise data with first resolve

    this.executeCallbacks(this.successCallbackQueue);
    this.isResolveCalled = true; // informs that resolve has been called
};

CustomPromise.prototype.reject = function (value = '') {
    this.failQueue.forEach(function (fn) { fn(value) });
}

CustomPromise.prototype.executeCallbacks = function (callback) {

    while (callback.length) {
        const successCallback = callback.shift(); // pick each callback one by one and process it
        const returnedData = successCallback(this.data);

        if (returnedData)
            this.data = returnedData;  // update data if callback returns something
    }
}


export default CustomPromise
/* SIMPLE SYNC CHAIN 

new CustomPromise((res) => {
    res(100)
})
    .then((data) => console.log(data))
    .then(data => (data + 100))
    .then((data) => console.log(data))
    .then(data => data + 100)
    .then((data) => console.log(data));

*/


/*  SYNC BRANCH CHAIN

const a = new CustomPromise((res) => {
    res(100)
})
    .then((data) => console.log(data))

a
    .then(data => data + 100)
    .then((data) => console.log(data))

a
    .then(data => data + 100)
    .then((data) => console.log(data));

*/


/* ASYNC SIMPLE CHAIN 

new CustomPromise((res) => {
    setTimeout(() => res(100), 1500);
})
    .then((data) => console.log(data))
    .then(data => data + 100)
    .then((data) => console.log(data))
    .then(data => data + 100)
    .then((data) => console.log(data));

/*




*/

/* EXECUTED !!!!!! ---> ASYNC branched chain 
const d = new CustomPromise((res) => {
    setTimeout(() => res(100), 3000)
})
    .then((data) => console.log(data))
d
    .then(data => data + 100)
    .then((data) => console.log(data))

d
    .then(data => data + 100)
    .then((data) => console.log(data));


*/


/*

If promise is not resolved, 
first push the then() callback in the success callback queue

return a new promise 


 
*/