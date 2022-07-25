const { isFunction } = require('./utils')

class Promise {
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'

    constructor(executor) {
        this.status = Promise.PENDING
        this.value = null
        this.reason = null
        this.callbacks = []

        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    resolve = (value) => {
        if (!this.isPending()) return
        this.value = value
        this.status = Promise.FULFILLED

        this.callbacks.forEach(cb => {
            cb.onFulfilled()
        })
    }
    reject = (reason) => {
        if (!this.isPending()) return
        this.reason = reason
        this.status = Promise.REJECTED

        this.callbacks.forEach(cb => {
            cb.onRejected()
        })
    }
    isPending = () => {
        return this.status === Promise.PENDING
    }

    then(onFulfilled, onRejected) {
        if (!isFunction(onFulfilled)) {
            onFulfilled = value => value
        }
        if (!isFunction(onRejected)) {
            onRejected = error => {
                throw error
            }
        }
        const promise2 = new Promise((resolve, reject) => {

            if (this.status === Promise.FULFILLED) {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === Promise.REJECTED) {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.isPending()) {
                this.callbacks.push({
                    onFulfilled: () => {
                        queueMicrotask(() => {
                            try {
                                const x = onFulfilled(this.value)
                                this.resolvePromise(promise2, x, resolve, reject)
                            } catch (e) {
                                reject(e)
                            }
                        })
                    },
                    onRejected: () => {
                        queueMicrotask(() => {
                            try {
                                const x = onRejected(this.reason)
                                this.resolvePromise(promise2, x, resolve, reject)
                            } catch (e) {
                                reject(e)
                            }
                        })
                    }
                })
            }
        })
        return promise2
    }

    resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            throw TypeError('Chaining cycle detected for promise')
        }
        if (x instanceof Promise) {
            x.then(y => {
                this.resolvePromise(promise2, y, resolve, reject)
            }, reject)
        } else if (typeof x === 'object' || isFunction(x)) {
            try {
                let then = x.then
                if (isFunction(then)) {
                    try {
                        x.then(y => {
                            this.resolvePromise(promise2, y, resolve, reject)
                        }, reject)
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    resolve(x)
                }
            } catch (e) {
                reject(e)
            }
        } else {
            resolve(x)
        }
    }

    catch (onRejected) {
        this.then(null,onRejected)
    }

    finally(fn) {
        return this.then(value => {
            fn()
            return value
        }, reason => {
            fn()
            return reason
        })
    }

    static resolve(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    static reject(reason) {
        return new Promise((_, reject) => {
            reject(reason)
        })
    }

    // 当所有promise是resolved 或者有一个rejected才结束
    static all(promises) {
        const res = []
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                promise.then(value => {
                    res[index] = value
                    if (res.length === promises.length) {
                        resolve(res)
                    }
                }, reject)
            })
        })
    }

    // 所有promise有值
    static allSettled(promises){
        const res = []
        return new Promise((resolve,reject)=>{
            function isSuccess() {
                if (res.length === promises.length) {
                    resolve(res)
                }
            }
            promises.forEach((item, index) => {
                Promise.resolve(item).then(value => {
                    res[index] = {
                        status: 'fulfilled',
                        value
                    }
                    isSuccess()
                }, reason => {
                    res[index] = {
                        status: 'rejected',
                        reason
                    }
                    isSuccess()
                })
            })
        })
    }

    // 一个promise有值 不管成功失败
    static race(promises){
        return new Promise((resolve,reject)=>{
            promises.forEach(promise=>{
                Promise.resolve(promise).then(resolve,reject)
            })
        })
    }

    // 一个promise成功 或者全部失败就抛错AggregateError: All promises were rejected

    static any(promises){
        const errs = []
        return new Promise((resolve,reject)=>{
            promises.forEach((promise,index)=>{
                Promise.resolve(promise).then(resolve,reason=>{
                    errs[index] = reason
                    if (errs.length === promises.length) {
                        // reject('失败了')
                        // nodejs 不支持
                        reject(AggregateError([
                            new Error("All promises were rejected")
                        ], 'All promises were rejected'))
                    }
                })
            })
        })
    }
}

module.exports = Promise