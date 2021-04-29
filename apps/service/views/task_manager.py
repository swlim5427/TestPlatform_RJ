# -*- coding: utf-8 -*-
from apps.service import models as mysql_db
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


# 查询 测试任务 列表
@csrf_exempt
def select_task_list(request):

    if request.method == "POST":
        post = request.POST

        name = post["name"].replace(" ", "")
        status = post["status"]

        if name != "":
            if status != "":
                select_table = mysql_db.TestTask.objects.filter(name__contains=name, status=status).values().order_by('-id')
            else:
                select_table = mysql_db.TestTask.objects.filter(name__contains=name).values().order_by('-id')
        else:
            if status != "":
                select_table = mysql_db.TestTask.objects.filter(status=status).values().order_by('-id')
            else:
                select_table = mysql_db.TestTask.objects.filter().values().order_by('-id')

        limit = int(post["limit"])
        page = int(post["page"])

        if page != 1:
            page = ((page - 1) * limit) + 1
            limit = (limit + page) - 1

        count = select_table.count()

        result = select_table[page-1:limit]

        # period_list = json.dumps(list(select_table))

        response = {"code": 0, "count": count, "data": list(result)}

        return JsonResponse(response)
