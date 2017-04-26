###原生js仿写的百度云网页客户端
##使用规则

* **左侧菜单**

		[回收站 clickedId == 9]

			1/ 回收站内不能创建文件夹
			2/ 回收站内不能下载
			3/ 回收站内文件加入"搜索"(?)
			4/ 回收站内只以列表显示
			5/ 回收站内可以进行 "还原" "彻底删除" 操作
				5.1/ 在右键菜单中操作
				5.2/ 在content-info中操作
<br>

		[左侧菜单"全部文件"项 clickedId == 1]

			1/ 点击显示全部文件/文件夹
<br>

		[左侧菜单"全部文件"项 clickedId == 8]
			1/ 暂留
<br>

		[左侧菜单其他项 clickedId == 2-7]
			1/ 点击显示该分类下的全部文件

***

* **user-info**

		1/ "wanna play games" 暂留

		2/ 移动到user-info上弹出pop层,
           移出延时隐藏pop层

 		3/ "客户端下载"  暂留

		4/ "system-info" 系统通知
	   	   "feedback"    回复
	   	   "night-mode"  黑夜模式

		5/ "smash it"    暂留

***

* **content-header**

		1/ "上传"

		2/ "新建文件夹"

		3/ "下载"

		4/ "我的设备"     暂留

		5/ content-op     默认隐藏/在有文件选中的情况下显示
			5.1/ "分享"   暂留
			5.2/ "下载"   
			5.3/ "删除"   删除 所有 (选中文件 和 文件夹及以子级所有文件/文件夹)
			5.4/ "重命名"
			5.5/ "复制到"
			5.6/ "移动到"
			5.7/ "更多"   暂留

		6/ content-search 用正则匹配搜索包含关键字的文件/文件夹
			6.1/ 文件/文件夹字符串构成: title + fileType + time.date

		7/ content-sort   排序
			7.1/ 用localCompare排列按文件名(中文) (?)
			7.2/ 用sort按时间排序

		8/ content-display 显示模式
			8.1/ 通过切换content的class改变不同样式
			8.2/ class="content content-list"显示列表模式
			8.3/ class="content content-icon"显示图标模式

***

* **content-info**

		1/ path        记录文件进入路径,点击span可以回溯
		2/ load        显示文件加载情况
		3/ checkall	   
			3.1/ check-btn 全选按钮
			3.2/ check-text 显示选中情况

***

* **content**

		1/ item(dl)
			构成:
				1.1/ dt                   存放文件图片,根据type和filetype切换图标
				1.2/ dd					  存放文件名
				////只在content-list下可见
				1.3/ content-list-op      文件列表操作
				1.4/ content-list-size	  显示文件大小
				1.5/ content-list-time	  显示文件时间
				////只在content-list下可见 end
				1.6/ span                 checkbox模拟
			功能:
				1.1/ hover改变item背景
				1.2/ 首次单击span选中文件,
					 	span -> .checkbox-active   选中checkbox
					 	item -> .item .item-active 选中item

					 再次单击span取消选中文件,
					 	span -> ''                 取消选中checkbox
					 	item -> .item  			   取消选中item
				1.3/ 双击item,
					1.3.1/ 若该文件 type == 'folder' 进入下一级菜单
					1.3.2/ 若该文件 type == 'file' 禁止进入下级菜单/选择方式打开文件
				1.4/ 左击item并拖动
					1.4.1/ 创建clone并拖动
					1.4.2/ 与所有当前目录下的文件(左上角)碰撞检测,若检测结果true且targetId有效,将该文件移动至目标文件(由targetId指向)下;
					1.4.3/ 删除clone
				1.5/ 右击item弹出自定义菜单
					1.5.1/ 在clickedId == 9 和 其他情况下显示不同内容
<br>

		2/ content显示由主函数fillcontent()负责刷新

***
***
***

##当前问题(更新至2-20)###

	1)重命名delete和blur冲突(?)

	2)findAllSubs需要最后一个return(?)

	3)[solved]删除数据移动至回收站

	4)[solved]移动数据后content-op没有消失

	5)解决全选与单击全选冲突

	6)[solved]重写fillContent():把数据获取与页面生成分离,方便排序操作

	7)[solved]用str.sort (function(a,b){return a.localeCompare(b)})排列中文

	8)[solved]重写data

	9)[solved]解决sprite在不同显示模式下位置关系

	10)把焦点给'网盘'问题

	11)[solved]页面大小被撑开问题

	12)[solved]1435行为什么要加if(){}条件
		判断只有最顶层文件夹被指向回收站

	13)[solved]不同情况content-info-path刷新问题

	14)[solved]movetoFooterConfirm.onclick()重复触发问题
		movetoFooterConfirm执行结束后没有清(targetId = -1)

	15)[solved]搜索不能找到顶层文件夹

	16)回收站内文件只保存7天cookie

	17)[solved]新建文件夹时做其他操作问题

	18)[solved]列表模式下 新建文件夹 小图标没对齐

	19)moveto-box中新建文件夹

	20)[solved]scrolltop与clientY问题

	21)回收站不能切换成icon显示模式

	22)只能同时移动一个文件

	23)右键两次点击选中问题

	24)右键菜单不能用html判断

	25)左侧菜单分类可以找到回收站

***
***
***

##重构js

	1. 复写main.js --> main_rewrite.js
