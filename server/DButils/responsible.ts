import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Responsible } from "../types/responsible";
import { OrganizationType } from "../types/organization";

export const insertResponsible = async (username:string , firstName:string, lastName:string, email:string, gender:Gender, organizationName:string, responsibleType:OrganizationType) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const responsibles = db.collection<Responsible>(collectionIds.responsibleUsers);
		
		await responsibles.insertOne({
			username,
			firstName,
			lastName,
			email,
			gender,
			organizationName,
			responsibleType
		})
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}
