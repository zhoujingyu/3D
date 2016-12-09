$(function(){
    var id=$('title').text();
    //$.ajax({
    //    type:'get',
    //    url:'/getPicById',
    //    data:{
    //        id:id
    //    },
    //    dataType:'json',
    //    success:function(data){
    //        new Create3D(data);
    //    },
    //    error:function(){
    //    console.log('失败')
    //    }
    //})
    var data=[{
        type:'jpg',
        count:98,
        path:'/img/car/'
    }];
    new Create3D(data);
});
/**
 *
 * @param data
 * @constructor
 */
function Create3D(data){
    this.data=data[0];
    this.type=['Circle','Cube','Book'];//3d类型
    this.sides=[-1,6,1];//3d类型对应的边数,0为不确定边数
    this.start();
    //this.move();
}
//分发
Create3D.prototype.start=function() {
    var t= 0,sides= 0,remain=-1;
    if(this.data.count<3){//当总图片数少于4张时，采取另外的显示方式
        console.log('当总图片数少于3张时，采取另外的显示方式');
        for(var j=0;j<this.data.count;j++){
            this.createBook(1,this.random(300,500),this.data.path,j+1);
        }
    }else{
        for(var i=1;i<=this.data.count;){
            remain=this.data.count-i+1;
            if(remain<3){//当剩余图片数少于4张时，采取另外的显示方式
                console.log('当剩余图片数少于3张时，采取另外的显示方式:'+(this.data.count-i+1));
                sides=remain;
                for(var k=0;k<remain;k++){
                    this.createBook(1,this.random(300,500),this.data.path,k+1);
                }
                break;
            }else if(remain<=5){ //当剩余图片数>=3,<=5张时，采取Circle显示方式
                sides=remain;
                this['create'+this.type[0]](sides,this.random(240,280),this.data.path,i);
            }else{//当剩余图片数>=6张时，采取多种显示方式
                t=this.random(1,this.type.length);//随机产生一种3d类型
                sides=this.sides[t-1]==-1?this.random(3,this.data.count-i+1>=12?12:this.data.count-i+1):this.sides[t-1];
                this['create'+this.type[t-1]](sides,this.random(240,280),this.data.path,i);
            }
            i+=sides;
        }
    }
};
/**
 * 环
 * @param sides 圆的边数
 * @param width 每张图片的宽度
 * @param path 图片路径
 * @param start 第一张图片序号
 */
Create3D.prototype.createCircle=function(sides,width,path,start){
    var deg=parseFloat((360/sides).toFixed(4));//角度
    var r=Math.floor((width/2)/(Math.tan(deg/2/180*Math.PI)));//围成近似圆的形状的内圆的半径

    var imgArr=[];
    for(var i=0;i<sides;i++){
        imgArr.push(new Image());
        imgArr[i].src=path+(start+i)+'.'+this.data.type;
    };

    var rw=-1,rh=-1,loaded= 0,self=this;
    var transform,translateX,translateZ,rotateY;
    $(imgArr).on('load',function(){
        if(this.height>rh){
            rh=this.height;
            rw=this.width;
        }
        loaded++;
        if(loaded==sides){
            var height=Math.ceil(width*rh/rw);
            var circle3DHeight=Math.ceil(height+(r*Math.sin(deg/180*Math.PI))*2+10);
            var ImgDiv='',bgImg='',bgSize='',url='';
            for(var j=0;j<sides;j++){
                url=path+(start+j)+"."+self.data.type;
                bgImg="background-image: url('"+url+"')";
                size="width: "+width+"px;height:"+Math.ceil(width*imgArr[j].height/imgArr[j].width)+"px";
                translateX=r*(Math.sin(deg*j/180*Math.PI));
                translateZ=r*(Math.cos(deg*j/180*Math.PI));
                rotateY=j*deg;
                transform='transform:translate3d('+translateX+'px,0,'+translateZ+'px) rotateY('+rotateY+'deg)';
                ImgDiv+='<div style="'+size+';'+bgImg+';'+transform+'"></div>';
            }

            var circle3Ds=[
                'width:'+width+'px',
                'height:'+height+'px',
                'margin-left:-'+(width/2)+'px',
                'margin-top:-'+(height/2)+'px'
            ];
            circle3Ds=circle3Ds.join(';');

            var circle='<div class="circle3D" style="height: '+circle3DHeight+'px">'+
                        '<div class="circle3Ds" style="'+circle3Ds+'">'+ImgDiv+'</div>'+
                    '</div>';
            $('body').append(circle);
        }
    });
};

/**
 * 正方体
 * @param sides
 * @param width
 * @param path
 * @param start
 */
