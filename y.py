import requests
import json
import sys
from flask import request

from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello():
    payload = {'MemberID': '', 'ClientIPAddress': '95.217.5.6'}
    r = requests.post("http://api.iati.ir/Tracker/Get_LoginID/7D7764DF874F8C9D06B7A5BAA462AD0F", data="{MemberID:null,ClientIPAddress:'95.217.5.6'}")
    print(r.text)
    datastore = json.loads(r.text)

    sesseionid=datastore["LoginID"]


    reqstr='''{   "LoginID":"#LoginID",   "CallBackURL":"http://pw.Iati.ir/payment/check/{{id}}",   "PaymentTypeID": 1 '''
    payload=reqstr.replace("#FROM#", request.args.get('from')).replace("#TO#", request.args.get('to')).replace("#DATE1#", request.args.get('date')).replace("#SESSIONID#",sesseionid)

    print(payload)


    r = requests.post("http://api.iati.ir/Flight/Search/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)

    #print(len(datastore["Flights"][0]["Legs"]))

    result=[]

    for i in range(0,len(datastore["Flights"])):
        if  len(datastore["Flights"][i]["Legs"])==1:
            result.append(datastore["Flights"][i]);

    return json.dumps(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8400)


#for rs in result:
#    print(rs["Legs"][0]["FlightNo"])
#print(datastore["Legs"][0])
