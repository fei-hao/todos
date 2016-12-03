var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', function (req, res) {
    // console.log(req);
    var todo = Todo({
        text: req.body.text
    });
    todo.save(function (e,data) {
        res.send(data);
    });
});
app.get('/todos', function (req, res) {
    Todo.find(function (e,data) {
        res.send(data);
    })
});
app.get('/todos/:id', function (req, res) {
    var id = req.params.id;
    Todo.findById(id, function (e,data) {
        res.send({data});
    })
});
app.delete('/todos/:id', function (req, res) {
    var id = req.params.id;
    Todo.findByIdAndRemove(id, function (e,data) {
        res.send({msg:'deleted'});
    })
});
app.put('/todos/:id', function (req, res) {
    var id = req.params.id;
    Todo.findById(id, function (e,data) {
        if(req.body.completed){
            data.completed = req.body.completed;
            data.completedAt = new Date().getTime();
        }
        if(req.body.text){
            data.text = req.body.text;
        }
        data.save();
        res.send({data});
    })
});


app.listen(3000, function () {
    console.log("listening on port 3000:")
});

