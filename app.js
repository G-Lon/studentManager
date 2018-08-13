// 导入express模块
const express = require('express');

// 导入bodyParser
const bodyParser = require('body-parser');


// 导入session中间包
const session = require('express-session')

// 实例化express
let app = express();

// 自动格式化数据 在 req这个对象上 增加 .body 属性 把数据保存进去
app.use(bodyParser.urlencoded({ extended: false }));


// 相信第一次请求
app.set('trust proxy', 1) // trust first proxy
// 设置session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 30, // harlf of hour
    // secure: false
   }
}))


// 引入自己写的路由
const router = require('./route/managerRoute');

// 托管静态资源
app.use(express.static('static'));

// 使用自己写的路由
app.use('/manager',router);

app.use('/admin',router);

// 监听服务
app.listen(8848,'127.0.0.1',()=>{
    console.log('success');
    
})