$(function(){
    var id=$('title').text();
    $.ajax({
        type:'get',
        url:'/getPicById',
        data:{
            id:id
        },
        dataType:'json',
        success:function(data){
            new Create3D(data);
        },
        error:function(){
        console.log('失败')
        }
    })
});
/**
 *
 * @param data
 * @constructor
 */
function Create3D(data){
    this.data=data[0];
    this.type=['Circle','Cube'];//3d类型
    this.sides=[0,6];//3d类型对应的边数,0为不确定边数
    this.start();
    //this.move();
}
//分发
Create3D.prototype.start=function() {
    var t= 0,sides= 0;
    if(this.data.count<3){//当总图片数少于4张时，采取另外的显示方式
        console.log('当总图片数少于4张时，采取另外的显示方式');
    }else{
        for(var i=1;i<=this.data.count;){
            if(this.data.count-i+1<3){//当剩余图片数少于4张时，采取另外的显示方式
                console.log('当剩余图片数少于4张时，采取另外的显示方式:'+(this.data.count-i+1));
                break;
            }else if(this.data.count-i+1<=6){//当剩余图片数>=4,<=6张时，采取Circle显示方式
                sides=this.data.count-i+1;
                this['create'+this.type[t-1]](sides,this.random(240,280),this.data.path,this.data.type,i);
            }else{//当剩余图片数>6张时，采取多种显示方式
                t=this.random(1,this.type.length);//随机产生一种3d类型
                //t=1;
                sides=this.sides[t-1]==0?this.random(3,this.data.count-i+1>=12?12:this.data.count-i+1):this.sides[t-1];
                this['create'+this.type[t-1]](sides,this.random(240,280),this.data.path,this.data.type,i);
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
 * @param picType 图片类型，jpg/png
 * @param start 第一张图片序号
 */
Create3D.prototype.createCircle=function(sides,width,path,picType,start){
    var deg=parseFloat((360/sides).toFixed(4));//角度
    var r=Math.floor((width/2)/(Math.tan(deg/2/180*Math.PI)));//围成近似圆的形状的内圆的半径
    var img="<img src='"+path+"#replaceNo#."+picType+"' style='#transfrom#'>",imgTmp='';
    var transform,translateX,translateZ,rotateY;
    for(var i=1;i<=sides;i++){
        translateX=r*(Math.sin(deg*(i-1)/180*Math.PI));
        translateZ=r*(Math.cos(deg*(i-1)/180*Math.PI));
        rotateY=(i-1)*deg;
        transform='transform:translate3d('+translateX+'px,0,'+translateZ+'px) rotateY('+rotateY+'deg)';
        imgTmp+=img.replace('#replaceNo#',start+(i-1)).replace('#transfrom#',transform);
    }
    var transform3d='translateX(-'+(width/2)+'px) translateY(0) translateZ(-'+r+'px)';
    var div='<div class="wrapper3D">'+
        '<div class="circle3D" style="width:'+width+'px;transform:'+transform3d+'">'+
        '<div class="circle3Ds" data-sides="'+sides+'" data-width="'+width+'">'+imgTmp+'</div>'+
        '</div>'+
        '</div>';
    $('body').append(div);
    this.setRoom(r,15,transform3d);
};

/**
 * 正方体
 * @param sides
 * @param width
 * @param path
 * @param picType
 * @param start
 */
Create3D.prototype.createCube=function(sides,width,path,picType,start){
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
    var imgTmp='';
    for(var i=1;i<=sides;i++){
        imgTmp+='<img src="'+path+(start+(i-1))+'.'+picType+'" style="width:'+width+'px;height:'+width+'px;transform:'+translateX[i-1]+' '+translateZ[i-1]+' '+rotate[i-1]+'">';
    }
    var transform3d='translateX(-'+(width/2)+'px) translateY(0) translateZ(-'+r+'px)';
    var div='<div class="wrapper3D">'+
        '<div class="cube3D" style="width:'+width+'px;transform:'+transform3d+'">'+
        '<div class="cube3Ds" style="width: '+width+'px;height:'+width+'px">'+imgTmp+'</div>'+
        '</div>'+
        '</div>';
    $('body').append(div);
    this.setRoom(r,90,transform3d);
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
            //$3d.children().css('transform',transform3d.replace('translateY(0px)','translateY(-'+(maxH/2)+'px)'));
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