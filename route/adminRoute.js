// 导入模块--express
const express = require('express');

// 导入MonFoDB模块--数据库
let MgDB = require('../tools/helper');

// 内置模块--template
const template = require('art-template');
const path = require('path');


// 实例化router
let router = express.Router();

// 注册路由
// 首页  查找
router.get('/index', (req, res) => {
    // console.log(req.query.key);
    let sqlObj = {};
    if(req.query.key){
        // 使用正则进行模糊匹配
        sqlObj = {
            userName:{$regex:req.query.key}
        }
    }else{
        sqlObj = {};
    }
    // console.log(req.session.userName);
    let userInfo = req.session.userName;
    // console.log(result);
    if (userInfo) { 
        // 读取首页数据，然后渲染
        MgDB.find('student',sqlObj,(result)=>{
            let html = template(path.join(__dirname, '../template/index.html'), {
                userInfo,//session保存的用户名
                result //根据数据库查询出来的值
            })
            res.send(html);
        })
            
    }else {
        res.send(`<script>alert('你还未登录，请先登录');window.location = '/manager/login'</script>`)
    }
});

// 退出
router.get('/logout',(req,res)=>{
    // 删除session
    // req.session.userName = undefined;
    delete req.session.userName;
    res.send(`<script>alert('你已退出，将返回到登录页面');window.location = '/manager/login'</script>`)
});


// 添加数据
router.get('/add',(req,res)=>{
    if(req.session.userName){
        let html = template(path.join(__dirname,'../template/add.html'),{
            userInfo:req.session.userName
        })

        res.send(html);
    }else{
        res.send(`<script>alert('你还未登录，请先登录');window.location = '/manager/login'</script>`)
    }
});


// 将添加的数据添加到数据库
router.post('/add',(req,res)=>{
    MgDB.insertOne('student',req.body,(result)=>{
        if(result.result.n == 1){
            res.send(`<script>alert('添加成功');window.location = '/admin/index'</script>`)
        }
    })
});


// 删除数据
// 对id的值要进行特殊处理
router.get('/delete/:id',(req,res)=>{
    // console.log(req.params);
    // 对id进行截取，把引号去掉
    let id = req.params.id.slice(1,25);
    // console.log(id);
    
    // res.send(id)
    MgDB.deleteOne('student',{_id:MgDB.ObjectId(id)},(result)=>{
        // console.log(result.result);
        if(result.result.n==1){
            // 删除成功就返回到首页
            res.redirect('/admin/index')
            // res.send(`<script>alert('删除成功');window.location = '/admin/index'</script>`)
        }
    })
});


// 编辑信息页面
router.get('/edit/:id',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../template/edit.html'));
    // console.log(req.params);
    let id = req.params.id.slice(1,25);
    MgDB.find('student',{_id:MgDB.ObjectId(id)},(result)=>{
        console.log(result);
        let html = template(path.join(__dirname,'../template/edit.html'),{
            userName:req.session.userName,
            result:result[0]
        })
        res.send(html)
    })
    
    
    
});


// 编辑信息
router.post('/edit',(req,res)=>{
    // console.log(req.body);
    // 获取提交的信息
    // let userName = req.body.userName
    // let userAge = req.body.userAge
    // let userSex = req.body.userSex
    // let userPhone = req.body.userPhone
    // let userAddress = req.body.userAddress
    // let userInstruct = req.body.userInstruct

    let id = req.body.id.slice(1,25);
    // console.log(id);
    MgDB.updateOne('student',{_id:MgDB.ObjectId(id)},{$set:req.body},(result)=>{
        // console.log(result.result);
        if(result.result.n == 1){
            // res.send(`<script>alert('修改成功');window.location = '/admin/index'</script>`)
            res.redirect('/admin/index')
        }
        
    })
    
});




// 暴露出去
module.exports = router