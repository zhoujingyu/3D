var sio=require('socket.io');

module.exports=function(server){
    var io=sio.listen(server);

    io.on('connection',function(_socket){
        _socket.on('message',function(msg){
            console.log("接收到客户端信息："+msg);
            _socket.emit('message', msg);
        });

        _socket.on('disconnect',function(){
            console.log("用户离开了聊天室");
        });
    });
};
