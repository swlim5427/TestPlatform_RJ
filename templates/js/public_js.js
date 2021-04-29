
function config() {
    let serviceIp = "127.0.0.1:8000";
    return serviceIp;
}

function errorMessage(message) {
    layer.msg(message,{icon:2});
}


function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// 加载select列表
function setOptions(res, elementId, funcType) {

    var response = res.data;
    for(var i=0, l=response.length; i<l; i++){
        response[i].selected = true;
        var name = response[i].file_name;
        var id = response[i].file_id;
        var sel = document.getElementById(elementId);
        var option = new Option(name,id);
        sel.options.add(option);
    }
}

function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

function isIntNum(val){
    var regPos = / ^\d+$/;
    var regNeg = /^[0-9]+$/;

    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

function reloadOption(id) {
    $("#"+id).empty();
    $("#"+id).append("<option value=\"\">选择或搜索</option>");
}