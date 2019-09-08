import requests
import json
import sys
from flask import request
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    payload = {'MemberID': '', 'ClientIPAddress': '95.217.5.6'}
    r = requests.post("http://testapi.iati.ir/Tracker/Get_LoginID/7D7764DF874F8C9D06B7A5BAA462AD0F", data="{MemberID:null,ClientIPAddress:'95.217.5.6'}")
    print("-----")

    print(r.text)
    print("-----")

    datastore = json.loads(r.text)
    sesseionid=datastore["LoginID"]

    reqstr=''' { "fromAirport": "#FROM#","allinFromCity": false,"toAirport": "#TO#","allinToCity": false,"fromDate": "#DATE1#","returnDate": "",   "adult": "1",   "child": "0",   "infant": "0",   "TestMode": false,   "MemberSessionID": "#SESSIONID#" } '''
    payload=reqstr.replace("#FROM#", request.args.get('from')).replace("#TO#", request.args.get('to')).replace("#DATE1#", request.args.get('date')).replace("#SESSIONID#",sesseionid)
    print(payload)

    r = requests.post("http://testapi.iati.ir/Flight/Search/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)

    #print(len(datastore["Flights"][0]["Legs"]))

    result=[]

    for i in range(0,len(datastore["Flights"])):
        if  len(datastore["Flights"][i]["Legs"])==1:
            datastore["Flights"][i]["SearchID"]=datastore["SearchID"];
            datastore["Flights"][i]["SessID"]=sesseionid;
            result.append(datastore["Flights"][i]);

    return json.dumps(result)


#get PaymentID
@app.route('/payid')
def payid():
    reqstr=''' {   "LoginID":"#SESSIONID#",   "CallBackURL":"http://pw.Iati.ir/payment/check/{{id}}",   "PaymentTypeID": 1 } '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    print(payload)

    r = requests.post("http://testapi.iati.ir/Payment/Get_Payment_Code/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)


#get VMoney
@app.route('/vmoney')
def vmoney():
    reqstr=''' {   "MemberSessionID":"#SESSIONID#", "PaymentCode": "#PAYCODE#" } '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess')).replace("#PAYCODE#",request.args.get('payid'));
    print(payload)

    r = requests.post("http://testapi.iati.ir/Payment/Payment_From_VMoney_Website/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)


#get VMoney
@app.route('/selllist')
def selllist():
    reqstr=''' {   "MemberSessionID":"#SESSIONID#", "PaymentCode": "#PAYCODE#" } '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess')).replace("#PAYCODE#",request.args.get('payid'));
    print(payload)

    r = requests.post("http://testapi.iati.ir/Payment/Get_Member_Sell_List/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)


#get PaymentID
@app.route('/pricedetail')
def pricedetail():
    reqstr=''' {   "FareRefereces": [     {       "FlightID": "#FLIGHTID#",       "FareType": "ECONOMY"     }],   "AdultCount": #ADULT#,   "ChildCount": 0,   "InfantCount": 0,   "Currency": "IRR",   "SearchID": "#SEARCHID#",   "MemberSessionID": "#SESSIONID#" }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#FLIGHTID#",request.args.get('flight'))
    payload=payload.replace("#ADULT#",request.args.get('adult'))
    payload=payload.replace("#SEARCHID#",request.args.get('search'))

    print(payload)

    r = requests.post("http://testapi.iati.ir/Flight/PriceDetail/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)

#get PaymentID
@app.route('/addticket')
def addticket():
    reqstr='''{   "LoginID":"#SESSIONID#",   "CallBackURL":"http://iati.ir/payment/check/{{id}}",
    "PaymentTypeID": 1,"PaymentCode": "#PAYCODE#","ServiceName": "FLIGHT", "MemberDescription": "",
    "PriceDetailID": "#DETAILID#",   "Description": "" ,"BookArray":"{\\"TestMode\\":true,
    \\"ContactInfo\\":{
    \\"Email\\":\\"#EMAIL#\\",
    \\"CellphoneNumber\\": \\"#MOBILE#\\",
    \\"PhoneNumber\\":\\"#PHONE#\\"},
    \\"PassengerList\\":[
    {\\"FirstName\\":\\"#NAME#\\",
    \\"LastName\\":\\"#LAST#\\",
     \\"FirstNameEnglish\\":\\"#ENNAME#\\",
     \\"LastNameEnglish\\":\\"#ENLAST#\\",
     \\"IdentityNumber\\":\\"#ID#\\",
     \\"IdentityExpireDate\\":\\"#EXPIRE#\\",
     \\"BirthDate\\":\\"#BD#\\",
     \\"Gender\\":\\"true\\",
     \\"Nationality\\":\\"IR\\",
     \\"DomesticFlight\\":true,
     \\"PassengerType\\":\\"ADULT\\",
     \\"NationalCode\\":\\"0077707788\\"}
     ]}" ,
    "ExteraAgency": 0 }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#PAYCODE#",request.args.get('payid'))
    payload=payload.replace("#DETAILID#",request.args.get('detailid'))
    payload=payload.replace("#ENNAME#",request.args.get('enname'))
    payload=payload.replace("#ENLAST#",request.args.get('enlast'))
    payload=payload.replace("#NAME#",request.args.get('name'))
    payload=payload.replace("#LAST#",request.args.get('last'))
    payload=payload.replace("#ID#","1190076566")
    payload=payload.replace("#EXPIRE#","2019-12-22")
    payload=payload.replace("#BD#","1990-04-22")
    payload=payload.replace("#MOBILE#","09112868767")
    payload=payload.replace("#PHONE#","6565877")
    payload=payload.replace("#EMAIL#","aaaa@bou.com")
    print(payload)

    r = requests.post("http://testapi.iati.ir/Payment/Invoice_Add_Item/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)

    datastore = json.loads(r.text)
    return json.dumps(datastore)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8400)

#for rs in result:
#    print(rs["Legs"][0]["FlightNo"])
#print(datastore["Legs"][0])
