var express = require('express');
var app = express();

var SerialPort = require("serialport");    
var port = "/dev/ttyMFD1";    
var serialPort = new SerialPort(port, { autoOpen:false});   

var armed = false; // true if armed
var alarm = false; // true is alarm is triggered

app.get('/armed', function (req, res) {
  res.send(armed);
});

app.get('/alarm', function (req, res) {
  res.send(alarm);
});

app.get('/armed/:armed', function (req, res) {
    var on = req.params.armed;
    armed = on;
    res.send("ok").status(200).end();
    console.log('armed: ' + on);

    sendStatus(on == 'true' ? '1' : '0');
});

app.get('/alarm/:alarm', function (req, res) {
    var on = req.params.alarm;
    alarm = on;
    res.send("ok").status(200).end();
    console.log('alarm: ' + on);

    if(on == 'true'){
        sendStatus('2');
    }else{
        sendStatus(armed == 'true' ? '1' : '0');
    }
});

serialPort.open(function (error) {     
    if (error) {     
        console.log('Failed to open serial port: '+error);     
    } else {     
        console.log('opened serial port!');     
        app.listen(3000, function () {
            console.log('Server listening on 3000!');
        });  
    } 
})

function sendStatus(status){
    serialPort.write(status, function(err) {    
        if(err) {    
            console.log('err writing serial data' + err);    
        }else{    
            console.log('wrote serial data ' + status + '!');    
        }
    });    
}
