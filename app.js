'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const access_token = "EAAH0Ts4VSDMBAPeDtCV5hnwt6JH9KN9TZBvziJwvVH43XdzOH7YdU4QwLPs8qFVRFtYcPjND9KaTuvhlPmrdnGGnZCgSw5XvIIrKTJSXf7ZAIcG4NFKiuhItQWIKfksQ8Rt0bxnxbthGGVBeJghFvZAbkonGJNTBMsu9aqRBVAZDZD"
const app = express();

app.set('port',5000);
app.use(express.json());

app.get('/',function(req,res){
    res.send('Hola mundo!');
})

app.get('/webhook',function(req,res){
    if(req.query['hub.verify_token'] == 'botmanzanaverde_token'){
        res.send(req.query['hub.challenge']);
    }else{
        res.send('No tienes permisos')
    }
})

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            handleMessage(event);
        })
    }
    res.sendStatus(200);
})

function handleMessage(event){
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient:{
            id: senderId
        },
        message: {
            text:messageText
        }
    }
    callSendApi(messageData)
}
function callSendApi(response){
    request({
        "uri": "https://graph.facebook.com/me/messages/",
        "qs":{
            "access_token":access_token
        },
        "method":"POST",
        "json": response
    },
    function(err){
        if(err){
            console.log('ha ocurrido un error')
        }else{
            console.log('mensaje enviado')
        }
    }
    )
}

app.listen(app.get('port'),function(){
    console.log('nuestro servidor esta funcionando en el puerto', app.get('port'))
})
