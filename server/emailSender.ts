import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';
import { ConfirmationEmailDetails, MeetingEmailDetails } from './types/emailDetails';

// FIXME: these variables hold specific info for ziv and domain is localhost
// what is this for if it sends only to ziv? Should this sensitive info be here exposed?
// if domain is localhost would it work when launching the client as "production" from other computers:
// => going to chrome and inserting the web andress of televol (elderly) site
const USER = 'televol.noreply@gmail.com';
const PASSWORD = 'ZivNadav1!';
const DOMAIN = 'http://localhost:3000/Tele-vol';

export const sendEmail = (messageHTML: string, subject: string, email: string) => {
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

		const message: Mail.Options = {
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

export const sendConfirmationEmail = (emailDetails: ConfirmationEmailDetails) => {
	const {username, password, firstName, lastName} = emailDetails;

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
		const message: Mail.Options = {
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

export const sendMeetingEmail = function (emailDetails: MeetingEmailDetails) {
	const {firstName, lastName, meeting} = emailDetails;

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

		const message: Mail.Options = {
			from: USER,
			// todo: change email field
			// to: email // in production uncomment this
			// While we are testing we want to send a message to our selfs
			to: USER,
			subject: 'Tele-Vol - נקבעה לך פגישה',
			html: `
				<h3> שלום ${firstName + ' ' + lastName}</h3>
				<p>נקבעה לך פגישה עם ${meeting.elderlyName}, ב ${meeting.date} בנושא ${meeting.subject}</p>
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

exports.sendForgotPasswordEmail = function (username: string, email: string) {
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

		const message: Mail.Options = {
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