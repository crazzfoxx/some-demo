#walk alone

---

### 游戏目的
	
	当前游戏仅为体验性质,剧情不完整,尝试用原生js实现常规rpg游戏编写

---

### 文档结构
	
* html
		
		walkalone.html

* css

		|css-->reset.css         	css reset
		|css-->wrapper.css			外框以及整体布局
		|css-->loading.css			起始页
		|css-->areas.css            weaponArea/packArea/lootArea
		|css-->game-area.css        gameArea
		|css-->event-layer.css      事件层
		|css-->music.css            音乐播放器

* js

		|script-->data.js           数据
		|script-->js_libs.js  		通用函数库
		|script-->main.js			主函数备份
		|script-->main_for_modify.js主函数
		|script-->tool.js			项目通用工具函数

* images

		|images						通用图片和整体布局图片
		|images-->card				基本卡牌图片
		|images-->event-->info		随机事件图片
		|images-->event-->plot		剧情图片
		|images-->item				物品图片
		|images-->music				播放器图片
		|images-->state				人物状态图片

* music-list

		|music-list    				音乐文件

---
### 分层:
* loading起始页

		作用:  
			1\游戏标题和logo
			2\作为游戏loading
		
		主要实现方法:
			标题描绘: svg(path)+animation
			小球弹跳: js运动函数


* event-layer事件层
		作用:
			1\显示事件图片
			2\模拟对话框操作
			
		主要实现方法:
			事件图文显示: 主要函数plotDisplay(plotData,resultFn) line-1802:
			
			*读取每次事件数据plotData,当时间结束时,根据选项的不同,dialogueSelect对应的值不同

			*每次事件单独写事件结果函数resultFn(dialogueSelect),触发不同结果

			*对于多选择对话,采用若干步后回归主线减少编程代价

			*对于多选择结局,向事件队列mainPlotQueue插入对应后续事件函数

			*图文对应

* 游戏界面

		分区:
			1\左上-->weaponArea武器区:
				武器区显示当前包裹内武器和防具
			2\左下-->packArea道具区:
				道具区显示当前包裹内食物,水源,药品和工具
			3\右侧-->lootArea:
				显示翻牌成功搜刮到的所有物品
			4\整个中间-->gameArea游戏区:
				4_1 上侧-->stateArea状态区:
					4_1_1状态区主要区域包含人物当前所有的属性值[见属性介绍]并且实时更新;
					4_1_2状态区下侧三栏分别显示: 游戏时间(分/秒), 货币数量,
					当前生存天数
					4_1_3 [!important]点击当前生存天数进入下一天,同时监控当前生存天数触发剧情[见剧情]
					4_1_4状态区左侧数字[默认下为20]显示当前剩余操作步数
					4_1_5状态区右侧显示缩小化音乐播放器[见音乐播放器]
				4_2 左侧-->infoArea信息区:
					4_2_1信息区上侧是装备栏,包括:武器,衣服和头盔[见道具]以及人物头像
					4_2_2信息区下显示信息,显示非剧情随机事件,游戏内操作或立即型剧情结束信息的图(info_show)文(info_text)
					4_2_3info_text设置为打字机效果,无法通过常规<br>换行;
					4_2_4info_text文本根据事件性质随机生成[见文本生成]
				4_3	右侧-->cardArea卡牌区:
					卡牌区域包含2*8共16张卡牌,分别对应八种基本类型:
					食物, 水, 药物, 近战武器, 枪支, 工具, 弹药 和 随机事件.
					
					*在卡牌区进行翻牌配对,每一轮操作步数上限为20步

---


