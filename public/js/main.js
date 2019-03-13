var cookieTime = 1;//预设cookie时间  1小时
//创建cookie
function setCookie(c_name, value, expiretime) {//小时为单位
  var exdate = new Date();
  exdate.setTime(exdate.getTime() + expiretime * 60 * 60 * 1000);
  document.cookie = c_name+ "=" +escape(value) + ((expiretime === null) ? "" : ";expires=" + exdate.toGMTString());
}
//查询cookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start!=-1) { 
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end==-1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
  return 'false'
}
//删除cookie
function delCookie(name) {
  var exdate = new Date();
  exdate.setTime(exdate.getTime() - 1);
  var cval = getCookie(name);
  if(cval != null)
  document.cookie= name + "=" + cval+";expires=" + exdate.toGMTString();
}