// 新建测试任务
layui.use(['element', 'form'], function(){
    var $ = layui.jquery
        ,element = layui.element
        ,form = layui.form;

    var asrDiarization = false;
    var WZC2CDiarization = false;

    var tabId = 0;
    var asrTestWZ = true;

    var asrContext = true;
    var WZC2CContext = true;
    var asrStreaming = false;
    var WZC2CAsrStreaming = false;
    var letter = false;


    selectCaseListFile(form, 1001);
    // selectContextFile(form);

    element.on('tab(createTestTask)', function(data){
        tabId = data.index;
        console.log(tabId);
        // 选项卡-新建接口测试任务
        if (tabId === 0){
            // 初始化接口测试用例
            selectCaseListFile(form, 1001)
        }
        if (tabId === 1){
            // 初始化性能测试用例
            // selectWavListFile(form);
            // selectContextFile(form);
            selectCaseListFile(form, 1001)

        }

    });

    //
    form.verify({
        // asr 识别率测试输入项验证
        taskName: function (value) {
            if (value === ""){
                return "任务名称";
            }
        },
        testCaseFile: function (value) {
            if (value === ""){
                return "选择测试用例";
            }
        }
        ,checkIp: function (value) {
            if (value === ""){
                return "输入 ASR 服务器IP";
            }
            if (isValidIP(value) === false){
                return "ip 不合法";
            }
        }
        ,checkPort: function (value) {
            if (value === ""){
                return "输入 ASR 服务器端口";
            }
            if (isIntNum(value) === false){
                return "端口不合法";
            }
        }

        // 问真端到端输入项验证
        ,testCaseFileWZ: function (value) {
            if (value === ""){
                return "选择测试用例";
            }
        }
        ,wavListFileWZ: function (value) {
            if (value === ""){
                return "选择标注文件";
            }
        }
        ,checkWzIp: function (value) {

            if (value === ""){
                return "输入问真 IP";
            }
            if (isValidIP(value) === false){
                return "ip 不合法";
            }
        }
        ,checkAppKey: function (value) {
            if (value === ""){
                return "输入appkey";
            }
        }
        ,checWZPort: function (value) {
            if (value === ""){
                return "输入问真端口";
            }
            if (isIntNum(value) === false){
                return "端口不合法";
            }
        }
        ,checkIpWZAsr: function (value) {
            if (asrTestWZ){
                if (value === ""){
                    return "输入 ASR 服务器IP";
                }
                if (isValidIP(value) === false){
                    return "ip 不合法";
                }
            }
        }
        ,checkPortWZAsr: function (value) {
            if (asrTestWZ){
                if (value === ""){
                    return "输入 ASR 服务器端口";
                }
                if (isIntNum(value) === false){
                    return "端口不合法";
                }
            }
        }
    });
    //
    form.on('switch(asrOpenClose)', function(obj){
        if (obj.elem.checked){
            asrTestWZ = true;
            document.getElementById("asrDiv").style.display=""
        }
        else{
            asrTestWZ = false;
            document.getElementById("asrDiv").style.display="none"
        }
    });

    // 控制开关
    form.on('switch(openClose)', function(obj){  // asr识别率测试-话者分离
        asrDiarization = obj.elem.checked;
    });

    form.on('switch(openCloseD)', function(obj){  // 问真端到端测试-话者分离
        WZC2CDiarization = obj.elem.checked;
    });

    form.on('switch(asrContextOpenClose)', function(obj){  // asr识别率测试-context
        asrContext = obj.elem.checked;
    });

    form.on('switch(WZC2CContextOpenClose)', function(obj){  // 问真端到端测试-context
        WZC2CContext = obj.elem.checked;
    });

    form.on('switch(streaming)', function(obj){  // asr streaming/batch 默认batch
        asrStreaming = obj.elem.checked;
    });

    form.on('switch(streamingD)', function(obj){  // asr streaming/batch 默认batch(问侦端到端)
        WZC2CAsrStreaming = obj.elem.checked;
    });

    form.on('switch(letterOpenClose)', function(obj){  // asr 英文汉字间空格处理 默认不处理结果
        letter = obj.elem.checked;
    });

    // 提交测试-接口测试
    form.on('submit(testRun)', function(data){  // 接口测试

        var sel_name = document.getElementById("testCaseFile");
        // var context_sel = document.getElementById("contextFile");
        var fileName = sel_name.options[sel_name.selectedIndex].text;
        // var contextName = context_sel.options[context_sel.selectedIndex].text;

        var requestData = {
            "testType": "APITest",
            "params":JSON.stringify({
                "apiHost": data.field.ip+":"+data.field.port
                ,"fileName": fileName
                ,"fileId": data.field.testCaseFile
                ,"taskName": data.field.taskName
            })
        };

        $.ajax({
            type: 'POST',
            url: '/test_start/',
            data: requestData,
            dataType: 'json',
            success: function (res) {
                if (res!=null) {
                    layer.msg(res.responseMessage.message, {
                        end: function () {
                            window.location.reload();
                        }
                    });
                }
            }
        });

        return false;
    });

    // 提交测试-问真端到端
    form.on('submit(testRunWZ)', function(data){  // 问真端到端
        // var sel_name = $('#wavListFile');
        var sel_name = document.getElementById("wavListFileWZ");
        var testcase_sel = document.getElementById("testCaseFileWZ");
        // var context_sel = document.getElementById("contextFileWZ");

        var testCaseName = testcase_sel.options[testcase_sel.selectedIndex].text;
        var fileName = sel_name.options[sel_name.selectedIndex].text;
        // var contextName = context_sel.options[context_sel.selectedIndex].text;

        var requestData = {
            "testType": "WZC2C",
            "params":JSON.stringify({
                "caseId": data.field.testCaseFileWZ
                ,"wzIp": data.field.WZIp+":"+data.field.WZPort
                ,"appKey": data.field.appKey
                ,"asr": asrTestWZ
                ,"asrIp": data.field.asrIpWZ+":"+data.field.asrPortWZ
                ,"caseName": testCaseName
                ,"listId": data.field.wavListFileWZ
                // ,"contextId": data.field.contextFileWZ
                // ,"contextName": contextName
                ,"context": WZC2CContext
                ,"diarization": WZC2CDiarization
                ,"streaming": WZC2CAsrStreaming
            })
        };

        $.ajax({
            type: 'POST',
            url: '/test_start/',
            data: requestData,
            dataType: 'json',
            success: function (res) {
                if (res!=null) {
                    layer.msg(res.responseMessage.message, {
                        end: function () {
                            // window.location.reload();
                        }
                    });
                }
            }
        });

        return false;
    });

});

// 初始化测试用例
function selectCaseListFile(form, caseType) {

    $.ajax({
        type: 'POST',
        url: '/select_list/',
        data: {
            "status": "1"
            ,"listType": "2"
            ,"caseType": caseType
            ,"listName": ""
        },

        dataType: 'json',
        success: function (res) {
            console.log(res);
            if (res!=null) {
                reloadOption("testCaseFile");
                setOptions(res, "testCaseFile", "testCaseFile");
                form.render();
            }
        }
    });
}
