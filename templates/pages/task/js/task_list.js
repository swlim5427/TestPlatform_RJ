var name = "";
var status = "";

// 打开弹窗-新建测试任务
function createTestTask() {
    layui.use('layer', function () {
        layer.open({
            id:1,
            type: 2,
            title:false,
            // resize: false,
            area:['650px', '500px'],
            offset:'100px',
            content: ['/templates/pages/task/layer/create_task.html']
        });
    });
}

// 打开弹窗-测试报告
function showReportLit(testId, testName, testType){

    switch(testType) {
        case "AsrModelRate":
            layui.use('layer', function () {
                layer.open({
                    id:1,
                    type: 2,
                    title:'测试报告：' + testName,
                    // resize: false,
                    area:['1200px', '650px'],
                    offset:'100px',
                    content: ['/templates/pages/task/layer/asr_report_list.html?testId='+testId]
                });
            });
            break;
        case "WZC2C":
            layui.use('layer', function () {
                layer.open({
                    id:1,
                    type: 2,
                    title:'测试报告：' + testName,
                    // resize: false,
                    area:['1200px', '650px'],
                    offset:'100px',
                    content: ['/templates/pages/task/layer/wzc2c_report_list.html?testId='+testId]
                });
            });
            break;
    }

}

// 结束任务
function stopTask(testId){
    var requestData = {
            "testId": testId
        };

    $.ajax({
            type: 'POST',
            url: '/test_stop/',
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
}
// 加载表格

function loadTable(table){
    table.render({
        elem: '#testTaskList'
        ,url:'/select_task_list/'
        ,method: 'post'
        // ,totalRow: true
        ,cellMinWidth: 80 //
        ,where: {
            "name": name
            , "status": status
        }
        ,cols: [[
            {field:'table_id', type: 'numbers', title: '序号'}
            ,{field:'name', title:'任务名称', width:150}
            ,{field:'case_name', title:'测试用例名称'}
            ,{field:'asr_server_id', title:'请求参数'}
            ,{field:'start_date', title:'开始时间'}
            ,{field:'end_date', title:'结束时间'}
            ,{field:'status', title:'状态', toolbar:'#status', width:150, align:'center'}
            ,{field:'testReport', title:'测试报告', toolbar:'#edit', width:160, align:'center'}
        ]]
        ,page:true
        ,limits:[10,30,50,100]
    });
}


layui.use(['table', 'laypage', 'form'], function(formData){
    var table = layui.table
        ,laypage = layui.laypage
        ,form = layui.form;
    form.render();

    // 监听查找按钮
    form.on('submit(taskSearch)', function (data) {
        // console.log(data);
        name = data.field.taskName;
        status = data.field.testStatus;
        loadTable(table);
        return false
    });

    // 加载表格
    loadTable(table);

    // 操作表格
    table.on('tool(testTaskList)', function (obj) {
        // console.log(obj)
        var data = obj.data;
        if (obj.event === 'details'){
            console.log(data);
            showReportLit(data.test_id, data.case_name, data.test_type)
        }
        if (obj.event === 'stop'){
            if (data.status === '0') {
                console.log(data);
                stopTask(data.test_id)
            }
        }
        if (obj.event === "export"){

            var url = '/export_test_report/';
            var xhr = new XMLHttpRequest();
            var requestData = JSON.stringify({"testId":data.test_id, "caseName": data.case_name});

            xhr.open('POST', url, true);
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.responseType = "blob";
            xhr.onprogress = function(e){
                console.log(xhr);
                console.log(e.loaded + "------loaded-----")
            };
            xhr.onload = function () {
                console.log(this.status);
                if (this.status === 200){
                    var fileName = "";
                    // var fileName = xhr.getResponseHeader("content-disposition").split("filename*=")[1];
                    // console.log(data.test_type);
                    if (data.test_type === "AsrModelRate"){
                        fileName = data.case_name + ".zip"
                    }
                    else if (data.test_type === "WZC2C"){
                        fileName = data.case_name + ".xlsx"
                    }

                    console.log(decodeURI(fileName));
                    var blob = this.response;
                    // console.log(blob);
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function (e) {

                        var a = document.createElement('a');
                        a.download = fileName;
                        a.href = e.target.result;
                        $("body").append(a);
                        a.click();
                        $(a).remove();

                        console.log("download over!");  //下载完成
                    }
                }
            };
            console.log("start");
            xhr.send(requestData);
        }
    });
    form.on('switch(openClose)', function(obj){
        // console.log(this.value)
        // console.log(obj.elem.checked)

        $.ajax({
            type: 'POST',
            url: '/wav_list_manager/',
            data: {"listId":this.value, "status": obj.elem.checked},
            dataType: 'json',
            success: function (res) {
                console.log(res)
            }
        })

    });
    //
});