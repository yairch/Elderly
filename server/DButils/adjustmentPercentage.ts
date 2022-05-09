import { adjustmentPercentage } from './../types/adjustmentPercentage';
import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds';

export const setDefaultPercent = async (organizationName: string , dateRank: number, languageRank: number, interestRank: number, genderRank: number) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()
		const db = client.db(config.database.name);
		const adjustmentPercentages = db.collection<adjustmentPercentage>(collectionIds.adjustmentPercentages);
        await adjustmentPercentages.insertOne({
                organizationName,
                dateRank,
                languageRank,
                interestRank,
                genderRank
        });
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

export const changePercent = async (organizationName: string | undefined , dateRank: number, languageRank: number, interestRank: number, genderRank: number) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()
		const db = client.db(config.database.name);
		const adjustmentPercentages = db.collection<adjustmentPercentage>(collectionIds.adjustmentPercentages);
        await adjustmentPercentages.updateOne(
            {organizationName: organizationName},
            {
                $set:
                {   
                    dateRank: dateRank,
                    languageRank: languageRank,
                    interestRank: interestRank,
                    genderRank: genderRank
                }
            });
		console.log(adjustmentPercentages);
		return adjustmentPercentages
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}