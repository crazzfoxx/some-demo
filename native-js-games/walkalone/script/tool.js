//从data中找到id对应的数据
//data格式:
//data={1:[],2:[]...}
function findDataById(currentId,data) {
	for (var attr in data) {
		for (var i=0;i<data[attr].length;i++) {
			if (data[attr][i].id == currentId) {
				return data[attr][i];
			}
		}
	}
}

function findDataInCharacterItem(currentId,currentLevel,data) {
	for (var attr in data) {
		for (var i=0;i<data[attr].length;i++) {
			if (data[attr][i].id == currentId && data[attr][i].itemInfo.itemLevel == currentLevel) {
				return {
					currentData: data[attr][i],
					attr: attr,
					idx: i
				};
			}
		}
	}
};

//碰撞检测
function collisionValidate(obj1,obj2) {
	var cls = {
		isCls: false,
		tlQuater: false 
	};

	var obj1Pos = obj1.getBoundingClientRect();
	var obj2Pos = obj2.getBoundingClientRect();

	//用getBoundingClientRect获取位置参数
	var l1 = obj1Pos.left;
	var r1 = obj1Pos.right;
	var t1 = obj1Pos.top;
	var b1 = obj1Pos.bottom;

	var l2 = obj2Pos.left;
	var r2 = obj2Pos.right;
	var t2 = obj2Pos.top;
	var b2 = obj2Pos.bottom;

	if (l1 > r2 || r1 < l2 || t1 > b2 || b1 < t2) {
		cls.isCls = false;
	}else {
		cls.isCls = true;

		//左上1/4碰撞检测
		if (l1 < r2 && l1 > l2 && t1 < b2 && t1 > t2) {
			cls.tlQuater = true;
		}
	}

	return cls;
}


//深拷贝
//将p拷贝到c
function deepCopy(p, c) {
var c = c || {};
for (var i in p) {
	if (typeof p[i] === 'object') {
		c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
}

//生成0到len-1的随机正整数
function getRandomPositiveInt(len) {
	var result = Math.floor((Math.random()+Math.random())/2*len);
	return result;
}

//打字机效果
function typewritter(str,obj) {
	//清空原文本
	obj.innerHTML = '';

	var arr = str.split('');
	var typewritter_timer = setInterval(function() {
		obj.innerHTML += arr.shift();
		if (!arr.length) {
			clearInterval(typewritter_timer);
		}
	},35);
}

//生成N位包含相同字符的字符串
function generateNSameChars(num,char) {
	var str = '';
	for (var i=0;i<num;i++) {
		str += char;
	}
	return str;
}

function fixTwo(n) {
	return n < 10 ? '0' + n : '' + n;
}

function getTimeStr() {
	var time = new Date();
	var minute = time.getMinutes();
	var second = time.getSeconds();

	return fixTwo(minute) + ':' + fixTwo(second);
}

//返回最小值
function min(a,b) {
	return a > b ? b : a;
}

function css(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

function myNumber(str){
	var n='';
	if(typeof str=="number"){
		n=str;
	}else{
		for(var i=0;i<str.length;i++){
			if(!isNaN(Number(str[i]))||str[i]=='.'){
				n+=str[i];
			}
		}
	}
	return Number(n);
}

function shadow(obj,attrObj,callback){

	//获取运动开始时间
	var date = +new Date();

	for(var attr in attrObj){
		//获取起始位置
		var begin = myNumber(css(obj,attr));
		//获取运动总距离
		var count =myNumber(attrObj[attr].target)-begin;
		//console.log(typeof begin);
		set(attr,begin,count);
	}
	function set(attr,begin,count){
		var timer = setInterval(function(){
			//获取时间差
			var t = (+new Date()) - date;
			//判断时间到了之后停止定时器。
			if(t>=attrObj[attr].duration){
				clearInterval(timer);
				t = attrObj[attr].duration;
			}
			//得出当前元素应该在的位置。
			var value = js_libs.miaov.Tween[attrObj[attr].fx](t,begin,count,attrObj[attr].duration);
			if(attr=='opacity'||attr=='transform'){
				obj.style[attr]=value;
				obj.style['webkit'+attr.substring(0,1).toUpperCase() + attr.substring(1)] = value;
			}else{
				obj.style[attr] = value+'px';
			}
			(function(obj){
				if(t==attrObj[attr].duration){
					return attrObj[attr].callback&&attrObj[attr].callback(obj);
				}
			})(obj);

		}, 30);
	}
}







