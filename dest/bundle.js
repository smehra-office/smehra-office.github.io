(function () {
    'use strict';

    /* 

    return new Promise((resolve, reject))=>{
    }

    */

    function CustomPromise(callback) {
        this.successQueue = [];
        this.failQueue = [];

        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);

        callback(this.resolve, this.reject);
    }

    CustomPromise.prototype.then = function (callback) {
        this.successQueue.push(callback);
    };

    CustomPromise.prototype.catch = function (callback) {
        this.failQueue.push(callback);
    };

    CustomPromise.prototype.resolve = function (value = '') {
        this.successQueue.forEach(function (fn) { fn(value); });
    };


    CustomPromise.prototype.reject = function (value = '') {
        this.failQueue.forEach(function (fn) { fn(value); });
    };





    function promise_dummy(res) {
        setTimeout(function () { res(); }, 5000);
    }

    new CustomPromise(promise_dummy).then((e) => { console.log('then block has been invoked'); });

})();
