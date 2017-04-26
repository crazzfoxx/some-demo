$(function() {
    // 初始化留言显示
    var cpage = 1,
        ctotalPage = 1,
        msgPerPage = 4;

    updateUserState();
    initMessageBoard();

    /**
     * 更新用户状态
     * @return {void}
     */
    function updateUserState() {
        var uid = getCookie('uid'),
            uname = getCookie('username');

        if (uid) {
            $('#user').show();
            $('#userinfo').html('当前用户: '+uname);
            $('#reg').hide();
            $('#login').hide();
        } else {
            $('#user').hide();
            $('#reg').show();
            $('#login').show();
        }
    }

    /* 验证用户名(展示给用户) */
    /* 后端接口使用:
       1\get
       2\guestbook/index.php
       3\params:
            m: index,
            a: verifyUserName,
            username: 要验证的用户名
        4\return
            {
            code: 0:没有错误 1: 有错误
            message: 具体返回的信息
        }
     */
    var $username1 = $('#username1'),
        $password1 = $('#password1'),
        $msg = $('#verifyUserNameMsg');

    $username1.on('keyup', function() {
        var uname = $(this).val();
        if (!uname) return $msg.html('用户名不能为空');
        $.ajax({
            url: 'guestbook/index.php',
            data: {
                m: 'index',
                a: 'verifyUserName',
                username: uname
            }
        }).done(function(d) {
            var data = JSON.parse(d);
            $msg.html(data.message).css('color', function() {
                return data.code ? 'rgb(232, 39, 63)' : 'rgb(53, 193, 79)';
            });
        });
    });

    /* 用户注册(后台再次验证) */
    /*
        后端接口使用:
        1\get
        2\guestbook/index.php
        3\params:
             m: index,
             a: verifyUserName,
             username: 注册用户名
             password: 注册密码
        4\return
            {
            code: 0:没有错误 1: 有错误
            message: 具体返回的信息
        }
     */
     $('#btnReg').on('click', function() {
         var uname = $username1.val(),
             psw = $password1.val();
         $.ajax({
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'reg',
                 username: uname,
                 password: psw
             }
         }).done(function(d) {
             var data = JSON.parse(d);
             $username1.val('');
             $password1.val('');
             $msg.html('');
             alert(data.message);
         });
     });

     var $username2 = $('#username2'),
         $password2 = $('#password2');

     /* 用户登录 */
     $('#btnLogin').on('click', function() {
         var uname = $username2.val(),
             psw = $password2.val();
         $.ajax({
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'login',
                 username: uname,
                 password: psw
             }
         }).done(function(d) {
             var data = JSON.parse(d);
             $username2.val('');
             $password2.val('');
             alert(data.message);

             // 更新用户状态
             if (!data.code) updateUserState();
         });
     });

     /* 退出登录 */
     $('#logout').on('click', function() {
         $.ajax({
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'logout'
             }
         }).done(function(d) {
             var data = JSON.parse(d);
             alert(data.message);

             // 更新用户状态
             if (!data.code) updateUserState();
         });
     });

     /* 初始化留言列表 */
     /*
         后端接口使用:
         1\get
         2\guestbook/index.php
         3\params:
              m: index,
              a: getList,
              page: 当前页数, 默认1
              n: 每页显示条数, 默认10
         4\return
             {
             code: 0:没有错误 1: 有错误
             message: 具体返回的信息
         }
      */
     function initMessageBoard() {
         $.ajax({
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'getList',
                 n: msgPerPage
             }
         }).done(function(d) {
             var cData = JSON.parse(d);
             // 没有留言, 弹出错误信息并终止
             if (cData.code) return alert(cData.message);
             cpage = cData.data.page;
             ctotalPage = cData.data.pages;
             cData.data.list.forEach(function(msgData) {
                 createMessageOnPage(msgData);
             });
         });
     }

     /* 获取更多留言 */
     $('#showMore').on('click', function() {
         ++cpage;
         if (cpage > ctotalPage) return alert('没有更多留言啦...');
         $.ajax({
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'getList',
                 page: cpage,
                 n: msgPerPage
             }
         }).done(function(d) {
             var cData = JSON.parse(d);
             cData.data.list.forEach(function(msgData) {
                 createMessageOnPage(msgData);
             });
         });
     });

     /* 添加留言 */
     /*
         后端接口使用:
         1\post
         2\guestbook/index.php
         3\params:
              m: index,
              a: send,
              content: encodeURI(留言内容)
         4\return
             {
             code: 0:没有错误 1: 有错误
             message: 具体返回的信息
             data: {
                cid: 留言id,
                uid: 留言人id,
                content: 留言内容
                username: 留言人用户名,
                dataline: 留言时间戳(s),
                support: 顶的数量
                oppose: 踩的数量
         }
         }
      */
     var $content = $('#content');
     $('#btnPost').on('click', function() {
         $.ajax({
             method: 'post',
             url: 'guestbook/index.php',
             data: {
                 m: 'index',
                 a: 'send',
                 content: encodeURI($content.val())
             }
         }).done(function(d) {
             var cData = JSON.parse(d);
             // 留言失败,弹出失败信息并终止
             if (cData.code) return alert(cData.message);
             // 清空留言文本输入框
             $content.val('');
             // 在页面上留言区创建留言
             createMessageOnPage(cData.data, 'insertBefore');
         });
     });

     /**
      * 在页面上留言区创建留言
      * @param  {object} data [留言数据]
      * @return {void}
      */
     function createMessageOnPage(data, appendMethod='appendAfter') {
         var html = `
            <dl>
                 <dt>
                     <strong>${data.username}</strong> 说 :
                 </dt>
                 <dd>${decodeURI(data.content)}</dd>
                 <dd class="t">
                     <a href="javascript:;" class="support">顶(<span>${data.support}</span>)</a>
                      |
                     <a href="javascript:;" class="oppose">踩(<span>${data.oppose}</span>)</a>
                 </dd>
             </dl>
        `;

        if (appendMethod == 'appendAfter') {
            $(html).appendTo($('#list'));
        } else if (appendMethod == 'insertBefore') {
            $(html).insertBefore($('#list').children()[0]);
        }
     }
});
