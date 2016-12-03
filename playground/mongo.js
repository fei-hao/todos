// const MongoClient = require("mongodb").MongoClient;

const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb://localhost:27017/Todos";

MongoClient.connect(url, function (e, db) {
    if(e){
        return console.log(e);
    };
    console.log("Connected");
    // INSERT
    db.collection("Todos").insertOne({
    	text:"this is a todo",
        completed:true
    },function (e, data) {
        if(e){
            return console.log(e);
        };
        console.log(data.ops);
    });
    //
    // db.collection("Users").insertOne({
    //     name:"dick",
    // age:"18",
    // location:"tokyo"
    // },function (e, data) {
    //     if(e){
    //         return console.log(e);
    //     };
    //     console.log(data.ops);
    // });

    // Retrive
    // db.collection("Todos").find().toArray(function (e,data) {
    //     if(e){
    //         return console.log(e);
    //     };
    //     console.log(data);
    // });
    // db.collection("Todos").find({completed:false}).toArray(function (e,data) {
    //     if(e){
    //         return console.log(e);
    //     };
    //     console.log(data);
    // });
    // db.collection("Todos").find({_id:new ObjectID("5842acbc46b06d290c13e2db")}).toArray(function (e,data) {
    //     if(e){
    //         return console.log(e);
    //     };
    //     console.log(data);
    // });
    // db.collection("Todos").find({}).count(function (e,data) {
    //     if(e){
    //         return console.log(e);
    //     };
    //     console.log(data);
    // });
    // Delete
    // db.collection("Todos").deleteOne({completed:false},
    //     function (e,data) {
    //         if(e){
    //             return console.log(e);
    //         };
    //         console.log(data.result);
    //     });

    // Update

    db.collection("Todos").findOneAndUpdate(
        {completed:false},{
            $set:{
                text:"return oringinal"
            }
        },{
            returnOriginal:false
        },
        function (e,data) {
            if(e){
                return console.log(e);
            };
            console.log(data);
        });

    db.close();
});