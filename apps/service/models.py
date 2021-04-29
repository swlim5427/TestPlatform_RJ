# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


# 测试用例表
class TestCase(models.Model):
    file_id = models.CharField('用例文件id', unique=False, null=True, max_length=255)
    file_name = models.CharField('用例文件名称', unique=False, max_length=255)
    case_id = models.CharField('用例id', max_length=255, unique=False)
    case_name = models.TextField('用例名称', null=True)
    module = models.CharField('功能模块',  max_length=255, null=True)
    api_name = models.TextField('接口名称', null=True)
    case_level = models.CharField('用例等级', max_length=255, null=True)
    api_type = models.CharField('接口类型(post/get)', max_length=255, null=True)
    api_url = models.CharField('请求地址', max_length=255, null=True)
    preconditions = models.CharField('前置条件', max_length=255, null=True)
    relation = models.CharField('关联参数', max_length=255, null=True)
    input_params = models.CharField('输入参数',  max_length=255, null=True)
    expected = models.CharField('预期结果', max_length=255, null=True)
    output = models.CharField('实际结果', max_length=255, null=True)
    result = models.CharField('测试结果(success/fail)', max_length=255, null=True)
    project_name = models.CharField('项目名称', max_length=255, null=True)
    version = models.CharField('版本号', max_length=255, null=True)
    comments = models.CharField('备注', max_length=255, null=True)
    status = models.CharField('状态（0：停用，1：使用）', max_length=255, null=True)
    insert_date = models.CharField('创建日期', max_length=255, null=True)
    update_date = models.CharField('修改日期', max_length=255, null=True)

    def __unicode__(self):
        return self.file_id, self.file_name, self.case_id, \
               self.case_name, self.module, \
               self.api_name, self.case_level, \
               self.api_type, self.api_url, \
               self.preconditions, self.relation, \
               self.input_params, self.expected, self.output, \
               self.project_name, self.version, \
               self.result, self.comments, self.status, \
               self.insert_date, self.update_date


# 文件列表（测试用例）
class CheckUpFile(models.Model):
    file_id = models.CharField('文件id',  max_length=255, unique=False, null=True)
    file_name = models.CharField('文件名称', max_length=255, unique=True, null=True)
    status = models.CharField('状态（0 停用，1 启用）', max_length=255, unique=False, null=True)
    case_type = models.CharField('用例类型：1001，1002，1003', max_length=255, null=True)
    case_type_name = models.CharField('用例类型名:接口，性能，UI', max_length=255, null=True)

    def __unicode__(self):
        return self.file_id, self.file_name, \
               self.status, \
               self.case_type, self.case_type_name


# 测试任务表
class TestTask(models.Model):

    test_id = models.CharField('测试任务id',  max_length=255, unique=True, null=True)
    case_name = models.CharField('测试用例名称, list_name',  max_length=255, null=True)
    case_id = models.CharField('测试用例id,list_id',  max_length=255, null=True)
    next_case_id = models.CharField('下一条测试用例id',  max_length=255, null=True)
    now_case_id = models.CharField('当前测试用例id',  max_length=255, null=True)
    progress = models.CharField('当前任务进度',  max_length=255, null=True)
    status = models.CharField('状态（0：进行中，1：完成，2：终止）', max_length=255, null=True)
    test_type = models.CharField('任务种类', max_length=255, null=True)
    api_host = models.CharField('测试地址', max_length=255, null=True)
    start_date = models.CharField('开始时间', max_length=255, null=True)
    end_date = models.CharField('结束时间', max_length=255, null=True)
    name = models.CharField('任务名称(自定义，例如模型名称)', max_length=255, null=True)
    tmp1 = models.CharField('预留', max_length=255, null=True)

    def __unicode__(self):
        return self.test_id, self.case_id, self.case_name, \
               self.next_case_id, self.now_case_id, \
               self.progress, self.status, \
               self.api_host, self.test_type, \
               self.start_date, self.end_date, \
               self.name, self.tmp1


# 测试报告表
# class Report(models.Model):
#     test_id = models.CharField('测试任务id', max_length=255, unique=True)
#     test_result = models.TextField('测试结果', null=True)
#     test_details = models.TextField('报告详情', null=True)
#
#     def __unicode__(self):
#         return self.test_id, self.test_result, self.test_details
