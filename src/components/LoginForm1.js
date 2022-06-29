import React, { useState, useEffect } from 'react';
import * as Cookies from 'js-cookie';
import Modal from './modal/Modal';
import {serverURL} from '../ClientUtils'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
// import images from "../resources/images.jpg"
import './registrationForms/RegistrationForm.css';
import { fetchMeetingsFullDetails, loginCheck } from '../services/server';
import { getCurrentWebSocket } from '../services/notifacationService';
// import { filterMeetings } from '../server.js';
import { meetingFields, usersFields } from "../constants/collections";
import { userTypes } from '../constants/userTypes';
import { UserRole } from '../types/user'
import {pullSleep, pullFromApi, SetCookie, DeleteCookie, hasCookie } from './CookieManager.js';
const CLIENT_ID = "454610489364-66snjbuq568fgvrluepjrusgjv8u1juv.apps.googleusercontent.com";//process.env.REACT_APP_CLIENT_ID;

function LoginForm(props) {
	const [user, setUser] = useState({ haslogin: false, accessToken: '' });
	const [modal, setModal] = useState(false);
	const [mess, setMess] = useState('');
	const [isElderly, setElderly] = useState(false);
	

	const today = new Date().getTime()
	// console.log(today)
	const bucketDay = 86400000;
	// const bucketMonth= 30*bucketDay
	const bucketMonth = 30 * bucketDay*3
	useEffect(() => {
		const cookieObject = hasCookie();
		if (cookieObject.haslogin) {
			setUser({
				...cookieObject
			});
		}
	}, []);

	async function login(response) {
		// console.log(response.profileObj)
		if (response.accessToken) {
			setUser({
				...response.profileObj,
				haslogin: true,
				accessToken: response.accessToken
			})
			let res = await axios.get(serverURL+"/researcher")
			// console.log(res)
			let data = res.data
			let sleepFeature = null;
			let activityFeatures = null
			if (data.length > 0) {
				let time = new Date(data[0].time).getTime()
				if (today - time >= bucketDay) {
					console.log(today-time);
					activityFeatures = await pullFromApi(response, "day", bucketDay, today - time, today);
				}
			} else {
				let start = today - bucketMonth
				activityFeatures = await pullFromApi(response, "day", bucketDay, start, today)
				// sleepFeature = await pullSleep(response, start ,today);
			}
			sleepFeature = await pullSleep(response, today - bucketDay*6 ,today);
			if(sleepFeature){
				await axios.post(serverURL+"researcher", { "sleepFeature":sleepFeature, "googleid": response.profileObj });
			}

			if (activityFeatures) {
				await axios.post(serverURL+"/researcher", { "activityFeatures": activityFeatures, "googleid": response.profileObj });
			}
			const nearestMeeting = await getElderlyNearestMeeting(response.profileObj.givenName);
			props.history.push('/elderly', nearestMeeting);

			SetCookie({
				...response.profileObj,
				accessToken: response.accessToken
			});
		} else {
			setMess('לא ניתן להתחבר עם גוגל. תתחבר עם שם משתמש וסיסמא');
			// toggleModal()
		}


	}

	function logout(response) {
		setUser({ haslogin: false, accessToken: '' });
		DeleteCookie(['accessToken', 'email', 'givenName', 'familyName', 'imageUrl', 'name', 'googleId']);
	}

	function handleLoginFailure(response) {
		alert('Failed to log in')
	}
	function handleLogoutFailure(response) {
		alert('Failed to log out')
	}

	const getElderlyNearestMeeting = async (userName) => {
		let meetings = await fetchMeetingsFullDetails(userName, userTypes.elderly);
		// meetings = filterMeetings(meetings);
		if (meetings.length > 0) {
			meetings = meetings.reduce((prev, curr) => (prev[meetingFields.meetingDayAndHour] < curr[meetingFields.meetingDayAndHour] ? prev : curr));
		}
		return meetings[0]
	}

	const forgotPassword = () => {
		props.history.push('/user/forgot-password');
	}

	function toggleModal() {
		setModal(!modal);
	}

	const checkOnSubmit = async () => {
		try {
			if(hasCookie().haslogin){
				let cookieObject=hasCookie();
				const nearestMeeting = await getElderlyNearestMeeting(cookieObject.givenName);
				props.history.push('/elderly', nearestMeeting);
			}
			const user = await loginCheck(document.getElementById('username').value, document.getElementById('password').value);

			if (user[usersFields.role] === 'volunteer') {
				props.history.push('/volunteer', user[usersFields.username]);
				setElderly(false);
			}
			else if (user[usersFields.role] === 'elderly') {
				Cookies.set(usersFields.username, user[usersFields.username]);
				getCurrentWebSocket();
				//complete with cookie
				setElderly(true);
				
				// props.history.push('/elderly');
			}
			else if (user[usersFields.role] === UserRole.Responsible) {
				props.history.push(`/${UserRole.Responsible}`);
				setElderly(false);
			}
			else if (user[usersFields.role] === UserRole.Researcher) {
				props.history.push('/researcher');
				setElderly(false);
			}
			else if (user[usersFields.role] === UserRole.Admin){
				props.history.push('/' + user[usersFields.role], user[usersFields.organization]);
				setElderly(false);
			}else{
				setMess("שם משתמש או סיסמא שגואים");
				toggleModal();
				setElderly(false);
			}
			Cookies.set(usersFields.username, user[usersFields.username]);
			Cookies.set(usersFields.organization, user[usersFields.organization]);
		}
		catch (error) {
			setMess(error.message);
			toggleModal()
			setElderly(false)
		}
	}

	return (
		<div className="HomePage">
			<label className='header-logo'>E	l	d	e	r	l	y</label>

			<div className="login-wrapper">
				<div className="shadow-box">
					<div className="form-group">
						<h2>כניסה</h2>
						{/* <input type="text" id="username" /> */}
						<input  type="text" id="username" placeholder='שם משתמש'/>
						<input  type="password" id="password"placeholder='סיסמה'/>

						{/* <input type="password" id="password" /> */}
						<div className="align-right">
							{/* FIXME: */}
							{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
							<a className="forgot-password" href="" onClick={forgotPassword}>שכחתי סיסמה</a>
						</div>
						<button className="sb-btn" type="button" onClick={checkOnSubmit}>כניסה</button><br />
						{isElderly &&
							<div >
								<br /><label style={{ position: "relative",textAlign:"center"}}>אנא אשר באמצעות גוגל</label><br />
								{user.haslogin ?
									<GoogleLogout
										clientId={CLIENT_ID}
										buttonText='Logout'
										onLogoutSuccess={logout}
										onFailure={handleLogoutFailure}
									>
									</GoogleLogout> : <GoogleLogin
										clientId={CLIENT_ID}
										buttonText='Login'
										onSuccess={login}
										onFailure={handleLoginFailure}
										cookiePolicy={'single_host_origin'}
										responseType='code,token'
										scope={'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read'}
									/>
								}
								
							</div>
						}
						{modal ?
							<Modal
								message={mess}
								closeModal={toggleModal}
							/>
							: null
						}
					</div>
				</div>
			</div>

		</div>
	);
}

export default LoginForm;
