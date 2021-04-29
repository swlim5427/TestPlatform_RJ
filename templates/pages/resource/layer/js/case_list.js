// 加载测试用例列表
layui.use(['table', 'laypage'], function(obj){

    var caseId = location.search.split("=")[1];
    var table = layui.table
        ,laypage = layui.laypage;
    // 加载表格
    table.render({
        elem: '#caseList'
        ,url:'/select_case/'
        ,method: 'post'
        // ,totalRow: true
        ,where: {"caseId": caseId}
        ,cellMinWidth: 80 //
        ,cols: [[
            {field:'table_id', type: 'numbers', title: '序号'}
            ,{field:'case_id', title:'用例ID', width:80}
            ,{field:'case_name', title:'用例名称', width:150}
            ,{field:'case_level', title:'用例等级', width:90}
            ,{field:'api_name', title:'接口名称', width:150}
            ,{field:'api_url', title:'接口地址', width:150}
            ,{field:'api_type', title:'接口类型', width:90}
            ,{field:'input_params', title:'输入项', width:180, edit:true}
            ,{field:'expected', title:'预期结果', width:180, edit:true}
        ]]

        ,page:true
        ,limits:[10,30,50,100]

    });

    //监听单元格编辑
    table.on('edit(caseList)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段

        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/edit_case/',
            data: {"data": JSON.stringify(data)},
            dataType: 'json',
            success: function (response) {
                console.log(response);

                if(response.code==="0"){
                    console.log(response.responseMessage);
                    layer.msg(response.responseMessage.message,{
                        time: 1000,
                        end: function(){
                            window.location.reload();
                        }
                    });
                }else {
                    layer.msg("成功",{
                        time: 1000,
                    });
                }
            }
        });

    });

});
