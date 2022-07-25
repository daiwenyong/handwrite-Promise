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
}

module.exports = Promise