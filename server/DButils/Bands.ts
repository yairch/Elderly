const { MongoClient } = require('mongodb');

const config = {
    host: 'localhost',
    database: {
        name: 'Elderly',
        url: "mongodb://127.0.0.1:27017/"
    },
};

let features: any = { 'Calories': [], 'Steps': [], 'Speed': [], 'Active_min': [], 'Distance': [], 'HR': [] }


export const insertSteps = async (steps: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const step_col = db.collection("Steps");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": steps,
            "time": time,
            "googleid": googleid,
            "start": start,
            "end": end
        }
        await step_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertCalories = async (calories: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const calories_col = db.collection("Calories");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": calories,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await calories_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertSpeed = async (speed: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const speed_col = db.collection("Speed");
        let time = new Date();
        const result = {
            "days": speed,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await speed_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertActive = async (active_min: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Active_col = db.collection("Active_min");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": active_min,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await Active_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}
export const insertDistance = async (distance: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const distance_col = db.collection("Distance");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": distance,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await distance_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertHR = async (hr: Array<number>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const hr_col = db.collection("HR");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": hr,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await hr_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}
export const getUpdatedTime = async () => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const calories_col = db.collection("Calories");
        let res = await calories_col.find({})
        res = (await res.toArray()).sort((a: any, b: any) => b.time - a.time)
        return res
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}
export const insertSleeping = async (Sleeping: Array<any>, googleid: string, start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Sleeping_col = db.collection("Sleeping");
        let time = new Date();//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        const result = {
            "days": Sleeping,
            "time": time,
            "googleid": googleid,
            'start': start,
            'end': end
        }
        await Sleeping_col.insertOne(result)
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}


export const getAllFeatures = async (start: number, end: number) => {
    const client = new MongoClient(config.database.url)
    try {
        console.log(new Date(start))
        console.log(new Date(end))
        await client.connect()
        const db = client.db(config.database.name);
        if (!start || !end) {
            for (const key in features) {

                const feature = db.collection(key);
                // let res = feature.find({}).sort({'time':-1}).limit(7);
                let res = feature.find({}).sort({ 'start': -1 });
                features[key] = await res.toArray();
            }
        
        }
        else{
            for (const key in features) {

                const feature = db.collection(key);
                // let res = feature.find({}).sort({'time':-1}).limit(7);
                let res = feature.find({
                    'start': {
                        '$lte': "" + start
                    }
                }).sort({ 'start': -1 });
                features[key] = await res.toArray();
            }
        }
        return features
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}