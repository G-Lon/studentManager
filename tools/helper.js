// 导入mongodbde mongoClient方法
const MongoClient = require('mongodb').MongoClient;

// 数据库地址
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'manager';

// 准备ObjectId 暴露出去
const ObjectId = require('mongodb').ObjectID;


module.exports = {
    // 查找数据
    find(collectionName,filterObj,callback) {
        // 数据库连接
        MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {

            // 选择使用的数据库
            const db = client.db(dbName);

            db.collection(collectionName).find(filterObj).toArray((err,result)=>{
                if(err) throw err;

                // 关闭数据库
                client.close();

                // 将数据传递出去
                callback(result)
            })
        });
    },

    // 插入数据
    insertOne(collectionName,filterObj,callback) {
        // 数据库连接
        MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {

            // 选择使用的数据库
            const db = client.db(dbName);

            db.collection(collectionName).insertOne(filterObj,(err,result)=>{
                if(err) throw err;

                // 关闭数据库
                client.close();

                // 将数据传递出去
                callback(result);
            })
        });
    },

    // 删除数据
    deleteOne(collectionName,filterObj,callback){
         // 数据库连接
         MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {

            // 选择使用的数据库
            const db = client.db(dbName);

            db.collection(collectionName).deleteOne(filterObj,(err,result)=>{
                if(err) throw err;

                // 关闭数据库
                client.close();

                // 将数据传递出去
                callback(result);
            })
        });
    },

    // 更新数据
    // 删除数据
    updateOne(collectionName,oldFilterObj,newFilterObj,callback){
        // 数据库连接
        MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {

           // 选择使用的数据库
           const db = client.db(dbName);

           db.collection(collectionName).updateOne(oldFilterObj,newFilterObj,(err,result)=>{
               if(err) throw err;

               // 关闭数据库
               client.close();

               // 将数据传递出去
               callback(result);
           })
       });
   },

//    生成id的方法
   ObjectId
}