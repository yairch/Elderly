import { MongoClient } from "mongodb";
import { collectionIds } from "../constants/collectionsIds";
import { config } from "./config";
import {User, UserRole} from '../types/user';

export const getUserByUsername = async (username: string): Promise<User | null> => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection<User>(collectionIds.users);
		const user = await users.findOne({username});
		
		return user;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}
export const updateUserPassword = async (username: string, password: string) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection<User>(collectionIds.users);
		await users.updateOne({username},
			{
				'$set': {
					password
				}
			})
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getAllUsers = async (): Promise<User[]> => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection<User>(collectionIds.users);
		const cursor = await users.find();
		const allUsers = await cursor.toArray();
		
		return allUsers;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}


export const insertUser = async (username: string, hash_password: string, role: UserRole, organization: string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection<User>(collectionIds.users);
		const newUser: User = {
			username,
			password: hash_password,
			role,
			organization,
		};
		await users.insertOne(newUser);
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}