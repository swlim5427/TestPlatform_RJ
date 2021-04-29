# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse


def test_frame_index(request):
    import os
    print os.system("pwd")
    return render(request, 'pages/index.html')


def test(request):
    return render(request, 'pages/wav_list_table.html')
