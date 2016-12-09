window.onload=function(){
    var lazyLoad=new LazyLoad();
    var $img=$('img');
    var scale15='scale(2)',scale25='scale(2.5)';
    $img.on('mouseover',function(){
        if(isMobile()){

        }else{
            var translate=getTranslate(this);
            $(this).css({
                'z-index':10,
                '-webkit-transform':scale15+translate,
                '-moz-transform':scale15+translate,
                '-o-transform':scale15+translate,
                'transform':scale15+translate
            });
        }
    }).on('mouseout',function(){
        $(this).attr('style','');
    }).on('click',function(){
        var translate;
        if(isMobile()){
            translate=getTranslate(this);
            var zIndex=this.style['zIndex'];
            if(zIndex==''){//第一次点击
                $(this).css({
                    'z-index':10,
                    '-webkit-transform':scale15+translate,
                    '-moz-transform':scale15+translate,
                    '-o-transform':scale15+translate,
                    'transform':scale15+translate
                });
            }else if(zIndex==10){//第二次点击
                var w1=this.clientWidth+parseFloat($(this).css('border-width'))*2;
                var w2=$(window).width();
                var times=parseFloat(w2/w1);
                $(this).css({
                    'z-index':20,
                    '-webkit-transform':'scale('+times+')'+translate,
                    '-moz-transform':'scale('+times+')'+translate,
                    '-o-transform':'scale('+times+')'+translate,
                    'transform':'scale('+times+')'+translate
                });
            }else if(zIndex==20){
                $(this).attr('style','');//第三次点击
            }
        }else{
            translate=getTranslate(this,2);
            $(this).css({
                'z-index':10,
                '-webkit-transform':scale25+translate,
                '-moz-transform':scale25+translate,
                '-o-transform':scale25+translate,
                'transform':scale25+translate
            });
        }
    });

    var getTranslate=function(obj,times){
        if(times==undefined)times=1;
        var width=$(window).width();
        var num= 4,tX=20,tY=25;
        if(width>=640){
            num=4;
        }else if(width<640&&width>500){
            num=3;
        }else if(width<=500&&width>100){
            num=2;
        }
        var arr=obj.src.split('/');
        var index=(arr[arr.length-1]).replace('.jpg','');
        var translateX;
        if(index%num==1){
            if(isMobile()&&obj.style['zIndex']==10){
                translateX='translateX('+Math.ceil(((obj.clientWidth+parseFloat($(obj).css('border-width'))*2-parseFloat($(obj).css('margin-left')))/4))+'px)';
            }else{
                translateX='translateX('+(tX*times)+'%)';
            }
        }else if(index%num==0){
            if(isMobile()&&obj.style['zIndex']==10){
                translateX='translateX(-'+Math.ceil(((obj.clientWidth+parseFloat($(obj).css('border-width'))*2-parseFloat($(obj).css('margin-left')))/4))+'px)';
            }else{
                translateX='translateX(-'+(tX*times)+'%)';
            }
        }else{
            translateX='';
        }

        var translateY,imgLen=$('img').length;
        if(imgLen%num!=0){
            imgLen=imgLen+num-imgLen%num;
        }
        if(index<=num){
            if(isMobile()&&obj.style['zIndex']==10){
                translateY='translateY('+((obj.clientHeight+parseFloat($(obj).css('border-width'))*2)/4)+'px)';
            }else{
                translateY='translateY('+(tY*times)+'%)';
            }
        }else if(index>(imgLen-num)){
            if(isMobile()&&obj.style['zIndex']==10){
                translateY='translateY(-'+((obj.clientHeight+parseFloat($(obj).css('border-width'))*2)/4)+'px)';
            }else{
                translateY='translateY(-'+(tY*times)+'%)';
            }
        }else{
            translateY='';
        }

        return ' '+translateX+' '+translateY;

    };

    var isMobile=function(){
        return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
    }
};