Create3D.prototype.createCube=function(sides,width,path,start){
    if(sides!=6)return false;
    var deg=90;//角度
    var r=Math.floor((width/2)/(Math.tan(deg/2/180*Math.PI)));//正方体的内球的半径
    var translateZ=['translateZ('+(r*(Math.cos(deg*(0)/180*Math.PI)))+'px)',
        'translateZ('+(r*(Math.cos(deg*(1)/180*Math.PI)))+'px)',
        'translateZ('+(r*(Math.cos(deg*(2)/180*Math.PI)))+'px)',
        'translateZ('+(r*(Math.cos(deg*(3)/180*Math.PI)))+'px)',
        'translateZ(0)',
        'translateZ(0)'];
    var translateX=['translateX('+(r*(Math.sin(deg*(0)/180*Math.PI)))+'px)',
        'translateX('+(r*(Math.sin(deg*(1)/180*Math.PI)))+'px)',
        'translateX('+(r*(Math.sin(deg*(2)/180*Math.PI)))+'px)',
        'translateX('+(r*(Math.sin(deg*(3)/180*Math.PI)))+'px)',
        'translateY('+(-r)+'px)',
        'translateY('+(r)+'px)'];
    var rotate=['rotateY(0)','rotateY(90deg)','rotateX(180deg) rotateY(180deg)','rotateX(180deg) rotateY(270deg)','rotateX(90deg)','rotateX(-90deg)'];
    var ImgDiv='',imgArr=[],url='',bgImg='',style;
    for(var i=0;i<sides;i++){
        imgArr.push(new Image());
        imgArr[i].src=path+(start+i)+'.'+this.data.type;
        style=[
            "width:"+width+"px",
            "height:"+width+"px",
            "background-image: url('"+(path+(start+i)+"."+this.data.type)+"')",
            "transform:"+translateX[i]+" "+translateZ[i]+" "+rotate[i]
        ];
        style=style.join(";");
        ImgDiv+='<div style="'+style+'"></div>';
    }

    var rw=-1,rh=-1,loaded= 0,self=this;
    $(imgArr).on('load',function(){
        if(this.height>rh){
            rh=this.height;
            rw=this.width;
        }
        loaded++;
        if(loaded==sides){
            var height=width;
            var cube3DHeight=Math.ceil(height+(r*Math.sin(deg/180*Math.PI))*2+10);

            var cube3Ds=[
                'width:'+width+'px',
                'height:'+height+'px',
                'margin-left:-'+(width/2)+'px',
                'margin-top:-'+(height/2)+'px'
            ];
            cube3Ds=cube3Ds.join(';');

            var div='<div class="cube3D" style="height:'+cube3DHeight+'px">'+
                        '<div class="cube3Ds" style="'+cube3Ds+'">'+ImgDiv+'</div>'+
                    '</div>';
            $('body').append(div);
        }
    });
};

/**
 * 书
 * @param sides
 * @param width
 * @param path
 * @param index
 */
Create3D.prototype.createBook=function(sides,width,path,index){
    var src=path+index+'.'+this.data.type;
    var img=new Image();
    img.src=src;
    img.onload=function(){
        var rw=this.width;
        var rh=this.height;
        var height=Math.ceil(width*rh/rw);
        var book3DHeight=Math.ceil(Math.sqrt(Math.pow(15,2)+Math.pow(width/2,2)+Math.pow(height/2,2))+height);
        var backgroundSize='background-size: '+(width+60)+'px '+(height+60)+'px';
        var backgroundImage="background-image: url('"+src+"')";
        var book3Ds=[
            'width:'+width+'px',
            'height:'+height+'px',
            'margin-left:-'+(width/2)+'px',
            'margin-top:-'+(height/2)+'px'
        ];
        book3Ds=book3Ds.join(';');
        var front='<div class="book3D-front" style="'+backgroundSize+';'+backgroundImage+'"></div>',
            left='<div class="book3D-left" style="'+backgroundSize+';'+backgroundImage+'"></div>',
            top='<div class="book3D-top" style="'+backgroundSize+';'+backgroundImage+'"></div>',
            right='<div class="book3D-right" style="'+backgroundSize+';'+backgroundImage+';transform: translateX('+(width-30)+'px) translateZ(-15px) rotateY(90deg)"></div>',
            back='<div class="book3D-back" style="'+backgroundSize+';'+backgroundImage+'"></div>',
            bottom='<div class="book3D-bottom" style="'+backgroundSize+';'+backgroundImage+';transform: translateY('+(height-30)+'px) translateZ(-15px) rotateX(-90deg)"></div>';

        var book='<div class="book3D" style="height: '+book3DHeight+'px">'+
                    '<div class="book3Ds" style="'+book3Ds+'">'+
                        front+left+top+right+back+bottom+
                    '</div>'+
                '</div>';
        $('body').append(book);
    };
};

/**
 * 设置一个3d区块的所占高度
 */
Create3D.prototype.setRoom=function(r,deg,transform3d){
    var $3d=$('.wrapper3D:nth-last-child(1)');
    var $img=$3d.find('img');
    var len=$img.length,maxH= 0,i=0;
    $img.on('load',function(){
        maxH=(this.clientHeight>maxH)?this.clientHeight:maxH;
        i++;
        if(i==len){
            var x=r*Math.sin(deg/180*Math.PI);
            $3d.css('height',(maxH+x*2+10)+'px');
            var a=transform3d.replace('translateY(0)','translateY(-'+(maxH/2)+'px)');
            $3d.children().css('transform',a);
        }
    });
};



/**
 *
 * @param start
 * @param end
 * @returns {number}
 */
Create3D.prototype.random=function(start,end) {
    return Math.ceil(Math.random()*(end-start+1)+(start-1))
};