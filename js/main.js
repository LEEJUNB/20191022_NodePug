const express = require('express');
const app = express();
const port = 3333;

app.locals.pretty = true;
app.set('view engine','pug');
app.set('views','./views');

app.use(express.static('public'));

app.listen(port, function(){
    console.log('Revolution');
});