const Promise  = require('./index')
new Promise((res,rej)=>{
    console.log(1)
    setTimeout(()=>{
        rej('err')
        // res('success')
    },500)
})
.then(res =>{
    console.log('res',res)
},rej=>{
    console.log("-> rej", rej);
})