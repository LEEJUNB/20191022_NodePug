const express = require('express');
const app = express();
const port = 3333;
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest:'uploads/'});

app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty = true;

app.set('view engine','pug');
app.set('views','./views');

//app.use(express.static('public'));

// homepage
app.get('/', function(req,res){
    res.render('home',{_time:Date(), _title:'Rev Home'} );
})

// login page
app.get('/login', function(req,res){
    res.send('login page');
})

// write page
app.get('/board', function(req,res){
    fs.readdir('data',function(err,files){
        if(err){
            console.log(err);
            res.status(500).send('Interver Server Error');
        }
        res.render('board', {topics:files}); // board.pug
    })
})

// write complete page
// post version
app.post('/topic', function(req,res){ // board.pug -> post route is '/topic'
    const title = req.body.title;
    const description = req.body.description;
    // data폴더에 작성한 내용이 저장됨
    fs.writeFile('data/'+title, description, function(err){
        if(err){
            res.status(500).send('Internal server error');
        }
        res.send('Success!!  ' + req.body.title); // 작성한 글 페이지로 이동
    })
});

// get method : url통해 /topic으로 접근가능
// 글 목록이 화면에 표시된다.
app.get(['/topic','/topic/:id'], function(req,res){
    fs.readdir('data',function(err,files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id){
        // 게시글 제목을 클릭했을 때 제목과 내용이 뜨도록 만들자
        // 마치 네이버 블로그글 처럼
        fs.readFile('data/'+id ,'utf8', function(err,data){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('viewBoard', {topics:files, title:id, description:data});
        })
        } else {
        res.render('viewBoard', {topics:files, title:'Welcome', description:'Hello Man'}); // view is filename, topics(변수)를 통해 files인자(파일들을 배열화시킨 것)를 가져온다.
        }
    })
});

// server waiting
app.listen(port, function(){
    console.log(`Revolution Start ${port}`);
});