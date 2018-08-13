// 导入express模块
const express = require('express');

// 实例化express
let app = express();

// 托管静态资源
app.use(express.static('static'))

// 监听服务
app.listen(3000,'127.0.0.1',()=>{
    console.log('success');
    
})