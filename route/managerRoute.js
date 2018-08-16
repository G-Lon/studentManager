// 导入模块--express
const express = require('express');

// 导入MonFoDB模块--数据库
let MgDB = require('../tools/helper');

// 验证码生成模块
const svgCaptcha = require('svg-captcha');

// 小写转换
const toLowerCase = require('to-lower-case');

// 内置模块--路径
const path = require('path');

// 内置模块--template
const template = require('art-template')

// 实例化router
let router = express.Router();


// 登录
router.post('/login', (req, res) => {
    // console.log(req.body);
    // 根据req.body 的值去获取相应的数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    let vCode = req.body.vCode;


    // 为节约性能，先判断验证码是否正确
    // if(vCode == req.session.captcha || vCode == req.session.captcha.toLowerCase()){
    if (vCode == req.session.captcha || vCode == toLowerCase(req.session.captcha)) {

        // 验证码正确，那么就去数据库查询用户名和密码是否一样
        MgDB.find('admin', {
            userName,
            userPass
        }, (result) => {
            // console.log(result);
            if (result.length != 0) {
                // 如果有值，那么就跳转到首页

                // 将用户名记录在session中
                req.session.userName = userName;

                // let html = template(path.join(__dirname,'../template/index.html'),{
                //     result:result[0]
                // });

                // res.send(html)

                res.redirect('/admin/index')
            } else {
                // 如果没有值，那么就弹出用户名或者密码错误，请重新确认输入
                res.send(`<script>alert('用户名或者密码错误，请重新确认输入!!');window.location = '/manager/login'</script>`)
            }
        })
    } else {
        // 验证码错误，就弹出弹出信息，并返回至登录界面
        res.send(`<script>alert('验证码错误');window.location = '/manager/login'</script>`)
    }

});

// 注册路由
// 登录界面
router.get('/login', (req, res) => {

    res.sendFile(path.join(__dirname, '../template/login.html'));
});


// 跳转到注册页面： /manager/register
router.get('/register', (req, res) => {

    res.sendFile(path.join(__dirname, '../template/register.html'))
})

// 注册用户
router.post('/register', (req, res) => {
    // res.send(req.body); 通过请求体来获取发送了什么请求
    // 获取到输入的数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;

    // 到数据库去查询是否存在
    MgDB.find('admin', {
        userName
    }, (result) => {
        // console.log(result);
        if (result.length == 0) { //如果数据库中不存在该数据，那么就注册添加到数据库
            MgDB.insertOne('admin', {
                userName,
                userPass
            }, (result) => {
                console.log(result);
                if (result.result.n == 1) {
                    // 注册成功那就前往登录页面
                    res.send(`<script>alert('注册成功，请前往登录');window.location = '/manager/login'</script>`)
                }
            })
        } else {
            // 如果已经被注册那么就返回已被注册的信息，并跳回到注册页面
            res.send(`<script>alert('用户名已存在，请重新输入用户名');window.location = '/manager/register';</script>`)
        }
    })
});


// 生成验证码
router.get('/vCode', function (req, res) {
    // 使用第三方模块生成验证码
    let captcha = svgCaptcha.create();

    // 设置session的值
    req.session.captcha = captcha.text;

    // 使用ejs等模板时如果报错 res.type('html')
    res.type('svg');
    res.status(200).send(captcha.data);
});





// 暴露出去
module.exports = router