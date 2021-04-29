// 加载表格
layui.use(['table', 'laypage'], function(obj){
    var testDetails = "";
    var testResult = "";

    var testId = location.search.split("=")[1];
    var table = layui.table
        ,laypage = layui.laypage;
    // 加载表格
    table.render({
        elem: '#reportList'
        ,url:'/select_report_detail/'
        ,method: 'post'
        // ,totalRow: true
        ,where: {"testId": testId, "msgType": "WZC2C"}
        ,cellMinWidth: 80 //
        ,cols: [[
            {field:'table_id', type: 'numbers', title: '序号'}
            ,{field:'case_id', title:'用例id', width:200}
            ,{field:'wav_name', title:'音频文件名称', width:150}
            ,{field:'asr_result', title:'ASR转写结果', width:160}
            ,{field:'wav_answer', title:'ASR标注结果'}
            ,{field:'wer', title:'ASR准确率', width:120}
            ,{field:'run_result', title:'系统判断结果', width:120}
            ,{field:'expect_result', title:'预期判断结果', width:120}
            ,{field:'report', title:'测试结果', width:100, toolbar:'#result'}
        ]]
        ,page:true
        ,limits:[10,30,50,100]
    });

    $.ajax({
        type: 'POST',
        url: '/select_report_main/',
        data: {"testId": testId, "msgType": "WZC2C"},
        dataType: 'json',
        success: function (res) {
            try {
                testDetails =
                    "准确率：" + res.rate + '<br>' +
                    "总 数：" + res.all_result + '<br>' +
                    "正 确：" + res.right_result + '<br>' +
                    "错 误：" + res.error_result;
            }
            catch (e) {
                console.log(e)
            }

            // testResult = res.data.test_result;

            // console.log(testDetails);
            $("#testDetails").html(testDetails)
            // $("#testDetails").html(testDetails)
        }
    });
    //监听行单击事件,弹出单条详情
    table.on('row(reportList)', function(obj){
        var data = obj.data;
        console.log(data.correct_answer);
        try {
            var questionText = "\t" +"问题：" + data.question_text + "<br>";
            var asrResult = "ASR转写结果：" + data.asr_result + "<br>";
            var wavAnswer = "ASR标注结果：" + data.wav_answer + "<br>";
            var runResult = "实际结果：" + data.run_result + "<br>";
            var expectResult = "预期结果：" + data.expect_result + "<br>";
            var correctAnswer = "预期答案：" + data.correct_answer + "<br>";

            var detail =
                questionText
                + asrResult
                + wavAnswer
                + runResult
                + expectResult
                + correctAnswer.replace(/\"/g,'');
        }
        catch (e) {
            console.log(e)
        }

        layer.alert((detail), {
            title: '用例详情',
            area: ['500px', '300px']
        });


    });
});
