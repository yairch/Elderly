var mongodb=require('mongodb');  
var MongoClient=mongodb.MongoClient;  
var url='mongodb://127.0.0.1:27017/';  
MongoClient.connect(url,function(error, databases){// use for to connect to the databases  
    if(error){  
        throw error;  
    
    }  
    var dbobject=databases.db('Elderly');//use for create database   
    console.log("databases is created")  
    databases.close();  
  
});