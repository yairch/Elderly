const nodemailer = require('nodemailer');

const USER = 'televol.noreply@gmail.com';
const PASSWORD = 'ZivNadav1!';
const DOMAIN = 'http://localhost:3000/Tele-vol';

exports.sendEmail = function (messageHTML, subject, email) {
	return new Promise((res, rej) => {
		// Create transporter object with gmail service
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: USER,
				pass: PASSWORD
			},
			tls: {
				rejectUnauthorized: false
			},
			secure: false
		});

		const message = {
			from: USER,
			to: email,
			subject: `${subject}`,
			html: `${messageHTML}`
		};

		transporter.sendMail(message, function (err, info) {
			if (err) {
				rej(err);
			}
			else {
				res(info);
			}
		});
	});
};

exports.sendConfirmationEmail = function ({username, email, password, firstName, lastName, message}) {
	// Return promise in order to use async/await or "then"
	return new Promise((res, rej) => {
		// Create transporter object with gmail service
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: USER,
				pass: PASSWORD
			},
			tls: {
				rejectUnauthorized: false
			},
			secure: false
		});

		// Create a message you want to send to a user
		const message = {
			from: USER,
			// todo: change email field
			// to: email // in production uncomment this
			// While we are testing we want to send a message to our selfs
			to: USER,
			subject: 'Tele-Vol - Activate Account',
			html: `
        <h3> שלום ${firstName + ' ' + lastName}</h3>
        <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
        <p>To activate your account please follow this link: <a target="_" href="${DOMAIN}/user/activate/${username}/${password}">${DOMAIN}/activate </a></p>
        <p>Cheers</p>
        <p>Your Application Team</p>
      `
		};

		// send an email
		transporter.sendMail(message, function (err, info) {
			if (err) {
				rej(err);
			}
			else {
				res(info);
			}
		});
	});
};

exports.sendMeetingEmail = function ({email, firstName, lastName, meeting}) {
	return new Promise((res, rej) => {
		// Create transporter object with gmail service
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: USER,
				pass: PASSWORD
			},
			tls: {
				rejectUnauthorized: false
			},
			secure: false
		});

		const message = {
			from: USER,
			// todo: change email field
			// to: email // in production uncomment this
			// While we are testing we want to send a message to our selfs
			to: USER,
			subject: 'Tele-Vol - נקבעה לך פגישה',
			html: `
        <h3> שלום ${firstName + ' ' + lastName}</h3>
        <p>נקבעה לך פגישה עם ${meeting.elderlyName}, ב ${meeting.meetingDate} בנושא ${meeting.meetingSubject}</p>
        <p>לצפיה בפגישות שלך היכנס למערכת בקישור הבא <a target="_" href="${DOMAIN}">${DOMAIN} </a></p>
        <p>תודה,</p>
        <p>צוות המערכת</p>
      `
		};

		transporter.sendMail(message, function (err, info) {
			if (err) {
				rej(err);
			}
			else {
				res(info);
			}
		});
	});
};

exports.sendForgotPasswordEmail = function (username, email) {
	return new Promise((res, rej) => {
		// Create transporter object with gmail service
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: USER,
				pass: PASSWORD
			},
			tls: {
				rejectUnauthorized: false
			},
			secure: false
		});

		const message = {
			from: USER,
			// todo: change email field
			// to: email // in production uncomment this
			// While we are testing we want to send a message to our selfs
			to: USER,
			subject: 'Tele-Vol - שחזור סיסמה',
			html: `
        <h3> שלום, בעל מספר תעודת הזהות ${username}</h3>
        <p>קיבלנו ממך בקשה לשחזור הסיסמה שלך במערכת</p>
        <p>לחץ על הקישור כדי לבחור סיסמה חדשה <a target="_" href="${DOMAIN}/user/forgot-password/change-password/${username}">${DOMAIN} </a></p>
        <p>תודה,</p>
        <p>צוות המערכת</p>
      `
		};

		transporter.sendMail(message, function (err, info) {
			if (err) {
				rej(err);
			}
			else {
				res(info);
			}
		});
	});
};