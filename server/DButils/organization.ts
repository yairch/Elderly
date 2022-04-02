import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Organization, OrganizationType } from "../types/organization";

export const getOrganizationByName = async (name: String): Promise<Organization | null> => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection<Organization>(collectionIds.organizations);
		const organization = await organizations.findOne({name});
		return organization;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getOrganizationByEnglishName = async (englishName: string): Promise<Organization | null> => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection<Organization>(collectionIds.organizations);
		const organization = await organizations.findOne({englishName});
		return organization;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const insertOrganization = async (name: string, englishName: string, type: OrganizationType, phoneNumber: string) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection<Organization>(collectionIds.organizations);
		await organizations.insertOne({
			name,
			englishName,
			type,
			phoneNumber,
		});		
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getAllOrganizations = async (): Promise<Organization[]> => {
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection<Organization>(collectionIds.organizations);
		const cursor = await organizations.find();
		const allOrganizations = await cursor.toArray();
		
		return allOrganizations;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}