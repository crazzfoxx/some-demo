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

	var cardArea = gameArea.getElementsByClassName('card-area')[0];
	var cards = cardArea.getElementsByClassName('card');

	var infoArea = gameArea.getElementsByClassName('info-area')[0];
	var equipmentSlots = infoArea.getElementsByClassName('equipment')[0].getElementsByTagName('div');
	var info_show = infoArea.getElementsByClassName('show')[0];
	var info_text = infoArea.getElementsByClassName('text')[0];

	var stateArea = gameArea.getElementsByClassName('state-area')[0];
	var healthState = stateArea.getElementsByClassName('health')[0];
	var timecount = stateArea.getElementsByClassName('timecount')[0];
	var nukacola = stateArea.getElementsByClassName('nukacola')[0];
	var loadingBar = stateArea.getElementsByClassName('loading-bar')[0];
	var overall = stateArea.getElementsByClassName('overall')[0];
	var dayRecord = loadingBar.getElementsByTagName('strong')[0];

	//gameArea//

	//lootArea//
	var lootArea = document.getElementById('loot-area');
	var lootList = lootArea.getElementsByClassName('loot-list')[0];
	var dls_lootList = lootList.getElementsByTagName('dl');
	//lootArea//
	
	//rightClickMenu// 
	var rightClickMenu = document.getElementsByClassName('rightClickMenu')[0];
	//rightClickMenu// 

	/////////////////////执行//////////////////////

	//保存新生成的card对象
	var cardObjs = [];
	//保存新生成的item对象
	var itemObjs = [];
	//保留一次翻转操作中两张牌的信息
	var flipData = [];
	//记录当前操作的对象
	var objUnderOp;
	//记录当前生存天数
	var daysOfSuvival = 0;

	//记录最大负重上线
	var maxLoad = 100;
	//超重flag
	var overweightFlag = false;

	//生成cardArea的HTML和对象
	generateCardArea();

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
			});
		};
	})();

	//右键菜单操作
	(function() {
		var pick = rightClickMenu.children[0].children[0];
		var pickall = rightClickMenu.children[0].children[1];
		var equip = rightClickMenu.children[0].children[2];
		var takeoff = rightClickMenu.children[0].children[3];
		var drop = rightClickMenu.children[0].children[4];

		rightClickMenu.onclick = function() {
			this.style.cssText = '';
		}

		//拾取
		pick.onclick = function() {
			var type = objUnderOp.itemInfo.type;

			typewritter('你将'+objUnderOp.itemInfo.name+'放入背包中...',info_text);

			//深拷贝
			var newObj = {};
			newObj = deepCopy(findDataById(objUnderOp.id,itemData),newObj);

			//将item数据存入characterItem对应数组(深拷贝)
			if (type == 'weapon') {
				//检查item数据是否已经在characterItem中,
				var idx = checkInArrbyId(objUnderOp.id,characterItem.weapon);

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
			}else if (type == 'other') {
				//检查item数据是否已经在characterItem中,
				var idx = checkInArrbyId(objUnderOp.id,characterItem.other);

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

			//刷新weaponArea和packArea显示
			createItemAreas(characterItem);

			//在loot内删除该元素
			lootList.removeChild(objUnderOp.item);
		};
		//全部拾取
		pickall.onclick = function() {};
		//装备
		equip.onclick = function() {};
		//卸下
		takeoff.onclick = function() {};
		//丢弃
		drop.onclick = function() {
			lootList.removeChild(objUnderOp.item);
		};
	})();

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

			_this.turnAround();

			//地址传递关系
			flipData.push(_this);
			
			var c1 = flipData[0];
			var c2 = flipData[1];

			if (c2) {
				if (c1.id != c2.id) {
				//如果一次操作中翻转的两张牌对应的id不同,将会转回去
					info_show.style.background = '';
					info_text.innerHTML = '呲...呲...呲...无线联络器发出毫无意义的电信号声,你试图从中听到些什么,但是这些尝试显然是徒劳无功的...';
					setTimeout(function() {
						c1.turnAround();
						c2.turnAround();
					},500);
				}else {
				//如果一次操作中翻转的两张牌对应的id相同,则触发事件
				
					//翻转一次并且成功配对后设置为已翻转状态
					c1.isFlipped = true;
					c2.isFlipped = true;
										
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
		this.itemVal = eachData.itemVal;

		this.leftDist = 0;
		this.topDist = 0;

		//根据itemData生成item内容
		var dt = this.item.children[0];
		dt.style.background = '#fff url('+this.imgSrc+') no-repeat center/70%';
		var dd = this.item.children[1];
		dd.innerHTML = this.itemInfo.name;

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

			var flag = true;
			var type = _this.itemInfo.type;
			typewritter('你将'+_this.itemInfo.name+'放入背包中...',info_text);

			//声明新对象
			var newObj = {};
			//深拷贝
			newObj = deepCopy(findDataById(_this.id,itemData),newObj);

			if (type == 'weapon'
				&& collisionValidate(_this.item,weaponList).tlQuater) {
				//检查item数据是否已经在characterItem中,
				//若是则需要重叠物品,
				//若否,则新添加物品
				var idx = checkInArrbyId(_this.id,characterItem.weapon);
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
			}else if (type == 'other'
				&& collisionValidate(_this.item,packList).tlQuater) {
				//检查item数据是否已经在characterItem中,
				var idx = checkInArrbyId(_this.id,characterItem.other);
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

			//刷新weaponArea和packArea显示
			createItemAreas(characterItem);

			if (flag) {
				_this.item.style.cssText = '';
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

	///////////函数声明//////////
	function generateCardArea() {
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

	function parseItemEvent(cardObj) {
		//重要的是根据cardInfo: 'melee'解析

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

	// eventTriggered: {eventType: 0,eventNature: -1,eventValue: 10,eventTarget: 0}
	// //0:头部1:手臂2:肩膀3:身体4:腿
	function countDamage(eventTriggered) {
		var val = eventTriggered.eventNature * eventTriggered.eventValue;

		switch (eventTriggered.eventTarget) {
			case 0:
				characterData.health.head += val;
				break;
			case 1:
				characterData.health.arm += val;
				break;
			case 2:
				characterData.health.shoulder += val;
				break;
			case 3:
				characterData.health.body += val;
				break;
			case 4:
				characterData.health.leg += val;
				break;
		}

		showHealth(characterData.health);
	}

	function showHealth(health) {
		healthState.children[0].innerHTML = '头部 ' + health.head;
		healthState.children[1].innerHTML = '肩膀 ' + health.shoulder;
		healthState.children[2].innerHTML = '手臂 ' + health.arm;
		healthState.children[3].innerHTML = '身体 ' + health.body;
		healthState.children[4].innerHTML = '腿 ' + health.leg;
	}

	function generateLi(id,num,container) {
		var li = document.createElement('li');
		//记录物品id
		li.itemId = id;
		//获取物品名称
		li.innerHTML = findDataById(id,itemData).itemInfo.name + (num < 2 ? '' : ('(' + num + ')'));
		container.appendChild(li);
	}

	//刷新显示weaponArea和packArea
	function createItemAreas(characterItem) {
		// console.log(characterItem);
		//刷新显示weaponArea
		weaponList.innerHTML = '';

		for (var i=0,len=characterItem.weapon.length;i<len;i++) {
			generateLi(characterItem.weapon[i].id,characterItem.weapon[i].num,weaponList);
		}

		//刷新显示packArea
		packList.innerHTML = '';

		for (var i=0,len=characterItem.other.length;i<len;i++) {
			generateLi(characterItem.other[i].id,characterItem.other[i].num,packList);
		}

		//刷新显示load
		var weight = calWeight(characterItem);

		//highlight超重状态
		overweightWarn(weight);

		//刷新重量显示
		weaponLoad.innerHTML = weight.weapon+'/'+maxLoad;
		packLoad.innerHTML = weight.pack+'/'+maxLoad;
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

	function overweightWarn(weight) {
		overweightFlag = false;

		if (weight.weapon > parseInt(maxLoad*0.7)) {
			weaponLoad.style.color = '#f37c3d';
		}
		if (weight.weapon > parseInt(maxLoad*0.9)) {
			weaponLoad.style.color = '#ff0000';
			overweightFlag = true;
		}

		if (weight.pack > parseInt(maxLoad*0.7)) {
			packLoad.style.color = '#f37c3d';
		}
		if (weight.pack > parseInt(maxLoad*0.9)) {
			packLoad.style.color = '#ff0000';
			overweightFlag = true;
			overweightFlag = true;
		}
	}

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
};











