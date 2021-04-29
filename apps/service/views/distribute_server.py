# -*- coding: utf-8 -*-
from django.http import JsonResponse
from apps.service import models as mysql_db
# import ap
from lib import custom_lib as lib
from django.views.decorators.csrf import csrf_exempt
import json
import time
import case_manager
import threading


@csrf_exempt
def test_start(request):

    if request.method == "POST":

        post = request.POST
        start_response = distribute(post)

        return JsonResponse(start_response)


@csrf_exempt
def test_stop(request):

    try:
        test_id = request["testId"]
        update_test_status = mysql_db.TestTask.objects.get(test_id=test_id)
        update_test_status.status = "2"
        update_test_status.end_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        update_test_status.save()

    except Exception as e:
        print e

        if request.method == "POST":

            params = request.POST
            test_id = params["testId"]

            update_test_status = mysql_db.TestTask.objects.get(test_id=test_id)
            update_test_status.status = "2"
            update_test_status.end_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))

            try:
                update_test_status.save()

                response = {"message": u"停止成功"}
                result = "success"
                result_code = "1"

            except:

                response = {"message": u"停止失败"}
                result = "failed"
                result_code = "0"

            return JsonResponse(lib.response_message(result, response, result_code))


def distribute(post):

    params = json.loads(post["params"])
    test_type = post["testType"]

    test_id = test_type + "-" + lib.set_id()
    params["test_id"] = test_id

    if test_type == "APITest":  # 接口测试
        from apps.api_test.views import api_test
        # 更新测试任务表，写入测试任务
        print test_id
        insert_test_task = mysql_db.TestTask(
            test_id=test_id,
            case_name=params["fileName"],  # list_name
            case_id=params["fileId"],  # list_id
            next_case_id="",
            now_case_id="",
            test_type=test_type,
            api_host=params["apiHost"],
            start_date=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
            end_date="",
            name=params["taskName"],
            tmp1="",
            progress=0,
            status=0
        )
        try:
            insert_test_task.save()

            t = create_threading(api_test.api_test, params)
            t.start()

            response = lib.test_start_success(test_id)

        except Exception as e:
            print e
            response = lib.test_start_faild(test_id)

        return response


def create_threading(func, param):
    p = [param]
    new_threading = threading.Thread(target=func, args=p)
    return new_threading
