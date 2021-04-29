# -*- coding: utf-8 -*-
import requests
import json


def http_get(**kwargs):
    print kwargs


# post 请求封装
def http_post(**kwargs):
    print kwargs
    url = kwargs["url"]
    headers = kwargs["headers"]
    data = kwargs["data"]

    if headers["Content-Type"] == "application/json":

        response = requests.post(url, headers=headers, json=data)

    elif headers["Content-Type"] == "application/x-www-form-urlencoded":
        response = requests.post(url, headers=headers, json=data)
        print "application/x-www-form-urlencoded"
    else:
        response = ""
        print "else"

    return json.loads(response.text)


def http_delete(**kwargs):
    print kwargs


def http_path(**kwargs):
    print kwargs


def http_put(**kwargs):
    print kwargs
