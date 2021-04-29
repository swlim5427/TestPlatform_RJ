// 打开弹窗-上传音频列表
var name = "";
var status = "";

function showUploadTestCase(){

    layui.use('layer', function () {
        layer.open({
            id:1,
            type: 2,
            title:'上传测试用例',
            resize: false,
            area:['550px', '350px'],
            offset:'100px',
            content: ['/templates/pages/resource/layer/upload_testCase.html','no']
        });
    });
}

// 打开弹窗-查看测试用例
function showTestCase(listId, listName){
    console.log(listId);
    layui.use('layer', function () {
        layer.open({
            id:1,
            type: 2,
            title: listName,
            // resize: false,
            area:['1200px', '550px'],
            offset:'auto',
            // offset:'50px',
            content: ['/templates/pages/resource/layer/case_list.html?caseId='+listId]
        });
    });
}

// 删除测试用例
function deleteTestCase(fileId, caseName){
    // console.log(listId)
    layer.confirm('是否确认删除"' + caseName + '"', {
        btn: ['确认','取消'] //按钮
    }, function(){
        $.ajax({
            type: 'POST',
            url: '/del_case/',
            data: {"fileId":fileId},
            dataType: 'json',
            success: function () {
                layer.msg("成功",{
                    time: 1000,
                    end: function () {
                        window.location.reload();
                    }
                });
            }
        })
    });
}


// 加载表格
function loadTable(table){
    layui.use(['table', 'laypage'], function(){
        // 加载表格
        table.render({
            elem: '#caseList'
            ,url:'/select_list/'
            ,method: 'post'
            ,where: {
                "fileName": name
                , "status": status
                ,"caseType": ""
            }
            // ,totalRow: true
            ,cellMinWidth: 80 //
            ,cols: [[
                {field:'table_id', type: 'numbers', title: '序号'}
                ,{field:'case_type_name', title:'用例类别', width:180}
                ,{field:'file_name', title:'用例名'}
                ,{field:'right', title:'操作', toolbar:'#edit', width:180, align:'center'}
            ]]
            ,page:true
            ,limits:[10,30,50,100]
        });
    });
}


layui.use(['table', 'laypage', 'form'], function(formData){
    var table = layui.table
        ,laypage = layui.laypage
        ,form = layui.form;
    form.render();

    // 监听查找按钮
    form.on('submit(caseListSearch)', function (data) {
        // console.log(data);
        name = data.field.caseListName;
        // status = data.field.status;
        status = "";
        loadTable(table);
        return false
    });

    // 加载表格
    loadTable(table);

    // 操作表格
    table.on('tool(caseList)', function (obj) {
        // console.log(obj)
        var data = obj.data;
        if (obj.event === 'details'){
            console.log(data);
            showTestCase(data.file_id, data.file_name)
        }
        if (obj.event === 'delete'){
            console.log(data);
            deleteTestCase(data.file_id, data.file_name)
        }
        if (obj.event === "export"){

            var url = '/export_testcase/';
            var xhr = new XMLHttpRequest();
            var requestData = JSON.stringify({"fileId":data.file_id, "fileName": data.file_name});

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
                    fileName = data.file_name + ".xlsx"

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

    // 控制开关
    form.on('switch(openClose)', function(obj){
        // console.log(this.value)
        // console.log(obj.elem.checked)

        $.ajax({
            type: 'POST',
            url: '/wav_list_manager/',
            data: {"listId":this.value, "status": obj.elem.checked},
            dataType: 'json',
            success: function () {

            }
        })
    });
    //
});
