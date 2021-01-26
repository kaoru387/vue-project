#-*- coding: utf-8 -*-
import requests
import xmltodict
import json
from flask import escape,make_response,jsonify

url = 'https://www.supersaas.com/api'
payload={'username':'susture','password':'susture2525'}

# 検証用
def main():
    headers = {'content-type': 'application/json'}
    r = requests.get(url, 
        auth=('susture','jmlLq1BhwucEkul_WgmSOA'),
        data=json.dumps(payload), 
        headers=headers)
    dict = xmltodict.parse(r.text)
    return json.dumps(dict, indent=4)

def get(method_name):
    headers = {'content-type': 'application/json'}
    r = requests.get(url+method_name, 
        auth=('susture','jmlLq1BhwucEkul_WgmSOA'),
        data=json.dumps(payload), 
        headers=headers)
    dict = xmltodict.parse(r.text)
    return json.dumps(dict, indent=4, ensure_ascii=False)

def hello_world(request):
    
    # preflight request時
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)

    param_dict=''
    if request.method == 'GET':
        param_dict=get('/users')

    # param_dict=main()
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    # return (json.dumps(param_dict), 200, headers)
    # return ('success', 200, headers)
    return make_response(jsonify({'result':param_dict}))


if __name__ == '__main__':
    print(main())