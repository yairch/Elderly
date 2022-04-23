import { MongoClient } from "mongodb";
import { elderlyFields, meetingFields, volunteerFields } from "../constants/collections";
import { collectionIds } from "../constants/collectionsIds";
import { Meeting } from "../types/meeting";
import { config } from "./config";

export const checkMeetingExistsByChannel =async (channelName:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const meeting = await meetings.findOne({channelName});
		return meeting;
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const deleteMeetingsByChannel = async (channelName: string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const meetings = db.collection<Meeting>(collectionIds.meetings);
		meetings.deleteMany({channelName});
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getFullElderlyMeetings = async (username: string): Promise<Meeting[]>=> {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);

        // FIXME: not sure which approach is better
        // const match: MatchKeysAndValues<Meeting> = {elderlyUsername: username};
        // interface LookupKeysAndValues<T, U> {
        //     from: string;
        //     localField: keyof T;
        //     foreignField: keyof U;
        //     as: string;
        // }
        // const lookup: LookupKeysAndValues<Meeting, Volunteer> = {
        //     from: collectionIds.volunteerUsers,
        //     localField: "elderlyUsername",
        //     foreignField: "username",
        //     as: 'volunteer'
        // }
        // const aggregationCursor = meetings.aggregate<Meeting>()
        //     .match(match)
        //     .lookup(lookup);

        const aggregationCursor = meetings.aggregate<Meeting>([
			{ $match: { [meetingFields.elderlyUsername]: username}},
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: meetingFields.volunteerUsername,
				  foreignField: volunteerFields.username,
				  as: 'volunteer'
				}
			}
		]);

		return await aggregationCursor.toArray();
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getVolunteerMeetings = async (username: string): Promise<Meeting[]> => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);
		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const cursor = await meetings.find({volunteerUsername: username});
		const allMeetings = await cursor.toArray();
		
        return await allMeetings;
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getFullVolunteerMeetings = async (username: string): Promise<Meeting[]> => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);
		
        const aggregationCursor = meetings.aggregate<Meeting>([
            { $match: {[meetingFields.volunteerUsername]: username} },
			{ $lookup:
				{
				  from: collectionIds.elderlyUsers,
				  localField: meetingFields.elderlyUsername,
				  foreignField: elderlyFields.username,
				  as: 'elderly'
				}
			}
		]);

		return await aggregationCursor.toArray();
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getMeetingsByOrganization = async (organizationName: string): Promise<Meeting[]> => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);
		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const cursor = meetings.aggregate<Meeting>([
			{ $lookup:
				{
				  from: collectionIds.elderlyUsers,
				  localField: meetingFields.elderlyUsername,
				  foreignField: elderlyFields.username,
				  as: 'elderly'
				}
			},
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: meetingFields.volunteerUsername,
				  foreignField: volunteerFields.username,
				  as: 'volunteer'
				}
			},
            {
                $match: {[elderlyFields.organizationName]: organizationName}
            }
		]);
		const toArr = await cursor.toArray();
        return toArr
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}


export const insertMeeting = async (volunteerUsername: string, elderlyUsername: string, date: Date, subject: string, channelName: string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const meeting = {
			volunteerUsername,
			elderlyUsername,
			date,
            subject,
			channelName,
		}
		meetings.insertOne(meeting);
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}