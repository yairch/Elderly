var mongodb=require('mongodb');  
var MongoClient=mongodb.MongoClient;  
var url="mongodb://127.0.0.1:27017/"  
MongoClient.connect(url,function(error,databases){  
    if(error){  
        throw error;  
  
    }  
    var dbase=databases.db("Elderly");  
    dbase.createCollection("temp",function(error,response){  
        if(error){  
            throw error;
        }  
      
    console.log("collection is created.....")  
    databases.close();  
    });  
});  