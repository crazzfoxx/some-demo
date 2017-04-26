//////////////////变量声明//////////////////////
var wrap = document.getElementById('wrap');
var header = document.getElementById('header');

var user = document.getElementById('user');
var userInfo = user.getElementsByClassName('userinfo')[0];
var arrow = userInfo.getElementsByClassName('arrow')[0];
var headerNotice = user.getElementsByClassName('header-notice')[0];
var systemNotice = headerNotice.children[1];
var feedback = headerNotice.children[2];
var skin = headerNotice.children[3];
var smash = headerNotice.children[4];
//user-info-pop//
var pop = userInfo.getElementsByClassName('pop')[0];
var funcMarkdownpad = pop.getElementsByClassName('func-markdownpad')[0];
//user-info-pop//

var context = document.getElementById('context');
var contextLis = context.getElementsByTagName('li');

////content-box////
var contentBox = document.getElementById('content-box');

//content-header//
var contentHeader = contentBox.getElementsByClassName('content-header')[0];
var contentUpload = contentHeader.getElementsByClassName('content-upload')[0];
var contentNew = contentHeader.getElementsByClassName('content-new')[0];
var contentDownload = contentHeader.getElementsByClassName('content-download')[0];
var contentDevice = contentHeader.getElementsByClassName('content-device')[0];
//content-header//

//content-op//
var contentOp = contentHeader.getElementsByClassName('content-op')[0];
var opDelete = contentOp.getElementsByClassName('op-delete')[0];
var opRename = contentOp.getElementsByClassName('op-rename')[0];
var opCopyto = contentOp.getElementsByClassName('op-copyto')[0];
var opMoveto = contentOp.getElementsByClassName('op-moveto')[0];
//content-op//

//content-display/sort/search//
var contentSearch = contentHeader.getElementsByClassName('content-search')[0];
var contentDisplay = contentHeader.getElementsByClassName('content-display')[0];
var contentDisplay_list = contentDisplay.children[0];
var contentDisplay_icon = contentDisplay.children[1];
var contentSort = contentHeader.getElementsByClassName('content-sort')[0];
var contentSort_title = contentSort.children[0];
var contentSort_time = contentSort.children[1];
//content-display/sort/search//

//content-info//
var contentInfo = contentBox.getElementsByClassName('content-info')[0];
var backwards = contentInfo.getElementsByClassName('backwards')[0];
var path = contentInfo.getElementsByClassName('path')[0];
var load = contentInfo.getElementsByClassName('load')[0];
var checkall = contentInfo.getElementsByClassName('checkall')[0];
var checkBtn = checkall.getElementsByClassName('check-btn')[0];
var checkText = checkall.getElementsByClassName('check-text')[0];
var recover = contentInfo.getElementsByClassName('recover')[0];
var clearall = contentInfo.getElementsByClassName('clearall')[0];
//content-info//

//content//
var content = contentBox.getElementsByClassName('content')[0];
var items = content.getElementsByClassName('item');
//content//

//rename-box//
var renameBox = contentBox.getElementsByClassName('rename-box')[0];
var rename = renameBox.getElementsByClassName('rename')[0];
var renameIpt = rename.children[0];
var renameConfirm = rename.children[2];
var renameCancel = rename.children[1];
//rename-box//

//rightclick-menu//
var rightclickMenu = contentBox.getElementsByClassName('rightclick-menu')[0];
//rightclick-menu//

////content-box////

//movetobox//
var movetoBox = document.getElementById('moveto-box');

var movetoHeader = movetoBox.children[0];
var movetoHeaderCancel = movetoHeader.children[1];

var movetoContextList = movetoBox.children[1].children[0];
var movetoContextList_spans = movetoContextList.getElementsByTagName('span');

var movetoFooter = movetoBox.children[2];
var movetoFooterNew = movetoFooter.children[0];
var movetoFooterConfirm = movetoFooter.children[2];
var movetoFooterCancel = movetoFooter.children[1];
//movetobox//

//mask//
var mask = document.getElementsByClassName('mask')[0];
//mask//


//markdownpad//
var markdownpad = document.getElementById('markdownpad');
var write = markdownpad.getElementsByClassName('write')[0];
var show = markdownpad.getElementsByClassName('show')[0];
var btns = markdownpad.getElementsByClassName('btns')[0];
var markdownpad_save = btns.children[0];
var markdownpad_close = btns.children[1];
//markdownpad//

