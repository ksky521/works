/**
 * @author wyq
 */

function Maze(canvasId, m, n, size){
	var borderWidth = 3,halfBorderWidth = borderWidth/2;//外边框宽度
	
	this.gridSize = size || 10;//设置单个格子大小
	//设置共多少格子
	this.WIDTH = m;
	this.HEIGHT = n;
	
	this.grid = [];//为访问数组，为了快速使用gridObj 和grid一维数组配合使用
	this.visitedObj = {};//访问过的对象
	this.stackArr = [];//出栈结果
	this.stackObj = {};//出栈对象
	
	this.nGridArr = [];//即将访问的数组
	this.nGridObj = {};//即将访问的对象
	//canvas
	this.canvas = document.getElementById(canvasId);
	//设置canvas宽高，填充颜色
	var w = m * this.gridSize + borderWidth*2, h = n * this.gridSize + borderWidth*2;
	//设置canvas宽高
	this.canvas.setAttribute('width', w);
	this.canvas.setAttribute('height', h);
//	this.canvas.style.border = '4px solid #F60';
//	this.canvas.style.padding= '10px';
	
	
	var ctx = this.ctx = this.canvas.getContext('2d');
	ctx.fillStyle = '#f5f5f5';//背景颜色
	ctx.fillRect(0, 0, w, h);//填充背景
	
	this.drawLine([0,halfBorderWidth],[w,halfBorderWidth],'#999999',borderWidth);//上
	this.drawLine([halfBorderWidth,0],[halfBorderWidth,h],'#999999',borderWidth);//左
	this.drawLine([w-halfBorderWidth,0],[w-halfBorderWidth,h ],'#999999',borderWidth);//右
	this.drawLine([0,h-halfBorderWidth],[w-this.gridSize-halfBorderWidth,h-halfBorderWidth],'#999999',borderWidth);//下
	ctx.translate(borderWidth,borderWidth);
	
	this.init();
}
Maze.prototype = {
	constructor:Maze,
	/**
	 * 反方向关系组
	 */
	OPPOSITE: {
        E:'W',W:'E',N:'S',S:'N'
    },
	/**
	 * 位移大小关系
	 */
	bit: {
        N:1,S:4,E:2,W:8
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
	 * 画线时，四条边位置计算
	 */
	LINEDIR: {
        E:[[1,0],[1,1]],
        W:[[0,0],[0,1]],
        S:[[0,1],[1,1]],
        N:[[0,0],[1,0]]
    },
	/**
	 * 入口文件
	 * 循环得到this.grid数组
	 */
	init:function(){
		var t = this,temp;
        for (var m = 0; m < this.WIDTH; m++) {
            for (var n = 0; n < this.HEIGHT; n++) {
                temp = [m,n].join(',');
				t.grid.push(temp);
            }
        }
	},
	/**
	 * 是否为起点
	 * @param {Object} poi
	 */
	isStart:function(poi){
		return poi[0]===0 && poi[1]===0;
	},
	/**
	 * 是否为终点
	 * @param {Object} poi
	 */
	isEnd:function(poi){
		return poi[0] === this.WIDTH-1 && poi[1] === this.HEIGHT - 1;
	},
	/**
	 * 创建迷宫
	 */
	create:function(){
		var temp,tArr,tObj;
	    temp = this.grid.splice(random(0,this.grid.length-1),1)[0];
		temp = temp.split(',');
		//随机选取第一个点
		//寻找
		this.doSearch(temp);
		//判断临近点数组是否为空，不为空继续寻找，直至所有的点都访问过
		while(!this.isEmpty()){
			
			//temp = this.nGridArr.shift();
			temp = this.nGridArr.splice(random(0,this.nGridArr.length-1),1)[0];
			if(this.isVisited(temp)){
				continue
			}
			this.walkTo(temp);
		}
		//清除大数组，释放内存,只留 this.stackObj
		this.grid.length = 0;
		this.visitedObj = {};
		
		this.display();
	},
	/**
	 * 显示迷宫
	 */
	display:function(){
		var t = this,
		  arr = t.stackArr,
		  v,m,n,dx1,dy1,dx2,dy2,
		  a,arrTemp;
		
		while(a = arr.shift()){
			arrTemp = a.split(',');//点
            v = t.stackObj[a];
            m = +arrTemp[0];
            n = +arrTemp[1];
            
            'E S W N'.replace(/\S+/g, function(dir){
                if (!(v & t.bit[dir])) {
                    dir = t.LINEDIR[dir];
                    dx1 = m + dir[0][0];
                    dy1 = n + dir[0][1];
                    dx2 = m + dir[1][0];
                    dy2 = n + dir[1][1];
                    t.drawGrid([dx1,dy1],[dx2,dy2]);
                }
            });
		}  
	},
	/**
	 * 运动到
	 * @param {Object} b
	 */
	walkTo:function(b){
		var a,dir,tArr,tObj;
		tObj = this.nGridObj[''+b];//walk的a点，dir

        a = [tObj[0],tObj[1]];
        dir = tObj[2];
        
        this.walk(a,b,dir);
		
		this.doSearch(b); 
	},
	/**
	 * 标记为已经访问过
	 * @param {Array} a 点数组
	 */
	mark:function(a){
		var str = ''+a;
		//压入访问过的栈
		this.stackArr.push(str);
		this.stackObj[str] = this.stackObj[str]?this.stackObj[str]:0;//设置此点图形状态

		//标注未已经访问过了
		this.visitedObj[str] = 1;
		
		//从将要访问的栈中删除
		var temp = this.nGridObj[str];
		if(!temp){
			return;
		}
		this.nGridArr.splice(temp[3],1);
		delete this.nGridObj[str];
	},
	/**
	 * 随机搜索下一点，递归，直至周围点没有合适的
	 * @param {Object} a
	 */
	doSearch:function(a){
		this.mark(a);//标注为已经访问
        
		var arr = this.getNeighbor(a),
		  len = arr.length,
		  temp,dir,
		  nextPoi;
		//根据点获取的未访问的临近点，进行递归，直至在点周围找不到未访问的临近点
		while (arr.length) {
			//随机取一个
			nextPoi = arr.splice(random(0, arr.length - 1))[0];
			
			if (!nextPoi) {
				continue;
			}
			
			//去除最后一个N，S，W，E
			dir = nextPoi.pop();
			//是否访问过
			if (this.isVisited(nextPoi)) {
				continue;
			}
			temp = [nextPoi[0], nextPoi[1]];
			
			this.walk(a,temp,dir);
			//递归
			this.doSearch(temp);
		}
	},
	/**
	 * 从a运动到b点，方向dir
	 * @param {Array} a 开始点坐标数组
	 * @param {Array} b 运动到的点坐标数组
	 * @param {String} dir a→b的运动方向
	 */
	walk:function(a,b,dir){
		
		this.stackObj[a] += this.bit[dir];//当前点 加 位
		this.stackObj[b] = this.stackObj[b]?this.stackObj[b]:0;
		this.stackObj[b] += this.bit[this.OPPOSITE[dir]]; //下一个运动到的点 加 位
		//最后一个开南边口
		if(this.isEnd(b)){
//            console.log('end',b);
            this.stackObj[b] += this.bit.S;
        }
	},
	/**
	 * 该点是否访问过
	 * @param {Array} poi 点坐标数组
	 */
	isVisited:function(poi){
		return ((''+ poi) in this.visitedObj);
	},
	/**
	 * nGridArr判断是否为空
	 */
	isEmpty: function(){
		return this.nGridArr.length === 0;
	},
	/**
	 * 从this.grid 和this.gridObj对象中删除
	 * @param {Object} poi
	 */
	deletePoi: function(poi){
		poi = '' + poi;
		var key = this.gridObj[poi];
		
		if (delete this.gridObj[poi]) {
			this.grid.splice(key, 1);
		}
		return this.grid.length;
	},
	/**
	 * 获取此点没有访问过的临近点
	 * @param {Array} poi 点坐标数组
	 */
	getNeighbor: function(poi) {
		
        var x = +poi[0], y = +poi[1], arr = [];
        var t = this, dx, dy, temp,len;
		
        'E S W N'.replace(/\S+/g, function(dir) {
            dx = x + t.DX[dir];
            dy = y + t.DY[dir];
            //如果没有访问过，并且在格子里面，则压入即将访问临近点的栈
            if (!t.isVisited([dx, dy]) && t.inGrid([dx, dy])) {
				temp = [dx, dy];
				arr.push([dx,dy,dir]);
				len = t.nGridArr.push(temp);
				t.nGridObj[temp] = [x,y,dir,--len];//存下出发点坐标和出发点到此点的方向
				//console.log(temp,t.nGridObj[temp]);
			}
        });
        return arr;
    },
	/**
	 * 判断该点是否在视野内
	 * @param {Object} poi
	 */
	inGrid:function(poi){
		var x = +poi[0], y = +poi[1];
		
		if(x>=0 && y>=0 && y< this.HEIGHT && x<this.WIDTH){
			return true;
		}
		return false;
	},
	/**
	 * 画格子
	 * @param {Object} a 起点坐标
	 * @param {Object} b 重点坐标
	 * @param {Object} color 颜色值
	 * @param {Object} width 宽度
	 */
    drawGrid: function(a, b, color, width) {
		
		//需要加上单个格子的宽度
        var x1 = a[0] * this.gridSize, y1 = a[1] * this.gridSize;
        var x2 = b[0] * this.gridSize, y2 = b[1] * this.gridSize;
        
        this.drawLine([x1,y1],[x2,y2],color,width);
    },
	/**
	 * 画线
	 * @param {Object} a
	 * @param {Object} b
	 * @param {Object} color
	 * @param {Object} width
	 */
	drawLine:function(a,b,color,width){
		color = color || '#333333';
        width = width || .5;
		
		var x1 = a[0],y1 = a[1],x2 = b[0],y2 = b[1];
		var ctx = this.ctx;
        ctx.strokeStyle = color;
        // 设置画笔粗细
        ctx.lineWidth = width;
        
        // 开始路径
        ctx.beginPath();
        // 画笔移动到起始点
        ctx.moveTo(x1, y1);
        // 画一条直线到点(x2, y2)
        ctx.lineTo(x2, y2);
        // 调用了这个方法后，线条才会真正出现在画布上
        ctx.stroke();
        // 关闭路径
        ctx.closePath();
	}
}

function random(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
}