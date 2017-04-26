/**
 * 获取cookie值
 * @param  {string} key [cookie键名]
 * @return {string}     [对应键值]
 */
function getCookie(key) {
    var cookie = document.cookie,
        re = new RegExp('\\b'+key+'=(\\w+?)\\b'),
        result = '';
    cookie.replace(re, function($0, $1) {
        result = $1;
    });
    return result;
}
