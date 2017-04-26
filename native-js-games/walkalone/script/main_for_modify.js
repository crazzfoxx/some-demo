window.onload = function() {
	///////变量声明/////////
	var wrapper = document.getElementById('wrapper');

	//weaponArea packArea//
	var weaponArea = document.getElementById('weapon-area');
	var weaponList = weaponArea.getElementsByClassName('weapon-list')[0];
	var weaponLoad = weaponArea.getElementsByClassName('load')[0];
	var packArea = document.getElementById('pack-area');
	var packList = packArea.getElementsByClassName('pack-list')[0];
	var packLoad = packArea.getElementsByClassName('load')[0];

	//weaponArea packArea//

	//gameArea//
	var gameArea = document.getElementById('game-area');

	var round = gameArea.getElementsByClassName('round')[0];
	//cardArea
	var cardArea = gameArea.getElementsByClassName('card-area')[0];
	var cards = cardArea.getElementsByClassName('card');

	//cardArea

	//infoArea
	var infoArea = gameArea.getElementsByClassName('info-area')[0];
	var equipmentSlots = infoArea.getElementsByClassName('equipment')[0].getElementsByTagName('div');
	var info_show = infoArea.getElementsByClassName('show')[0];
	var info_text = infoArea.getElementsByClassName('text')[0];

	//infoArea
	
	//stateArea
	var stateArea = gameArea.getElementsByClassName('state-area')[0];
	
	var overallhealth = stateArea.getElementsByClassName('overallhealth')[0];
	var overallhealthGraphic = overallhealth.children[0];
	var healthState = stateArea.getElementsByClassName('health')[0];

	var battleState = stateArea.getElementsByClassName('battle')[0];
	
	var timecount = stateArea.getElementsByClassName('timecount')[0];
	var nukacola = stateArea.getElementsByClassName('nukacola')[0];
	var loadingBar = stateArea.getElementsByClassName('loading-bar')[0];
	var overall = stateArea.getElementsByClassName('overall')[0];
	var dayRecord = loadingBar.getElementsByTagName('strong')[0];

	//stateArea

	//gameArea//

	//lootArea//
	var lootArea = document.getElementById('loot-area');
	var lootList = lootArea.getElementsByClassName('loot-list')[0];
	var dls_lootList = lootList.getElementsByTagName('dl');
	//lootArea//
	
	//rightClickMenu// 
	var rightClickMenu = document.getElementsByClassName('rightClickMenu')[0];
	var pick = rightClickMenu.children[0].children[0];
	var use = rightClickMenu.children[0].children[1];
	var equip = rightClickMenu.children[0].children[2];
	var takeoff = rightClickMenu.children[0].children[3];
	var drop = rightClickMenu.children[0].children[4];
	//rightClickMenu// 
	
	//eventLayer
	var eventLayer = document.getElementsByClassName('event-layer')[0];
	var eventBox = eventLayer.children[0];
	var eventShow = eventBox.getElementsByClassName('event-show')[0];
	var eventText = eventBox.getElementsByClassName('text')[0];
	var eventConfirm = eventBox.getElementsByClassName('event-confirm')[0];
	var eventLeave = eventBox.getElementsByClassName('event-leave')[0];
	var eventRefuse = eventBox.getElementsByClassName('event-refuse')[0];

	//eventLayer

	/////////////////////执行//////////////////////

	//保存新生成的card对象
	var cardObjs = [];
	//保存新生成的item对象
	var itemObjs = [];
	//保留一次翻转操作中两张牌的信息
	var flipData = [];
	//记录当前操作的item对象 --> lootArea
	var objUnderOp;
	//记录当前操作的li --> weaponArea和packArea
	var liUnderOp;

	//记录当前生存天数
	var daysOfSuvival = 1;

	//记录最大负重上线
	var maxLoad = 100;
	//超重flag
	var overweightFlag = {
		weapon: false,
		pack: false,
		weight: {weapon: 0,pack: 0}
	};

	//记录装备增益
	var equipmentGain = {
		atkGain: 0,
		defGain: 0,
		agiGain: 0
	};

	//记录操作roundCount数
	var roundCount = 20;

	//初始化主线剧情执行队列
	var mainPlotQueue = [mainplot1,mainplot2,mainplot3];
	//记录对话选项
	//0:confirm/1:leave/2:refuse
	var dialogueSelect = 0;

	//生成cardArea的HTML和对象
	generateCardArea();

	//loading页面小球弹跳
	(function() {
		var loading = document.getElementById('loading');
		var ball = loading.getElementsByClassName('ball')[0];
		var hint = loading.getElementsByClassName('hint')[0];

		var acc = 2;
		var alpha_collision = 0.8;
		var speedX = 6;
		var speedY = 1;
		var num = 0;
		var timer = null;
		var isBlink = false;

		timer = setInterval(function() {
			ball.style.left = ball.offsetLeft + speedX + 'px';
			ball.style.top = ball.offsetTop + speedY + 'px';

			speedY += acc;

			if (ball.offsetTop >= 310) {
				speedY *= -alpha_collision;
				num++;
			}

			if (num >= 3) {
				clearInterval(timer);
				speedX *= 0.2;
				speedY = 0;
				ball.style.background = '#35bd33';

				timer = setInterval(function() {
					if (isBlink) {
						hint.style.opacity = '1';
					}else {
						hint.style.opacity = '0';
					}

					isBlink = !isBlink;
				},500);
				
				document.addEventListener('keydown',function(ev) {
					var ev = ev || event;
					if (ev.keyCode == 13) {
						clearInterval(timer);
						loading.style.display = 'none';
					}
				},false);
			}
		},20);
	})();

	//点击右上进度条,进入下一天
	//width: 49 --> 228
	(function() {
		loadingBar.onclick = function() {
			//更新生存天数
			daysOfSuvival++;
			dayRecord.innerHTML = daysOfSuvival;

			//变化进度条
			js_libs.miaov.mTween(loadingBar,'width',228,2000,'linear',function() {
				//还原进度条
				loadingBar.style.cssText = '';
				//重新生成卡牌
				generateCardArea();
				//恢复roundCount计数
				roundCount = 20;
				round.innerHTML = roundCount;

				//计算每天耗损
				eachdayExpenditure();

				//刷新显示
				showAllState(characterData);
			});
		};
	})();

	//右键菜单操作
	(function() {
		rightClickMenu.onclick = function(ev) {
			var ev = ev || event;
			ev.cancelBubble = true;

			this.style.cssText = '';
		}

		//点击文档其他地方,隐藏右键菜单
		document.onclick = function() {
			rightClickMenu.style.cssText = '';
		};

		//拾取
		pick.onclick = function() {
			var type = objUnderOp.itemInfo.type;

			typewritter('你将'+objUnderOp.itemInfo.name+'放入背包中...',info_text);

			//深拷贝
			var newObj = {};
			newObj = deepCopy(findDataById(objUnderOp.id,itemData),newObj);

			//将item数据存入characterItem对应数组(深拷贝)
			if (type == 'weapon') {
				//判断武器是否超重
				if (overweightFlag.weapon) {
					//超重打印文字且不执行放入操作
					typewritter('你不能再背更多的武器了...',info_text);
					info_show.style.background = 'url(images/event/info/overweight.png)  no-repeat center';
				}else {
					//更新对象位置
					newObj.itemInfo.itemPos = 1;
					//检查item数据是否已经在characterItem中,
					var idx = stackCheck(objUnderOp.id,objUnderOp.itemInfo.itemLevel,characterItem.weapon);

					if (idx != -1) {
					//若数据已经存在,增加叠加数量
						characterItem.weapon[idx].num++;
					}else {
					//若不存在
						//初始化重叠数量
						newObj.num = 1;
						//将数据推入characterItem
						characterItem.weapon.push(newObj);
					}
				}
			}else if (type == 'other') {
				//判断物品是否超重
				if (overweightFlag.pack) {
					//超重打印文字且不执行放入操作
					typewritter('你不能再背更多的东西了...',info_text);
					info_show.style.background = 'url(images/event/info/overweight.png)  no-repeat center';
				}else {
					//更新对象位置
					newObj.itemInfo.itemPos = 2;
					//检查item数据是否已经在characterItem中,
					var idx = stackCheck(objUnderOp.id,objUnderOp.itemInfo.itemLevel,characterItem.other);

					if (idx != -1) {
					//若数据已经存在,增加叠加数量
						characterItem.other[idx].num++;
					}else {
					//若不存在
						//初始化重叠数量
						newObj.num = 1;
						//将数据推入characterItem
						characterItem.other.push(newObj);
					}
				}
			}

			//刷新weaponArea和packArea显示
			createItemAreas(characterItem);

			//在loot内删除该元素
			lootList.removeChild(objUnderOp.item);
		};

		//使用自增益物品
		use.onclick = function() {
			//若物品itemDetail不属于forrecover类型,不能被用于恢复自己
			var detail = liUnderOp.data.itemInfo.itemDetail;
			if (detail != 'forrecover') {
				return;
			}

			//使用物品根据itemInfo.itemValue增加生命值
			for (var attr in characterData.health) {
				if (attr == 'getOverall') {
					continue;
				}

				characterData.health[attr] += liUnderOp.data.itemInfo.itemValue;
			}

			//使用水源减少口渴度
			if (liUnderOp.data.itemInfo.name == '水源') {
				characterData.battle.thirsty -= liUnderOp.data.itemInfo.itemValue;
				if (characterData.battle.thirsty < 0) {
					characterData.battle.thirsty = 0;
				}
			}else if (liUnderOp.data.itemInfo.name == '食物') {
			//使用食物减少饥饿度
				characterData.battle.hungury -= liUnderOp.data.itemInfo.itemValue;
				if (characterData.battle.hungury < 0) {
					characterData.battle.hungury = 0;
				}
			}

			//刷新显示health和battle
			showAllState(characterData);

			//执行对齐操作
			drop.onclick();
		};

		//装备
		equip.onclick = function() {
			if (liUnderOp.data.itemInfo.type != 'weapon') {
				return;
			}

			//减去上一次agility增益
			characterData.battle.agility -= equipmentGain.agiGain;
			//减去上一次defend增益
			characterData.battle.defend -= equipmentGain.defGain;
			//减去上一次attack增益
			characterData.battle.attack -= equipmentGain.atkGain;

			//设置新的当前增益
			var detail = liUnderOp.data.itemInfo.itemDetail;
			switch (detail) {
				case 'helmet':
					//获取新的agility增益
					equipmentGain.agiGain = liUnderOp.data.itemInfo.itemValue;
					equipmentSlots[1].style.background = 'url('+liUnderOp.data.imgSrc+') no-repeat center/cover';
					equipmentSlots[1].style.color = 'transparent';
					break;
				case 'armor':
					//获取新的defend增益
					equipmentGain.defGain = liUnderOp.data.itemInfo.itemValue;
					equipmentSlots[2].style.background = 'url('+liUnderOp.data.imgSrc+') no-repeat center/cover';
					equipmentSlots[2].style.color = 'transparent';
					break;
				case 'ranged': case 'melee':
					//获取新的attack增益
					equipmentGain.atkGain = liUnderOp.data.itemInfo.itemValue;
					equipmentSlots[3].style.background = 'url('+liUnderOp.data.imgSrc+') no-repeat center/cover';
					equipmentSlots[3].style.color = 'transparent';
					break;
			}

			//计算新的装备增益
			//考虑到增益影响不仅是装备因素
			//因此先减去旧增益,再加上新增益计算
			calBattle();

			//刷新battleState显示
			showAllState(characterData);
		};
		//卸下
		takeoff.onclick = function() {};

		//丢弃
		drop.onclick = function() {
			//information包含{currentData,attr,idx}
			//currentData: 对象数据
			//attr: 包含在characterItem下的weapon还是other中
			//idx: 索引
			var infomation = findDataInCharacterItem(liUnderOp.data.id,liUnderOp.data.itemInfo.itemLevel,characterItem);
			var currentData = infomation.currentData;

			//堆叠数量减一
			currentData.num--;

			//若堆叠数量为0
			//在characterItem中删除该数据
			if (currentData.num<1) {
				characterItem[infomation.attr].splice(infomation.idx,1);
			}

			//刷新显示weaponArea和packArea
			createItemAreas(characterItem);
		};
	})();

	//infoArea时间显示
	(function() {
		timecount.innerHTML = getTimeStr();

		var timecount_timer = setInterval(function() {
			timecount.innerHTML = getTimeStr();
		},500);
	})();

	////stateInfo图片切换
	(function() {
		var Peo = overallhealthGraphic.getContext('2d');
		var timer = null;
		var num = 0;//控制人物行走状态
		var Img = new Image();
		var h;
		var speed = 150;

		walk(speed);

		function walk(speed) {
			h = characterData.health.getOverall();

			Peo.fillStyle = '#fff';
			Peo.fillRect(0,0,160,7.5+(100-h)/100*65);
			Peo.fillStyle = '#a4393b';
			Peo.fillRect(0,7.5+(100-h)/100*65,160,65-(100-h)/100*65);
			if(num%4 == 0){
				Peo.drawImage(Img,0,0,160,78,-40,0,160*1.5,78*1.5);
			}else if(num%4 == 1){
				Peo.drawImage(Img,160,0,160,78,-40,0,160*1.5,78*1.5);
			}else if(num%4 == 2){
				Peo.drawImage(Img,320,0,160,78,-40,0,160*1.5,78*1.5);
			}else if(num%4 == 3){
				Peo.drawImage(Img,480,0,160,78,-40,0,160*1.5,78*1.5);
			}
			num++;

			speed = parseInt(300 - h / 100 * 200);

			if (h <= 0) {
				return;
			}

			Img.src = 'images/state-bg1.png';

			setTimeout(function() {
				walk();
			},speed);
		} 
	})();

	//音乐播放器
	(function() {
		var windowW=window.innerWidth||document.documentElement.clientWidth;
		var windowH=window.innerHeight||document.documentElement.clientHeight;
		var prev=document.querySelector('.prev');
		var next=document.querySelector('.next');
		var play=document.querySelector('.play');
		var option=document.querySelector('.option');
		var optionMain=document.querySelector('.optionMain');
		var audio1=document.querySelector('.audio1');
		var audio2=document.querySelector('.audio2');
		var music1=document.querySelector('.music1');
		var music2=document.querySelector('.music2');
		var main=document.querySelector('.music2 .main');
		var lrcP=document.querySelector('.music2 .lrc');
		var lrc=document.querySelector('.music2 .lrcCon');
		var menu=document.querySelector('.music2 .main .menu');
		var current=document.querySelector('.music2 .current');
		var duration=document.querySelector('.music2 .duration');
		var progress=document.querySelector('.music2 .progress');
		var bar=document.querySelector('.music2 .progress .bar');
		var done=document.querySelector('.music2 .progress .done');
		var close=document.querySelector('.music2 .main .close');
		var back=document.querySelector('.back');
		var sound=document.querySelector('.sound');
		var optionMusic=document.querySelector('.optionMusic');
		var songIndex=1;
		var mark=document.createElement('div');
		var timer1 = null;
		var timer2 = null;
		option.onOff=false;
		play.onOff=false;
		music2.onOff=false;

		audio1.src="music-list/"+musicData[songIndex].src+"";
		
		var txt=musicData[songIndex].lrc;
		
		currentLrc();
		volumeFn(optionMusic,audio1);
		volumeFn(sound,audio2);
		progressFn();
		
		window.onresize=function(){
		    windowW=window.innerWidth||document.documentElement.clientWidth;
		    windowH=window.innerHeight||document.documentElement.clientHeight;
		    music2.style.width=windowW+'px';
		    music2.style.height=windowH+'px';
		};
		
		play.onclick=function(){
		    if(this.onOff){
		        audio1.pause();
		        this.onOff=false;
		        removeClass(this,'active');
		        clearInterval(timer1);
		        clearInterval(timer2);
		    }else{
		        audio1.play();
		        this.onOff=true;
		        setClass(this,'active');
		        progressFn();
		    }
		};

		prev.onclick=function(){
		    songIndex--;
		    if(songIndex<0){
		        songIndex=musicData.length-1;
		    }
		    audio1.src="music-list/"+musicData[songIndex].src+"";
		    txt=musicData[songIndex].lrc;
		    audio1.play();
		    currentLrc();
		    play.onOff=true;
		    setClass(play,'active');
		    progressFn();
		};
		next.onclick=function(){
		    songIndex++;
		    if(songIndex==musicData.length){
		        songIndex=0;
		    }
		    audio1.src="music-list/"+musicData[songIndex].src+"";
		    txt=musicData[songIndex].lrc;
		    audio1.play();
		    currentLrc();
		    play.onOff=true;
		    setClass(play,'active');
		    progressFn();
		};
		option.onclick=function(){
		    if(!this.onOff){
		        optionMain.style.display='inline-block';
		        mark.className='mark';
		        document.querySelector('.warp-music').appendChild(mark);
		    }else{
		        optionMain.style.display='';
		        document.querySelector('.warp-music').removeChild(mark);
		    }
		    this.onOff=!this.onOff;
		};
		back.onclick=function(){
		    optionMain.style.display='';
		    document.querySelector('.warp-music').removeChild(mark);
		    option.onOff=false;
		};
		music2.style.display='none';
		music1.ondblclick=function(){
		    music2.onOff=true;
		    audio2.pause();
		    shadow(music2,{
		        width:{
		            target:windowW,
		            duration:1000,
		            fx:'linear',
		            callback:function(obj){
		            }
		        },
		        height:{
		            target:windowH,
		            duration:1000,
		            fx:'linear',
		            callback:function(){
		                menu.style.opacity=0.6;
		                setStyle(lrcP,'transform','translate(0,0)');
		                setStyle(menu,'transform','translate(0,100px)');

		            }
		        }
		    });
		    var menuMark=document.querySelector('.menuMark');
		    menuMark.onmouseenter=function(){
		        setStyle(menu,'transform','translate(0,0)');
		        setStyle(menu,'z-index','5');
		        menu.onmouseleave=function(){
		            setStyle(menu,'transform','translate(0,100px)');
		            setStyle(menu,'z-index','');
		        };
		    };
		    setStyle(music2,'transform','rotateX(0deg)');
		    menu.appendChild(prev);
		    menu.appendChild(next);
		    menu.appendChild(play);
		    menu.appendChild(optionMusic);
		    setClass(optionMusic,'active');
		    music1.style.display='none';
		    music2.style.display='';

		};
		close.onclick=function(){
		    music2.onOff=false;
		    setStyle(menu,'transform','translate(0,100px)');
		    setClass(lrcP,'lrcHide');
		    //setStyle(lrcP,'transform','translate(0,-500px)');
		    //setStyle(lrcP,'transform','translateZ(-200px) scale(0.8)');
		    //setStyle(person,'opacity',0);
		    bind(menu,'transitionEnd',watchMenu,false);
		    bind(menu,'webkitTransitionEnd',watchMenu,false);
		    function watchMenu(){
		        if(!music2.onOff){
		            menu.style.opacity=0;
		            setStyle(music2,'transform','rotateX(90deg)');
		        }
		    }
		    audio2.play();
		    music1.appendChild(prev);
		    music1.appendChild(next);
		    music1.appendChild(play);
		    optionMain.appendChild(optionMusic);
		    removeClass(optionMusic,'active');
		    music1.style.display='';

		};
		function currentLrc(){
		    var lrcArr = txt.split("[");
		    var newLrcArr=[];
		    var str='';
		    for (var i=0;i < lrcArr.length ;i++ ){
		        var arr = lrcArr[i].split("]");
		        var time = arr[0].split(".");
		        var timer = time[0].split(":");
		        var ms = timer[0]*60 + timer[1]*1;//将时间转换为秒
		        var text = arr[1];//歌词内容
		        newLrcArr.push([ms,text]);
		    }
		    for(var i=1;i<newLrcArr.length;i++){
		        str+='<p class="lrc'+newLrcArr[i][0]+'">'+newLrcArr[i][1]+'</p>';
		    }
		    lrc.innerHTML = str;

		    audio1.addEventListener("timeupdate",function(){
		        var aP=document.querySelectorAll('.lrc p');
		        var curTime = parseInt(audio1.currentTime);
		        for(var m=0;m<aP.length;m++){
		            if ('lrc'+curTime==aP[m].className){
		                for(var n=0;n<aP.length;n++){
		                    removeClass(aP[n],'active');
		                }
		                setClass(aP[m],'active');
		                lrc.style.top=190-30*m+'px';
		                //console.log(aP[m])
		                //console.log(m)
		            }
		        }
		    });

		}
		//bind(lrc,'mousedown',dragLrc,false);
		function dragLrc(){
		    audio1.pause();

		}
		//播放完成自动调整下一曲
		audio1.addEventListener("ended",function(){
		    songIndex++;
		    if(songIndex>musicData.length-1){
		        songIndex=0
		    }
		    audio1.src="music-list/"+musicData[songIndex].src+"";
		    txt=musicData[songIndex].lrc;
		    audio1.play();
		    currentLrc();
		    play.onOff=true;
		    setClass(play,'active');
		    progressFn();
		},false);

		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;  //  分析音频文件

		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitrequestAnimationFrame || window.mozrequestAnimationFrame || window.msrequestAnimationFrame;
		// 创建一个音乐对象
		var actx = new AudioContext();

		// 创建一个音频节点对象

		var analyser = actx.createAnalyser(); // 创建音频分析 转化成数字 通过canvas 画布表现出来
		// 传经媒体源节点
		var audioSrc = actx.createMediaElementSource(audio1);  // 获取音乐源文件

		audioSrc.connect(analyser) ;// 将音频源文件与分析机制链接起来

		analyser.connect(actx.destination); // 将分析机制与目标点链接 （扬声器）

		//var person=document.querySelector('.person');
		//person.style.transform='rotateX(45deg)';
		var can = document.getElementById("canvas");
		var cxt = can.getContext("2d");
		function draw(){

		    // 创建一个与音乐频次等长的数组
		    var voiceHigh= new Uint8Array(analyser.frequencyBinCount);

		    // 将分析出来的音频数据添加到数组里面
		    analyser.getByteFrequencyData(voiceHigh) ;
		    //console.log(voiceHigh)
		    var max=voiceHigh[0];
		    var old=0;
		    var onOff=false;
		    var deg=0;
		    var sum=0;
		    var average=0;
		    for(var i=0;i<voiceHigh.length;i++){
		        sum+=voiceHigh[i];
		        if(voiceHigh[i]>max){
		            old=max;
		            max=voiceHigh[i];
		            if(onOff){
		                deg=-Math.atan(voiceHigh[500]/177)*50;
		            }else{
		                deg=Math.atan(voiceHigh[500]/177)*50;
		            }
		        }
		    }
		    average=sum/voiceHigh.length;
		    //console.log(average)
		    //console.log(max)
		    //console.log(old)
		    //console.log(deg)
		    //console.log(person)
		    //person.style.left=max+'px';
		    //person.style.transform='rotateZ('+deg+'deg)';
		    //bind(person,'transitionEnd',watchLoadUp,false);
		    //bind(person,'webkitTransitionEnd',watchLoadUp,false);
		    function watchLoadUp(){
		        person.style.transform='rotateZ(0deg)';
		    }
		}
		//requestAnimationFrame(draw)
		//var timer3=null;
		//clearInterval(timer3);
		//timer3=setInterval(function() {
		//    draw();
		//},300);
		//draw();
		function bind(obj,ev,fn,bubble){
		    if (obj.addEventListener) {
		        obj.addEventListener(ev,fn,bubble);
		    } else{
		        obj.attachEvent('on'+ev,function(){
		            fn.call(obj);
		        });
		    }
		}
		progressDragFn(progress,audio1);
		function progressDragFn(obj,audio){
		    var bar=obj.querySelector('.bar');
		    var btn=obj.querySelector('.btn');
		    btn.onmousedown=function(ev){
		        console.log('down')
		        if(audio.paused){
		            return;
		        }
		        audio.pause();
		        clearInterval(timer1);
		        clearInterval(timer2);
		        var absLeft=getPos(bar).left;
		        var disX=ev.clientX-getPos(this).left;
		        var max=css(bar,'width')-css(btn,'width');
		        document.onmousemove=function(ev){
		            var left=ev.clientX-disX-absLeft;
		            if(left<0){
		                left=0;
		            }
		            if(left>max){
		                left=max;
		            }
		            btn.style.left=left+'px';
		            done.style.width = left+'px';
		            var currentTime = left/max*audio.duration;
		            console.log(currentTime)
		            audio.currentTime = currentTime;
		            //当前时间转成分秒
		            var now = zero(Math.floor(audio.currentTime/60))+':'+zero(Math.floor(audio.currentTime%60));
		            current.innerHTML = now;
		            return false;
		        };
		        document.onmouseup=function(){
		            audio.play();
		            progressFn();
		            document.onmousemove=null;
		            document.onmouseup=null;
		        };
		        return false;
		    };

		}

		//拖拽歌词播放
	    bind(lrc,'mousedown',dragLrc,false);
	    function dragLrc(ev){
	        var bar=progress.querySelector('.bar');
	        var btn=progress.querySelector('.btn');
	        audio1.pause();
	        clearInterval(timer1);
	        clearInterval(timer2);
	        var absTop=getPos(lrcP).top;
	        var aP=document.querySelectorAll('.lrc p');
	        var disT=ev.clientY-getPos(this).top;
	        var max=aP.length*30;
	        document.onmousemove=function(ev){
	            var oTop=ev.clientY-disT-absTop;
	            if(oTop<-max+190){
	                oTop=-max+190;
	            }
	            if(oTop>190){
	                oTop=190;
	            }
	            lrc.style.top=oTop+'px';
	            var index=Math.round((190-oTop)/30);
	            console.log(parseInt(aP[index].className.split('lrc')[1]))
	            var currentTime=parseInt(aP[index].className.split('lrc')[1]);
	            audio1.currentTime = currentTime;
	            done.style.width = currentTime/audio1.duration*css(bar,'width')+'px';
	            for(var n=0;n<aP.length;n++){
	                removeClass(aP[n],'active');
	            }
	            setClass(aP[index],'active');
	            var now = zero(Math.floor(audio1.currentTime/60))+':'+zero(Math.floor(audio1.currentTime%60));
	            current.innerHTML = now;
	            return false;
	        };
	        document.onmouseup=function(){
	            audio1.play();
	            play.onOff=true;
	            setClass(play,'active');
	            progressFn();
	            document.onmousemove=null;
	            document.onmouseup=null;
	        };
	        return false;
	    }

		function progressFn(){
		    var bar=document.querySelector('.progress .bar');
		    var progressBtn=document.querySelector('.progress .btn');
		    var max=css(bar,'width')-css(progressBtn,'width');
		    var w=audio1.currentTime/audio1.duration*max;
		    done.style.width = w+'px';
		    progressBtn.style.left=w+'px';
		    clearInterval(timer1);
		    timer1 = setInterval(function(){
		        w= audio1.currentTime/audio1.duration*max;
		        done.style.width = w+'px';
		        progressBtn.style.left=w+'px';
		    }, 16);
		    var now = zero(Math.floor(audio1.currentTime/60))+':'+zero(Math.floor(audio1.currentTime%60));
		    current.innerHTML=now;
		    var all = zero(Math.floor(audio1.duration/60))+':'+zero(Math.floor(audio1.duration%60));
		    if(duration.innerHTML==''){
		        duration.innerHTML="00:00";
		    }
		    clearInterval(timer2);
		    timer2 = setInterval(function(){
		        now = zero(Math.floor(audio1.currentTime/60))+':'+zero(Math.floor(audio1.currentTime%60));
		        current.innerHTML=now;
		        all = zero(Math.floor(audio1.duration/60))+':'+zero(Math.floor(audio1.duration%60));
		        duration.innerHTML=all;
		    }, 1000);
		}
		function volumeFn(obj,audio){
		    var bar=obj.querySelector('.bar');
		    var btn=obj.querySelector('.btn');
		    var v=css(btn,'left')/css(bar,'width');
		    btn.onmousedown=function(ev){
		        var absLeft=getPos(bar).left;
		        var disX=ev.clientX-getPos(this).left;
		        var max=css(bar,'width')-css(btn,'width');
		        document.onmousemove=function(ev){
		            var left=ev.clientX-disX-absLeft;
		            if(left<0){
		                left=0;
		            }
		            if(left>max){
		                left=max;
		            }
		            btn.style.left=left+'px';
		            v=css(btn,'left')/max;
		            audio.volume=v;
		            return false;
		        };
		        document.onmouseup=function(){
		            document.onmousemove=null;
		            document.onmouseup=null;
		        };
		        return false;
		    };
		    audio.volume=v;
		}

		function setClass(obj,className){
		    if(!obj.className){
		        obj.className=className;
		    }else{
		        var arr=obj.className.split(' ');
		        var index=arrIndex(arr,className);
		        if(!index){
		            obj.className+=' '+className;
		        }
		    }
		}
		function removeClass(obj,className){
		    if(obj.className){
		        var arr=obj.className.split(' ');
		        var index=arrIndex(arr,className);
		        if(index){
		            arr.splice(index,1);
		            obj.className=arr.join(' ');
		        }
		    }

		}
		function arrIndex(arr,className){
		    for(var i=0;i<arr.length;i++){
		        if(arr[i]==className){
		            return i;
		        }
		    }
		    return false;
		}
		function css(obj,attr){
		    return parseFloat(obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr]);
		}
		function setStyle(obj,attr,value){
		    obj.style[attr] = value;
		    obj.style['webkit'+attr.substring(0,1).toUpperCase() + attr.substring(1)] = value;
		}
		function getPos(obj) {
		    var pos = {left:0, top:0};
		    while (obj) {
		        pos.left += obj.offsetLeft;
		        pos.top += obj.offsetTop;
		        obj = obj.offsetParent;
		    }
		    return pos;

		}
		function zero(n){
		    return n<10? '0'+n:''+n;
		}
	})();

	////stateInfo图片切换

	/////////对象构造///////////
	//构造card对象
	function Card(cardElement,eachData) {
		//记录this指向
		var _this = this;

		//将card对象属性给cardElement
		this.card = cardElement;
		//设置卡牌朝向
		//true: 背面朝上
		this.cardFace = true;
		//设置可翻转状态
		this.isFlipped = false;
		//获取id
		this.id = eachData.id;
		//获取info
		this.cardInfo = eachData.cardInfo;
		//获取图片资源
		this.imgSrc = eachData.imgSrc;
		//获取卡牌名称
		this.name = eachData.name;

		//根据cardData生成card图片内容
		var cardFront = this.card.getElementsByClassName('card-front')[0];
		cardFront.style.background = '#fff url('+this.imgSrc+') no-repeat center/70%';

		//双击翻转
		this.card.onclick = function() {
			if (_this.isFlipped) {
				return;
			};

			//超过roundCount倒计时不允许再翻转卡牌
			if (!roundCount) {
				typewritter('时间太晚了,你今天不能再行动了...',info_text);
				info_show.style.background = 'url(images/event/info/roundend.png)  no-repeat center';
				return;
			}

			//翻转卡牌
			_this.turnAround();
			//将当前卡牌设置为不可翻转
			_this.isFlipped = true;

			//地址传递关系
			flipData.push(_this);
			
			var c1 = flipData[0];
			var c2 = flipData[1];

			if (c2) {
				//roundCount数倒计
				roundCount--;
				round.innerHTML = roundCount;
				// round.style.color = 'red';

				if (c1.id != c2.id) {
				//如果一次操作中翻转的两张牌对应的id不同,将会转回去
					info_show.style.background = '';
					info_text.innerHTML = '呲...呲...呲...无线联络器发出毫无意义的电信号声,你试图从中听到些什么,但是这些尝试显然是徒劳无功的...';
					setTimeout(function() {
						//翻转一次round
						//若不能配对后
						//恢复为未翻转状态
						//两张卡牌翻到背面
						c1.turnAround();
						c2.turnAround();
						c1.isFlipped = false;
						c2.isFlipped = false;
					},500);
				}else {
				//如果一次操作中翻转的两张牌对应的id相同,则触发事件										
					//解析事件
					parseItemEvent(_this);
				}

				//清空翻转卡牌信息
				flipData = [];
			}
		};
	}

	Card.prototype.turnAround = function() {
		if (this.cardFace) {
			this.card.style.transition = '.4s';
			this.card.style.transform = 'rotateY(180deg)';
		}else {
			this.card.style.transform = '';
		}

		this.cardFace = !this.cardFace;
	};

	//构造item对象
	function Item(itemElement,eachData) {
		var _this = this;

		//将item对象属性给itemElement
		this.item = itemElement;

		//获取属性
		this.id = eachData.id;
		this.itemInfo = eachData.itemInfo;
		this.imgSrc = eachData.imgSrc;
		this.itemInfo.itemLevel = levels[getRandomPositiveInt(levels.length)];
		this.itemInfo.itemValue = this.itemInfo.itemValue * this.itemInfo.itemLevel;
		this.itemInfo.itemPos = 0;

		//初始化拖拽变量
		this.leftDist = 0;
		this.topDist = 0;

		//根据itemData生成item内容
		var dt = this.item.children[0];
		dt.style.background = '#fff url('+this.imgSrc+') no-repeat center/70%';
		var dd = this.item.children[1];
		dd.innerHTML = this.itemInfo.name+generateNSameChars(this.itemInfo.itemLevel,'★');

		//右键菜单
		this.item.oncontextmenu = function(ev) {
			var ev = ev || event;
			objUnderOp = _this;
			_this.showMenu(ev);

			//阻止浏览器默认右键菜单事件
			return false;
		};

		this.item.onmousedown = function(ev) {
			var ev = ev || event;
			//拖拽item时,隐藏右键菜单
			rightClickMenu.style.cssText = '';

			_this.fnMousedown(ev);

			//阻止浏览器拖拽文字/图片默认行为
			return false;
		};
	}

	Item.prototype.showMenu = function(ev) {
		var item_size = this.item.getBoundingClientRect();

		rightClickMenu.style.left = item_size.right + 'px';
		rightClickMenu.style.top = item_size.top + 'px';
		rightClickMenu.style.display = 'block';

		//显示/隐藏菜单项
		use.style.display = 'none';
		equip.style.display = 'none';
		takeoff.style.display = 'none';
		pick.style.display = '';
		drop.style.display = 'none';
	};


	Item.prototype.fnMousedown = function(ev) {
		var _this = this;
		var item_size = this.item.getBoundingClientRect();
		this.leftDist = ev.clientX - item_size.left;
		this.topDist = ev.clientY - item_size.top;

		document.onmousemove = function(ev) {
			var ev = ev || event;
			_this.fnMousemove(ev);
		};

		document.onmouseup = function() {
			document.onmousemove = document.onmouseup = null;

			//flag判断物品是否成功放入
			var flag = true;
			var type = _this.itemInfo.type;

			//声明新对象
			var newObj = {};
			//深拷贝
			newObj = deepCopy(findDataById(_this.id,itemData),newObj);

			if (type == 'weapon'
				&& collisionValidate(_this.item,weaponList).tlQuater) {

				//判断武器是否超重
				if (overweightFlag.weapon) {
					//超重打印文字且不执行放入操作
					typewritter('你不能再背更多的武器了...',info_text);
					info_show.style.background = 'url(images/event/info/overweight.png)  no-repeat center';
				}else {
					//更新对象位置
					newObj.itemInfo.itemPos = 1;
					//检查item数据是否已经在characterItem中,
					//若是则需要重叠物品,
					//若否,则新添加物品
					var idx = stackCheck(_this.id,_this.itemInfo.itemLevel,characterItem.weapon);
					if (idx != -1) {
					//item数据在characterItem中存在
						characterItem.weapon[idx].num++;
					}else {
					//item数据在characterItem中不存在
						//初始化重叠数量
						newObj.num = 1;
						//将item数据深拷贝并放入characterItem对应数据中
						characterItem.weapon.push(newObj);
					}
					//在loot内删除该元素
					lootList.removeChild(_this.item);
					flag = false;
				}
			}else if (type == 'other'
				&& collisionValidate(_this.item,packList).tlQuater) {

				//判断背包是否超重
				if (overweightFlag.pack) {
					//超重打印文字且不执行放入操作
					typewritter('你不能再背更多的东西了...',info_text);
					info_show.style.background = 'url(images/event/info/overweight.png)  no-repeat center';
				}else {
					//更新对象位置
					newObj.itemInfo.itemPos = 2;
					//检查item数据是否已经在characterItem中,
					var idx = stackCheck(_this.id,_this.itemInfo.itemLevel,characterItem.other);
					if (idx != -1) {
						characterItem.other[idx].num++;
					}else {
						//初始化重叠数量
						newObj.num = 1;
						//将item数据深拷贝并放入characterItem对应数据中
						characterItem.other.push(newObj);
					}
					//在loot内删除该元素
					lootList.removeChild(_this.item);
					flag = false;
				}
			}

			//刷新weaponArea和packArea显示
			createItemAreas(characterItem);

			if (flag) {
				_this.item.style.cssText = '';
			}else {
				typewritter('你将'+_this.itemInfo.name+'放入背包中...',info_text);
			}
		};
	};

	Item.prototype.fnMousemove = function(ev) {
		this.item.style.position = 'absolute';
		this.item.style.zIndex = '900';

		var parent_size = this.item.parentNode.getBoundingClientRect();

		this.item.style.left = ev.clientX - this.leftDist - parent_size.left + 'px';
		this.item.style.top = ev.clientY - this.topDist - parent_size.top + 'px';
	}

	///////////////////函数声明//////////////////
	
	////元素创建////
	function generateCardArea() {
		//死亡判断
		deadCheck();

		// 每隔3天触发主线剧情
		if (daysOfSuvival % 3 == 1) {
			var plotFunc = mainPlotQueue.shift();
			plotFunc && plotFunc();
		}

		//清空cardArea
		cardArea.innerHTML = '';
		//清空lootList
		lootList.innerHTML = '';

		//生成cardArea的HTML
		var str = '';
		for (var i=0;i<16;i++) {
			str += `
				<div class="card" style="left:${110*(i%4)+5}px;top:${Math.floor(i/4)*124+8}px;">
					<div class="card-front"></div>
					<div class="card-back"></div>
				</div>
			`;
		}
		cardArea.innerHTML = str;

		//生成2*8打乱的卡组
		var datas = extractCardData();
		datas = datas.concat(datas);
		datas.sort(function(a,b) {
			return Math.random() - 0.5;
		});

		//清除cardObjs
		cardObjs = [];
		//清空itemObjs
		itemObjs = [];

		//生成16个新cardArea的对象,并推入cardObjs
		for (var i=0;i<datas.length;i++) {
			cardObjs.push(new Card(cards[i],datas[i]));
		}
	}

	//抽取8个不同卡牌数据
	//基本卡牌种类暂时有8种,
	//随剧情递进,可以加入新的种类
	function extractCardData() {
		var extractedDatas = [];
		var len = cardData.length;
		var r;

		//若cardData中只有基本卡牌,不需要随机抽取,直接取出
		if (len == 8) {
			return cardData;
		}

		//若卡牌中有新的卡牌种类加入,随机抽取不重复的8个种类
		while (extractedDatas.length < 8) {
			r = Math.floor(Math.random()*len);
			if (extractedDatas.indexOf(cardData[r]) == -1) {
				extractedDatas.push(cardData[r]);
			}
		}

		return extractedDatas;
	}

	//生成item对象
	function generateItem(currentData) {
		var dl = document.createElement('dl');
		dl.className = 'item';

		var dt = document.createElement('dt');	
		dl.appendChild(dt);
		var dd = document.createElement('dd');
		dl.appendChild(dd);

		lootList.appendChild(dl);

		itemObjs.push(new Item(dl,currentData));	
	}

	function generateLi(id,level,num,container) {
		var li = document.createElement('li');
		//记录物品id
		li.itemId = id;
		
		//在characterItem用id和itemLevel找到数据
		var currentData = findDataInCharacterItem(id,level,characterItem).currentData;

		//设置物品名称
		li.innerHTML = currentData.itemInfo.name + generateNSameChars(currentData.itemInfo.itemLevel,'★') + (num < 2 ? '' : ('(' + num + ')'));

		li.data = currentData;

		container.appendChild(li);

		//weaponArea和packArea右键菜单
		li.oncontextmenu = function(ev) {
			var ev = ev || event;

			liUnderOp = this;

			rightClickMenu.style.left = ev.clientX + 'px';
			rightClickMenu.style.top = ev.clientY + 'px';
			rightClickMenu.style.display = 'block';

			//显示/隐藏菜单项
			pick.style.display = 'none';
			takeoff.style.display = 'none';
			use.style.display = '';
			equip.style.display = '';
			drop.style.display = '';

			return false;
		};
	}

	//刷新显示weaponArea和packArea
	function createItemAreas(characterItem) {
		// console.log(characterItem);
		//刷新显示weaponArea
		weaponList.innerHTML = '';

		for (var i=0,len=characterItem.weapon.length;i<len;i++) {
			generateLi(characterItem.weapon[i].id,characterItem.weapon[i].itemInfo.itemLevel,characterItem.weapon[i].num,weaponList);
		}

		//刷新显示packArea
		packList.innerHTML = '';

		for (var i=0,len=characterItem.other.length;i<len;i++) {
			generateLi(characterItem.other[i].id,characterItem.other[i].itemInfo.itemLevel,characterItem.other[i].num,packList);
		}

		//刷新显示load
		var weight = calWeight(characterItem);

		//判断超重状态
		overweightWarn(weight);

		//刷新重量显示
		weaponLoad.innerHTML = weight.weapon+'/'+maxLoad;
		packLoad.innerHTML = weight.pack+'/'+maxLoad;
	}
	////元素创建////
	
	////事件解析///
	function parseItemEvent(cardObj) {
		//重要的是根据cardInfo: 'melee'解析
		
		if (cardObj.cardInfo == 'chance') {
			var chanceNature = chanceData.nature[getRandomPositiveInt(10)];
			var chanceEffect = chanceData.effect[getRandomPositiveInt(20)];
			var chanceEffectArg = chanceData.effectArg[getRandomPositiveInt(20)];

			var idx1 = getRandomPositiveInt(infoKeyWord.person.length); 
			var idx2 = getRandomPositiveInt(infoKeyWord.adjective.length); 
			var idx3 = getRandomPositiveInt(infoKeyWord.location.length); 
			var idx4 = getRandomPositiveInt(infoKeyWord.verb.chance.pos.length); 

			//生成文本内容
			var chanceStr = infoKeyWord.person[idx1] + '在' + infoKeyWord.adjective[idx2] + infoKeyWord.location[idx3] + infoKeyWord.verb.chance[chanceNature > 0 ? 'pos' : 'neg'][idx4];

			//事件效果
			var val = chanceEffectArg * chanceEffectArg * chanceNature;

			switch (chanceEffect) {
				//atk
				case 0:
					val *= 3;

					characterData.battle.attack += val;
					chanceStr += '。 你的攻击力' + (val > 0 ? '增加了' : '减少了') + val;

					info_show.style.background = 'url(images/event/info/attackup.png) no-repeat center';
					break;
				//def
				case 1:
					val *= 3;

					characterData.battle.defend += val;
					chanceStr += '。 你的防御力' + (val > 0 ? '增加了' : '减少了') + val;

					info_show.style.background = 'url(images/event/info/defendup.png) no-repeat center';
					break;
				//agi
				case 2:
					val *= 3;

					characterData.battle.agility += val;
					chanceStr += '。 你的灵敏度' + (val > 0 ? '增加了' : '减少了') + val;

					info_show.style.background = 'url(images/event/info/agility.png) no-repeat center';
					break;
				//mod
				case 3:
					val *= 15;

					characterData.battle.mood += val;
					chanceStr += '。 你的心情' + (val > 0 ? '增加了' : '减少了') + val;

					info_show.style.background = 'url(images/event/info/moodup.png) no-repeat center';
					break;
				//item
				case 4:
					createItemInLootArea();
					break;
				//health
				case 5:
					val *= 5;

					var part;
					switch (getRandomPositiveInt(5)) {
						case 0:
							part = 'head';
							break;
						case 1:
							part = 'shoulder';
							break;
						case 2:
							part = 'arm';
							break;
						case 3:
							part = 'body';
							break;
						case 4:
							part = 'leg';
							break;
					}

					characterData.health[part] += val;
					chanceStr += '。 你的' + part + (val > 0 ? '恢复了' : '受到伤害') + val;

					info_show.style.background = 'url(images/event/info/battle.png)  no-repeat center';
			}

			//打印info_text文本
			typewritter(chanceStr,info_text);
		}else {
			//根据类别生成从itemData中随机抽取数据
			createItemInLootArea();
		}

		//刷新battle信息
		showAllState(characterData);

		////根据类别生成从itemData中随机抽取数据
		function createItemInLootArea() {
			////根据类别生成从itemData中随机抽取数据
			//根据cardObj.cardInfo找到itemData中对应类的数组currentDatas
			var currentDatas = itemData[cardObj.cardInfo];
			//生成随机数
			var rdm = Math.floor(Math.random()*currentDatas.length);
			//随机选择一个item
			var currentData = currentDatas[rdm];

			//在lootList中创建item对象
			generateItem(currentData);

			//刷新info图片
			info_show.style.background = 'url('+currentData.imgSrc+') no-repeat center/ 50%';
			//刷新info文本
			//info_text.innerHTML = createInfo('你在',infoKeyWord,currentData.itemInfo.name,'loot');
			//打字机效果
			typewritter(createInfo('你在',infoKeyWord,currentData.itemInfo.name,'loot'),info_text);
		}
	}

	////事件解析///

	////数据计算/显示////
	
	//每日耗损
	function eachdayExpenditure() {
		//每日耗费血量比0.1
		for (var attr in characterData.health) {
			if (attr == 'getOverall') {
				continue;
			}
			characterData.health[attr] = parseInt(characterData.health[attr] * .9);
		}

		//每日增加饥饿度
		characterData.battle.hungury += 2;
		//每日增加口渴度
		characterData.battle.thirsty += 5;

		//若hungury>90或thirsty>85
		//持续减少mood
		//持续减少health
		if (characterData.battle.hungury > 90
			|| characterData.battle.thirsty < 85) {
			//mood
			characterData.battle.mood -= 4;

			//health
			for (var attr in characterData.health) {
				if (attr == 'getOverall') {
					continue;
				}
				characterData.health[attr] -= 4;
			}
		}
	}

	//计算新的battleState
	function calBattle() {
		characterData.battle.attack += equipmentGain.atkGain;
		characterData.battle.defend += equipmentGain.defGain;
		characterData.battle.agility += equipmentGain.agiGain;
	}

	//限制characterData的health和battle各项数值在0-100
	//显示health和battle信息
	function showAllState(characterData) {
		var health = characterData.health;
		var battle = characterData.battle;

		//限制characterData的health和battle各项数值在0-100
		limitCharaterDataRange();

		//切换stateArea的overall图片//
		var overallImgSrc = 'url(images/state/normal.png) no-repeat';
		var overallHealth = health.getOverall();

		if (battle.mood < 20) {
			overallImgSrc = 'url(images/state/modlow.png) no-repeat';
		}

		if (battle.hungury > 80) {
			overallImgSrc = 'url(images/state/hgrhigh.png) no-repeat';
		}

		if (battle.thirsty > 75) {
			overallImgSrc = 'url(images/state/tsthigh.png) no-repeat';
		}

		if (!overallHealth) {
			overallImgSrc = 'url(images/state/dead.png) no-repeat';
		}else if (overallHealth < 30) {
			overallImgSrc = 'url(images/state/hplow.png) no-repeat';
		}else if (overallHealth > 70) {
			overallImgSrc = 'url(images/state/hphigh.png) no-repeat';
		}

		overall.style.background = overallImgSrc;
		//切换stateArea的overall图片//

		//显示所有health信息
		healthState.children[0].innerHTML = '头部 ' + health.head;
		healthState.children[1].innerHTML = '肩膀 ' + health.shoulder;
		healthState.children[2].innerHTML = '手臂 ' + health.arm;
		healthState.children[3].innerHTML = '身体 ' + health.body;
		healthState.children[4].innerHTML = '腿 ' + health.leg;

		//显示所有battle信息
		battleState.children[0].innerHTML = 'ATK ' + battle.attack;
		battleState.children[1].innerHTML = 'DEF ' + battle.defend;
		battleState.children[2].innerHTML = 'AGI ' + battle.agility;
		battleState.children[3].innerHTML = 'MOD ' + battle.mood;
		battleState.children[4].innerHTML = 'TST ' + battle.thirsty
		battleState.children[5].innerHTML = 'HGR ' + battle.hungury;
	}

	function limitCharaterDataRange() {
		for (var attr in characterData.health) {
			if (attr == 'getOverall') {
				continue;
			}
			var val = characterData.health[attr];
			if (val > 100) {
				characterData.health[attr] = 100;
			}else if (val < 0) {
				characterData.health[attr] = 0;
			}
		}

		for (var attr in characterData.battle) {
			var val = characterData.battle[attr];
			if (val > 100) {
				characterData.battle[attr] = 100;
			}else if (val < 0) {
				characterData.battle[attr] = 0;
			}
		}
	}

	//计算weaponArea和packArea重量
	function calWeight(characterItem) {
		var weaponSum = 0;
		var packSum = 0;

		characterItem.weapon.forEach(function(value) {
			weaponSum += value.itemInfo.weight;
		});

		characterItem.other.forEach(function(value) {
			packSum += value.itemInfo.weight;
		});

		return {weapon: weaponSum, pack: packSum};
	}

	//判断超重状态
	function overweightWarn(weight) {
		overweightFlag = {
			weapon: false,
			pack: false,
			weight: weight
		};

		//根据负重状态改变负重显示字体颜色
		if (weight.weapon > parseInt(maxLoad*0.9)) {
			weaponLoad.style.color = '#ff0000';
		}else if (weight.weapon < parseInt(maxLoad*0.7)) {
			weaponLoad.style.color = '#35bd33';
		}else {
			weaponLoad.style.color = '#f37c3d';
		}

		if (weight.pack > parseInt(maxLoad*0.9)) {
			packLoad.style.color = '#ff0000';
		}else if (weight.pack < parseInt(maxLoad*0.7)) {
			packLoad.style.color = '#35bd33';
		}else {
			packLoad.style.color = '#f37c3d';
		}

		if (weight.weapon >= maxLoad) {
			overweightFlag.weapon = true;
		}
		if (weight.pack >= maxLoad) {
			overweightFlag.pack = true;
		}
	}

	//计算battle影响因素
	function battleArguments(characterData) {
		//arg = [atkF,defF,agiF]
		var arg = [1,1,1];

		var mod = characterData.battle.mood;
		var tst = haracterData.battle.tst;
		var hgr = haracterData.battle.hgr;

		if (mod >= 80) {
			arg = [1.2,1,1.2];
		}else if (mod < 20) {
			arg = [0.8,1,1];
		}

		if (overweightFlag) {
			for (var i=0;i<3;i++) {
				arg[i] = min(0.5,arg[i]);
			}
		}

		if (tst > 85 || hgr > 90) {
			for (var i=0;i<3;i++) {
				arg[i] = min(0.7,arg[i]);
			}
		}

		return arg;
	}
	////数据显示/计算////

	////死亡////
	function deadCheck() {
		var deadFlag = false;

		var health = characterData.health.getOverall();
		var mood = characterData.battle.mood;

		if (!health || !mood) {
			deadFlag = true;
			alert('你已经死了');
		}
	}
	////死亡////

	////功能函数////
	
	//从characterData中加上obj的相应项的值
	function changeCharacterData(type,obj) {
		for (var attr in obj) {
			characterData[type][attr] += obj[attr];
		}
	}

	//根据情景生成随机文本
	function createInfo(subject,infoKeyWord,object,situation) {
		var str = '';
		var idx1 = getRandomPositiveInt(infoKeyWord.adjective.length);
		var idx2 = getRandomPositiveInt(infoKeyWord.location.length);
		var idx3 = getRandomPositiveInt(infoKeyWord.verb.loot.length);
		var idx4 = getRandomPositiveInt(infoKeyWord.comment.pos.length);

		switch (situation) {
			case 'loot':
				str = subject + infoKeyWord.adjective[idx1] + infoKeyWord.location[idx2] + infoKeyWord.verb.loot[idx3] + '┌ '+object +' ┘.' +infoKeyWord.comment.pos[idx4];
				break;
		}

		return str;
	}

	//用id和itemLevel判断是否堆叠
	function stackCheck(checkId,checkLevel,arr) {
		for (var i=0,len=arr.length;i<len;i++) {
			if (arr[i].id == checkId && arr[i].itemInfo.itemLevel == checkLevel) {
				return i;
			}
		}

		return -1;
	};

	////功能函数////

	/////////////////////////////////////////////////////
	//////////////剧情///////////////////////////////////
	////////////////////////////////////////////////////

	////主线剧情////
	// var mainPlotQueue = [mainplot1,mainplot2];
	//主线1: 苏醒
	function mainplot1() {
		clearBindFunc();

		var plotDataIdx = mainplotsData.findIndex(function(value) {
			return value.id == 1;
		});
		plotDisplay(mainplotsData[plotDataIdx]);
		mainplotsData.splice(plotDataIdx,1);
	}

	//主线2: 乞求
	function mainplot2() {
		clearBindFunc();

		var plotDataIdx = mainplotsData.findIndex(function(value) {
			return value.id == 2;
		});
		var plotData_backup;
		plotData_backup = deepCopy(mainplotsData[plotDataIdx],plotData_backup);

		plotDisplay(mainplotsData[plotDataIdx],resultFn);
		mainplotsData.splice(plotDataIdx,1);

		function resultFn() {
			var resultStr = '';
			var resultImgSrc = '';

			switch (dialogueSelect) {
				case 0:
					changeCharacterData('battle',{mood:-40,attack:2,defend:2,agility:2});

					resultStr = '出于警惕,你开枪杀死了男人,当你翻找尸体的时候,你发现他可能不过是一个疯疯癫癫的人.出于杀死无辜的平民的内疚感,你的心情变得更差了...苏醒后第一次战斗,让你的战斗本能恢复了一些...';
					resultImgSrc = 'images/event/plot/mainplot2-end1.png';
					break;
				case 1:
					changeCharacterData('health',{body:-30,arm:-30});

					resultStr = '他把一个破旧的水壶捧在手里,小心翼翼的用你割破手腕流下的献血接了小半壶."谢谢,士兵,"喝下几口血后,他的样子看起来比之前有了些生气,"你救了我的命,我会报答你的..."说着,他便选择另一条路离开了.由于失血,你的模样看上去并不好...';
					resultImgSrc = 'images/event/plot/mainplot2-end23.png';

					mainPlotQueue.push(mainplot2);
					mainplotsData.push(plotData_backup);
					break;
				case 2:
					changeCharacterData('battle',{mood:-10});

					resultStr = '不顾他眼中乞求的目光,你转身离去,渐渐地他的身影消失在你的视野里,你将他的命运的决定权再一次抛给废土...也许这是明智的做法,但是你心中人就感到一些不定...';
					resultImgSrc = 'images/event/plot/mainplot2-end23.png';
					break;
			}

			//刷新health和battle显示
			showAllState(characterData);

			//输出事件结果图片和文字
			typewritter(resultStr,info_text);
			info_show.style.background = 'url(' + resultImgSrc + ')  no-repeat center';
		}
	}

	//主线3: 
	function mainplot3() {
		clearBindFunc();

		var plotDataIdx = mainplotsData.findIndex(function(value) {
			return value.id == 3;
		});
		plotDisplay(mainplotsData[plotDataIdx],resultFn);
		mainplotsData.splice(plotDataIdx,1);

		function resultFn() {
			var resultStr = '';
			var resultImgSrc = '';

			switch (dialogueSelect) {
				case 0:case 1:
					changeCharacterData('battle',{mood:20});

					resultStr = '无论出于什么原因,你没有杀死女人,而是选择了继续上路,留下她独自等候可能已经在废土丧生的丈夫,安德鲁.很快你就把这件事抛在脑后了...';
					resultImgSrc = 'images/event/plot/mainplot3-end1.png';
					break;
				case 2:
					changeCharacterData('battle',{mood:-10,attack:2});

					resultStr = '你向女人开了一枪,正中眉心,她毫无痛苦的离开了...';
					resultImgSrc = 'images/event/plot/mainplot3-end2.png';
					break;
			}

			//刷新health和battle显示
			showAllState(characterData);

			//输出事件结果图片和文字
			typewritter(resultStr,info_text);
			info_show.style.background = 'url(' + resultImgSrc + ')  no-repeat center';
		}
	}

	//主线3后续1(不杀/离去)
	function mainplot3_1() {

	}

	//主线3后续1(杀死)
	function mainplot3_2() {
		
	}

	////主线剧情////

	//剧情显示
	function plotDisplay(plotData,resultFn) {
		//显示eventLayer
		eventLayer.style.display = 'block';
		
		//修改eventShow图片
		eventShow.style.background = 'url('+plotData.imgSrc.shift()+') no-repeat center';
		eventShow.style.opacity = '1';
		
		//修改eventText文本
		eventText.innerHTML = plotData.text.shift();
		
		//修改对话选项
		var eventDialogue = plotData.choice.shift();
		eventConfirm.innerText = eventDialogue[0].content;
		eventLeave.innerText = eventDialogue[1].content;
		eventRefuse.innerText = eventDialogue[2].content;

		eventConfirm.onclick = function() {
			if (!this.innerHTML) {
				return;
			}

			dialogueSelect = 0;
			confirm(plotData,resultFn);
		};
		eventLeave.onclick = function() {
			if (!this.innerHTML) {
				return;
			}
			if (!eventDialogue[1].ext_p) {
				dialogueSelect = 1;
				confirm(plotData,resultFn);
				return;
			}

			eventText.innerHTML = eventDialogue[1].ext_p;
			eventDialogue = eventDialogue[1].ext_s;
			eventConfirm.innerText = eventDialogue[0];
			eventLeave.innerText = eventDialogue[1];
			eventRefuse.innerText = eventDialogue[2];
		};
		eventRefuse.onclick = function() {
			if (!this.innerHTML) {
				return;
			}
			if (!eventDialogue[2].ext_p) {
				dialogueSelect = 2;
				confirm(plotData,resultFn);
				return;
			}

			eventText.innerHTML = eventDialogue[2].ext_p;
			eventDialogue = eventDialogue[2].ext_s;
			eventConfirm.innerText = eventDialogue[0];
			eventLeave.innerText = eventDialogue[1];
			eventRefuse.innerText = eventDialogue[2];
		};

		function confirm(plotdata,resultFn) {
			if (plotData.imgSrc.length) {
			//还有数据
				js_libs.miaov.mTween(eventShow,'opacity',0,500,'linear',function() {
					plotDisplay(plotData,resultFn);
				});
			}else {
			//没有数据
				hideEventLayer();
				resultFn && resultFn(dialogueSelect);
			}
		};
	}

	function hideEventLayer() {
		eventLayer.style.display = 'none';
		eventShow.style.background = '';
		eventText.innerHTML = '';
	}

	function clearBindFunc() {
		eventConfirm.onclick = null;
		eventLeave.onclick = null;
		eventRefuse.onclick = null;
	}
};












