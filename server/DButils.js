const sql = require('mysql');

const config = {
	user: 'root',
	password: 'Minmax2Uybu!',
	host: 'localhost',
	database: 'elderlyDB',
	options: {
		encrypt: true,
		enableArithAbort: true
	}
};

const con = new sql.createPool(config);

exports.bcrypt_saltRounds = 13;

exports.execQuery = async function (query) {
	return new Promise(function (resolve, reject) {
		con.query(query, function (err, rows) {
				if (err) {
					console.log(config);
					reject(err);
				}
				if (rows === undefined) {
					reject(new Error('Error rows is undefined'));
				}
				else {
					resolve(rows);
				}
			}
		);
	});
};

exports.convertElderlyDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			phoneNumber: dic.phoneNumber,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			genderToMeetWith: dic.genderToMeetWith,
			wantedServices: JSON.parse(dic.wantedServices),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation
		};
	});
	return records;
};

exports.convertVolunteerDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			phoneNumber: dic.phoneNumber,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			services: JSON.parse(dic.services),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation
		};
	});
	return records;
};
