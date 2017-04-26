var characterData = {
	name: 'Leon',
	age: 30,
	head: 1,
	hair: 1,
	body: 1,
	leg: 1,
	health: {
		head: 100,
		shoulder: 100,
		arm: 100,
		body: 100,
		leg: 100,
		getOverall: function() {
			return this.head*0.5 + this.shoulder*0.1+this.arm*0.1+this.body*0.2+this.leg*0.1;
		}
	},
	battle: {
		attack: 0,
		defend: 0,
		agility: 0,
		mood: 100,
		hungury: 0,
		thirsty: 0
	}
};

var characterItem = {
	weapon: [],
	other: []
};

var cardData = [
	{	
		id: 1,
		cardInfo: 'food',
		imgSrc: 'images/card/food.png',
	},
	{	
		id: 2,
		cardInfo: 'firstaid',
		imgSrc: 'images/card/firstaid.png',
	},
	{	
		id: 3,
		cardInfo: 'chance',
		imgSrc: 'images/card/chance.png',
	},
	{	
		id: 4,
		cardInfo: 'tool',
		imgSrc: 'images/card/tool.png',
	},
	{	
		id: 5,
		cardInfo: 'water',
		imgSrc: 'images/card/water.png',
	},
	{	
		id: 6,
		cardInfo: 'gun',
		imgSrc: 'images/card/gun.png',
	},
	{	
		id: 7,
		cardInfo: 'melee',
		imgSrc: 'images/card/melee.png',
	},
	{	
		id: 8,
		cardInfo: 'ammo',
		imgSrc: 'images/card/ammo.png',
	}
];

