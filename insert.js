var mysql = require('mysql');
var fs=require('fs');
var connection = mysql.createConnection({
    host: 'localhost',
    port:'3306',
    user: 'root',
    password: '',
    database:'mine'
});

connection.connect();

var url='public/img/刘飞儿/';
var sort='刘飞儿';

function getDirs(path){
    fs.readdir(path,function(err,files){
        if(err){
            console.log(err);
        }else{
            var len=files.length,title=files;
            for(var i=0;i<len;i++){
                files[i]=path+files[i]+'/';
            }
            getCount(files);
        }
    });
}

function getCount(paths){
    var len=paths.length;
    for(var i=0;i<len;i++){
        insertInto(paths[i],fs.readdirSync(paths[i]).length);
    }
}

function insertInto(path,count){
    var arr=path.split('/');
    var type='jpg',title=arr[arr.length-2];
    path=path.replace('public/','/');

    var sql='insert into image(path,title,count,type,sort) values("'+path+'","'+title+'",'+count+',"'+type+'","'+sort+'")';
    connection.query(sql,function(err, rows, fields) {
        if (err) {
            console.log(sql+'执行失败');
        } else {
            console.log(sql+'执行成功');
        }
    });
}

//var sql='insert into image(path,title,count,type) values("'+path+'","'+title+'",'+count+',"'+type+'")';
//connection.query(sql,function(err, rows, fields) {
//    if (err) {
//        console.log(err);
//        res.send({
//            success:false,
//            message:"添加图片数据失败。。。"
//        })
//    } else {
//        res.send({
//            success:true,
//            message:"添加图片数据成功！！！"
//        })
//    }
//});

getDirs(url);