###游戏操作

		1\关于进度:
			点击stateArea中的[当前生存天数]进入下一天,同时监控当前生存天数触发剧情

		2\关于翻牌:
			在16张牌中任意点击两张,
			若图案一致,则配对成功,根据配对成功卡牌性质 在搜刮区 生成相应物品,或触发随机事件;
			配对成功的卡牌不能再次被翻转;
			若图案不一致,则配对失败,翻转过的两张卡牌恢复未翻转状态;
			
			[!important]翻转任意两张牌,无论配对是否成功,视为完成一次操作,每一天操作上限为20次;剩余次数为0时,禁止继续翻转,强制进入下一天;

		3\关于右键菜单rightClickMenu和拖拽操作:
				3_1\在武器区,道具区打开右键菜单可以 使用, 装备, 丢弃物品,
				更改相关属性,拾取的物品会自动分类;

				3_2\当前装备的物品会显示在信息区的武器栏相应位置,并增加人物相应属性

				3_3\在搜刮区打开右键菜单可以 拾取 物品,同时可以直接拖拽物品到对应的包裹.[!important]若拾取物品不能被拖拽到不同分类包裹下(eg.把道具类物品拖拽到武器类包裹下)

		4\关于event-layer对话框
				对话框默认有三个选项,对应性质为 confirm leave refuse,根据剧情数据修改选项innerHTML,但其触发前后性质不变

		5\关于物品搜刮与使用
				物品存在于lootArea中时可以被拾取,未被拾取的物品在进入新一天的时候消失;

				物品存在于weaponArea或packArea中时,可以被 装备 使用 丢弃;

		6\关于负重
				默认weaponArea和packArea各有100负重上限,当负重接近负重上限时(默认为90),战斗数据(attack,defend,agility)最大会削弱至0.5倍.当拾取的物品导致负重上限超出时,无法发生拾取动作;

		7\关于死亡条件判定
				游戏死亡条件有两个: overallhealth < 0 [见characterData] 或 mood < 0 [见characterData]

---

### 游戏数据
		
		1\characterData
		玩家数据,包含生命值信息(head,shoulder,arm,body,leg)和战斗数据(attack,defend,agility,mood,thirsty,hungury),用于相关剧情触发判断和战斗结果判定.
		[!important]此数据需要实时更新

			1_1生命值信息
			* 生命值由5部分组成(head,shoulder,arm,body,leg),各部分生命值限制为[0-100].
			* 总生命值overallhealth计算公式如下:
				overall health = head*.5 
								+ shoulder*.1 
								+ arm*.1+body*.2+leg*.1

			* 事件会影响不同部位的生命值,但是在以生命值为条件判定死亡时,以overallhealth为准

			* 水源,食物会对所有部位生命值有微量加成

			* 药品对所有部位生命值有大量加成

			* overallhealth不具体显示,以血量条高度形式以及logo人物行走速度显示,以overall状态辅助表现[见分层]

			1_2战斗信息
			* 战斗信息由6部分组成(攻击力attack,防御力defend,灵敏度agility,心情mood,饥渴度thirsty,饥饿度hungury),各项数据限制为[0-100].

			* 战斗信息不直接影响随机事件触发的战斗结果,但是对剧情结果有影响

			* 关于战斗信息的加成:
				1_2_1 装备可以加成战斗数据,武器增加attack,头盔增加agility,衣服增加defend.不同装备有不同加成.

				1_2_2 关于加成性质:
				并非所有加成均为增益,同时也会有减益可能.

				1_2_3 随机事件成功加成.
				翻牌触发1/2随机事件时,
				
				attack,defend,agility属性都有1/20的几率得到加成(基础加成为2),同时有0.15的几率得到两倍加成,0.05的几率得到3被加成(上限为6);
				
				mood属性有0.4的几率触发加成.

				1_2_4 剧情事件加成.剧情事件成功更改相应战斗数据,变更值固定.

		2\characterItem
		玩家背包物品信息,储存所有存在当前存在于背包中的物品,在操作背包物品时使用

		3\cardData
		基本卡牌信息,共有8基本类: food water gun melee fisrtaid chance ammo tool

		4\itemData
		对应每种基本类,存储相应物品信息数据;
		卡牌配对成功时,相应基本类的物品信息中随机选择数据信息.

		5\chanceData
		翻牌随机事件数据.包含(nature,effect,effectArg)三组数据.
		nature: 随机事件性质,+1有正面影响,-1有负面影响,各有0.5几率
		effect: 事件类型
			0 --> atk 0.05
			1 --> def 0.05
			2 --> agi 0.05
			3 -->  mod 0.4
			4 --> item 0.05
			5 --> health 0.4  
		effectArg: 效果倍率
			1: 0.8
			2: 0.15
			3: 0.05

		6\infoKeyWord
		关键词组合,用于根据事件数据生成随机文本,增加可玩性[见 随机文本生成]

		7\musicData
		音乐数据,包含路径和歌词信息
	
		8\mainplotsData
		存储剧情事件数据,
		基本格式为
		{
			id:,			//数据id,用于在事件队列中查找时间数据
			imgSrc: [],		//剧情图片路径
			text: [],		//剧情文本
			choice: []		//对话框选项
		}
		
		* 剧情图片路径,剧情文本,对话框选项均为数组形式,其内容一一对应

