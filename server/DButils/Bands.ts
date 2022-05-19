const {MongoClient} = require('mongodb');

const config = {
	host: 'localhost',
	database: {
		name:'Elderly',
		url:"mongodb://127.0.0.1:27017/"
	},
};



export const insertSteps = async(steps:Array<number>, bucketType: string, googleid: string)=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const step_col = db.collection("Steps");
        let time = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": steps,
            "time":time,
            "googleid": googleid
        }
        await step_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}

export const insertCalories = async(calories:Array<number>, bucketType: string, googleid: string )=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const calories_col = db.collection("Calories");
        let time = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": calories,
            "time":time,
            "googleid": googleid
        }
        await calories_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}

export const insertSpeed = async(speed:Array<number>, bucketType: string, googleid: string )=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const speed_col = db.collection("Speed");
        let time = new Date()
        const result = {
            "days": speed,
            "time":time,
            "googleid": googleid
        }
        await speed_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}

export const insertActive = async(active_min:Array<number>, bucketType: string, googleid: string )=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const Active_col = db.collection("Active_min");
        let time = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": active_min,
            "time":time,
            "googleid": googleid
        }
        await Active_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}
export const insertDistance = async(distance:Array<number>, bucketType: string, googleid: string )=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const distance_col = db.collection("Distance");
        let time = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": distance,
            "time":time,
            "googleid": googleid
        }
        await distance_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}

export const insertHR = async(hr:Array<number>, bucketType: string, googleid: string )=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const hr_col = db.collection("HR");
        let time = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": hr,
            "time":time,
            "googleid": googleid
        }
        await hr_col.insertOne(result)
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}
export const getUpdatedTime = async()=>{
    const client = new MongoClient(config.database.url)
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const calories_col = db.collection("Calories");
        let res = await calories_col.find({})
        res = (await res.toArray()).sort((a:any,b:any)=> b.time-a.time)
        return res
    }catch(e){
        console.error(e);
    }finally{
        client.close()
    }
}