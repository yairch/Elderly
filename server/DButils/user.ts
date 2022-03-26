//FIXME: should fix code below
exports.getUserByUsername = async (username) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		const user = await users.findOne({[usersFields.username]: username});
		
		return user;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}
exports.updateUserPassword = async (username, password) => {

	const client = new MongoClient(config.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		await users.updateOne({[usersFields.username]: username},
			{
				'$set': {
					[usersFields.password]: password
				}
			})
		
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}
exports.getUsers = async () => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		const cursor = await users.find();
		const allUsers = await cursor.toArray();
		
		return allUsers;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getUserChannels = async (username)=> {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		const cursor = await meetings.find({[meetingsCollectionFields.elderlyUsername]: username});
		const allColl = await cursor.toArray();
		return allColl;
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.insertToUser = async (username, hash_password, userRole, organizationName) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		let newUser = {
			[usersFields.username]: username,
			[usersFields.password]: hash_password,
			[usersFields.role]: userRole,
			[usersFields.organization]: "organizationName"
		}
		await users.insertOne(newUser);
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}