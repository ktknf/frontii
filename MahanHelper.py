#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import json
import sys
from flask import request
from flask import Flask
from bs4 import BeautifulSoup
app = Flask(__name__)

@app.route('/')
def flights():
    Username="APIKOOHENOOR"
    Password="Noor@1212"
    reqstr='''<?xml version="1.0" encoding="utf-16"?>
<Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.xmlsoap.org/soap/envelope/">
<Header>
<Security p5:mustUnderstand="1" xmlns:p5="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
<UsernameToken p7:Id="UsernameToken-17855236" xmlns:p7="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
<Username>#USER#</Username>
<Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">#PASS#</Password>
</UsernameToken>
</Security>
</Header>
<Body>
<OTA_AirAvailRQ EchoToken="" PrimaryLangID="en-us" SequenceNmbr="0" Target="TEST" TimeStamp="" Version="20061.00" xmlns="http://www.opentravel.org/OTA/2003/05">
<POS>
<Source TerminalID="TestUser/Test Runne">
  <RequestorID ID="APIKOOHENOOR" Type="4" />
  <BookingChannel Type="12" />
</Source>
</POS>
<OriginDestinationInformation>
<DepartureDateTime>#DATE#T00:00:00</DepartureDateTime>
<OriginLocation LocationCode="#FROM#" />
<DestinationLocation LocationCode="#TO#" />
</OriginDestinationInformation>
<FlexiQuote>true</FlexiQuote>
<TravelerInfoSummary>
<AirTravelerAvail>
  <PassengerTypeQuantity Code="ADT" Quantity="1" />
  <PassengerTypeQuantity Code="CHD" Quantity="0" />
  <PassengerTypeQuantity Code="INF" Quantity="0" />
</AirTravelerAvail>
</TravelerInfoSummary>
</OTA_AirAvailRQ>
</Body>
</Envelope>
    '''
    reqstr = reqstr.replace("#USER#", 'APIKOOHENOOR')
    reqstr = reqstr.replace("#PASS#", 'Noor@1212')
    reqstr = reqstr.replace("#FROM#", request.args.get('from'))
    reqstr = reqstr.replace("#TO#", request.args.get('to'))
    reqstr = reqstr.replace("#DATE#", request.args.get('date'))
    print(reqstr)

    headers= {'Content-Type': 'text/xml; charset=utf-8','SOAPAction': 'runTransaction'}

    r = requests.post("https://reservations.mahan.aero/webservices/services/AAResWebServices", data=reqstr ,headers=headers)
    #print('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    #print(r.text)
    #print('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    soup = BeautifulSoup(r.text, 'xml')
    arv = soup.find_all('ns1:ArrivalAirport')

    dpr = soup.find_all('ns1:DepartureAirport')


    td = soup.find_all('ns1:OTA_AirAvailRS')
    #print("--------------------")
    #print(td[0].attrs['TransactionIdentifier'])
    tid_val=td[0].attrs['TransactionIdentifier']



    ns2 = soup.find_all('ns1:FlightSegment')

    print("============================================================================================")
    print(len(ns2))
    print("============================================================================================")

    final=[]
    for i in range(0,len(arv)):
        rph_val=ns2[i].attrs['RPH']

        print("************************")
        print(ns2[i])
        print("************************")

        price_val=getPrice(tid_val,arv[i].attrs['LocationCode'],dpr[i].attrs['LocationCode'],ns2[i].attrs['DepartureDateTime'],ns2[i].attrs['ArrivalDateTime'],ns2[i].attrs['FlightNumber'],rph_val,'1','0','0',i+1)
        final.append({
        'AirLine': 'ماهان',
        'AirLineShort': 'W5',
        'FlightNo':ns2[i].attrs['FlightNumber'],
        'From':arv[i].attrs['LocationCode'],
        'To':dpr[i].attrs['LocationCode'],
        'DepartureDateTime':ns2[i].attrs['DepartureDateTime'],
        'ArrivalDateTime':ns2[i].attrs['ArrivalDateTime'],
        'Price':price_val

        })
        #print(arv[i].attrs['LocationCode'])

    #datastore = json.loads(r.text)
    return json.dumps(final)




