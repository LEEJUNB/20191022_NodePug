const express = require('express');
const app = express();
const port = 3333;
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const _storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, 'uploads/') // 파일 저장 경로
    },
    filename : function(req,file,cb){
        cb(null, file.originalname); // 파일 제목 지정
    }
})
const upload = multer({storage:_storage}); // dest(파일저장위치)

app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty = true;

app.set('view engine','pug');
app.set('views','./views');



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

// upload page
app.get('/upload',function(req,res){
    res.render('upload');
})

// single의 인자는 해당 input타입의 name명이다.
// 그리고 이 인자의 단수 파일을 전달받아 req.file에 저장된다.
app.post('/upload', upload.single('userfile'), function(req,res){
    console.log(req.file);
    res.send('uploaded : ' +req.file.filename);
})

// server waiting
app.listen(port, function(){
    console.log(`Revolution Start ${port}`);
});