var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PythonShell = require('python-shell');
const multer = require('multer');
const path = require('path');
var fs = require('fs');

var testname = '';
var testname2 = '';

var count = 0;

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
			count = count + 1;

			if(count % 2 == 0){
				testname2 = file.fieldname+'.jpg';
			}else{
				testname = file.fieldname+'.jpg';
			}

			//testname = file.fieldname;
			console.log(testname);
			console.log(testname2);

      //cb(null, file.originalname);
			cb(null, file.fieldname+'.jpg');

    }
  }),
});

app.post('/upload', upload.fields([{name:'test_file'}, {name: 'test_file2'}]), (req,res) => {
	console.log(req.files);
	res.render('imageview',{
		image1: testname, image2: testname2
	});
});



app.locals.pretty = true;
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.bodyParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/upload', function(req,res){
	res.render('upload');
});


app.get('/imgs', function(req, res){
	fs.readFile('./uploads/'+testname, function(error, data){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});
app.get('/imgs2', function(req, res){
	fs.readFile('./uploads/'+testname2, function(error, data){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});
app.get('/imgs3', function(req, res){
	fs.readFile('./hyh_gc.jpg', function(error, data){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});

////////////////////////////////////////



app.get('/test', function(req,res){
		PythonShell.run('grabcut.py',
		    {
		      mode: 'text',
		      pythonPath: '',
		      pythonOptions: ['-u'],
		      scriptPath: '/Users/jaejin/dev/Opensoftware', // 서버에 맞게 경로 설정
		      args: [testname, testname2]

		    }
		    , function (err, results){
		    if (err) throw err;

		    console.log('results: %j', results);
		    res.render('view',{

		    });

		  });
})


app.listen(3000, function(){
	console.log('Conneted 3000 port!! ');
});
