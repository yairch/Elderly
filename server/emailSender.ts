import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';
import { ConfirmationEmailDetails, MeetingEmailDetails } from './types/emailDetails';

// FIXME: these variables hold specific info for ziv and domain is localhost
// what is this for if it sends only to ziv? Should this sensitive info be here exposed?
// if domain is localhost would it work when launching the client as "production" from other computers:
// => going to chrome and inserting the web andress of televol (elderly) site
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const USER = 'televol.noreply@gmail.com';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PASSWORD = 'ZivNadav1!';
const DOMAIN = 'http://localhost:3000/';


// FIXME: mail sending doesn't throw errors anymore but still doesn't work. Mail has not been recieved
export const sendEmail = async (messageHTML: string, subject: string, email: string) => {
	
	// FIXME: temporary until we understand how and from what mail to send
	const testAccount = await nodemailer.createTestAccount();

	// Create transporter object with gmail service
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
		tls: {
			rejectUnauthorized: false,
		},
		secure: false,
	});

	const message: Mail.Options = {
		from: testAccount.user,
		to: email,
		subject,
		html: messageHTML,
	};

	return transporter.sendMail(message);
};

// export const sendEmail = (messageHTML: string, subject: string, email: string) => {
// 	return new Promise((res, rej) => {
// 		// Create transporter object with gmail service
// 		const transporter = nodemailer.createTransport({
// 			service: 'gmail',
// 			auth: {
// 				user: USER,
// 				pass: PASSWORD
// 			},
// 			tls: {
// 				rejectUnauthorized: false
// 			},
// 			secure: false
// 		});

// 		const message: Mail.Options = {
// 			from: USER,
// 			to: email,
// 			subject: `${subject}`,
// 			html: `${messageHTML}`
// 		};

// 		transporter.sendMail(message, function (err, info) {
// 			if (err) {
// 				rej(err);
// 			}
// 			else {
// 				res(info);
// 			}
// 		});
// 	});
// };

export const sendConfirmationEmail = async (emailDetails: ConfirmationEmailDetails) => {

	const {username, password, firstName, lastName, email} = emailDetails;		
	const subject = 'Tele-Vol - Activate Account';
	const htmlMessage = `
			<h3> שלום ${firstName + ' ' + lastName}</h3>
			<p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
			<p>To activate your account please follow this link: <a target="_" href="${DOMAIN}/user/activate/${username}/${password}">${DOMAIN}/activate </a></p>
			<p>Cheers</p>
			<p>Your Application Team</p>
		`;
	
	return await sendEmail(htmlMessage, subject, email)
}

// export const sendConfirmationEmail = (emailDetails: ConfirmationEmailDetails) => {
// 	const {username, password, firstName, lastName} = emailDetails;

// 	// Return promise in order to use async/await or "then"
// 	// FIXME: I think to remove message from params, use this function without send any message
// 	return new Promise((res, rej) => {
		
// 		// Create transporter object with gmail service
// 		const transporter = nodemailer.createTransport({
// 			service: 'gmail',
// 			auth: {
// 				user: USER,
// 				pass: PASSWORD
// 			},
// 			tls: {
// 				rejectUnauthorized: false
// 			},
// 			secure: false
// 		});

// 		// Create a message you want to send to a user
// 		const message: Mail.Options = {
// 			from: USER,
// 			// todo: change email field
// 			// to: email // in production uncomment this
// 			// While we are testing we want to send a message to our selfs
// 			to: USER,
// 			subject: 'Tele-Vol - Activate Account',
// 			html: `
// 				<h3> שלום ${firstName + ' ' + lastName}</h3>
// 				<p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
// 				<p>To activate your account please follow this link: <a target="_" href="${DOMAIN}/user/activate/${username}/${password}">${DOMAIN}/activate </a></p>
// 				<p>Cheers</p>
// 				<p>Your Application Team</p>
// 			`
// 		};

// 		// send an email
// 		transporter.sendMail(message, function (err, info) {
// 			if (err) {
// 				rej(err);
// 			}
// 			else {
// 				res(info);
// 			}
// 		});
// 	});
// };

