// 导入mongodbde mongoClient方法
const MongoClient = require('mongodb').MongoClient;

// 数据库地址
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'manager';



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
}