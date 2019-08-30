var request = require('request');

//Modules
var utility = require("./utility.js");



module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {

    var data = `<?xml version="1.0" encoding="utf-16"?>
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
</Envelope>`;

data=data.replace("#USER#",'APIKOOHENOOR');
data=data.replace("#PASS#",'Noor@1212');
data=data.replace("#FROM#",Source);
data=data.replace("#TO#",Target);
data=data.replace("#DATE#","2019-"+Month+"-"+Day);

    var get_url = "https://reservations.mahan.aero/webservices/services/AAResWebServices";
    console.log(get_url);
    console.log(data);

    request({
      url: get_url,
      method: 'GET',
      body: data
    }, function(error, response, body){
      console.log(body);
    });

  },
  //GetFlight Function End

  //Reserve Function Start
  Reserve: function(Source, Target, FlightClass, No, Day, Month, Name, Last, Age, ID, FlightNo, Contact, callback) {
    var get_url = "http://book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/ReservJS?Airline=ZV" +
      "&cbSource=" + Source + "&cbTarget=" + Target + "&FlightClass=" + FlightClass + "&No=" + No + "&Day=" +
      Day + "&Month=" + Month + "&edtName1=" + Name + "&edtLast1=" + Last + "&edtAge1=" + Age + "&edtID1=" +
      ID + "&OfficeUser=THR210-1.WS&OfficePass=K2019&edtContact=" + Contact + "&FlightNo=" + FlightNo;

      console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(JSON.parse(body)['AirReserve'][0]);
    });
  },
  //Reserve Fuvnction End


  //Issue Function Start
  Issue: function(PNR, Email, callback) {
    var get_url = "http://Book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/ETIssueJS?Airline=ZV" +
      "&PNR=" + PNR + "&Email=" + Email+ "&OfficeUser=THR210-1.WS&OfficePass=K2019";

      console.log(get_url);
    request.get(get_url, {timeout: 150000}, function(err, res, body) {

      try {
        callback(body);
      }
      catch (e) {
        callback('err');
        console.log(e);
        console.log(body);
      }
    });
  },
  //Issue Fuvnction End


  //CancelSeat Function Start
  CancelSeat: function(PNR,Name,Last,Date,FlightNo, callback) {
    var get_url = "http://Book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/CancelSeatJS?Airline=ZV" +
      "&PNR=" + PNR + "&PassengerName=" + Name+ "&PassengerLastName=" + Last+"&DepartureDate=" + Date+
      "&FlightNo=" + FlightNo + "&OfficeUser=THR210-1.WS&OfficePass=K2019";

      console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(body);
    }).setTimeout(600000);
  }
  //CancelSeat Fuvnction End

};