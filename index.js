var express = require('express');
var app = express();
var path = require('path');
require('dotenv').config();

const client = require('twilio')(process.env.accountSid, process.env.authToken);

app.use(express.urlencoded({
    extended: true
}))

app.get('/', function (req, res, next) {
    var options = {
        root: path.join(__dirname)
    };

    var fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

console.log(process.env);

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

function sendSms(recipient, message) {
    client.messages.create({
        body: message,
        from: '+18333513147',
        to: '+1' + recipient
    })
    .then(message => console.log(message.sid));
}

app.post('/sms_recv/', (req, res) => {
    console.log("received");
    const twiml = new MessagingResponse();

    if (req.body.Body == 'hello') {
        twiml.message('Hi!');
    } else if (req.body.Body == 'bye') {
        twiml.message('Goodbye');
    } else {
        twiml.message(
                'No Body param match, Twilio sends this in the request to your server.'
                );
    }

    res.type('text/xml').send(twiml.toString());
});

app.post('/sms_send', (req, res) => {
    sendSms(req.body.recipient, req.body.message)
    res.end()
})
