# -*- coding: utf-8 -*-

# import time
import datetime
import lib.custom_lib as lib
from django.http import JsonResponse
# from django.http import HttpResponse
import TestPlatform.settings as sys_setting
from django.views.decorators.csrf import csrf_exempt
import json
import xlrd
import os
from apps.service import models as mysql_db


# 上传测试用例
@csrf_exempt
def upload_case(request):
    if request.method == "POST":

        test_case = request.FILES.get("testCaseFile", None)
        post = request.POST

        try:
            case_file_name = post["caseName"]
            if case_file_name.replace(" ", "") == "" or case_file_name == "" or case_file_name == "undefined":
                case_file_name = case_file_name.name

        except Exception as e:
            print(e)
            case_file_name = test_case.name

        case_type = post["caseType"]

        if case_type == "1001":
            case_type_name = "接口测试用例"
        elif case_type == "1002":
            case_type_name = "性能测试用例"
        elif case_type == "1003":
            case_type_name = "UI测试用例"
        else:
            case_type_name = "其他"

        try:
            case_project = post["caseProject"]
        except Exception as e:
            print(e, "--no case project")
            case_project = "default"
        try:
            version = post["version"]
        except Exception as e:
            print(e, "--no version")
            version = "last"

        test_case_file = xlrd.open_workbook(filename=None, file_contents=test_case.read())
        sheet = test_case_file.sheets()[0]

        if sheet.nrows > 1:

            file_id = "testCase-" + lib.set_id()
            insert_table_file_list = mysql_db.CheckUpFile(
                file_id=file_id,
                file_name=case_file_name,
                status="1",
                case_type=case_type,
                case_type_name=case_type_name
            )

            check_result = lib.check_file(insert_table=insert_table_file_list)
            if check_result[0] == 0:
                return JsonResponse(check_result[1])

            for i in range(1, sheet.nrows):
                case_id = sheet.cell(i, 0).value
                case_name = sheet.cell(i, 1).value
                module = sheet.cell(i, 2).value
                api_name = sheet.cell(i, 3).value
                case_level = sheet.cell(i, 4).value
                http_type = sheet.cell(i, 5).value
                api_url = sheet.cell(i, 6).value
                preconditions = sheet.cell(i, 7).value
                input_params = sheet.cell(i, 8).value
                expected = sheet.cell(i, 9).value
                output = sheet.cell(i, 10).value
                relation = sheet.cell(i, 11).value
                result = sheet.cell(i, 12).value
                comments = sheet.cell(i, 13).value

                try:
                    json.loads(input_params)
                except Exception as e:
                    print(e)
                    input_params = "json格式错误"

                insert_table_test_case = mysql_db.TestCase(
                    file_id=file_id,  # 文件ID
                    file_name=case_file_name,  # 文件名
                    case_id=case_id,  # 用例ID
                    case_name=case_name,  # 用例名
                    module=module,  # 功能模块
                    api_name=api_name,  # 接口名称
                    case_level=case_level,  # 用例等级
                    api_type=http_type,  # 接口类型（post、get、delete、path）
                    api_url=api_url,  # 接口地址
                    preconditions=preconditions,  # 前置条件
                    relation=relation,  # 关联参数
                    input_params=input_params.replace("\n", "").replace("\t", "").replace(" ", ""),  # 输入参数
                    expected=expected,  # 预期结果
                    output=output,  # 实际返回结果
                    result=result,  # 测试结果
                    project_name=case_project,  # 项目名称
                    version=version,  # 版本号
                    comments=comments,  # 备注
                    status="1",  # 用例状态
                    insert_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # 用例写入时间
                    update_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # 用例修改时间

                )

                try:
                    insert_table_test_case.save()

                except Exception as e:
                    print(e)
                    mysql_db.CheckUpFile.objects.filter(file_id=file_id).delete()
                    mysql_db.TestCase.objects.filter(file_id=file_id).delete()

                    response = {"message": u"失败,上传终止"}
                    return JsonResponse(lib.error_return(response, "0"))

            response = {"message": u"上传成功"}
            result = "success"
            result_code = "1"
            return JsonResponse(lib.response_message(result, response, result_code))


# 删除测试用例
@csrf_exempt
def del_case(request):
    if request.method == "POST":
        post = request.POST
        list_id = post["fileId"]

        mysql_db.CheckUpFile.objects.filter(case_id=list_id).delete()
        mysql_db.TestCase.objects.filter(file_id=list_id).delete()

        response = {"message": u"成功"}
        result = "success"
        result_code = "1"
        return JsonResponse(lib.response_message(result, response, result_code))


# 编辑测试用例
@csrf_exempt
def edit_case(request):
    if request.method == "POST":
        post = request.POST
        data = json.loads(post["data"])

        case_param = data["case_param"]

        try:
            json.loads(case_param)
        except Exception as e:
            print(e)
            response = {"message": u"失败,参数json格式错误"}
            result_code = "0"
            return JsonResponse(lib.error_return(response, result_code))

        file_id = data["file_id"]
        case_id = data["case_id"]
        expected = data["expected"]

        update_table = mysql_db.TestCase.objects.get(file_id=file_id, case_id=case_id)
        update_table.case_param = case_param
        update_table.expected = expected
        update_table.update_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        update_table.save()

        response = {"message": u"更新成功"}
        result = "success"
        result_code = "1"
        return JsonResponse(lib.response_message(result, response, result_code))


# 查询测试用例
@csrf_exempt
def select_case(request):
    if request.method == "POST":
        post = request.POST

        limit = int(post["limit"])
        page = int(post["page"])

        try:
            case_id = post["caseId"]
            select_table = mysql_db.TestCase.objects.filter(file_id=case_id).values()
        except:
            select_table = mysql_db.TestCase.objects.filter().values()

        if page != 1:
            page = ((page - 1) * limit) + 1
            limit = (limit + page) - 1

        count = select_table.count()
        result = select_table[page-1:limit]

        response = {"code": 0, "count": count, "data": list(result)}
        return JsonResponse(response)


# 下载测试用例
@csrf_exempt
def download_case():
    print("download")


# 初始化测试用例
@csrf_exempt
def init_case(test_case):

    sql = "select * from " + test_case

    lib.mysql_connect(sql)
    print("init_case")


# 查询用例列表
@csrf_exempt
def select_list(request):

    if request.method == "POST":
        post = request.POST

        case_type = post["caseType"]    # 测试用例类型
        conditions_filter = {"case_type": case_type}

        status = post["status"]
        conditions_filter["status"] = status     # 测试用例状态

        file_name = post.get("fileName")
        if file_name is not None:
            conditions_filter["file_name__contains"] = file_name    # 测试用例文件名称
        if file_name != "" and file_name is not None:
            conditions_filter["file_name__contains"] = file_name

        try:
            limit = int(post["limit"])
            page = int(post["page"])
        except Exception as e:
            print(e)
            limit = 0
            page = 0

        if page != 1:
            page = ((page - 1) * limit) + 1
            limit = (limit + page) - 1

        if case_type == "" and status == "" and file_name == "":
            select_table = mysql_db.CheckUpFile.objects.filter().values().order_by('-id')
        else:
            select_table = mysql_db.CheckUpFile.objects.filter(**conditions_filter).values().order_by('-id')

        count = select_table.count()
        # if case_type == "":
        #     try:
        #         get_option = post["getOption"]
        #         print(get_option)
        #         result = select_table
        #     except Exception as e:
        #         print(e)
        #         result = select_table[page-1:limit]
        # else:
        #     result = select_table

        response = {"code": 0, "count": count, "data": list(select_table)}

        return JsonResponse(response)
