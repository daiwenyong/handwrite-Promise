const Promise  = require('../index')
new Promise((res,rej)=>{
    res('success')
    setTimeout(()=>{
        // rej('err')
        res('success')
    },500)
})
.then(res =>{
    return new Promise((res,rej)=>{
        res(1)
    })
},rej=>{
    console.log("-> rej", rej);
})
.then(res=>{
    console.log('res2',res)
})