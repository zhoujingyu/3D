function LazyLoad(){
    this.winH=document.documentElement.clientHeight || document.body.clientHeight;//窗口高度
    this.winW=document.documentElement.clientWidth || document.body.clientWidth;//窗口宽度
    this.x=document.documentElement.scrollLeft || document.body.scrollLeft;//窗口左上角x坐标
    this.y=document.documentElement.scrollTop || document.body.scrollTop;//窗口左上角y坐标
    console.log("窗口宽度："+this.winW+",窗口高度："+this.winH+",x="+this.x+",y="+this.y);

    this.resize();
    this.scroll();
    this.collectCanLoadImg();
}

LazyLoad.prototype.resize=function(){
    var self=this;
    window.onresize=function(){
        self.winH=document.documentElement.clientHeight || document.body.clientHeight;
        self.winW=document.documentElement.clientWidth || document.body.clientWidth;
        self.x=document.documentElement.scrollLeft || document.body.scrollLeft;
        self.y=document.documentElement.scrollTop || document.body.scrollTop;
    };
};

LazyLoad.prototype.scroll=function(){
    var self=this;
    window.onscroll=function(){
        self.x=document.documentElement.scrollLeft || document.body.scrollLeft;
        self.y=document.documentElement.scrollTop || document.body.scrollTop;
        self.collectCanLoadImg();
    };
};

LazyLoad.prototype.collectCanLoadImg=function(){
    var img=document.getElementsByTagName('img');
    var x, y, w, h,len=img.length;
    for(var i=0;i<len;i++){
        x=this.getX(img[i]);
        y=this.getY(img[i]);
        w=$(img[i]).width();
        h=$(img[i]).height();
        if( x + w > this.x &&
            this.x + this.winW > x &&
            y + h > this.y &&
            this.y + this.winH > y){
            this.loadImg(img[i]);
        }
    }
};

LazyLoad.prototype.loadImg=function(obj){
    var src=obj.getAttribute('src');
    var dataSrc=obj.getAttribute('data-src');
    if(src!=dataSrc){
        obj.setAttribute('src',dataSrc);
    }
};

LazyLoad.prototype.getY=function(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=this.getY(e.offsetParent);
    return offset;
};

LazyLoad.prototype.getX=function(e){
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=this.getX(e.offsetParent);
    return offset;
};
//批量下载代码
//var img=document.getElementsByTagName('img');var src='';for(var i=0;i<img.length;i++){src+=img[i].getAttribute('src');src+='\n'}
//var img=document.getElementsByTagName('img');
//var src='';
//for(var i=0;i<img.length;i++){
//    if(/.jpg/.test(img[i].getAttribute('src'))){
//        src+=img[i].getAttribute('src');
//        src+='\n';
//    }
//}
//console.log(src);

//大图批量下载
//var img=document.getElementsByTagName('img');var src='';for(var i=0;i<img.length;i++){src+=img[i].getAttribute('src');src+='\n'};src=src.replace(/photo\/public/g,'large/public/');

//var img=document.getElementsByTagName('img');var src='';for(var i=0;i<img.length;i++){src+=img[i].getAttribute('src');src+='\n'};src=src.replace(/mw690/g,'large');
