#!/usr/bin/env python
# -*- coding: utf-8 -*-
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

    date2=""
    if request.args.get('IsRound')=="true":
        date2=request.args.get('date2')

    reqstr=''' { "fromAirport": "#FROM#","allinFromCity": false,"toAirport": "#TO#","allinToCity": false,"fromDate": "#DATE1#","returnDate": "#DATE2#",   "adult": "#ADULT#",   "child": "#CHILD#",   "infant": "#INFANT#",   "TestMode": false,   "MemberSessionID": "#SESSIONID#" } '''
    payload=reqstr.replace("#FROM#", request.args.get('from')).replace("#TO#", request.args.get('to')).replace("#DATE1#", request.args.get('date')).replace("#DATE2#", request.args.get('date2')).replace("#SESSIONID#",sesseionid).replace("#ADULT#", request.args.get('adult')).replace("#CHILD#", request.args.get('child')).replace("#INFANT#", request.args.get('infant'))

    print(payload)

    r = requests.post("http://testapi.iati.ir/Flight/Search/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    #print("________________________________________________________________________________________________")
    #print(r.text)
    #print("________________________________________________________________________________________________")
    datastore = json.loads(r.text)
    #print(len(datastore["Flights"][0]["Legs"]))
    result=[]

    for i in range(0,len(datastore["Flights"])):
        #if  len(datastore["Flights"][i]["Legs"])==1:
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


#get Rules
@app.route('/rules')
def rules():
    reqstr=''' {   "FlightID": "#FLIGHTID#",  "SearchID": "#SEARCHID#",   "MemberSessionID": "#SESSIONID#" }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#FLIGHTID#",request.args.get('flight'))
    payload=payload.replace("#SEARCHID#",request.args.get('search'))

    print(payload)

    r = requests.post("http://testapi.iati.ir/Flight/FareRule/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)


#get Rules
@app.route('/view')
def view():
    reqstr=''' {     "MemberSessionID": "#SESSIONID#" , "PaymentCode": "#PAYCODE#" }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#PAYCODE#",request.args.get('payid'))

    print(payload)

    r = requests.post("http://testapi.iati.ir/Payment/Product_View/7D7764DF874F8C9D06B7A5BAA462AD0F", data=payload)
    print(r.text)
    datastore = json.loads(r.text)
    return json.dumps(datastore)



#get PaymentID
@app.route('/pricedetail')
def pricedetail():
    reqstr=''' {   "FareRefereces": [     {       "FlightID": "#FLIGHTID#",       "FareType": "ECONOMY"     } ],   "AdultCount": #ADULT#,   "ChildCount": 0,   "InfantCount":0,   "Currency": "IRR",   "SearchID": "#SEARCHID#",   "MemberSessionID": "#SESSIONID#" }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#FLIGHTID#",request.args.get('flight'))
    #payload=payload.replace("#FLIGHTID2#",request.args.get('flight2'))
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
     \\"DomesticFlight\\":false,
     \\"PassengerType\\":\\"ADULT\\",
     \\"NationalCode\\":\\"0077707788\\"}
     ]}" ,
    "ExteraAgency": 0 }  '''

    reqdummy='''
{   "LoginID":"1edd5d10-f162-4f32-8df0-2f9f79d42",   "CallBackURL":"http://iati.ir/payment/check/{{id}}",
    "PaymentTypeID": 1,"PaymentCode": "eeb4913b-0395-4593-80d3-1f59c0b5e547","ServiceName": "FLIGHT", "MemberDescription": "",
    "PriceDetailID": "60cee529-c4fd-463a-bac2-39d5dd92c254",   "Description": "" ,"BookArray":"{\\"TestMode\\":true,
    \\"ContactInfo\\":{
    \\"Email\\":\\"amzoddin@gmail.com\\",
    \\"CellphoneNumber\\": \\"09190008767\\",
    \\"PhoneNumber\\":\\"6500877\\"},
    \\"PassengerList\\":[
    {\\"FirstName\\":\\"محمد\\",
    \\"LastName\\":\\"جبلی\\",
     \\"FirstNameEnglish\\":\\"mohammad\\",
     \\"LastNameEnglish\\":\\"jebeli\\",
     \\"IdentityNumber\\":\\"P490070566\\",
     \\"IdentityExpireDate\\":\\"2020-12-22\\",
     \\"BirthDate\\":\\"1990-04-22\\",
     \\"Gender\\":true,
     \\"Nationality\\":\\"IR\\",
     \\"DomesticFlight\\":false,
     \\"PassengerType\\":\\"ADULT\\",
     \\"NationalCode\\":\\"0477707708\\"}
     ,
     {\\"FirstName\\":\\"معصومه\\",
    \\"LastName\\":\\"جبلی\\",
     \\"FirstNameEnglish\\":\\"masoumeh\\",
     \\"LastNameEnglish\\":\\"jebeli\\",
     \\"IdentityNumber\\":\\"P110071566\\",
     \\"IdentityExpireDate\\":\\"2020-12-22\\",
     \\"BirthDate\\":\\"1992-11-22\\",
     \\"Gender\\":false,
     \\"Nationality\\":\\"IR\\",
     \\"DomesticFlight\\":false,
     \\"PassengerType\\":\\"ADULT\\",
     \\"NationalCode\\":\\"2317707088\\"}
     ,
     {\\"FirstName\\":\\"علی\\",
    \\"LastName\\":\\"جبلی\\",
     \\"FirstNameEnglish\\":\\"ali\\",
     \\"LastNameEnglish\\":\\"jebeli\\",
     \\"IdentityNumber\\":\\"P192040066\\",
     \\"IdentityExpireDate\\":\\"2020-12-22\\",
     \\"BirthDate\\":\\"2014-02-02\\",
     \\"Gender\\":true,
     \\"Nationality\\":\\"IR\\",
     \\"DomesticFlight\\":false,
     \\"PassengerType\\":\\"CHILD\\",
     \\"NationalCode\\":\\"0077727580\\"}
     ,
     {\\"FirstName\\":\\"بهمن\\",
    \\"LastName\\":\\"جبلی\\",
     \\"FirstNameEnglish\\":\\"bahman\\",
     \\"LastNameEnglish\\":\\"jebeli\\",
     \\"IdentityNumber\\":\\"P192033566\\",
     \\"IdentityExpireDate\\":\\"2020-12-22\\",
     \\"BirthDate\\":\\"2019-04-22\\",
     \\"Gender\\":true,
     \\"Nationality\\":\\"IR\\",
     \\"DomesticFlight\\":false,
     \\"PassengerType\\":\\"INFANT\\",
     \\"NationalCode\\":\\"123447788\\"}


     ]}" ,
    "ExteraAgency": 0 }
    '''


    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#PAYCODE#",request.args.get('payid'))
    payload=payload.replace("#DETAILID#",request.args.get('detailid'))
    payload=payload.replace("#ENNAME#",request.args.get('enname'))
    payload=payload.replace("#ENLAST#",request.args.get('enlast'))
    payload=payload.replace("#NAME#",request.args.get('enname'))
    payload=payload.replace("#LAST#",request.args.get('enlast'))
    payload=payload.replace("#ID#",request.args.get('id'))
    payload=payload.replace("#EXPIRE#","2020-12-22")
    payload=payload.replace("#BD#","1990-04-22")
    payload=payload.replace("#MOBILE#","09112868767")
    payload=payload.replace("#PHONE#","6565877")
    payload=payload.replace("#EMAIL#",request.args.get('email'))
    print(reqstr)

    r = requests.post("http://testapi.iati.ir/Payment/Invoice_Add_Item/7D7764DF874F8C9D06B7A5BAA462AD0F", data=reqdummy)
    print(r.text)

    datastore = json.loads(r.text)
    return json.dumps(datastore)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8400)

#for rs in result:
#    print(rs["Legs"][0]["FlightNo"])
#print(datastore["Legs"][0])
