// 打开弹窗-上传音频列表
function showUploadContext(){

    layui.use('layer', function () {
        layer.open({
            id:1,
            type: 2,
            title:'上传文件',
            resize: false,
            area:['550px', '350px'],
            offset:'100px',
            content: ['/templates/pages/resource/layer/upload_context.html','no']
        });
    });
}

// 打开弹窗-查看context详细列表
function showContextList(contextId, contextName){
    // console.log(listId)
    layui.use('layer', function () {
        layer.open({
            id:1,
            type: 2,
            title: contextName,
            // resize: false,
            area:['500px', '550px'],
            offset:'100px',
            content: ['/templates/pages/resource/layer/context_list.html?listId='+contextId]
        });
    });
}

// 删除context列表
function deleteContextList(contextId, contextName){
    // console.log(listId)
    layer.confirm('是否确认删除"' + contextName + '"', {
        btn: ['确认','取消'] //按钮
    }, function(){
        $.ajax({
            type: 'POST',
            url: '/del_context_list/',
            data: {"contextId":contextId},
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
layui.use(['table', 'laypage'], function(){
    var table = layui.table
        ,laypage = layui.laypage
        ,form = layui.form;
    // 加载表格
    table.render({
        elem: '#contextFileList'
        ,url:'/select_list/'
        ,method: 'post'
        ,where: {"listType": 1}
        // ,totalRow: true
        ,cellMinWidth: 80 //
        ,cols: [[
            {field:'table_id', type: 'numbers', title: '序号'}
            ,{field:'context_name', title:'名称'}
            ,{field:'right', title:'操作', toolbar:'#edit', width:180, align:'center'}
        ]]
        ,page:true
        ,limits:[10,30,50,100]
    });

    // 操作表格
    table.on('tool(contextFileList)', function (obj) {
        // console.log(obj)
        var data = obj.data;
        if (obj.event === 'details'){
            console.log(data)
            showContextList(data.context_id, data.context_name)
        }
        if (obj.event === 'delete'){
            console.log(data)
            deleteContextList(data.context_id, data.context_name)
        }
    });

});