/**
 * Created by feiha on 12/3/2016.
 */
var mongoose = require("mongoose");

const url = "mongodb://localhost:27017/Todos";

mongoose.connect(url);

var Todo = mongoose.model('Tod',{
    text:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    }
});

var newTodo = Todo({
    text:"drink"
});

newTodo.save(function (e,data) {
    console.log(data);
});