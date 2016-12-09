'use strict';
//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port:'3306',
    user: 'root',
    password: '',
    database:'test'
});

connection.connect();

module.exports = QueryDB;

function QueryDB(){

}

QueryDB.prototype.getPictureList = function(pageNo,pageSize){
    if(pageNo===undefined)pageNo=1;
    if(pageSize===pageSize)pageSize=20;
    pageNo=Math.floor(pageNo);
    pageSize=Math.floor(pageSize);
    var start=1+(pageSize*(pageNo-1));
    var sql='select * from image limit '+start+','+pageSize;
    connection.query(sql,function(err, rows, fields) {
        if (err) {
            console.error(err);
            return false;
        }
        return rows;
    });
};

module.exports = QueryDB;