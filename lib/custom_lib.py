# -*- coding: utf-8 -*-
import hashlib
import time
import MySQLdb
import socket
import TestPlatform.settings as setting
from django.http import JsonResponse
from apps.service import models as mysql_db


# 生成id
def set_id():
    random = hashlib.md5()
    random.update(bytes(str(time.time())))
    return random.hexdigest()


# 返回json
def response_message(result, message, code):

    http_response = {"result": result, "responseMessage": message, "code": code}

    return http_response


# 错误返回
def error_return(response, code):
    result = "failed"
    result_code = code
    return response_message(result, response, result_code)


# 自动移mysql连接
def mysql_connect(sql):
    database = setting.DATABASES
    host = database["default"]["HOST"]
    port = database["default"]["PORT"]
    user = database["default"]["USER"]
    password = database["default"]["PASSWORD"]
    name = database["default"]["NAME"]

    conn = MySQLdb.connect(host=host, port=port, user=user, passwd=password, db=name)
    cur = conn.cursor()
    try:
        sql_result = cur.execute(sql)
        r_list = cur.fetchmany(sql_result)

        cur.close()
        conn.commit()
        conn.close()
        return r_list

    except Exception as e:
        print e


# 更新测试任务表
def update_test_task(status, test_id, end_time):
    update_status = mysql_db.TestTask.objects.get(test_id=test_id)
    update_status.status = status
    update_status.end_date = end_time
    try:
        update_status.save()
    except Exception as e:
        print e


# 测试结束后更新测试任务表
def test_end(**kwargs):

    test_id = kwargs["test_id"]
    step = kwargs["step"]
    list_id = kwargs["list_id"]
    status = kwargs["status"]
    test_type = test_id.split("-")[0]

    update_test_task(3, test_id, "")
    from apps.service.views import report_manager

    if test_type == "AsrModelRate":
        report_manager.report_manager_asr_model(step=step, test_id=test_id, list_id=list_id)

    elif test_type == "WZC2C":
        report_manager.report_manager_wz_c2c(step=step, test_id=test_id, list_id=list_id)

    end_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    update_test_task(status, test_id, end_time)


# 用例重复判断
def check_file(**kwargs):
    insert_table = kwargs["insert_table"]
    try:
        insert_table.save()
        return 1, ""
    except Exception as e:
        print e[0]
        if e[0] == 1062:
            response = {"message": u"失败,检查文件名", "code": e[0]}
        else:
            response = {"message": u"失败：" + e[0]}
        result = "failed"
        result_code = "0"
        return 0, response_message(result, response, result_code)


def test_start_success(test_id):
    response = {"message": u"测试任务开始执行", "testId": test_id}
    result = "success"
    result_code = "1"
    response = response_message(result, response, result_code)
    return response


def test_start_faild(test_id):
    response = {"message": u"测试任务启动失败", "testId": test_id}
    result = "failed"
    result_code = "0"
    response = response_message(result, response, result_code)
    return response
