
var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');

var publicPath = path.join(__dirname,'public');
app.use('/recursos',express.static(publicPath));

var IP_MALVADA="192.168.0.50,192.168.0.3,192.168.0.4,192.168.0.1,192.168.0.2";

app.use((request,response,next)=>{
if(request.ip === IP_MALVADA){response.status(401).send("Intento de acceso no autorizado");}
else{
    next();
}
});


var entries =[];
app.locals.entries = entries;
app.get('/',(request, response)=> response.render('index'));
app.get('/new-entry',(request, response)=> response.render('new-entry'));
app.get('/index',(request, response)=> response.render('index'));
app.get('/clases',(request, response)=> response.render('clases'));
app.get('/armas',(request, response)=> response.render('armas'));
app.get('/victimas',(request, response)=> response.render('victimas'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));

app.post('/new-entry',(request,response)=>{
    if(!request.body.title || !request.body.body){
        response.status(400).send('las entradas deben de tener un titulo y mensaje')
        return;
    }
    entries.push({
        title:request.body.title,
        body: request.body.body,
        created: new Date()
    });
    response.redirect('/victimas');
});

app.use((request,response)=>response.status(404).render('404'));

http.createServer(app).listen(3000,()=> 
console.log('La aplicacion esta corriendo en el puerto 3000'));
