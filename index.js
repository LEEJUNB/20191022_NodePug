const express = require('express');
const app = express();
const port = 3333;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));

app.locals.pretty = true;
app.set('view engine','pug');
app.set('views','./views');

app.use(express.static('public'));

// write page
app.get('/write', function(req,res){
    res.render('board'); // board.pug
});

// write Complete page
app.post('/topic', function(req,res){ // board.pug -> post route is '/topic'
    const title = req.body.title;
    const description = req.body.description;
    res.send(`Complete the ${title}`);
})

app.get('/', function(req,res){
    res.render('home',{_time:Date(), _title:'Rev Home'} );
})

app.listen(port, function(){
    console.log(`Revolution Start ${port}`);
});