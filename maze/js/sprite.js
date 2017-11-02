/**
 * @author wyq
 */
/**
 * 精灵类
 * @param {String} canvasId canvasid
 * @param {Number} m 横格数目
 * @param {Number} n 竖格数目
 * @param {Number} size 格子大小
 * @author wyq
 */
function Sprite(canvasId,m,n,gridSize,imgSize){
	this.moveStep = 2;//运动步长
	//多少个格子
	this.WIDTH = m;
	this.HEIGHT = n;
	//设置当前所在格子位置
    this.x = 0;
	this.y = 0;
	//设置fps
	this.fps = this.slowFPS = 5;
	this.fastFPS = 55;
	//当前方向是向this.curDir方向运动
	this.curDir = 'S';
	this.timer;//计时器
	
	this.imgObj = null;//img对象
	this.imgSize = imgSize || 18;
	this.gridSize = gridSize || 32;//每个格子大小
	
	//canvas相关
	this.canvas = document.getElementById(canvasId);
	//设置canvas宽高
    var w = m * this.gridSize, h = n * this.gridSize;
	this.canvas.setAttribute('width', w);
    this.canvas.setAttribute('height', h);
//	this.canvas.style.border = '4px solid #000';
	
    this.ctx = this.canvas.getContext('2d');
	//移动相关
	this.moveStack = [];
	this.moveing = false;
	this.moveNum = 0;
	this.dy = 0;
	this.dx = 0;
	
	this.sayTimeout=0;//说话最终结束时间
	this.word = '';
	
	this.init();
	this.index = 0;//动画索引，0,1
	
	this.fixed = (this.gridSize-this.imgSize)/2;
	
	this.ctx.translate(this.fixed,this.fixed);
}
Sprite.prototype = {
	constructor:Sprite,
	img:'sprite.png',//图片地址
	/**
     * 动画帧
     */
    frames:{
        N:[[0,0,32,32],[1*32,0,32,32]],
        S:[[8*32,0,32,32],[9*32,0,32,32]],
        W:[[12*32,0,32,32],[13*32,0,32,32]],
        E:[[4*32,0,32,32],[5*32,0,32,32]]
    },
    /**
     * 转向帧
     */
    turnFrames:{
        NE:[[2*32,0,32,32],[3*32,0,32,32]],
        ES:[[6*32,0,32,32],[7*32,0,32,32]],
        SW:[[10*32,0,32,32],[11*32,0,32,32]],
        WN:[[14*32,0,32,32],[15*32,0,32,32]]
    },
	/**
     * 转向计算横坐标变化数值
     */
    DX:{
        E:1,W:-1,S:0,N:0
    },
    /**
     * 转向计算纵坐标变化数值
     */
    DY:{
        E:0,W:0,S:1,N:-1
    },
	/**
	 * 入口文件
	 */
	init:function(){
		this.imgObj = new Image();
		this.imgObj.src = this.img;
	},
	/**
	 * 动画
	 * 使用setTimeout方便调节fps
	 */
	animate:function(){
		var t = this;
		this.clear();
		//console.log('fps',this.fps);
		
		this.timer = setTimeout(function(){
			t.updateFrame.call(t);
			t.animate.call(t);
		},1E3/this.fps);
	},
	/**
	 * 清除计时器
	 */
	clear:function(){
		this.timer && clearTimeout(this.timer);
	},
	/**
	 * 运动方向
	 * @param {Object} dir
	 */
	goDir:function(dir){
		var x = this.x + this.DX[dir],
		    y = this.y + this.DY[dir];
		this.moveTo(x,y); 
	},
	/**
	 * 运动函数
	 * =============> 只用于相邻格子之间运动！
	 * @param {Object} x 横坐标
	 * @param {Object} y 纵坐标
	 */
	moveTo:function(x,y){
		
		var dx,dy,dir,arr;
		//从运动栈中取出最后一个
		arr = this.moveStack[this.moveStack.length-1];
		
		if (arr) {
			//存在，则以运动栈最后一个格子为参考，计算运动方向
            dx = x - arr[2];
            dy = y - arr[3];
		}else{
			//没有，则以当前格子为参考计算运动方向
			dx = x - this.x;
            dy = y - this.y;
		}
		
		//根据格子计算运动方向
		//南面 S
        if(dx===0 && 1===dy){
            dir = 'S';
        }else if(dx===0 && -1 === dy){
			dir = 'N';
		}else if(dx === 1 && dy ===0){
			dir = 'E';
		}else if(dx ===-1 && dy===0){
			dir = 'W';
		}
		if(!dir){
			return;
		}
		//计算结果压入运动栈
		this.moveStack.push([dx,dy,x,y,dir]);
		//判断出栈
		this.doMove();
		//链式
		//return arguments.callee;
	},
	/**
	 * 判断出栈
	 */
	doMove:function(){
		if(this.moveNum){
			//说明正在运动，所以返回
			return;
		}
		//出栈
		var arr = this.moveStack.shift();
		if(!arr){
			//没有内容，则直接返回
			return;
		}
		
		this.dx = arr[0];
		this.dy = arr[1];
		this.x = arr[2];
		this.y = arr[3];
		this.curDir = arr[4];
		
		this.moveNum += this.gridSize;
		//this.updateFrame();
	},
	/**
	 * 清除格子
	 */
	clearGrid:function(){
		var width = this.WIDTH*this.gridSize,
		  height = this.HEIGHT*this.gridSize;
		
		this.ctx.clearRect(-100,-100,width,height);
	},
	/**
	 * 停止运动
	 */
	stopMove:function(){
		this.moveStack.length = 0;
	},
	/**
	 * 更新帧0
	 */
	updateFrame: function(){
		this.index++;
		if (this.index === 2) {
			this.index = 0;
		}
		
        this.clearGrid();
		
		if(this.moveNum){
			//当前正在运动
			this.moveNum--;
			this.ctx.translate(this.dx,this.dy);
			this.fps = this.fastFPS; 
		}else{
			this.moveNum = 0;
			//当前静止，原地踏步吧
			this.fps = this.slowFPS;
			this.curDir = 'S';
			
		}
		this.doMove();
		
		var frame = this.frames[this.curDir][this.index];
		//更新画布内容
		var ctx = this.ctx;
		
		ctx.drawImage(this.imgObj, frame[0], frame[1], frame[2], frame[3], 0, 0, this.imgSize, this.imgSize);
		
		if(this.sayTimeout>+new Date && this.word!==''){
			ctx.font = 'normal 10px';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(this.word,0,0);
		}
	},
	/**
	 * 说话
	 * @param {Object} word
	 */
	say:function(word){
		this.word = word;
		this.sayTimeout = 3E3+(+new Date);//时间为三秒
	},
	clearSay:function(){
		this.sayTimeout = 0;
		this.word = '';
	},
	/**
	 * 获取当前所在位置
	 */
	getXY:function(){
		return [this.x,this.y];
	}
}
 