---

### 随机文本生成
		
	基本语句由几个部分构成: 主谓宾定状补
	实现文本随机化可以考虑将各部分拆开写成数组格式,构成基本语句时从各部分随机选取任一项拼成完整的话

	在本例中,将一句话拆分成
	person adjective location verb comment几个部分,组合成形如:
	"person 在 adjective location verb
	(thing) . conmment..."的话(eg.leon在阴暗的下水道给你一本书.真是惊喜...)

	* 需要注意的是 verb 存在正面和负面词性,对应的conmment将从对应词性的数据中随机选择

---

### 对话框实现

	对话框信息由mainplotsData中各项的choice确定
	基本格式为:
	{
		content: '确定',
		ext_p: '',
		ext_s: ['','','']
	}
	
	* content为选项内容
	* ext_p为选项后续文本,ext_s为选项后续选项

	若exp_p为空,则继续当前剧情后续情节;若当前剧情无后续情节,则隐藏event-layer层并触发事件结果函数resultFn

---

### 剧情产生
	1\剧情构成
		每个剧情由若干情节组成,每个情节用图文展示,并用对话框选择分支,
		最终对话框选项决定剧情结果,并调用相应结果函数resultFn

	2\剧情数据的基本格式为:
		{
			id:,			//数据id,用于在事件队列中查找时间数据
			imgSrc: [],		//剧情图片路径
			text: [],		//剧情文本
			choice: []		//对话框选项
		}
	
	剧情图片路径,剧情文本,对话框选项均为数组形式,在剧情中每次触发情节从数组分别调用Array.shift()方法取出第一项数据,图片路径放入event-show,文本放入text和对话框文本放入对应选项.

	3\剧情函数与剧情队列
	
	* 剧情的执行通过监控生存天数daysofsurvival实现	
	
	* 执行剧情函数(eg.mainplot1())实现剧情显示与选择
	剧情函数的基本构成为:
	清除 对话框选项 时间绑定
	显示剧情图文及对话框选项
	设置剧情结果函数resultFn
		
	* 剧情队列mainPlotQueue
	所有剧情函数存放在mainPlotQueue队列中,除了剧情一(介绍)以外,所有剧情在执行前会被打乱顺序

	通过监控生存天数,满足条件时,用Array.shift()方法取出当前剧情队列第一项执行,执行结果可能将新剧情推入mainPlotQueue并打乱顺序.

---

### 音乐播放器
	
	1\功能目的: 音乐播放器模块，为小游戏添加点缀...
	2\需求：游戏进程中添加音效，分为两部分，一部分在游戏时缩小显示，一部分为音乐播放界面。
		·缩小界面功能：切歌、播放和设置音量。
		·音乐播放界面功能：切歌、播放、设置音量、拖拽快进、歌词同步功能。
	3\问题：
		·用transition运动时对运动的监控。
		·布局不合理影响JS控制。
		·浏览器兼容性问题。
















