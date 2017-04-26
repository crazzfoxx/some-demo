var js_libs = {};

js_libs.miaov = {

	//function: css(obj,attr)
	//@description:
	//获取元素计算后属性值,与miaov_getStyle.js功能相同
	//区别在于返回值没有单位
	css: function(obj,attr) {
		return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr]);
	},


	//function: addClass(obj,classNameStr)
	//@description:
	//给obj添加className
	//当obj没有className时,直接添加
	//当obj原来有className时,添加' ' + className
	//当obj新添加的className与原有包含的className,不会添加

	//@require:
	//array.indexOf()在IE8以下不兼容
	addClass: function(obj,classNameStr) {
		var classNameArr = obj.className.split(' ');

		if (obj.className == '') {
			obj.className = classNameStr;
		}else {
			if (this.getExistIndex(classNameArr,classNameStr) == -1) {
				//原className不包含新的className
				obj.className += ' ' + classNameStr;
			}
			//原className包含新的className
		}
	},

	//function: removeClass(obj,classNameStr)
	//@description:
	//给obj删除className
	//当obj没有className时,直接跳出
	//当obj有className时,但没有与新className相同的项,跳出
	//当obj新添加的className与原有包含的className相同时,删除该className

	//@require:
	//array.indexOf()在IE8以下不兼容
	removeClass: function(obj,classNameStr) {
		var classNameArr = obj.className.split(' ');

		if (obj.className != '') {
			var classNameIndex = this.getExistIndex(classNameArr,classNameStr);

			if (classNameIndex != -1) {
				classNameArr.splice(classNameIndex,1);
				obj.className = classNameArr.join(' ');
			}
		}
	},

	getExistIndex: function(classNameArr,classNameStr) {
		var index = classNameArr.indexOf(classNameStr);
		if (index != -1) {
			return index;
		}else{
			return -1;
		}
	},

	//function: mTween(obj,attr,target,duration,fx,callback)

	//@description:
	//obj:运动对象
	//attr:操作属性
	//target:属性改变目标值
	//duration:运动时间
	//fx:运动方式
	//callback:回调函数

	//@require:
	//需要引入tween.js获得属性值
	//需要引入miaov_css.js
	mTween: function(obj,attr,target,duration,fx,callback) {
		//获取起始位置
		var begin;

		if (attr == 'opacity') {
			//获取起始位置
			var begin = this.css(obj,attr) * 100;
		}else {
			//获取起始位置
			var begin = this.css(obj,attr);
		}

		//计算运动距离
		var count = target - begin;

		//获得参考时间
		var iNow = +new Date();

		//将_this指向当前命名空间
		var _this = this;

		//启动定时器
		var timer = setInterval(function() {
			//获取当前时间
			var iNew = +new Date();
			//计算时间差
			var t = iNew - iNow;
			//判断终止条件
			if (t >= duration) {
				clearInterval(timer);
				t = duration;
			}

			//根据运动方式计算新的属性值
			var value = _this.Tween[fx](t,begin,count,duration);
			//修改操作对象属性值
			if (attr == 'opacity') {
				obj.style[attr] = value / 100;
			}else {
				obj.style[attr] = value + 'px';
			}

			//调用回调函数
			if (t == duration) {
				callback && callback();
			}
		},30);
	},

	//基于tween.js
	//在某运动方程,通过(t,c,b,d)计算obj在当前时间应该在的位置
	//t: 已过时间 (e.g. var t = +new Date() - date;)
	//c: count 改变值得间隔
	//b: begin 属性改变起始点 (e.g. var begin = css(obj.attr))
	//d: duration 整个动作时间 

	/*
	* t : time 已过时间
	* b : begin 起始值
	* c : count 总的运动值
	* d : duration 持续时间
	*
	* 曲线方程
	*
	* http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
	* */

	//Tween.linear();

	Tween:{
		linear: function (t, b, c, d){  //匀速
			return c*t/d + b;
		},
		easeIn: function(t, b, c, d){  //加速曲线
			return c*(t/=d)*t + b;
		},
		easeOut: function(t, b, c, d){  //减速曲线
			return -c *(t/=d)*(t-2) + b;
		},
		easeBoth: function(t, b, c, d){  //加速减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInStrong: function(t, b, c, d){  //加加速曲线
			return c*(t/=d)*t*t*t + b;
		},
		easeOutStrong: function(t, b, c, d){  //减减速曲线
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t*t*t + b;
			}
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
			if (t === 0) { 
				return b; 
			}
			if ( (t /= d) == 1 ) {
				return b+c; 
			}
			if (!p) {
				p=d*0.3; 
			}
			if (!a || a < Math.abs(c)) {
				a = c; 
				var s = p/4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
			if (t === 0) {
				return b;
			}
			if ( (t /= d) == 1 ) {
				return b+c;
			}
			if (!p) {
				p=d*0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},    
		elasticBoth: function(t, b, c, d, a, p){
			if (t === 0) {
				return b;
			}
			if ( (t /= d/2) == 2 ) {
				return b+c;
			}
			if (!p) {
				p = d*(0.3*1.5);
			}
			if ( !a || a < Math.abs(c) ) {
				a = c; 
				var s = p/4;
			}
			else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			if (t < 1) {
				return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
						Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			}
			return a*Math.pow(2,-10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
		},
		backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
			if (typeof s == 'undefined') {
			   s = 1.70158;
			}
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}, 
		backBoth: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158; 
			}
			if ((t /= d/2 ) < 1) {
				return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			}
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
			return c - Tween['bounceOut'](d-t, 0, c, d) + b;
		},       
		bounceOut: function(t, b, c, d){//*
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
			}
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		},      
		bounceBoth: function(t, b, c, d){
			if (t < d/2) {
				return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
		}
	},

	shakeObj: function(obj,attr,callback) {
		//清除上一个定时器
		clearInterval(obj.shake_timer);
		// obj.isStatic = null;

		//初始化抖动变量
		obj.INIT_TARGET = this.css(obj,attr);
		obj.distArr = [];
		for(var i=20;i>=0;i-=2){
			obj.distArr.push(i,-i);
		}
		obj.distArr.push(0);
		obj.jumpTime = 0;

		//开新定时器抖动
		obj.shake_timer = setInterval(function(){
			obj.style[attr] = obj.INIT_TARGET + obj.distArr[obj.jumpTime] + 'px';
			obj.jumpTime++;
			if(obj.jumpTime === obj.distArr.length){
				clearInterval(obj.shake_timer);
				obj.jumpTime = 0;
				obj.isStatic = true;
				callback && callback();
			}
		},30);
	},

	fadeObj: function(obj,target,duration,fx,callback) {
		var begin = this.css(obj,'opacity') * 100;
		var count = target - begin;

		var iNow = +new Date();

		var _this = this;

		var fade_timer = setInterval(function() {
			var t = +new Date() - iNow;
			if (t > duration) {
				clearInterval(fade_timer);
				t = duration;
			}

			var value = _this.Tween[fx](t,begin,count,duration)
			obj.style.opacity = value / 100;

			if (t == duration) {
				callback && callback();
			}
		}, 20);
	},

	mTweenPlus: function(obj,attrs,callback) {
		var _this = this;

		var options = {};
		var max = 0;
		for (var attr in attrs) {
			options[attr] = {};
			for (var att in attrs[attr]) {
				options[attr][att] = attrs[attr][att];
			}
			
			if (attr == 'opacity') {
				options[attr].begin = css(obj,attr) * 100;
			}else {
				options[attr].begin = css(obj,attr);
			}

			options[attr].count =  options[attr].target - options[attr].begin;

			if (max < options[attr].duration) {
				max = options[attr].duration;
			}
		}

		var date = +new Date();

		var timer = setInterval(function() {
			var t = +new Date() - date;

			for (var attr in options) {
				options[attr].t = +new Date() - date;

				if (options[attr].t >= options[attr].duration) {
					options[attr].t = options[attr].duration;
				}

				var value = _this.Tween[options[attr].fx](options[attr].t,options[attr].begin,options[attr].count,options[attr].duration);

				if (attr == 'opacity') {
					obj.style[attr] = value / 100;
				}else {
					obj.style[attr] = value + 'px';
				}

				if (options[attr].t == options[attr].duration) {
					options[attr].callback && options[attr].callback();
					options[attr].callback = null;
				}
			}

			if (t >= max) {
				clearInterval(timer);
				callback && callback();
			}
		},20);
	}
}

js_libs.self = {

	//function: bubbleSort(arr)
	//description:
	//冒泡排序arr,
	//返回值为冒泡后的arr
	bubbleSort: function(arr) {
		var len = arr.length-1;
		var temp;

		while (len > 0) {
			for (var i=0;i<len;i++) {
				if (arr[i] > arr[i+1]) {
					temp = arr[i];
					arr[i] = arr[i+1];
					arr[i+1] = temp;
				}
			}
			len--;
		}

		return arr;
	},

	//function: quickSort(arr)
	//description:
	//快速排序arr
	//返回值为排序后arr
	quickSort: function(arr) {
		if (arr.length <= 1) {
			return arr;
		}

		var pivotIndex = Math.floor(arr.length / 2);
		var pivot = arr.splice(pivotIndex,1)[0];

		var left = [];
		var right = [];

		for (var i=0;i<arr.length;i++) {
			if (arr[i] <= pivot) {
				left.push(arr[i]);
			}else {
				right.push(arr[i]);
			}
		}

		return quickSort(left).concat(pivot,quickSort(right));
	}
}
