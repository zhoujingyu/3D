$(function(){
    var lazyLoad=new LazyLoad();
    var currentPage=0,loading=false;
    var sort='*';
    $('#goTop').on('click',function(){
        $(document).scrollLeft(0);
        $range.val(0);
    });

    $('#goBottom').on('click',function(){
        $(document).scrollLeft($(document).width());
        $range.val(1000);
    });

    var $range=$('#range');
    var max=$range.attr('max');
    var setRangeVal=function(){
        $range.val(max*($(document).scrollLeft()/($(document).width()-$(window).width())));
    };
    setRangeVal();
    $range.on('input',function(){
        $(document).scrollLeft(($(document).width()-$(window).width())*($(this).val()/max));
        getNextPage();
    });

    //滚轮滚动窗口
    var step=40;
    window.onwheel=function(e){
        rangeScroll(e);
        getNextPage();
    };

    $(document).on('scroll',function(e){
        if(isMobile()){
            rangeScroll(e);
            getNextPage();
        }
    });

    var $mainTop=$('#mainTop'),$mainBottom=$('#mainBottom');
    var getNextPage=function(){
        if(loading)return false;
        if(($(document).scrollLeft()+$(window).width()+10)<$(document).width())return false;
        $.ajax({
            type:'get',
            url:'/getPicture',
            data:{
                sort:sort,
                pageNo:currentPage+1
            },
            dataType:'JSON',
            beforeSend:function(){
                loading=true;
            },
            success:function(data){
                var tmp,len=data.length,i=0;//=buildList(data);
                if(len>0){
                    var id=setInterval(function(){
                        if(i>=len){
                            loading=false;
                            currentPage++;
                            lazyLoad.collectCanLoadImg();
                            setRangeVal();
                            clearInterval(id);
                        }else{
                            tmp=buildList(data[i]);
                            if($mainTop.width()==0||$mainTop.width()<=$mainBottom.width()){
                                $mainTop.append(tmp);
                            }else{
                                $mainBottom.append(tmp);
                            }
                            i++;
                        }
                    },50);
                }else{
                    loading=false;
                }
            },
            error:function(){
                loading=false;
                console.log('连接错误');
            }
        })
    };

    var buildList=function(data){
        return '<div class="img-box">'+
            '<div class="title">'+
            '<table><tbody><tr><td><p>'+data.count+'张-'+data.title+'</p></td></tr></tbody></table>'+
            '</div>'+
            '<a href="/pictureWall/'+data.id+'">'+
            '<div class="img-path-box"><img src="/img/common/loading.png" data-src="'+data.path+'1.jpg" class="img-path"></div>'+
            '</a></div>';
    };

    var rangeScroll=function(e){
        e=event||window.event;
        var scrollLeft=$(document).scrollLeft();
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                $(document).scrollLeft(scrollLeft-step);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                $(document).scrollLeft(scrollLeft+step);
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向上滚动时
                $(document).scrollLeft(scrollLeft-step);
            }
            if (e.detail< 0) { //当滑轮向下滚动时
                $(document).scrollLeft(scrollLeft+step);
            }
        }
        $range.val(max*($(document).scrollLeft()/($(document).width()-$(window).width())));
    };

    var isMobile=function(){
        return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
    };
    getNextPage();

    var getRGB=function(){
        return {
            r:Math.floor(Math.random()*256),
            g:Math.floor(Math.random()*256),
            b:Math.floor(Math.random()*256)
        }
    };

    var $sort=$('#sort'),$sortChild=$('.sort-child'),sortLen=$sortChild.length;
    var sortListShow=false;
    var showSort=function(){
        for(var i=0;i<sortLen;i++){
            var s=getXY(sortLen,i+1,4,2,70,0,0);
            var k=getRGB();
            $($sortChild[i]).css({
                'opacity':'1',
                'transform': 'translate('+ s.x+'px,'+ (-s.y)+'px)',
                'background-color':'rgba('+ k.r+','+ k.g+','+ k.b+',.8)'
            });
        }
    };
    var hideSort=function(){
        for(var i=0;i<sortLen;i++){
            $($sortChild[i]).attr('style','display:\'none\'');
        }
    };

    $sort.on('click',function(){
        if(sortListShow){
            sortListShow=false;
            if(sortLen>0){
                hideSort();
            }
        }else{
            sortListShow=true;
            showSort();
        }


    });

    //len分类总长度，index当前索引，firstNum第一圈分类个数，step每一圈增加分类个数，r半径，baseX、baseY原点
    var getXY=function(len,index,firstNum,step,r,baseX,baseY){
        var x=0,y=0;
        //先知道一共有多少圈，
        var tmpLen=len,k= 0,position={x:0,y:0};
        while(tmpLen>0){
            tmpLen=tmpLen-(firstNum+k*step);
            k++;
        }

        //然后得到当前索引在第几圈
        for(var i=1;i<=k;i++){
            if(index<=firstNum*i+step*(i-1)*i/2){
                position.x=i;
                break;
            }
        }

        //得到这圈一共应有分类个数
        var circleNum=firstNum+step*(position.x-1);

        //再得到在这圈的第几个
        position.y=circleNum-(firstNum*position.x+step*(position.x-1)*position.x/2-index);

        //当前索引的真实半径
        var realr=r*position.x;

        //水平向右为x轴正方向
        //当前索引相对原点的角度
        var angle=180/(circleNum-1)*(position.y-1);

        position.x=Math.floor(realr*Math.sin(angle/180*Math.PI));
        position.y=Math.floor(realr*Math.cos(angle/180*Math.PI));

        return {
            x:position.x,
            y:position.y
        }
    };

    $('#sortBox').on('click','.sort-child',function(){
        if(loading)return false;
        var key=$(this).attr('data-key');
        if(sort!=key){
            sort=key;
            currentPage=0;
            $mainTop.html('');
            $mainBottom.html('');
            getNextPage();
        }
    });
});