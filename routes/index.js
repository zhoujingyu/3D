var mysql = require('mysql');
//var connection = mysql.createConnection({
//    host: 'localhost',
//    port:'3306',
//    user: 'root',
//    password: '',
//    database:'mine'
//});
//
//connection.connect();

//connection.query('insert into image(path,title,count,type) values("/img/girl/xiaoqiai/121/","筱琦爱222444",15,"jpg")',function(err, rows, fields) {
//    if(err){
//        console.log(err)
//    }
//});
module.exports=function(app){
    app.get('/',function(req,res){
        //res.send('欢迎来到成长帮手聊天室!');
        res.render('index',{
            title:"成长帮手聊天室首页"
        });
    });
    app.get('/pictureWall',function(req,res){
        var sql='select distinct sort from image order by id desc';
        var result;
        connection.query(sql,function(err, rows, fields) {
            if (err) {
                console.error(err);
                result={};
            }else{
                result=rows;
            }
            res.render('pictureWall',{
                title:'照片墙',
                sortList:result
            });
        });
    });
    app.get('/pictureWall/:id',function(req,res){
        //connection.query('select * from image where id='+req.params.id,function(err, rows, fields) {
        //    if (err) {
        //        console.error(err);
        //        result = {};
        //    } else {
        //        result = rows;
        //    }
        //    console.log(result);
        //    res.render('pictureInner', {
        //        title: result[0].title,
        //        data: result
        //    });
        //});
        res.render('pic3D', {
            title: req.params.id
        });
    });
    app.get('/getPicById',function(req,res){
        connection.query('select * from image where id='+req.query.id,function(err, rows, fields) {
            if (err) {
                console.error(err);
                result = {};
            } else {
                result = rows;
            }
            res.json(result);
        });
    });
    app.get('/addData',function(req,res){
        res.render('addData', {
            title: "添加数据"
        });
    });
    app.get('/addPictureData',function(req,res){
        var path=req.query.path;
        var title=req.query.title;
        var count=req.query.count;
        var type=req.query.type;
        var sql='insert into image(path,title,count,type) values("'+path+'","'+title+'",'+count+',"'+type+'")';
        connection.query(sql,function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.send({
                    success:false,
                    message:"添加图片数据失败。。。"
                })
            } else {
                res.send({
                    success:true,
                    message:"添加图片数据成功！！！"
                })
            }
        });
    });
    app.get('/getPicture',function(req,res){
        var sort=(req.query.sort!==undefined&&req.query.sort!='*')?' where sort="'+req.query.sort+'"':'',
            pageNo=(req.query.pageNo!==undefined)?req.query.pageNo:1,
            pageSize=(req.query.pageSize!==undefined)?req.query.pageSize:20;
        var start=pageSize*(pageNo-1);
        var sql='select * from image'+sort+' order by id desc limit '+start+','+pageSize;
        //sql='select * from image where sort="family" order by id desc';
        var result;
        console.log(sql);
        connection.query(sql,function(err, rows, fields) {
            if (err) {
                console.error(err);
                result={};
            }else{
                result=rows;
            }
            res.send(result);
        });
    });
    app.get('/getPicBySort',function(req,res){
        var sort=(req.query.sort!==undefined)?req.query.pageNo:'*',
            pageNo=(req.query.pageNo!==undefined)?req.query.pageNo:1,
            pageSize=(req.query.pageSize!==undefined)?req.query.pageSize:20;
        var start=1+(pageSize*(pageNo-1));
        var sql='select * from image where sort="'+sort+'" order by id desc limit '+start+','+pageSize;
        var result;
        connection.query(sql,function(err, rows, fields) {
            if (err) {
                console.error(err);
                result={};
            }else{
                result=rows;
            }
            res.send(result);
        });
    });
};