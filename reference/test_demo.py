# -*- coding: utf-8 -*-
import requests
import lib.http_request as http_request


def test_login():

    url = 'http://172.16.29.210:30880/kapis/iam.kubesphere.io/v1alpha2/login'

    payload = {"username": "admin", "password": "P@88w0rd"}
    headers = {
        'Content-Type': 'application/json'
    }

    print http_request.http_post(url=url, data=payload, headers=headers)


if __name__ == '__main__':
    test_login()
