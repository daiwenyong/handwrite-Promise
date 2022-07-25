// const Promise  = require('../index')
// new Promise((res,rej)=>{
//     res('success')
//     setTimeout(()=>{
//         // rej('err')
//         res('success')
//     },500)
// })
// .then(res =>{
//     return new Promise((res,rej)=>{
//         res(1)
//     })
// },rej=>{
//     console.log("-> rej", rej);
// })
// .then(res=>{
//     console.log('res2',res)
// })

/**
 * catch
 * */
// Promise.resolve(new Promise((res)=>{
//     console.log(a)
//     res(1)
// })).catch(err=>{
//     console.log("-> err", err);
// })
// Promise.resolve(new Promise((res)=>{
//     console.log(a)
//     res(1)
// })).then(value=>{
//     console.log("-> value", value);
// },err=>{
//     console.log("-> err", err);
// })
// Promise.reject(1).catch(err=>{
//     console.log("-> err", err);

/**
 * finally
 * */
Promise.resolve(1).then(v=>{
    console.log('v',v)
    return 23
}).finally(()=>{
    console.log('finally')
})
// setTimeout(()=>{
//     console.log(f)
// })

// var f2 = Promise.reject('222').then(null,v=>{
//     return 23
// }).finally(()=>{
//     console.log('finally')
// }).then(v2=>{
// console.log("-> v2", v2);
// })
// setTimeout(()=>{
//     console.log(f2)
// })

// var f2 = Promise.reject('222').then(null, v => {
//     return new Promise(res => {
//         res(1)
//     })
// }).finally(() => {
//     setTimeout(() => {
//         console.log('set timeout finally',f2)
//     }, 1000)
//     console.log('finally')
// })
// console.log(123)