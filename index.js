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

        this.callbacks.forEach(cb=>{
            cb.onFulfilled()
        })
    }
    reject = (reason) => {
        if (!this.isPending()) return
        this.reason = reason
        this.status = Promise.REJECTED

        this.callbacks.forEach(cb=>{
            cb.onRejected()
        })
    }
    isPending = () => {
        return this.status === Promise.PENDING
    }

    then(onFulfilled,onRejected){
        if(!isFunction(onFulfilled)){
            onFulfilled = value => value
        }
        if(!isFunction(onRejected)){
            onRejected = error => {
                throw error
            }
        }
        // onFulfilled(this.value)

        if(this.isPending()){
            this.callbacks.push({
                onFulfilled:()=>{
                    queueMicrotask(()=>{
                        onFulfilled(this.value)
                    })
                },
                onRejected:()=>{
                    queueMicrotask(()=>{
                        onRejected(this.reason)
                    })
                }
            })
        }
    }
}

module.exports = Promise