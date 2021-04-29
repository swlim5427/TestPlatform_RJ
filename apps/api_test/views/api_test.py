# -*- coding: utf-8 -*-
from lib import http_request
from apps.service import models as mysql_db
import json


def api_test(params):
    # print params
    host = params["apiHost"]
    file_id = params["fileId"]
    file_name = params["fileName"]

    test_case_list = mysql_db.TestCase.objects.filter(file_id=file_id).values()

    for row in test_case_list:
        # 查询测试用例表，获取测试关键字
        case_id = row["case_id"]
        case_name = row["case_name"]
        module = row["module"]
        api_name = row["api_name"]
        case_level = row["case_level"]
        api_type = row["api_type"]
        api_url = row["api_url"]
        preconditions = json.loads(row["preconditions"])
        relation = json.loads(row["relation"])
        input_params = json.loads(row["input_params"])

        try:
            expected = json.loads(row["expected"])
        except:
            expected = row["expected"]

        headers = input_params["headers"]

        try:
            headers["access_token"]
        except:
            headers = {
                'Content-Type': 'application/json'
            }

        data = input_params["data"]

        url = host + api_url

        if api_type == "post":
            http_response = http_request.http_post(url=url, headers=headers, data=data)
            print(http_response)
