// 上传测试用例
layui.use(['layer', 'upload', 'form'], function(){
    var $ = layui.jquery
        ,upload = layui.upload
        ,form = layui.form;

    form.verify({
        checkCaseName: function (value) {
            if (value === ""){
                return "输入用例名称";
            }
        }
    });

    upload.render({
        elem: '#fileSelect'
        ,url: '/upload_case/'
        ,auto: false
        //,multiple: true
        ,bindAction: '#uploadTestCase'
        ,accept: 'file'
        ,field:"testCaseFile"
        ,data: {
            caseName: function(){
                return $('#caseName').val();
            },
            caseType: function(){
                return $('#caseType').val();
            },
            caseTypeName: function(){
                return "接口测试用例";
            },


        }

        ,before:function () {
            // layer.load()
        }
        ,done: function(res){
            console.log(res);

            if (res.code==="0"){
                layer.msg(res.responseMessage.message);

            }else {
                layer.msg(res.responseMessage.message, {
                    time: 1000,
                    end: function () {
                        // var index = parent.layer.getFrameIndex(window.name);
                        // parent.layer.close(index);
                        window.parent.location.reload();
                    }
                });
            }
        }
        ,error: function (index, upload) {
            console.log("222")

        }
    });
});