export const sendMeetingEmail = function (emailDetails: MeetingEmailDetails) {
	const {firstName, lastName, meeting, email} = emailDetails;
	const subject = 'Tele-Vol - נקבעה לך פגישה';
	const htmlMessage = `
		<h3> שלום ${firstName + ' ' + lastName}</h3>
		<p>נקבעה לך פגישה עם ${meeting.elderlyName}, ב ${meeting.date} בנושא ${meeting.subject}</p>
		<p>לצפיה בפגישות שלך היכנס למערכת בקישור הבא <a target="_" href="${DOMAIN}">${DOMAIN} </a></p>
		<p>תודה,</p>
		<p>צוות המערכת</p>
		`;

	return sendEmail(htmlMessage, subject, email)
};

// export const sendMeetingEmail = function (emailDetails: MeetingEmailDetails) {
// 	const {firstName, lastName, meeting} = emailDetails;

// 	return new Promise((res, rej) => {
// 		// Create transporter object with gmail service
// 		const transporter = nodemailer.createTransport({
// 			service: 'gmail',
// 			auth: {
// 				user: USER,
// 				pass: PASSWORD
// 			},
// 			tls: {
// 				rejectUnauthorized: false
// 			},
// 			secure: false
// 		});

// 		const message: Mail.Options = {
// 			from: USER,
// 			// todo: change email field
// 			// to: email // in production uncomment this
// 			// While we are testing we want to send a message to our selfs
// 			to: USER,
// 			subject: 'Tele-Vol - נקבעה לך פגישה',
// 			html: `
// 				<h3> שלום ${firstName + ' ' + lastName}</h3>
// 				<p>נקבעה לך פגישה עם ${meeting.elderlyName}, ב ${meeting.date} בנושא ${meeting.subject}</p>
// 				<p>לצפיה בפגישות שלך היכנס למערכת בקישור הבא <a target="_" href="${DOMAIN}">${DOMAIN} </a></p>
// 				<p>תודה,</p>
// 				<p>צוות המערכת</p>
// 			`
// 		};

// 		transporter.sendMail(message, function (err, info) {
// 			if (err) {
// 				rej(err);
// 			}
// 			else {
// 				res(info);
// 			}
// 		});
// 	});
// };

export const sendForgotPasswordEmail = function (username: string, email: string) {
	const subject = 'Tele-Vol - שחזור סיסמה';
	const htmlMessage = `
		<h3> שלום, בעל מספר תעודת הזהות ${username}</h3>
		<p>קיבלנו ממך בקשה לשחזור הסיסמה שלך במערכת</p>
		<p>לחץ על הקישור כדי לבחור סיסמה חדשה <a target="_" href="${DOMAIN}/user/forgot-password/change-password/${username}">${DOMAIN} </a></p>
		<p>תודה,</p>
		<p>צוות המערכת</p>
	`;

	return sendEmail(htmlMessage, subject, email);
};

// export const sendForgotPasswordEmail = function (username: string, email: string) {
// 	return new Promise((res, rej) => {
// 		// Create transporter object with gmail service
// 		const transporter = nodemailer.createTransport({
// 			service: 'gmail',
// 			auth: {
// 				user: USER,
// 				pass: PASSWORD
// 			},
// 			tls: {
// 				rejectUnauthorized: false
// 			},
// 			secure: false
// 		});

// 		const message: Mail.Options = {
// 			from: USER,
// 			// todo: change email field
// 			// to: email // in production uncomment this
// 			// While we are testing we want to send a message to our selfs
// 			to: USER,
// 			subject: 'Tele-Vol - שחזור סיסמה',
// 			html: `
// 				<h3> שלום, בעל מספר תעודת הזהות ${username}</h3>
// 				<p>קיבלנו ממך בקשה לשחזור הסיסמה שלך במערכת</p>
// 				<p>לחץ על הקישור כדי לבחור סיסמה חדשה <a target="_" href="${DOMAIN}/user/forgot-password/change-password/${username}">${DOMAIN} </a></p>
// 				<p>תודה,</p>
// 				<p>צוות המערכת</p>
// 			`
// 		};

// 		transporter.sendMail(message, function (err, info) {
// 			if (err) {
// 				rej(err);
// 			}
// 			else {
// 				res(info);
// 			}
// 		});
// 	});
// };