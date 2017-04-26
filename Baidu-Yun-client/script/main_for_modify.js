//注意备份
//当前问题:
//1)重命名delete和blur冲突(?)
//2)findAllSubs需要最后一个return(?)
//3)[solved]删除数据移动至回收站
//4)[solved]移动数据后content-op没有消失 
//5)解决全选与单击全选冲突
//6)[solved]重写fillContent():把数据获取与页面生成分离,方便排序操作
//7)用str.sort (function(a,b){return a.localeCompare(b)})排列中文
//8)[solved]重写data
//9)[solved]解决sprite在不同显示模式下位置关系
//10)把焦点给'网盘'问题
//11)[solved]页面大小被撑开问题
//12)[solved]1435行为什么要加if(){}条件 --> 判断只有最顶层文件夹被指向回收站
//13)[solved]不同情况content-info-path刷新问题 --> 在fillContent中根据clickedId修改path显示
//14)[solved]movetoFooterConfirm.onclick()重复触发问题
//15)[solved]搜索不能找到顶层文件夹
//16)回收站内文件只保存7天cookie
//17)新建文件夹时做其他操作问题
//18)列表模式下 新建文件夹 小图标没对齐
//19)moveto-box中新建文件夹

window.onload = function() {
	///////////////////////////////////////////////////
	///////////////变量声明////////////////////////////
	///////////////////////////////////////////////////
	
	//此处引入script/variable_declaration.js进行变量声明
	//////////////////文档生成/操作////////////////////
	(function() {
		////变量声明
		var datas = data.files;
		//定义左键已点击id,默认为点击'全部图片'项
		var clickedId = 1;
		//定义右键已点击id,默认为未点击
		var rightClickedId = -1;

		//初始化路径
		var paths = [];
		paths.push(1);

		//初始化已选中项目数组
		var selectIds = [];
		//初始化选中项id及其所有子项id数组
		var selfnsubsIds = [];
		//初始化回收站文件id数组,
		//记录一遍在删除后不再被分类或搜索找到
		var trashIds = [];

		//初始化moveto选择项目的id
		var targetId = -1;
		//初始化当前选择的文件id(只有一项)
		var opId = -1;

		//默认非拖拽文件状态
		var isDrag = false;	

		////执行
		for (var i=0;i<contextLis.length;i++) {
			//初始化cid
			contextLis[i].cid = i + 1;
			//给每一个context里的li绑定事件
			contextLis[i].onclick = function() {
				//修改title
				var re = /[^全部|我的分享|回收站](\W+)/g;
				var ctitle = this.lastElementChild.innerHTML;
				var ntitle = ctitle.match(re);
				document.title = '流域-' + (ntitle == null ? ctitle: '全部' + ntitle);

				//设置焦点
				for (var i=0;i<contextLis.length;i++) {
					contextLis[i].className = '';
				}
				this.className = 'li-active';

				//设置已点击的文件id
				clickedId = this.cid;

				paths.pop();
				paths.push(clickedId);
				//重新生成content内容
				fillContent(content,getContentData(clickedId,clickedId));

				if (clickedId == 9) {
					contentDisplay_list.onclick();
					recover.style.display = 'block';
					clearall.style.display = 'block';
				}else {
					if ([1,2,3,4,5,6,7,8].indexOf(clickedId) != -1) {
						contentDisplay_icon.onclick();
					}
					recover.style.display = '';
					clearall.style.display = '';
				}
			};
		}

		////新建文件夹操作
		var contentNewFun = {
			dl: null,
			dt: null,
			dd: null,
			ipt: null,
			createNewFolder: function() {
				var _this = this;

				//回收站内不能新建文件夹
				if (clickedId == 9) {
					return;
				}

				//创建dl(item),dt(>div),dd(ipt),span结构
				//dl: 整个文件包围区域
				//dt: 包含文件图标(sprite包含在合适大小的div中)
				//dd: 包含输入框
				//ipt: 文件名输入框
				//span: 模拟checkbox
				dl = document.createElement('dl');
				dl.className = 'item';
				//提升层级,与mask.style.display结合操作
				dl.style.zIndex = '102';
				//取消冒泡,防止触发content框选操作
				dl.onmousedown = function(ev) {
					var ev = ev || event;
					ev.cancelBubble = true;
				};

				dt = document.createElement('dt');
				var div = document.createElement('div');
						
				//用雪碧图生成文件图标
				//spritePosData在data.js中,
				//保存了文件相应图标在sprite中的绝对位置
				//spritePosDat的结构是:{a:[posx,posy],b:[posx,posy],...}
				var spritePos = spritePosData.folder;

				//设置参数,list模式下sprite图标大小是icon模式下的1/2
				var divisor = 1;
				if (content.className == 'content content-list') {
					divisor = 2;
				}

				div.style.backgroundPosition = (-spritePos[0] / divisor) + 'px ' + (-spritePos[1] / divisor) + 'px';
				dt.appendChild(div);
				dl.appendChild(dt);

				dd = document.createElement('dd');
				ipt = document.createElement('input');
				ipt.style.padding = '0 2px';

				dd.appendChild(ipt);
				dl.appendChild(dd);

				var span = document.createElement('span');
				span.className = 'checkbox';
				span.checked = false;
				dl.appendChild(span);

				content.appendChild(dl);

				//显示mask,防止在新建文件夹未完成时触发其他动作bug
				mask.style.display = 'block';

				//按下enter确认新建文件夹
				document.onkeydown = function() {
					_this.finishGeneration();
				};

				//把焦点给ipt
				ipt.focus();
			},
			generateFolderData: function() {
				//若文本框为空,清除创建的dl
				if (ipt.value == '') {
					content.removeChild(dl);
				}else {
				//若文本框不为空,
					//获取新的文件夹名
					var newTitle = ipt.value;
					//生成新id
					var newId = createNewId();
					dd.innerHTML = newTitle;
					//生成新时间戳
					var newTime = getDate();

					//在datas中添加数据
					datas.push({
						id: newId,
						pid: clickedId,
						title: newTitle,
						type: 'folder',
						time: newTime,
						size: '0Mb'
					});

					//重绘content
					fillContent(content,getContentData(clickedId));
				}
			},
			finishGeneration: function(ev) {
				var ev = ev || event;

				if (ev.keyCode == 13) {
					//创建文件夹
					this.generateFolderData();
					//创建结束后,
					//隐藏mask
					//还原dl(item)层级(一般情况下z-index: 2)
					mask.style.display = 'none';
					dl.style.zIndex = '';
				}
			}
		};

		contentNew.onclick = function() {
			contentNewFun.createNewFolder();
		};

		////全选操作
		var checkBtnFunc = {
			clicked: false,
			click: function() {
				if (!this.clicked) {
					this.className = 'check-btn-active';
				}else {
					this.className = 'check-btn';
				}

				//所有items点击状态取反
				for (var i=0;i<items.length;i++) {
					items[i].onmouseenter();
					items[i].lastElementChild.onclick();
					items[i].onmouseleave();
				}

				//checkBtn状态取反
				this.clicked = !this.clicked;
			}
		};

		checkBtn.onclick = function() {
			checkBtnFunc.click();
		};

		////框选操作
		//在content内按下鼠标触发框选动作
		var dragSelectFun = {
			oldPos: 0,
			newPos: 0,
			content_size: null,
			contentScrollTop: 0,
			contentScrollLeft: 0,
			div: null,
			dragSelectDown: function(ev) {
				var _this = this;
				//解决重命名delete和blur冲突(bug被其他方案替代)
				// header.children[0].focus();
				
				var ev = ev || event;
				//只允许左键触发
				if (ev.button != 0) {
					return;
				}

				this.oldPos;
				this.newPos;
				this.content_size = content.getBoundingClientRect();
				this.contentScrollTop = content.scrollTop;
				this.contentScrollLeft = content.scrollLeft;

				this.div = document.createElement('div');
				this.div.className = 'choose';

				content.appendChild(this.div);

				this.oldPos = {
					left: ev.clientX - this.content_size.left + this.contentScrollLeft,
					top: ev.clientY - this.content_size.top + this.contentScrollTop
				};

				this.div.style.left = this.oldPos.left + 'px';
				this.div.style.top = this.oldPos.top + 'px';

				document.onmousemove = function() {
					_this.dragSelectMove();
				};

				document.onmouseup = function() {
					_this.dragSelectUp();
				};
			},
			dragSelectMove: function(ev) {
				if (!isDrag) {
					var ev = ev || event;
					this.newPos = {
						left: ev.clientX - this.content_size.left + this.contentScrollLeft,
						top: ev.clientY - this.content_size.top + this.contentScrollTop
					};

					if (this.newPos.left < 10 + this.contentScrollLeft) {
						this.newPos.left = 10 + this.contentScrollLeft;
					}else if (this.newPos.left > this.content_size.width - 10 + this.contentScrollLeft) {
						this.newPos.left = this.content_size.width - 10 + this.contentScrollLeft;
					}

					if (this.newPos.top < 10 + this.contentScrollTop) {
						this.newPos.top = 10 + this.contentScrollTop;
					}else if (this.newPos.top > this.content_size.height - 10 + this.contentScrollTop) {
						this.newPos.top = this.content_size.height - 10 + this.contentScrollTop;
					}

					var newWidth = this.newPos.left - this.oldPos.left;
					var newHeight = this.newPos.top - this.oldPos.top;

					this.div.style.width = Math.abs(newWidth) + 'px';
					this.div.style.height = Math.abs(newHeight) + 'px';

					if (newWidth < 0) {
						this.div.style.left = this.newPos.left + 'px';
					}
					if (newHeight < 0) {
						this.div.style.top = this.newPos.top + 'px';
					}
				}
			},
			dragSelectUp: function() {
				if (!isDrag) {
					for (var i=0;i<items.length;i++) {
						items[i].flag = collisionValidate(this.div,items[i]).isCls;
						if (items[i].flag) {
							items[i].onmouseenter();
							items[i].lastElementChild.onclick();
							items[i].onmouseleave();
						}
					}

					content.removeChild(this.div);
				}

				isDrag = false;
				document.onmousemove = document.onmouseup = null;

			}
		};

		content.onmousedown = function() {
			dragSelectFun.dragSelectDown();

			return false;
		};

		////返回上一级操作
		backwards.onclick = function() {
			path.children[path.children.length-2].onclick();
			//显示backwards
			if (clickedId != 1) {
				backwards.style.display = 'block';
			}else {
				backwards.style.display = '';
			}
		};

		////op删除操作
		var opDeleteFunc = {
			delete: function() {
				//从数据中删除已选中文件
				datas = this.moveToTrash(datas,selectIds);

				//重新生成content内容
				fillContent(content,getContentData(clickedId,clickedId));

				//修改checkText内容
				checkText.innerHTML = '全选';

				//推入trashIds保存已经删除数据的id
				trashIds = [].concat(selectIds);
				//清空已选项id
				selectIds = [];
			},
			moveToTrash: function(datas,selectIds) {
				var idx;

				for (var i=0;i<selectIds.length;i++) {
					idx = datas.findIndex(function(value) {
						return value.id == selectIds[i];
					});

					var trash = datas[idx];

					//只有最顶级文件夹/文件的pid才指向9(回收站)
					//在clickedId == 2,3,4,5,6,7时,只显示对应类型文件,不可能含
					//下一级数据,已经是最顶层,因此可以直接pid指向9(回收站)
					if ([trash.pid,2,3,4,5,6,7].indexOf(clickedId) != -1) {
						//将当前删除的顶层数据的pid指向回收站
						trash.rid = trash.pid;
						trash.pid = 9;
					}
				}

				return datas;
			}
		}; 

		opDelete.onclick = function() {
			opDeleteFunc.delete();
		};

		////重命名操作
		//只允许一次重命名一个文件,
		//在checkbox点击判断时,
		//若选择了一个文件,
		//使能重命名操作opRename.open = true
		//若选择了不止一个文件,
		//禁止重命名操作opRename.open = false

		var opRenameFunc = {
			open: false,
			idx: -1,
			click: function() {
					var _this = this;

					if (this.open) {
						//获取当前选择文件在content中的index
						for (var i=0,len=items.length;i<len;i++) {
							if (items[i].lastElementChild.checked) {
								idx = i;
								break;
							}
						}

						//隐藏原文件名
						items[idx].children[1].style.visibility = 'hidden';

						//显示renameBox
						renameBox.style.display = 'block';
						//重新定位rename
						rename.style.cssText = 'left:'+(items[idx].offsetLeft - 6)+'px;top:'+(items[idx].offsetTop + 90)+'px;'

						//renameIpt获取原文件名(<dt>title</dt>)
						//并选中文字
						renameIpt.value = items[idx].children[1].innerHTML;
						renameIpt.select();

						renameConfirm.onclick = function() {
							_this.confirm();
						};

						renameCancel.onclick = function() {
							_this.cancel();
						}

					}
				},
			//确认重命名
			confirm: function() {
					//隐藏renameBox
					renameBox.style.display = '';
					//恢复rename位置(可省略)
					rename.style.cssText = '';

					//若输入框为空
					if (renameIpt.value == '') {
						//显示原文件名
						items[idx].children[1].style.visibility = '';
						//清空renameIpt输入框
						renameIpt.value = '';
						return;
					}

					//修改相应数据
					var renameIdx = datas.findIndex(function(value) {
						return value.id == items[idx].cid;
					});
					datas[renameIdx].title = renameIpt.value;

					//清空renameIpt输入框
					renameIpt.value = '';

					//重绘content内容
					fillContent(content,getContentData(datas[renameIdx].pid));
				},
			//取消重命名都会恢复显示原文件名
			//不影响数据
			cancel: function() {
					//隐藏renameBox
					renameBox.style.display = '';
					//恢复rename位置(可省略)
					rename.style.cssText = '';

					//显示原文件名
					items[idx].children[1].style.visibility = '';
					//清空renameIpt输入框
					renameIpt.value = '';

					renameConfirm.onclick = renameCancel.onclick = null;
				}
		};

		opRename.className = 'op-rename op-inactive';
		opRename.onclick = function() {
			opRenameFunc.click();
		};

		////moveto-box移动至/复制操作
		var movetoBoxFunc = {
			//初始化移动至/复制操作模式
			mode: {
				moveto: false,
				cloneto: false
			},
			//初始化需要复制的数据
			//data_to_clone_1用于获取,保持不变
			//data_to_clone_2用于复制,进行操作
			data_to_clone_1: [],
			data_to_clone_2: [],
			//移动至
			fnMoveto: function() {
				//获取当前已点击文件的id
				opId = selectIds[0];

				//设置为移动至模式
				this.mode.moveto = true;

				//显示mask和movetoBox
				mask.style.display = 'block';
				movetoBox.style.display = 'block';
			},
			//复制到
			fnCopyto: function() {
				//获取当前已点击文件的id
				opId = selectIds[0];

				//设置为复制模式
				this.mode.cloneto = true;

				//显示mask和movetoBox
				mask.style.display = 'block';
				movetoBox.style.display = 'block';
			},
			//确认移动至/复制到操作
			fnConfirm: function() {
				//不能移动至/复制到最顶层目录'百度云'下
				//不能移动至/复制到已选中文件/文件夹下层
				if (targetId == -1 
					|| selectIds.indexOf(targetId) != -1) {
					return -1;
				}

				//禁止移动至非folder类型文件下
				var targetIdx = datas.findIndex(function(val) {
					return val.id == targetId;
				});

				if (datas[targetIdx].type != 'folder') {
					return -1;
				}

				//将opId移动至targetId下
				var idx = datas.findIndex(function(val) {
					return val.id == opId;
				});

				//获取当前pid
				var pre_pid = datas[idx].pid;

				if (this.mode.moveto) {
					//将需要移动文件夹的pid指向移动到文件夹的id
					datas[idx].pid = targetId;
					//修改checkText内容
					checkText.innerHTML = '全选';
				}

				if (this.mode.cloneto) {
					this._getCloneData(selectIds);
					this._setIds();
					datas = datas.concat(this.data_to_clone_2);

					//清空data_to_clone
					this.data_to_clone_1 = [];
					this.data_to_clone_2 = []; 
				}

				//刷新content
				fillContent(content,getContentData(pre_pid));

				//关闭movetoBox操作
				movetoFooterCancel.onclick();

				//隐藏contentOp
				contentOp.style.display = '';

				//执行结束,清除targetId
				targetId = -1;
			},
			fnCancel: function() {
				//隐藏movetoBox
				mask.style.display = '';
				movetoBox.style.display = '';
				//重置mode
				this.mode.cloneto = false;
				this.mode.moveto = false;
			},
			//生成MovetoContentList内容
			fnCreateMovetoTree: function(obj,id) {
				//通过id找到子数据
				var arr = datas.filter(function (value){
					return value.pid == id;	
				});

				//没有子数据 不向下执行
				if(!arr.length) {
					return;
				}

				var ul = document.createElement('ul');

				for (var i=0,len=arr.length;i<len;i++) {
					var currentData = arr[i];

					if (currentData.type != 'folder') {
						continue;
					}

					var li = document.createElement('li');

						var span = document.createElement('span');					
						span.innerHTML = '<i class="fa fa-folder"></i>' + currentData.title;
						span.cid = currentData.id;
						span.open = true;
						span.onclick = function() {
							targetId = this.cid;
							for (var i=0,len=movetoContextList_spans.length;i<len;i++) {
								movetoContextList_spans[i].className = '';
							}
							this.className = 'active-span';
							if (this.open) {
								this.children[0].className = 'fa fa-folder-open';
								if (this.nextElementSibling) {
									this.nextElementSibling.style.display = 'block';
								}
							}else {
								this.children[0].className = 'fa fa-folder';
								if (this.nextElementSibling) {
									this.nextElementSibling.style.display = '';
								}
							}
							this.open = !this.open;
						};
						li.appendChild(span);

						this.fnCreateMovetoTree(li,span.cid);
						ul.appendChild(li);
				}

				obj.appendChild(ul);
			},
			_getCloneData: function(selectIds) {
				for (var i=0,len=selectIds.length;i<len;i++) {
					var val = datas.find(function(value) {
						return value.id == selectIds[i];
					});

					var val_1 = clone(val);
					this.data_to_clone_1.push(val_1);

					var val_2 = clone(val);
					this.data_to_clone_2.push(val_2);
				}
			},
			_setIds: function() {
				for (var i=0,len=this.data_to_clone_2.length;i<len;i++) {
					this.data_to_clone_2[i].id = createNewId();
				}
				for (var i=0,len=this.data_to_clone_2.length;i<len;i++) {
					this.data_to_clone_2[i].pid = this._getPid(i);
				}
			},
			_getPid: function(idx) {
				var pre_id = this.data_to_clone_1[idx].pid;
				var _idx = this.data_to_clone_1.findIndex(function(value) {
					return value.id == pre_id;
				});

				if (_idx == -1) {
					return targetId
				}else {
					return this.data_to_clone_2[_idx].id;
				}
			}
		};

		//生成movetoContextList
		var initId = 1;
		movetoContextList.innerHTML = '';
		movetoBoxFunc.fnCreateMovetoTree(movetoContextList,initId);

		//移动至
		opMoveto.onclick = function() {
			movetoBoxFunc.fnMoveto();
		};

		//复制到
		opCopyto.onclick = function() {
			movetoBoxFunc.fnCopyto();
		}

		//确认移动至/复制到操作
		movetoFooterConfirm.onclick = function() {
			movetoBoxFunc.fnConfirm();
		};

		//取消移动至/复制到操作
		movetoFooterCancel.onclick = movetoHeaderCancel.onclick = function() {
			movetoBoxFunc.fnCancel();
		}

		////content-header操作
		var contentHeaderFun = {
			//默认图标显示
			isIconDisplay: true,
			//默认禁止时间排序
			isTimeSort: true,
			////显示模式操作
			//默认列表显示
			display_list: function() {
				if (!this.isIconDisplay) {
					return;
				}

				contentDisplay_list.className = 'active';
				contentDisplay_icon.className = '';

				content.className = 'content content-list';
				fillContent(content,getContentData(clickedId,clickedId));

				this.isIconDisplay = !this.isIconDisplay;		
			},
			//默认图标显示
			display_icon: function() {
				if (this.isIconDisplay) {
					return;
				}

				contentDisplay_list.className = '';
				contentDisplay_icon.className = 'active';

				content.className = 'content content-icon';
				fillContent(content,getContentData(clickedId,clickedId));

				this.isIconDisplay = !this.isIconDisplay;
			},
			//按本地方式排序文件名
			sort_by_title: function() {
				if (!this.isTimeSort) {
					return;
				}

				contentSort_title.className = 'active';
				contentSort_time.className = '';

				var arr = getContentData(clickedId,clickedId);
				arr.sort(function compareFunction(a, b) {
			        return (a.title).localeCompare(b.title);
				});

				//重绘content
				fillContent(content,arr);

				this.isTimeSort = !this.isTimeSort;
			},
			//按时间排序
			sort_by_time: function() {
				if (this.isTimeSort) {
					return;
				}

				contentSort_time.className = 'active';
				contentSort_title.className = '';

				var arr = getContentData(clickedId,clickedId);
				arr.sort(function(a,b) {
					return b.time.ms - a.time.ms;
				});

				//重绘content
				fillContent(content,arr);

				this.isTimeSort = !this.isTimeSort;
			}
		};

		contentDisplay_list.onclick = function() {
			contentHeaderFun.display_list();
		};

		contentDisplay_icon.onclick = function() {
			contentHeaderFun.display_icon();
		};

		contentSort_title.onclick = function() {
			contentHeaderFun.sort_by_title();
		};

		contentSort_time.onclick = function() {
			contentHeaderFun.sort_by_time();
		};	

		//user弹出层
		var userpopFunc = {
			userpop_timer: null,
			show: function() {
				clearTimeout(this.userpop_timer);

				pop.style.display = 'block';
				arrow.innerHTML = '<i class="fa fa-circle-o-notch">';

				document.addEventListener('click',function() {
					pop.style.display = '';
				},false);
			},
			hide: function() {
				this.userpop_timer = setTimeout(function() {
					pop.style.display = '';
					arrow.innerHTML = '<i class="fa fa-circle-o-notch fa-spin">';
				},260);
			}
		};

		userInfo.onmouseenter = function() {
			userpopFunc.show();
		};
		userInfo.onmouseleave = function() {
			userpopFunc.hide();
		};
		pop.onclick = function(ev) {
			var ev = ev || event;
			ev.cancelBubble = true;
		};

		//content-header弹出层
		(function() {
			//移入显示contentUpload下拉列表
			contentUpload.onmouseenter = function() {
				this.children[1].style.display = 'block';
			};

			//移除隐藏contentUpload下拉列表
			contentUpload.onmouseleave = function() {
				this.children[1].style.display = '';
			};

			//移入显示contentDevice下拉列表
			contentDevice.onmouseenter = function() {
				this.children[1].style.display = 'block';
			};

			//移入显示contentDevice下拉列表
			contentDevice.onmouseleave = function() {
				this.children[1].style.display = '';
			};
		})();

		//更换skin功能
		(function() {
			skin.onclick = function() {
				
			};
		})();

		//回收站操作
		var trashFunc = {
			//还原
			fnRecover: function() {
				if (!selectIds.length) {
					return;
				}
				for (var i=0;i<selectIds.length;i++) {
					//找到回收站内所选项
					var val = datas.find(function(value) {
						return value.id == selectIds[i];
					});
					//将pid指回原pid下(执行删除操作时储存在rid中)
					val.pid = val.rid;
					//删除rid
					delete val.rid;
				}

				trashIds = removeSameEles(trashIds,selectIds);
				selectIds = [];

				//重绘content
				fillContent(content,getContentData(clickedId,clickedId));
			},
			//彻底删除
			fnClearall: function() {
				if (!selectIds.length) {
					return;
				}
				for (var i=0;i<selectIds.length;i++) {
					//找到回收站内所选项
					var idx_to_clear = datas.findIndex(function(value) {
						return value.id == selectIds[i];
					});
					//从datas中彻底删除数据
					datas.splice(idx_to_clear,1);
				}

				selectIds = [];

				//重绘content
				fillContent(content,getContentData(clickedId,clickedId));
			}
		};

		recover.onclick = function() {
			trashFunc.fnRecover();
		};

		clearall.onclick = function() {
			trashFunc.fnClearall();
		}

		//搜索操作
		var searchFunc = {
			click: function() {
				contentSearch.style.width = '180px';
				contentSearch.children[0].select();
				document.addEventListener('keydown',this.searchFile,false);
			},
			blur: function() {
				contentSearch.style.width = '';
				document.removeEventListener('keydown',this.searchFile,false);
			},
			searchFile: function (ev) {
				if (ev.keyCode == '27') {
					contentSearch.children[0].value = '';
				}else if (ev.keyCode == '13') {
					//获取搜索关键词,若为空,,则不执行
					var ipt = contentSearch.children[0].value.trim();
					if (ipt == '') {
						contentSearch.children[0].blur();
						return;
					}
					//生成相应正则表达式
					var re = new RegExp(ipt,'i');
					//设置数组保存数据
					var results = [];

					//将数据转化为字符串并查找
					datas.forEach(function(value) {
						//不搜索回收站内文件
						//不搜索id == 1-9的顶层文件夹
						if (value.pid == 9
							|| value.pid == 0) {
							return;
						}

						//给每个文件生成搜索字符串
						var str = '';
						str = value.title + ',' + value.time.date + ',' + (value.fileType ? value.fileType : '');

						if (str.search(re) != -1) {
							results.push(value);
						}
					});

					//用查找结果刷新页面
					fillContent(content,results);
				}
			}
		};

		contentSearch.onclick = function() {
			searchFunc.click();
		};
		contentSearch.children[0].onblur = function() {
			searchFunc.blur();
		};

		//右键菜单操作
		var rightclickMenuFunc = {
			//显示/隐藏/默认事件
			fnDisplay: function() {
				//document上任何操作可以隐藏右键菜单
				rightclickMenu.style.display = 'none';
			},
			//右键菜单控制
			menu: function(ev) {
				switch (ev.target.innerHTML) {
					case '打开':
						var val = datas.find(function(value) {
							return value.id == rightClickedId;
						}); 

						if (val.type != 'folder') {
							//隐藏右键菜单
							rightclickMenu.style.display = 'none';
							return;
						}

						//记录id路径
						paths.push(rightClickedId);
						createPath();

						//右键打开后将clickedId指向rightClickedId
						clickedId = rightClickedId;

						//显示backwards
						if (rightClickedId != 1) {
							backwards.style.display = 'block';
						}else {
							backwards.style.display = '';
						}

						//重绘content
						fillContent(content,getContentData(clickedId,clickedId));
						break;
					case '下载':
						break;
					case '复制到':
						opCopyto.onclick();
						break;
					case '移动到':
						opMoveto.onclick();
						break;
					case '重命名':
						opRename.onclick();
						break;
					case '删除':
						opDelete.onclick();
						break;
					case '还原':
						recover.onclick();
						break;
					case '彻底删除':
						clearall.onclick();
						break;
				}

				//隐藏右键菜单
				rightclickMenu.style.display = 'none';
			}
		};

		document.onmousedown = function() {
			rightclickMenuFunc.fnDisplay();
		};

		rightclickMenu.onclick = function(ev) {
				var ev = ev || event;
				rightclickMenuFunc.menu(ev);
		}

		rightclickMenu.onmousedown = function(ev) {
			var ev = ev || event;
			ev.cancelBubble = true;
		};

		//pop弹出层功能
		var popFunc = {
			str: '',
			isBlink: true,
			timer: null,
			stopDefault: function (ev) {
				//阻止默认tab切换焦点
				if (ev.keyCode == 9) {
					return false;
				}
				if (ev.ctrlKey && ev.keyCode == 68) {
					return false;
				}

				clearInterval(this.timer);
			},
			addSpaces: function(ev) {
				//tab4个空格
				if (ev.keyCode == 9) {
					write.value += '    ';
				}
			},
			matchWord: function(ev) {
				if (ev.ctrlKey && ev.keyCode == 68) {
					var selObj = document.getSelection();
					console.log(selObj);
				}
			},
			markdown_main: function(ev) {
				this.preProcessing();

				this.hTagExchange();

				this.emTagExchange();

				this.boldTagExchange();

				this.underlineExchange();

				this.linkTagExchange();

				this.quoteExchange();

				this.liTagExchange();

				this.codeAreaGenerate();

				this.removeBrs();

				this.addCursor();

				show.innerHTML = this.str;

				var blink = document.getElementsByClassName('blink')[0];
				this.timer = setInterval(function() {
					if (this.isBlink) {
						blink.style.visibility = 'hidden'
					}else {
						blink.style.visibility = ''
					}
					this.isBlink = !this.isBlink;
				},500);
			},

			//this.str格式:
			//line1111111111111111111111<br><br>
			//line2222222222222222222222<br><br>

			//预处理
			preProcessing: function() {
				//把textarea内的/r/n替换成html标签<br>
				this.str = write.value.replace(/(\r)*\n/g,'<br><br>');
				//在文本开头插入两个<br>
				this.str = '<br><br>' + this.str;
			},

			//#-######替换<h>
			//匹配:
			//             <br>
			//##line1231231<br>
			hTagExchange: function() {
				for (var i=1;i<7;i++) {
					var re = new RegExp('(<br>)\s{0,3}' + this.generateNSameChars(i,'#') + '([^#]+?)(<br>)','g');
					this.str = this.str.replace(re,function($0,$1,$2,$3) {
						return $1 + '<h' + i + ' style="color: #b22322;">' + $2 + '</h' + i + '>' + $3;
					});
				}
			},

			//*123*替换<em>
			//匹配:
			//             <br>
			//*line*1231231<br>
			emTagExchange: function() {
				var re = /([^\*])\*([^\*\<\>\s]+?)\*([^\*]??)/g;
				this.str = this.str.replace(re,function($0,$1,$2,$3) {
					return $1 + '<em>' + $2 + '</em>' + $3;
				});
			},

			//**123**替换<span class="bold">
			//匹配:
			//             <br>
			//**line**1231231<br>
			boldTagExchange: function() {
				var re = /\*\*([^\*\<\>]+?)\*\*/g;
				this.str = this.str.replace(re,function($0,$1) {
					return '<span style="font-weight: 700;">'+$1+'</span>';
				});
			},

			//[链接名称](网址 "title") --> 链接
			//匹配:
			//[abc](123123 "")
			linkTagExchange: function() {
				var re = /\[(.+?)\]\((.+?)\s*(\"\S+?\")?\)/g;
				this.str = this.str.replace(re,function($0,$1,$2,$3) {
					return '<a href="' + $2 + '" title=' + $3 + '>' + $1 + '</a>'
				});
			},

			//>替换blockquote
			//匹配:
			//   		  <br><br>
			//>line1231231<br><br>
			//<br><br>
			// line1231231<br><br>
			quoteExchange: function() {
				var re = /(<br>)\s{0,3}\>\s*\S+?(.*?)(<br><br><br>)/g;
				this.str = this.str.replace(re,function($0,$1,$2,$3) {
					//换行加前修饰
					var re1 = /\<br\>\<br\>/g;
					$2 = $2.replace(re1,function($0) {
						return $0 + '<span style="color: #ccc;">▎</span>';
					});
					return $1 + '<blockquote>' + $2 + '</blockquote>' + $3;
				});
			},

			//***替换下划线
			//匹配:
			//   <br><br>
			//***<br><br>
			underlineExchange: function() {
				var re = /<br>\s*?(\*|\-)\1\1s*?<br>/g;
				this.str = this.str.replace(re,this.generateNSameChars(60,'-'));
			},

			//' '{0-3} + * + 若干' ' --> 无序列表
			//匹配:
			//             <br>
			//(s)* line1231231<br>
			//	 * line1231231<br>
			//	 * line1231231<br>
			//(e)line1231231<br>
			liTagExchange: function() {
				var re = /(<br>)\s{0,3}\*\s+(.*?)\1/g;
				this.str = this.str.replace(re,function($0,$1,$2) {
					return $1+'<li style="color: #e6db74;font-size: 16px;">'+$2+'</li>'+$1;
				});
			},

			//四个空格生创建代码区
			//匹配:
			//               <br><br>
			//    line1231231<br><br>
			//    line1231231<br><br>
			//<br><br>
			//line1231231<br><br>
			//<br><br>
			codeAreaGenerate: function() {
				var re1 = /(<br>)\s{4,}?(.+?)(<br><br><br>)/g;
				this.str = this.str.replace(re1,function($0,$1,$2,$3) {
					var re = /\<([^br]*?)\>/g;
					$2 = $2.replace(re,function($$0,$$1) {
						return '&lt;' + $$1 + '&gt;';
					});
					return $1 + '<div class="codeblock" style="color: lightgreen;">' + $2 + '</div>' + $3;
				});
			},

			removeBrs: function() {
				var re = /(\<br\>)\1+/g;
				this.str = this.str.replace(re,'<br>');
			},

			addCursor: function() {
				var re = /\<br\>$/
				var flag = true;

				this.str = this.str.replace(re,function() {
					flag = false;
					return '<span class="blink">▏</span>';
				});

				if (flag) {
					this.str += '<span class="blink">▏</span>';
				}
			},

			//生成包含相同字符的字符串
			generateNSameChars: function(numOfChar,char) {
				var str = '';

				for (var i=0;i<numOfChar;i++) {
					str += char;
				}

				return str;
			}
		};

		funcMarkdownpad.onclick = function() {
			markdownpad.style.display = 'block';
			js_libs.miaov.mTween(markdownpad,'left',0,500,'easeIn');
		};

		//关闭markdownpad
		markdownpad_close.onclick = function() {
			js_libs.miaov.mTween(markdownpad,'left',-1200,300,'easeOut',function() {
				markdownpad.style.display = '';
			});
		};

		//保存并上传覆盖
		markdownpad_save.onclick = function() {};

		write.value = `

# 仿markdown(待完成)

    #,##,###...###### --> 标题

# head1
##head2
.
.
.
###head6

***

    * --> 无序列表

* 13123

***

    > --> 引用blockquote

> 123123123

***

    &lsqb;链接名称&rsqb;(网址 "title") --> 链接

[百度](www.baidu.com "baidu")

***
 
    &ast;&ast;123&ast;&ast;/&ast;123&ast; --> 强调

**see here***see there*

***
    缩进四个空格 --> 代码块

    <div style="width:100px;height:100px;background:red;"></div>
			
			`;

		popFunc.markdown_main();
		document.addEventListener('keydown',popFunc.stopDefault,false);
		document.addEventListener('keyup',popFunc.addSpaces,false);
		document.addEventListener('keyup',popFunc.matchWord,false);
		document.addEventListener('keyup',popFunc.markdown_main,false);

		//初始化content显示'全部文件'文件夹内容
		contextLis[0].onclick();

		///////////////////////////////////////////////////////////
		////////////////////////函数声明///////////////////////////
		/////////////////////////////////////////////////////////////
		
		//根据当前id查找下一级数据并存入数组
		function getContentData(id,mode=1) {
			//根据当前id查找下一级数据并存入数组
			var arr = getTargetData(id,mode,datas);

			return arr;
		}
		
		//生成content内容
		function fillContent(obj,contentData) {
			//清空obj内容
			obj.innerHTML = '';
			//初始化全选框
			checkBtn.className = 'check-btn';
			checkBtn.clicked = false;
			//修改checkText内容
			checkText.innerHTML = '全选';

			//显示content-download和content-device
			contentDownload.style.display = '';
			contentDevice.style.display = '';
			//隐藏op
			contentOp.style.display = '';

			//每次刷新修改path显示
			switch (clickedId) {
				case 1:
					path.innerHTML = '全部文件 > ';
					break;
				case 2:
					path.innerHTML = '全部图片 > ';
					break;
				case 3:
					path.innerHTML = '全部文档 > ';
					break;
				case 4:
					path.innerHTML = '全部视频 > ';
					break;
				case 5:
					path.innerHTML = '全部种子 > ';
					break;
				case 6:
					path.innerHTML = '全部音乐 > ';
					break;
				case 7:
					path.innerHTML = '全部其它 > ';
					break;
				case 8:
					path.innerHTML = '我的分享 > ';
					break;
				case 9:
					path.innerHTML = '回收站 > ';
					break;
			}

			//左侧菜单刷新隐藏backwards
			if (clickedId > 0 && clickedId < 10) {
				backwards.style.display = 'none';
			}

			//获取下一级数据个数
			var len = contentData.length;
			//设置已选中文件个数
			var file_selected = 0;

			//显示当前文件夹文件个数
			load.innerHTML = '已全部加载,共' + len + '个';

			//若没有下一级数据,返回
			if (!len) {
				var div = document.createElement('div');
				div.className = 'nofile';

				var img = document.createElement('img');
				var cidx = parseInt(clickedId) > 9 ? '1' : clickedId;
				img.src = nofileData.url[cidx];
				div.appendChild(img);

				if (nofileData.text[cidx][0] != '') {
					var p = document.createElement('p');
					p.innerHTML = nofileData.text[cidx][0];
					div.appendChild(p);
				}

				var p = document.createElement('p');
				p.innerHTML = nofileData.text[cidx][1];
				div.appendChild(p);


				content.appendChild(div);
				return;
			}

			//根据下一级数据个数生成content内容
			for (var i=0;i<len;i++) {
				(function(i) {
					var currentData = contentData[i];

					var dl = document.createElement('dl');
					dl.className = 'item';
					dl.cid = currentData.id;

					var dt = document.createElement('dt');
					var div = document.createElement('div');
					
					//用雪碧图生成文件图标
					var spritePos;

					if (currentData.type == 'folder') {
						spritePos = spritePosData.folder;
					}else if (currentData.type == 'file') {
						spritePos = spritePosData[currentData.fileType];
					}

					var divisor = 1;
					if (content.className == 'content content-list') {
						divisor = 2;
					}

					div.style.backgroundPosition = (-spritePos[0] / divisor) + 'px ' + (-spritePos[1] / divisor) + 'px';
					dt.appendChild(div);
					dl.appendChild(dt);

					var dd = document.createElement('dd');
					dd.innerHTML = currentData.title;
					dd.title = currentData.title;
					dl.appendChild(dd);

					{
						//只在.content-list模式下显示
						////content-list-op
						var div = document.createElement('div');
						div.className = 'content-list-op';
						div.onclick = function(ev) {
							var ev = ev || event;
							ev.cancelBubble = true;
						}

						//分享
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-share-alt"></i>';
						span.onclick = function() {
							//选中当前文件
							dl.lastElementChild.onclick && dl.lastElementChild.onclick();
						};
						div.appendChild(span);

						//下载
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-download"></i>';
						span.onclick = function() {
							//选中当前文件
							dl.lastElementChild.onclick && dl.lastElementChild.onclick();
						};
						div.appendChild(span);

						//移动至
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-arrows"></i>';
						span.onclick = function() {
							//选中当前文件
							dl.lastElementChild.onclick && dl.lastElementChild.onclick();
							opMoveto.onclick();
						};
						div.appendChild(span);

						//删除
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-trash-o"></i>';
						span.onclick = function() {
							//选中当前文件
							dl.lastElementChild.onclick && dl.lastElementChild.onclick();
							opDelete.onclick();
						};
						div.appendChild(span);

						//重命名
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-pencil"></i>';
						span.onclick = function() {
							//选中当前文件
							dl.lastElementChild.onclick && dl.lastElementChild.onclick();
							opRename.onclick();
						};
						div.appendChild(span);

						dl.appendChild(div);

						////content-list-size
						var div = document.createElement('div');
						div.className = 'content-list-size';
						div.innerHTML = currentData.size;
						dl.appendChild(div);

						////content-list-time
						var div = document.createElement('div');
						div.className = 'content-list-time';
						div.innerHTML = currentData.time.date;
						dl.appendChild(div);
					}

					var span = document.createElement('span');
					span.className = 'checkbox';
					span.checked = false;
					dl.appendChild(span);

					//移入每个dl显示checkbox
					dl.onmouseenter = function() {
						this.lastElementChild.style.display = 'block';

						//若在content-list模式下显示content-list-op
						if (content.className == 'content content-list') {
							this.getElementsByClassName('content-list-op')[0].style.display = 'block';
						}
					};

					//移出每个dl隐藏checkbox,
					//若当前checkbox为选中状态,则不隐藏
					dl.onmouseleave = function() {
						if (!this.lastElementChild.checked) {
							this.lastElementChild.style.display = '';
						}

						//隐藏content-list-op
						this.getElementsByClassName('content-list-op')[0].style.display = '';
					};

					//点击dl进入下一级目录
					//点击dl的同时按ctrl为选中操作
					if (currentData.type == 'folder') {
						dl.ondblclick = function(ev) {
							//禁止拖动
							isDrag = false;

							var ev = ev ||event;
							if (ev.ctrlKey) {
								this.lastElementChild.onclick();
							}else {
								if (currentData.pid == 9) {
									return;
								}

								clickedId = currentData.id;

								//记录id路径
								paths.push(clickedId);
								createPath();

								//显示backwards
								if (clickedId != 1) {
									backwards.style.display = 'block';
								}else {
									backwards.style.display = '';
								}

								//重绘content
								fillContent(obj,getContentData(currentData.id));
							}
						};
					}

					//拖拽按下
					dl.onmousedown = function(ev) {
						var ev = ev || event;
						ev.cancelBubble = true;
						//只允许左键触发
						if (ev.button != 0) {
							return;
						}

						//任何左击操作可以隐藏右键菜单
						rightclickMenu.style.display = 'none';

						//在content-list显示模式下不允许拖拽
						if (content.className == 'content content-list') {
							return;
						}

						isDrag = true;

						dl.style.zIndex = '4';

						var dl_copy = dl.cloneNode(true);
						content.appendChild(dl_copy);

						dl_copy.style.left = dl.offsetLeft + 'px';
						dl_copy.style.top = dl.offsetTop + 'px';
						dl_copy.style.position = 'absolute';
						dl_copy.style.zIndex = '3';
						dl_copy.style.background = 'rgba(173,216,230,.2)';

						var pos = dl_copy.getBoundingClientRect();
						var contentPos = content.getBoundingClientRect();

						var leftDist = ev.clientX - pos.left;
						var topDist = ev.clientY - pos.top;

						//绑定事件
						document.addEventListener('mousemove',dragmove,false);
						document.addEventListener('mouseup',dragup,false);

						//拖拽移动
						function dragmove(ev) {
							console.log('dragmove',targetId);
							var ev = ev || event;

							var l = ev.clientX - leftDist - contentPos.left;
							var t = ev.clientY - topDist - contentPos.top;

							if (l < 0) {
								l = 0;
							}else if (l > contentPos.width - dl_copy.offsetWidth) {
								l = contentPos.width - dl_copy.offsetWidth
							}

							if (t < 0) {
								t = 0;
							}else if (t > contentPos.height - dl_copy.offsetHeight) {
								t = contentPos.height - dl_copy.offsetHeight
							}

							dl_copy.style.left = l + 'px';
							dl_copy.style.top = t + 'px';

							var flag = true;

							for (var i=0;i<items.length;i++) {
								//////////////////此处修改了/////////////////////////
								///if (items[i] != dl_copy) {} --> if (items[i] != dl_copy && items[i] != dl) {}
								///////////////////////////////////////////////////
								if (items[i] != dl_copy && items[i] != dl) {
									if (collisionValidate(dl_copy,items[i]).tlQuater) {
										//左上角碰撞
										items[i].className = 'item item-active';
										targetId = items[i].cid;
										flag = false;
									}else {
										items[i].className = 'item';
									}
								}
							}

							if (flag) {
								targetId = -1;
							}

							console.log('dragmove end',targetId);
						};

						//拖拽抬起
						function dragup() {
							content.removeChild(dl_copy);
							dl.style.zIndex = '';

							//执行移动至操作
							if (targetId != -1) {
								opMoveto.onclick();
								//重新制定当前操作的文件id
								opId = dl.cid;

								//隐藏mask和movetoBox
								mask.style.display = '';
								movetoBox.style.display = '';

								if (movetoFooterConfirm.onclick() == -1) {
									for (var i=0;i<items.length;i++) {
										items[i].className = 'item';
									}
								}
							}

							//移除事件
							document.removeEventListener('mousemove',dragmove,false);
							document.removeEventListener('mouseup',dragup,false);
							isDrag = false;
							targetId = -1;
						};

						return false;
					};

					dl.oncontextmenu = function(ev) {
						var ev = ev || event;

						//显示rightclickMenu
						if (clickedId == 9) {
							rightclickMenu.innerHTML = `
								<ul>
									<li>还原</li>
									<li>彻底删除</li>
								</ul>
							`;
						}else {
							rightclickMenu.innerHTML = `
								<ul>
									<li>打开</li>
									<li>下载</li>
									<li>复制到</li>
									<li>移动到</li>
									<li>重命名</li>
									<li>删除</li>
								</ul>
							`;
						}
						rightclickMenu.style.display = 'block';

						//定位rightclickMenu
						var contentBoxPos = contentBox.getBoundingClientRect();
						rightclickMenu.style.left = ev.clientX-contentBoxPos.left + 'px';
						rightclickMenu.style.top = ev.clientY-contentBoxPos.top + 'px';

						//取消选中所有已选中文件文件
						for (var i=0;i<items.length;i++) {
							if (items[i].className == 'item item-active') {
								items[i].onmouseenter();
								items[i].lastElementChild.onclick();
								items[i].onmouseleave();
							}
						}
						//选中该文件
						this.lastElementChild.onclick();

						//获取右键已点击id
						rightClickedId = this.cid;

						return false;
					};

					//阻止冒泡
					span.onmousedown = span.ondblclick = function(ev) {
						var ev = ev || event;
						ev.cancelBubble = true;

						//checkbox(span)上任何操作可以隐藏右键菜单
						rightclickMenu.style.display = 'none';
					};

					//点击checkbox(span)设置/取消激活状态
					span.onclick = function(ev) {
						var ev = ev || event;
						ev.cancelBubble = true;

						if (!this.checked) {
							this.className = 'checkbox-active';
							this.parentNode.className = 'item item-active';
							//已选中文件数量加1
							file_selected++;

							//清空selfnsubsIds
							selfnsubsIds = [];
							//获取当前项id以及所有子项id,并存入selfnsubsIds
							selfnsubsIds = findAllSubs(currentData.id,datas);
							//将当前文件id以及所有子文件id推入selectIds
							selectIds = selectIds.concat(selfnsubsIds);
						}else {
							this.className = 'checkbox';
							this.parentNode.className = 'item';
							//已选中文件数量减1
							file_selected--;

							//将当前文件id及所有子文件id从selectIds中删除
							for (var i=0;i<selfnsubsIds.length;i++) {
								selectIds = removeFromArr(selectIds,selfnsubsIds[i]);
							}
						}

						this.checked = !this.checked;

						//修改checkText内容
						checkText.innerHTML = file_selected ? '已选中' + file_selected + '个文件/文件夹' : '全选';

						//判断是否全部选中,修改checkBtn状态
						if (file_selected == len) {
							checkBtn.className = 'check-btn-active';
							checkBtnFunc.clicked = true;
						}else {
							checkBtn.className = 'check-btn';
							checkBtnFunc.clicked = false;
						}

						if (file_selected) {
							//隐藏content-download和content-device
							contentDownload.style.display = 'none';
							contentDevice.style.display = 'none';
							//显示op
							contentOp.style.display = 'block';
						}else {
							//显示content-download和content-device
							contentDownload.style.display = '';
							contentDevice.style.display = '';
							//隐藏op
							contentOp.style.display = '';
						}

						if (file_selected != 1) {
							opRenameFunc.open = false;
							opRename.className = 'op-rename op-inactive';
						}else {
							opRenameFunc.open = true;
							opRename.className = 'op-rename';
						}
					}

					obj.appendChild(dl);
				})(i);
			}

			//重新生成movetoContextList
			var initId = 1;
			movetoContextList.innerHTML = '';
			movetoBoxFunc.fnCreateMovetoTree(movetoContextList,initId);
		}

		//根据id和mode获取数据
		function getTargetData(id,mode,datas) {
			var arr;

			if ([2,3,4,5,6,7].indexOf(mode) != -1) {
				//分类显示
				arr = datas.filter(function(value) {
					//不搜索回收站内文件
					if (trashIds.indexOf(value.id) != -1) {
						return false;
					}

					switch (mode) {
						case 2:
							return (value.fileType == 'jpg'
									|| value.fileType == 'png'
									|| value.fileType == 'svg'
									|| value.fileType == 'gif');
						case 3:
							return (value.fileType == 'word'
									|| value.fileType == 'txt'
									|| value.fileType == 'pdf');
						case 4:
							return value.fileType == 'mp4';
						case 5:
							return value.fileType == 'torrent';
						case 6:
							return value.fileType == 'mp3';
						case 7:
							var flag = false;
							var types = ['jpg','png','gif','psd','mp3','mp4','txt','word','pdf','torrent'];
							if (value.fileType && types.indexOf(value.fileType) == -1) {
								flag = true;
							}
							return flag;
					}
				});
			}else {
				//按文件夹结构显示
				arr = createHTMLList(id,datas);
			}

			return arr;
		}

		//根据id获取下一级数据
		function createHTMLList(id,datas) {
			var arr = datas.filter(function(value) {
				return value.pid == id;
			});

			return arr;
		}

		//生成新的不重复id
		function createNewId() {
			do{
				newId = parseInt(Math.random()*9999);
				var val = datas.find(function(value) {
					return value.id == newId;
				})
			}while(val != 0 && val);

			return newId;
		}

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

				if (l1 < r2 && l1 > l2 && t1 < b2 && t1 > t2) {
					cls.tlQuater = true;
				}
			}

			return cls;
		}

		//创建路径
		function createPath() {
			path.innerHTML = '';

			for (var i=0,len=paths.length;i<len;i++) {
				var span = document.createElement('span');
				span.cid = paths[i];
				span.index = i;

				var val = datas.find(function(value) {
					return value.id == span.cid;
				});
				span.innerHTML = val.title + ' > ';

				span.onclick = function() {
					paths.splice(this.index+1);
					clickedId = paths[paths.length-1];
					createPath();
					fillContent(content,getContentData(this.cid));

					if (clickedId == 1) {
						backwards.style.display = 'none';
					}
				};

				path.appendChild(span);
			}
		}

		function findAllSubs(id,datas) {
			selfnsubsIds.push(id);

			var arr = createHTMLList(id,datas);

			if (!arr.length) {
				return selfnsubsIds;
			}

			for (var i=0;i<arr.length;i++) {
				findAllSubs(arr[i].id,datas)
			}

			return selfnsubsIds;
		}
	})();
};



