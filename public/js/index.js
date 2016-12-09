var socket=io.connect('http://localhost:3000/');
socket.on("connect",function(){
    $('#content').append('<p>连接上服务器了</p>');

    socket.emit('message','i come here');

    socket.on("message",function(msg){
        $('#content').append('<p>服务器发回来信息:'+msg+'</p>');
    });
});