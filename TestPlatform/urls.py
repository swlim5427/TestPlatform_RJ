"""TestPlatform URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconftest_start
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from apps.index.views import index
from apps.service.views import distribute_server, case_manager, task_manager, report_manager

urlpatterns = [

    url(r'^admin/', admin.site.urls),

    url(r'^$', index.test_frame_index),
    url(r'^test/$', index.test),

    url(r'^test_start/$', distribute_server.test_start),
    url(r'^test_stop/$', distribute_server.test_stop),

    url(r'^upload_case/$', case_manager.upload_case),
    url(r'^init_case/$', case_manager.init_case),
    url(r'^del_case/$', case_manager.del_case),
    url(r'^select_case/$', case_manager.select_case),
    url(r'^edit_case/$', case_manager.edit_case),

    url(r'^select_list/$', case_manager.select_list),

    url(r'^select_task_list/$', task_manager.select_task_list),
    url(r'^select_report_detail/$', report_manager.select_report_detail),
    url(r'^select_report_main/$', report_manager.select_report_main),
    url(r'^export_test_report/$', report_manager.export_test_report),
    url(r'^export_testcase/$', report_manager.export_testcase),
    url(r'^export_wavlist/$', report_manager.export_wavlist),


]
