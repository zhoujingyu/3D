var fs=require('fs');
function getDirs(path){
    fs.readdir(path,function(err,files){
        if(err){
            console.log(err);
        }else{
            var len=files.length;
            for(var i=0;i<len;i++){
                files[i]=path+files[i]+'/';
            }
            getFiles(files);
        }
    });
}

function getFiles(paths){
    var len=paths.length;
    for(var i=0;i<len;i++){
        var files=fs.readdirSync(paths[i]);
        rename(paths[i],files);
    }
}

function rename(path,files){
    var paths=[],len=files.length;
    for(var i=1;i<=len;i++){
        fs.renameSync(path+files[i-1],path+i+'.jpg');
        console.log('目录'+path+'下的文件'+files[i-1]+'更名为---->'+i+'.jpg');
    }
}


getDirs('public/img/刘飞儿/');