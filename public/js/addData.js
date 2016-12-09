function uploadPictureData(){
    var path=$('#picPath').val();
    var title=$('#picTitle').val();
    var count=$('#picCount').val();
    var type=$('#picType').val();
    //if(!/^\/[\w.]+\/$/.test(path)){
    //    console.warn("path格式错误");
    //    return false;
    //}else{
    //    console.log("path格式正确")
    //}
    if(title==""){
        console.warn("请输入title");
        return false;
    }else{
        console.log("title格式正确")
    }
    if(isNaN(count)){
        console.warn("请输入数字");
        return false;
    }else{
        console.log("count正确")
    }
    if(type==""){
        console.warn("type错误");
        return false;
    }
    $.ajax({
        type:"get",
        url:"/addPictureData",
        data:{
            path:path,
            title:title,
            count:count,
            type:type
        },
        dataType:"JSON",
        success:function(data){
            alert(data.message);
        },
        error:function(){
            alert("网络错误，请重新提交");
        }
    })

}