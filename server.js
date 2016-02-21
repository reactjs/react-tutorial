
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var QUESTIONS_FILE = path.join(__dirname, 'questions.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/questions', function(req, res) {
  fs.readFile(QUESTIONS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/questions/', function(req, res) {
  fs.readFile(QUESTIONS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var questions = JSON.parse(data);

    var newQuestion = {
      id: Date.now(),
      type: req.body.type,
      label: req.body.label,
      choices: req.body.choices
    };
    questions.push(newQuestion);
    fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(questions);
    });
  });
});

app.delete('/api/questions/:id', function(req, res){
  fs.readFile(QUESTIONS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var questions = JSON.parse(data);
    var id = req.params.id;

    var newQuestions = questions.filter(function(question){
      return question.id !== parseInt(id);
    });

    fs.writeFile(QUESTIONS_FILE, JSON.stringify(newQuestions, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(newQuestions);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
