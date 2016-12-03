1.   create a playground folder

2.   mongo.js

     ```javascript
      // const MongoClient = require('mongodb').MongoClient;
      const { MongoClient, ObjectID } = require('mongodb');
      var Errors = require('./errors');

      const url = "mongodb://localhost:27017/TodoApp";

      MongoClient.connect(url, function (err, db) {
          if (err){
              return console.log("Connection error");
          }
          console.log("Connected");

          /* Insert */
          db.collection('Todos').insertOne({
              text:"I have something to do",
              completed:false
          },function (e, data) {
              if(e){
                  return console.log("unable to insert");
              }
              console.log(JSON.stringify(data.ops));
          });

          db.collection('Users').insertOne({
              name:'peter',
              age:'18',
              location:'Philadelphia'
          },function (e,data) {
              if (e){
                  Errors.whileInsertion(e);
              }
              console.log(JSON.stringify(data.ops));
          });
          /* Retrieve */
          db.collection('Todos').find({}).toArray(function (e,data) {
              if(e){
                  Errors.whileFind(e);
              }
              prettyPrint(data);
          });
          db.collection('Todos').find({completed:false}).toArray(function (e,data) {
              if(e){
                  Errors.whileFind(e);
              }
              prettyPrint(data);
          });
          db.collection('Todos').find({_id:new ObjectID("58403a7edc461b425470746c")}).toArray(function (e,data) {
              if(e){
                  Errors.whileFind(e);
              }
              prettyPrint(data);
          });
          db.collection('Todos').find().count(function (e,data) {
              if(e){
                  Errors.whileFind(e);
              }
              console.log(data);
          });
          /* Delete */
          db.collection('Todos').deleteOne({completed:true},function (e,data) {
              console.log(data.result);
          });
          /* Update */
          db.collection('Todos').findOneAndUpdate({
              _id: new ObjectID('58403d04ffb44f16ac389388')
          },{
              $set:{
                  text:'I have nothing to do',
                  completed:true
              }
          },{
              returnOriginal:false
          },function (e,data) {
              if (e){
                  Errors.whileFind(e);
              }
              console.log(data)
          });

          db.close();
      });

      function prettyPrint(data) {
          console.log(JSON.stringify(data));
      }
     ```

      errors.js

     ```javascript
      exports.whileInsertion =  function InsertionError(e){
          return console.log('insertion error: '+e);
      };
      exports.whileConnection = function ConnectionError(e) {
          return console.log('Connection error: '+e);
      };
      exports.whileFind = function () {
          return console.log('Find error: '+e);
      };
     ```

3.   create a server folder

4.   demo.js

     ```javascript
     var mongoose = require('mongoose');

     const url = "mongodb://localhost:27017/TodoApp";
     mongoose.connect(url);
     var Todo = mongoose.model('Todo', {
         text: {
             type: String,
             required: true,
             minlength: 1,
             trim: true
         },
         completed: {
             type: Boolean,
             default: false
         },
         completedAt: {
             type: Number,
             default: null
         }
     });

     var newTodo = new Todo({
         text:'Cook dinner'
     });

     newTodo.save(function (e, data) {
         console.log(data);
     });
     var User = mongoose.model('User', {
         email: {
             type: String,
             required: true,
             minlength: 1,
             trim: true
         }
     });

     var newUser = new User({
         email:'todo@feihao.me'
     });

     newUser.save(function (e, data) {
         console.log(data);
     ```


5.   refactoring

6.   server.js

     ```javascript
      var express = require('express');
     var bodyParser = require('body-parser');

     var {mongoose} = require('./db/mongoose');
     var {Todo} = require('./models/todo');
     var {User} = require('./models/user');

     var app = express();

     app.use(bodyParser.json());

     app.post('/todos', function (req, res) {
         // console.log(req.body);
         var todo = new Todo({
             text: req.body.text
         });
         todo.save(function (e, data) {
             if (e) {
                 return res.status(400).send({e});
             }
             res.send(data);
         })
     });
     app.get('/todos', function (req, res) {
         Todo.find(function (e, data) {
             if (e) {
                 return res.status(400).send({e});
             }
             res.send({data});
         });
     });
     app.get('/todos/:id', function (req, res) {
         var id = req.params.id;
         Todo.findById(id, function (e, data) {
             if (e) {
                 return res.status(400).send({e});
             }
             res.send({data});
         })
     });
     app.delete('/todos/:id', function (req, res) {
         var id = req.params.id;
         Todo.findByIdAndRemove(id, function (e, data) {
             if (e) {
                 return res.status(400).send({e});
             }
             res.send({msg: "deleted"});
         });
     });
     app.put('/todos/:id', function (req, res) {
         var id = req.params.id;

         Todo.findById(id, function (e, data) {
                 if (e) {
                     return res.status(400).send({e});
                 }
                 if(req.body.completed){
                     data.completed = req.body.completed;
                     data.completedAt = new Date().getTime();
                 }
                 if(req.body.text){
                     data.text = req.body.text;
                 }
                 data.save();
                 res.send({data});
             }
         );
     });

     app.listen(3000, function () {
         console.log("listening on port 3000:")
     });
     ```
7.  create a client folder

8.  index.html

    ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <title>Todos</title>
         <link rel="stylesheet" href="lib/semantic.min.css">
     </head>
     <body>

     <div class="ui borderless main menu">
         <div class="ui text container">
             <div href="#" class="header item">
                 My Todo App
             </div>
         </div>
     </div>

     <div class="ui container">
         <div class="ui cards" id="todos"></div>
     </div>

     <script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
     <script src="app.js"></script>
     </body>
     </html>
    ```

9.  app.js

    ```javascript
     /**
    * Created by feiha on 12/2/2016.
    */
    $(function () {
       $.get("http://localhost:3000/todos", function(data, status){
           if(status === 'success'){
               data = data.data;
               for(index in data){
                   var todo = data[index];
                   $('#todos').append(`
                       <div class="ui centered card">
                           <div class="content">
                               <div class="description">${todo.text}</div>
                           </div>
                               <div class="ui animated fade button" tabindex="0">
                                 <div class="visible content">Complete</div>
                                 <div class="hidden content">Are You Sure?</div>
                               </div>
                       </div>
                   `);
               }
           }
       });
    });
    ```