var itemData = {
	gun: [
		{
			id: 21,
			itemInfo: {name:'格洛克',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'ranged',itemPos: -1},
			imgSrc: 'images/item/glock.png'		
		}
	],
	melee: [
		{
			id: 22,
			itemInfo: {name:'瑞士军刀',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'melee',itemPos: -1},
			imgSrc: 'images/item/army-knife.png'		
		},
		{
			id: 23,
			itemInfo: {name:'砍刀',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'melee',itemPos: -1},
			imgSrc: 'images/item/machete.png'		
		},
		{
			id: 23,
			itemInfo: {name:'太刀',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'melee',itemPos: -1},
			imgSrc: 'images/item/tachi.png'		
		},
		{
			id: 31,
			itemInfo: {name:'棒球帽',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'helmet',itemPos: -1},
			imgSrc: 'images/item/baseballhat.png'	
		},
		{
			id: 32,
			itemInfo: {name:'防化服',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'armor',itemPos: -1},
			imgSrc: 'images/item/chemical.png'	
		},
		{
			id: 33,
			itemInfo: {name:'毛大衣',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'armor',itemPos: -1},
			imgSrc: 'images/item/fur.png'	
		},
		{
			id: 34,
			itemInfo: {name:'摩托头盔',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'helmet',itemPos: -1},
			imgSrc: 'images/item/motorhelmet.png'	
		},
		{
			id: 35,
			itemInfo: {name:'警帽',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'helmet',itemPos: -1},
			imgSrc: 'images/item/policehat.png'	
		},
		{
			id: 36,
			itemInfo: {name:'燕尾服',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'armor',itemPos: -1},
			imgSrc: 'images/item/swallow.png'	
		},
		{
			id: 37,
			itemInfo: {name:'T恤',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'armor',itemPos: -1},
			imgSrc: 'images/item/tshirt.png'	
		},
		{
			id: 38,
			itemInfo: {name:'毛线帽',type:'weapon',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'helmet',itemPos: -1},
			imgSrc: 'images/item/woolenhat.png'	
		}
	],
	tool: [
		{
			id: 15,
			itemInfo: {name:'撬棍',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/crowbar.png'
		},
		{
			id: 16,
			itemInfo: {name:'指南针',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/compass.png'
		},
		{
			id: 17,
			itemInfo: {name:'绳索',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/roop.png'
		},
		{
			id: 18,
			itemInfo: {name:'伐木斧',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/axe.png'
		},
		{
			id: 19,
			itemInfo: {name:'手电筒',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/torch.png'
		},
		{
			id: 20,
			itemInfo: {name:'打火机',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'fortask',itemPos: -1},
			imgSrc: 'images/item/lighter.png'
		}
	],
	water: [
		{
			id: 14,
			itemInfo: {name:'水源',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'forrecover',itemPos: -1},
			imgSrc: 'images/item/primary-water.png'
		}
	],
	food: [
		{
			id: 13,
			itemInfo: {name:'食物',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'forrecover',itemPos: -1},
			imgSrc: 'images/item/primary-food.png'
		}
	],
	firstaid: [
		{
			id: 12,
			itemInfo: {name:'医疗包',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'forrecover',itemPos: -1},
			imgSrc: 'images/item/primary-firstaid.png'
		}
	],
	ammo: [
		{
			id: 11,
			itemInfo: {name:'九毫米子弹',type:'other',weight:10,itemValue: 5,itemLevel: -1,itemDetail: 'forreload',itemPos: -1},
			imgSrc: 'images/item/9mm-ammo.png'
		}
	]
};

//effect:
//0: atk 0.05
//1: def 0.05
//2: agi 0.05
//3: mod 0.4
//4: item 0.05
//5: health 0.4 
//--> [0,1,2,3,4] head shoulder arm body leg
//--> 3

//effectArg:效果倍率
//1: 0.8
//2: 0.15
//3: 0.05
var chanceData = {
	nature: [-1,-1,-1,-1,-1,1,1,1,1,1],
	effect: [0,1,2,4,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,5],
	effectArg: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3]
};

var infoKeyWord = {
	person: ['Abrham Washington','Amanta','Butch','Confessor Cromwell','Allistair Tenpenny','Bittercup','Colonel Autumn','Dr. Li','Elder Lyons','Harkness','Jericho','Moira Brown','Eulogy Jones','James','Lucas Simms','Mr. Burke','Old Longfellow','Preston Garvey','Scrible Rothchild','Three Dog','Piper','Sarah Lyons','Star Paladin Cross'],
	adjective: ['废弃的','破旧的','昏暗的','狭小的','潮湿的','死气沉沉','满目疮痍','宁静的','支离破碎的','静谧的','倾塌的','气味难闻的','冰冷的','一片漆黑的','灯光微弱的','灯火通明的','肮脏的','漆黑的','黎明时分','夜幕降临的时候','荒凉的','奇怪的','怪异的','暗影朦胧','月光照射下的'],
	location: ['修车厂里','路边','灌木丛中','医院里','一片废墟中','花园里','水池旁','一片湖泊','工厂里','下水道中','阴影里','房梁上','坟地上','沼泽里','教室中','妓院里','洗手池内','公共厕所里','竞技场里','大街上','田地里','办公楼里'],
	verb: {
		loot: ['发现了','摸出来','挖掘到','看到','查探到','搜寻到','用氪金狗眼看到','像狗一样嗅到','捡到','偶然碰到'],
		chance: {
			pos: ['向你打招呼','赠送你一本书','与你分享故事','教你一招','向你微笑','对你唱歌','亲你一口','向你飞吻','给你说了个笑话','拥抱了你','和你跳舞','丢来一个包裹'],
			neg: ['开了一枪','吐你一身','砍出一刀','偷袭','扔出一颗手榴弹','自爆攻击','向你丢粪','甩出飞镖','伸出一条腿','呼你熊脸','挥出一拳','踹你一脚']
		}
	},
	comment: {
		pos: ['','','','','','you lucky dog','真是走了狗屎运','傻人有傻福','运气不错','LOL','人品爆发','今天运气不错','希望以后也会是好日子','欧拉拉','[屌面侠]','你爸是李刚么'],
		neg: []
	}
};

//levels获取几率
//1: 0.4
//2: 0.3
//3: 0.2
//4: 0.095
//5: 0.05
var levels = [1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,4,4,5];

//音乐列表数据
var musicData = [
    {
        "src" : "唐嫣-众里寻他.mp3",
        "lrc" :"[00:00.57]众里寻他 (网游《吞噬苍穹》主题曲)-唐嫣[00:18.62]每个女神都曾想过寻找最美的花[00:22.17]仰望星空心中闪烁都像神话童话[00:26.13]手托着脸颊 眼睛眨呀眨[00:29.64]突然心动了一下[00:33.59]长大以后为了梦想走遍海角天涯[00:37.03]一边受伤一边长大付出多少代价[00:40.88]外面星空下 最纯真的他[00:44.62]那种诗梦还在吗[00:47.66]众里寻他 和他 身驾五彩云霞[00:52.09]去追 去飞 飞过璀璨年华[00:55.33]梦中一刹那[00:57.92]跌宕心事千变万化[01:18.53]每个女神都曾想过寻找最美的花[01:22.10]仰望星空心中闪烁都像神话童话[01:25.74]手托着脸颊 眼睛眨呀眨[01:29.51]突然心动了一下[01:33.52]长大以后为了梦想走遍海角天涯[01:37.03]一边受伤一边长大付出多少代价[01:40.84]外面星空下 最纯真的他[01:44.53]那种诗梦还在吗[01:47.57]众里寻他 和他 身驾五彩云霞[01:52.10]去追 去飞 飞过璀璨年华[01:55.30]梦中一刹那 跌宕心事千变万化[02:02.56]众里寻他 众里寻他 众里寻他[02:17.46]众里寻他 和他 身驾五彩云霞[02:21.78]去追 去飞 飞过璀璨年华[02:25.04]梦中一刹那 跌宕心事千变万化[02:32.54]众里寻他 为他 盘起青春长发[02:36.94]年华 放下 了断俗世牵挂[02:40.27]梦想的天空 有心一定会到达[02:47.49]众里寻他 为他 盘起青春长发[02:51.75]年华 放下 了断俗世牵挂[02:55.23]梦想的天空 有心一定会到达[03:02.26]众里寻他"
    },
    {
        "src" : "周杰伦-美人鱼.mp3",
        "lrc" : "[00:00.60]美人鱼 - 周杰伦[00:24.98]维京航海  日记簿  停留在甲板等日出[00:28.87]瓶中信  被丢入  关于美人鱼的纪录[00:32.74]中世纪  的秘密  从此后被塞入了瓶盖[00:36.38]千年来  你似乎  为等谁而存在[00:40.11]或许凄美  在暧昧  海与夕阳之间金黄的一切[00:43.68]海岸线  在起雾  似乎是离别适合的季节[00:47.68]雾散后  只看见  长发的你出现在岸边[00:51.07]为了爱  忘了危险[00:53.61]美人鱼的眼泪[00:56.47]是一个连伤心都透明的世界[01:00.61]地平线的远方一轮满月[01:03.65]童话般感觉[01:05.05]让我爱上有你的黑夜[01:09.20]无声的眼泪[01:11.41]水族玻璃里你一次次的来回[01:15.56]思念成了仅存的那一切[01:20.58]缺氧的感觉[01:36.24]维京航海  日记簿  停留在甲板等日出[01:40.09]瓶中信  被丢入  关于美人鱼的纪录[01:44.03]中世纪  的秘密  从此后被塞入了瓶盖[01:47.63]千年来  你似乎  为等谁而存在[01:51.35]或许凄美  在暧昧  海与夕阳之间金黄的一切[01:55.20]海岸线  在起雾  似乎是离别适合的季节[01:58.86]雾散后  只看见  长发的你出现在岸边[02:02.39]为了爱  忘了危险[02:04.94]美人鱼的眼泪[02:07.77]是一个连伤心都透明的世界[02:11.85]地平线的远方一轮满月[02:14.82]童话般感觉[02:16.72]让我爱上有你的黑夜[02:20.46]无声的眼泪[02:22.39]水族玻璃里你一次次的来回[02:26.78]思念成了仅存的那一切[02:31.82]缺氧的感觉[02:46.59]美人鱼的眼泪[02:49.01]是一个连伤心都透明的世界[02:53.19]地平线的远方一轮满月[02:56.27]童话般感觉[02:57.95]让我爱上有你的黑夜[03:01.66]无声的眼泪[03:03.98]水族玻璃里你一次次的来回[03:08.01]思念成了仅存的那一切[03:12.54]缺氧的感觉"
    }
];

////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

////主线剧情
var mainplotsData = [
	{
		//plot1图文
		id: 1,
		imgSrc: [
			'images/event/plot/plot1.png',
			'images/event/plot/plot2.png',
			'images/event/plot/plot2.png',
			'images/event/plot/plot3.png',
			'images/event/plot/plot4.png'
		],
		text: [
			`
			再一次从昏迷中醒过来,你仍感觉到头部隐隐的阵痛.<br><br>你是谁?你在哪里?你要去做什么?仅仅片刻的思索也让你的大脑像火山爆发一样得沸腾起来.<br><br>你放弃深究,转而开始打探四周,毕竟在这一片死气沉沉的废土上,求生永远是第一位.<br><br>目之所及你看不到一点人类文明的迹象,或许你是最后的人类...片刻后,你在脑里无情的嘲笑了这个想法,开始寻找脱困的方法.
			<br><br>即使在这种情况下,你仍然感不到一丝害怕的感觉,这暗示着什么?也许你之前是特种兵也说不定...你笑了笑,拍拍裤子准备上路.突然从你手上的pipboy中传出一阵电流的嘈杂声...
			`,
			`
			"欢迎回来,游骑兵Leo..."一个略显疲惫的声音说道.<br><br>如果你猜得没错的话,无线电的背后坐着一个颐指气使的老头,你甚至可以脑补出他盛气凌人的样子.
			`,
			`
			"禁止提问,士兵!<br><br>游骑兵不是一份让你养家糊口的工作,无论发生了什么,你的血液里始终流淌着游骑兵的血..."声音听起来有些生气,<br><br>"这里是游骑兵11号信号台.接受你的命令,士兵..."
			`,
			`
			"士兵,我们现在无法定位你的位置,你已经失去联系超过一周时间,游骑兵大队到处都找不到你.<br><br>就在刚才游骑兵电台接收到你的无线电讯号,可以确定的是,你在11号信号塔信号覆盖范围之内.<br><br>你现在的任务是,找到最近的地标,确定自己的位置,照这地图格老子爬回来...<br><br>菜鸟,如果你害怕到忘记生存技巧,希望你没有丢掉游骑兵生存手册..."无线电发出一阵刺耳的嗡嗡声,重新恢复了安静...
			`,
			`
			害怕疲惫的大脑忘记了什么重要的安全准则,你从背包最底下拽出来一本破破烂烂的手册.这应该就是老头说的"游骑兵生存手册"吧.你翻到"废土章",看了起来...
			<br><br>...<br><br>安全条例1.注意你的食物,水源和药品,如果你不想长眠于废土之上,保持你的<strong>生命值,饥饿度和饥渴度</strong>在下限之上;<br><br>
				安全条例2.注意你的<strong>情绪</strong>,废土是生产疯子的沃土,一个疯疯癫癫的游骑兵就像拿着枪的熊孩子一样危险;<br><br>
				安全条例3.注意你的<strong>负重</strong>,尽管有办法可以提升你的负重上限,但你不是超人,即使你内裤外穿;<br><br>
				安全条例4.注意废土上的<strong>人</strong>,不是每个微笑的人都抱着善意,不是每个拿刀的人不能成为伙伴;<br><br>
				安全条例5.注意各种<strong>资源</strong>,你吓得尿裤子的时候也需要一块尿不湿...
				<br><br>...	
			`
		],
		choice: [
			[{
				content: '确定',
				ext_p: '',
				ext_s: ['','','']
			},{
				content: '',
				ext_p: '',
				ext_s: ['','','']
			},{
				content: '',
				ext_p: '',
				ext_s: ['','','']
			}],
			[{
				content: '你是谁?',
				ext_p: '',
				ext_s: ['','','']
			},{
				content: '所以我是个┌游骑兵┘么',
				ext_p: '理论上来说,曾经是...',
				ext_s: ['发生了什么','所以我现在是什么身份','你刚才为什么叫我游骑兵']
			},{
				content:'有人么?我需要救援...',
				ext_p: '安静,士兵,你哭哭啼啼的样子真像个小姑娘...',
				ext_s: ['没有人问你的意见','闭嘴','你的语气真让人讨厌']
			}],
			[
				{
					content: '是',
					ext_p: '',
					ext_s: ['','','']
				},
				{
					content: '遵命,长官',
					ext_p: '',
					ext_s: ['','','']
				},
				{
					content: '如你所愿,老头',
					ext_p: '',
					ext_s: ['','','']
				},
			],
			[
				{
					content: '让我们行动吧',
					ext_p: '助你好运,菜鸟...',
					ext_s: ['老头,等我回去一定胖揍你一顿','','']
				},
				{
					content: '等等,我还有些问题',
					ext_p: '留着回来再问吧,菜鸟...',
					ext_s: ['如你所愿','','']
				},
				{
					content: '我可以原地等待救援么',
					ext_p: '如果你想等死的话,就待在那里吧,辐射区太危险了,没人愿意冒着危险过去救你的',
					ext_s: ['好吧,真是个令人不安的答案','','']
				},
			],
			[
				{
					content: '一个艰难的任务,不是么??',
					ext_p: '',
					ext_s: ['','','']
				},
				{
					content: '',
					ext_p: '',
					ext_s: ['','','']
				},
				{
					content: '',
					ext_p: '',
					ext_s: ['','','']
				},
			]
		]
	},
	{
		//plot2图文
		id: 2,
		imgSrc: [
			'images/event/plot/plot5.png'
		],
		text: [
			`
			地平线上一个黑影的出现引起了你的注意.<br><br>渐渐走近时,你发现那是个衣衫褴褛的男人,沿着废弃公路踽踽独行.<br><br>他似乎已经走了数不清的时间,嘴唇干涸的像龟裂的土地.你的接近引起了他的注意,终于他停下脚步,缓缓地转向你.<br><br>你紧了紧手中的武器,想起"游骑兵手册"中的一段话:不是每个微笑的人都抱着善意...
			`
		],
		choice: [
			[{
				content: '立即攻击他',
				ext_p: '',
				ext_s: ['','','']
			},
			{
				content: '嘿,需要帮助么',
				ext_p: '"嘿,士兵,听着,"<br><br>他的声音像砂纸在玻璃上划过一样沙哑,<br><br>"我需要一点鲜血,我知道你可以帮帮我的..."<br><br>突然他停下来,你才发现他有对小眼睛.眼睛的主人一边向你点头哈腰,一边偷偷的撇着眼睛瞟你,像极了一只邋里邋遢的大狗...',
				ext_s: ['做梦[攻击]','听着,也许我可以帮你','转身离开']
			},
			{
				content: '呐,不要多管闲事...',
				ext_p: '',
				ext_s: ['','','']
			}]
		]
	},
	{
		//plot3图文
		id: 3,
		imgSrc: [
			'images/event/plot/plot6.png',
			'images/event/plot/plot7.png'
		],
		text: [
			`
			一个奇怪的小屋.你心里想到.<br><br>你走进因为辐射变得畸形的树林里,希望找到什么有用的资源,偶然发现了一间林中小屋.稍微有理智的人都不会把屋子建在这样荒芜的地上...<br><br>
			当你经过的时候,你听到一个女人的虚弱的声音:"安德鲁,是你么?"
			`,
			`
			当你正要行动的时候,一个声音说道:"陌生人,请帮我结束这痛苦的生命吧,屋子里的东西你都可以拿走..."你转过头去,发现女人无力的睁开眼睛看向你.
			`
		],
		choice: [
			[{
				content: '女士,需要帮忙么?',
				ext_p: '你走近窗户,透过玻璃看到一个躺在床上满脸虚弱的女人,似乎这会又失去了意识.<br><br>女人的手臂上腐烂得很严重,即使隔着窗户你仿佛都能闻到味道.明显她被严重的辐射病所折磨,和她近距离接触的话,没准自己都会被感染.<br><br>废土的辐射病是如此痛苦,以至于很多患上这种病的人选择了自杀.',
				ext_s: ['翻窗进去,看看能帮上什么','不淌这趟浑水','趁这机会搜刮小屋']
			},
			{
				content: '转身离去',
				ext_p: '',
				ext_s: ['','','']
			},
			{
				content: '趁机抢劫',
				ext_p: '',
				ext_s: ['','','']
			}],
			[{
				content: '如果这是你希望的话...',
				ext_p: '',
				ext_s: ['','','']
			},
			{
				content: '安德鲁是你的丈夫吧?他怎么办?',
				ext_p: '女人痛苦的转过身去.<br><br>"我可怜的安德鲁,明明知道只是徒劳,他也一定要去外面找药.已经过去一周了,他一定是死在废土之上."她顿了顿,似乎鼓起勇气恳求道,"请送我到他那里去吧,陌生人..."',
				ext_s: ['不...女士.我不会杀死你的','抱歉,女士,我有更重要的事情要做...','我会让这过程毫无痛苦的']
			},
			{
				content: '趁这机会搜刮小屋',
				ext_p: '你四处翻找的声音惊醒了女人,她歇斯底里的大叫起来,为了避免被潜在敌人听见,你不得不开枪结束了她的生命',
				ext_s: ['','','杀死女人']
			}]
		]
	}
];













