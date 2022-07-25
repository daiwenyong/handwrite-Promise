const Promise  = require('../index')
/**
 * Promise.resolve
 * */
// Promise.resolve(new Promise((resolve,reject)=>{
//     reject('err')
// })).then(res=>{
//     console.log("-> res", res);
// },err=>{
//     console.log("-> err", err);
// })
/**
 * Promise.reject
 * */
// Promise.reject(1).then(res=>{
//     console.log("-> res", res);
// },err=>{
//     console.log("-> err", err);
// })
/**
 * Promise.all
 * */
let p_all1 = new Promise((resolve, reject) => {
    resolve("1");
})
let p_all2 = new Promise((resolve, reject) => {
    reject("2");
});
Promise.all([p_all1, p_all2]).then(
    promises => {
        console.log('all success',promises);
    },
    reason => {
        console.log('all fail',reason);
    }
)

/**
 * Promise.allSettled
 * */
// let p_allSettled1 = new Promise((resolve, reject) => {
//     resolve("1")
// })
// let p_allSettled2 = new Promise((resolve, reject) => {
//     reject("2")
// })
// Promise.allSettled([p_allSettled1, p_allSettled2]).then(
//     promises => {
//         console.log('allSettled success',promises)
//     },
//     reason => {
//         console.log('allSettled success',reason)
//     }
// )

/**
 * Promise.race
 * */
let p_race1 = new Promise((resolve, reject) => {
    reject("1")
})
let p_race2 = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve("2")
    },100)
})
Promise.race([p_race1, p_race2]).then(
    value => {
        console.log("race-> value", value);
    },
    reason => {
        console.log('race-> reason',reason);
    }
)

/**
 * Promise.any
 * */
const promises = [
    Promise.reject('ERROR A'),
    Promise.reject('ERROR B'),
    Promise.reject('result'),
]
//
Promise.any(promises).then((value) => {
    console.log('any -> value: ', value)
},(err) => {
    console.log('any -> err: ', err)
})
