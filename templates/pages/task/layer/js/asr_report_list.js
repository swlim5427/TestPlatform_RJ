// 加载表格
layui.use(['table', 'laypage', 'element'], function(obj){

    var table = layui.table
        ,element = layui.element
        ,laypage = layui.laypage
        ,form = layui.form;

    // 加载表格
    var wavType = "全部";
    var step = 0;
    renderTable(table, element, form, wavType, step);
    // var wavTypeSelect=document.getElementById("wavType");
    // var selectOptionIndex = wavTypeSelect.selectedIndex;
    // console.log(wavTypeSelect.options[selectOptionIndex].value);

    form.on('select(wavType)', function (data) {
        console.log(data.value);

        wavType = data.value;
        if (wavType!==""){
            step = 1;
            renderTable(table, element, form, wavType, step);
        }
    });

    //监听行单击事件,弹出单条详情
    table.on('row(reportList)', function(obj){
        // console.log(obj.data);
        var data = obj.data;
        try {
            var rt = "RT：" + data.rt + "<br>";
            var wer = data.wer + "<br>";
            var lab = data.lab + "<br>";
            var rec = data.rec + "<br>";
            var context = "context：" + data.context + "<br>";

            var detail = rt+wer+lab+rec+context.replace(/\"/g,'');
        }
        catch (e) {
            console.log(e)
        }

        layer.alert((detail), {
            title: data.wav_name + '：识别结果对比'
        });

    });
});

function renderTable(table, element, form, wavType, step) {

    var testDetails = "";
    var testResult = "";
    var testId = location.search.split("=")[1];

    table.render({
        elem: '#reportList'
        ,url:'/select_report_detail/'
        ,method: 'post'
        // ,totalRow: true
        ,where: {"testId": testId, "msgType": "AsrModelRate", "wavType": wavType}
        ,filter:true
        ,cellMinWidth: 80 //
        ,cols: [[
            {field:'table_id', type: 'numbers', title: '序号'}
            ,{field:'wav_name', title:'音频名称', width:300}
            ,{field:'wer', title:'识别率', width:150}
            ,{field:'wav_len', title:'音频时长', width:100}
            ,{field:'asr_time', title:'识别用时', width:100}
            ,{field:'rt', title:'RT', width:80}
            ,{field:'asr_result', title:'识别结果', toolbar:'#rec'}
            ,{field:'wav_answer', title:'答案', toolbar:'#lab'}
            ,{field:'wav_type', title:'分类',edit: true,filter: true, width:150}
        ]]
        ,page:true
        ,limits:[10,30,50,100]
    });

    $.ajax({
        type: 'POST',
        url: '/select_report_main/',
        data: {"testId": testId, "msgType": "AsrModelRate", "wavType": wavType},
        dataType: 'json',
        success: function (res) {
            // console.log(res);
            // console.log(JSON.parse(res.data));
            testResult = JSON.parse(res.data).rate;
            var wavTypeList = [];
            try {
                for(var ratekey in testResult){
                    // console.log(ratekey);
                    // console.log(testResult[ratekey]);
                    if (ratekey==="全部"){
                        wavTypeList.unshift(ratekey)
                    }else {
                        wavTypeList.push(ratekey)
                    }
                }
                // reloadOption("wavType");
                for(var i=0, l=wavTypeList.length; i<l; i++){

                    testDetails =
                        testDetails +
                        wavTypeList[i] + "：" +
                        "RT：" + testResult[wavTypeList[i]].rt + "，" +
                        testResult[wavTypeList[i]].wer +'<br>';
                    // 给option 赋值
                    if (step===0){
                        wavTypeList[0].selected = true;
                        var name = wavTypeList[i];
                        var id = wavTypeList[i];
                        var sel = document.getElementById("wavType");
                        var option = new Option(name,id);
                        sel.options.add(option);
                    }
                }
                form.render();

            }
            catch (e) {
                console.log(e)
            }

            // console.log(testDetails);
            $("#testDetails").html(testDetails)
            // $("#testDetails").html(testDetails)
        }
    });
}