def getPrice(tid,short1,short2,time1,time2,flightno,flightid,adult,child,infant,ind):
    Username="APIKOOHENOOR"
    Password="Noor@1212"
    reqstr="     <soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>"
    reqstr=reqstr+'\n'+ "        <soap:Header>"
    reqstr=reqstr+'\n'+ "           <wsse:Security soap:mustUnderstand='1' xmlns:wsse='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'>"
    reqstr=reqstr+'\n'+ "              <wsse:UsernameToken wsu:Id='UsernameToken-32124385' xmlns:wsu='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'>"
    reqstr=reqstr+'\n'+ "                 <wsse:Username>" + Username + "</wsse:Username>"
    reqstr=reqstr+'\n'+ "                 <wsse:Password Type='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText'>" + Password + "</wsse:Password>"
    reqstr=reqstr+'\n'+ "              </wsse:UsernameToken>"
    reqstr=reqstr+'\n'+ "           </wsse:Security>"
    reqstr=reqstr+'\n'+ "        </soap:Header>"
    reqstr=reqstr+'\n'+ "        <soap:Body xmlns:ns1='http://www.opentravel.org/OTA/2003/05'>"
    reqstr=reqstr+'\n'+ "           <ns1:OTA_AirPriceRQ EchoToken='' PrimaryLangID='en-us' SequenceNmbr='"+str(ind)+"' TimeStamp='2010-02-15T10:20:06' TransactionIdentifier='" + tid + "' Version='20061.00'>"
    reqstr=reqstr+'\n'+ "              <ns1:POS>"
    reqstr=reqstr+'\n'+ "                 <ns1:Source TerminalID='TestUser/Test Runner'>"
    reqstr=reqstr+'\n'+ "                    <ns1:RequestorID ID='" + Username + "' Type='4'/>"
    reqstr=reqstr+'\n'+ "                    <ns1:BookingChannel Type='12'/>"
    reqstr=reqstr+'\n'+ "                 </ns1:Source>"
    reqstr=reqstr+'\n'+ "              </ns1:POS>"
    reqstr=reqstr+'\n'+ "              <ns1:AirItinerary DirectionInd='OneWay'>"
    reqstr=reqstr+'\n'+ "                 <ns1:OriginDestinationOptions>"
    reqstr=reqstr+'\n'+ "                    <ns1:OriginDestinationOption>"
    reqstr=reqstr+'\n'+ "                       <ns1:FlightSegment ArrivalDateTime='" + time2 + "' DepartureDateTime='" + time1 + "' FlightNumber='" + flightno + "' RPH='" + flightid + "'>"
    reqstr=reqstr+'\n'+ "                          <ns1:DepartureAirport LocationCode='" + short1 + "' Terminal='TerminalX'/>"
    reqstr=reqstr+'\n'+ "                          <ns1:ArrivalAirport LocationCode='" + short2 + "'/>"
    reqstr=reqstr+'\n'+ "                       </ns1:FlightSegment>"
    reqstr=reqstr+'\n'+ "                    </ns1:OriginDestinationOption>"
    reqstr=reqstr+'\n'+ "                 </ns1:OriginDestinationOptions>"
    reqstr=reqstr+'\n'+ "              </ns1:AirItinerary>"
    reqstr=reqstr+'\n'+ "              <ns1:TravelerInfoSummary>"
    reqstr=reqstr+'\n'+ "                 <ns1:AirTravelerAvail>"
    reqstr=reqstr+'\n'+ "                    <ns1:PassengerTypeQuantity Quantity='" + adult + "' Code='ADT'/>"
    reqstr=reqstr+'\n'+ "                    <ns1:PassengerTypeQuantity Quantity='" + child + "' Code='CHD'/>"
    reqstr=reqstr+'\n'+ "                    <ns1:PassengerTypeQuantity Quantity='" + infant + "' Code='INF'/>"
    reqstr=reqstr+'\n'+ "                 </ns1:AirTravelerAvail>"
    reqstr=reqstr+'\n'+ "              </ns1:TravelerInfoSummary>"
    reqstr=reqstr+'\n'+ "           </ns1:OTA_AirPriceRQ>"
    reqstr=reqstr+'\n'+ "        </soap:Body>"
    reqstr=reqstr+'\n'+ "     </soap:Envelope>"

    print(reqstr)
    headers= {'Content-Type': 'text/xml; charset=utf-8','SOAPAction': 'runTransaction'}

    r = requests.post("https://reservations.mahan.aero/webservices/services/AAResWebServices", data=reqstr ,headers=headers)
    print(r.text)
    soup = BeautifulSoup(r.text, 'xml')
    arv = soup.find_all('ns1:TotalFare')
    prc=0
    if len(arv)!=0:
        prc=int(float(arv[0].attrs['Amount']))
    print("___________________________________________________________________________________________________________")
    print(prc)
    print("___________________________________________________________________________________________________________")
    #datastore = json.loads(r.text)
    return json.dumps(prc)


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
    reqstr=''' {   "FareRefereces": [     {       "FlightID": "#FLIGHTID#",       "FareType": "ECONOMY"     } , {       "FlightID": "#FLIGHTID2#",       "FareType": "ECONOMY"     }],   "AdultCount": #ADULT#,   "ChildCount": 1,   "InfantCount": 1,   "Currency": "IRR",   "SearchID": "#SEARCHID#",   "MemberSessionID": "#SESSIONID#" }  '''
    payload=reqstr.replace("#SESSIONID#",request.args.get('sess'))
    payload=payload.replace("#FLIGHTID#",request.args.get('flight'))
    payload=payload.replace("#FLIGHTID2#",request.args.get('flight2'))
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
    app.run(host='0.0.0.0', port=8401)

#for rs in result:
#    print(rs["Legs"][0]["FlightNo"])
#print(datastore["Legs"][0])
