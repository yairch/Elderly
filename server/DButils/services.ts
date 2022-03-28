import { MongoClient } from "mongodb";
import { config } from "./config";


export const createDatabase = async () => {
	console.log('Tries to create database...')
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		// creates DB with given name if not already exists
		const dbObject = client.db(config.database.name);
		console.log(`Database was created with name of ${config.database.name}`);  

		return dbObject;
	}
	catch(error) {
		console.error('Database creation failed');
		console.error(error);
	}
	finally {
		client.close();  
	}
	
}

export const createCollection = async (collectionName: string) => {
	
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		await db.createCollection(collectionName);
		console.log(`Successfully created collection ${collectionName}`);  
	}
	catch(error) {
		console.error(`Failed creating collection ${collectionName}`);
		console.error(error);
	}
	finally {
		client.close();  
	}
}