import React, { useState, useEffect } from 'react';
import * as Cookies from 'js-cookie';
import Modal from './modal/Modal';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import { fetchMeetingsFullDetails, loginCheck } from '../services/server';
import { getCurrentWebSocket } from '../services/notifacationService';
// import { filterMeetings } from '../server.js';
import {meetingFields, usersFields} from "../constants/collections";
import {userTypes} from '../constants/userTypes';

import {pullFromApi, SetCookie, DeleteCookie, hasCookie } from './CookieManager.js';
const CLIENT_ID =  "454610489364-66snjbuq568fgvrluepjrusgjv8u1juv.apps.googleusercontent.com";//process.env.REACT_APP_CLIENT_ID;

function LoginForm(props) {
	const [user, setUser] = useState({ haslogin: false, accessToken: '' });
	// const [password, setPass] = useState('')
	// const [message, setMessage] = useState('')
	// const [modalisOpen, setModalisOpen] = useState(false)

	const today = new Date().getTime()
  	// console.log(today)
  	const bucketDay= 86400000
  	// const bucketMonth= 30*bucketDay
  	const bucketWeek= 7*bucketDay
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		username: '',
	// 		password: '',
	// 		message: '',
	// 		modalisOpen: false,
	// 	};

	// 	this.usernameRef = React.createRef();
	// 	this.passwordRef = React.createRef();
	// 	this.checkOnSubmit = this.checkOnSubmit.bind(this);
	// 	this.toggleModal = this.toggleModal.bind(this);
	// 	this.forgotPassword = this.forgotPassword.bind(this);
	// }
	useEffect(() => {
		const cookieObject = hasCookie();
		if (cookieObject.haslogin) {
		  setUser({
			...cookieObject
		  });
		}
	}, []);

	async function login(response) {
		console.log(response.profileObj)
		if (response.accessToken) {
		  setUser({
			...response.profileObj,
			haslogin: true,
			accessToken: response.accessToken
		  })
		  let res = await axios.get("http://localhost:3001/researcher")
		  // console.log(res)
		  let data = res.data
	
		  let featuresWeek = null
		  if (data.length>0){
			let time =new Date(data[0].time).getTime()
			console.log(time)
			if(today-time>=bucketDay){
			  featuresWeek = await pullFromApi(response,"day", bucketDay, today-time,today)
			}
		  }else{
			let start=today-bucketWeek
			featuresWeek = await pullFromApi(response,"day",bucketDay, start,today)
			console.log(featuresWeek)
		  }
		  if(featuresWeek){
			await axios.post("http://localhost:3001/researcher", {"featuresWeek":featuresWeek, "googleid":response.profileObj}); 
		  }
		  	   
		}
		SetCookie({
		  ...response.profileObj,
		  accessToken: response.accessToken
		});
		const nearestMeeting = await getElderlyNearestMeeting(response.profileObj.givenName);
		props.history.push('/elderly', nearestMeeting);

		
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

	const getElderlyNearestMeeting=async(userName)=> {
		let meetings = await fetchMeetingsFullDetails(userName, userTypes.elderly);
		// meetings = filterMeetings(meetings);
		if (meetings.length>0){
			meetings= meetings.reduce((prev, curr) => (prev[meetingFields.meetingDayAndHour] < curr[meetingFields.meetingDayAndHour] ? prev : curr));
		}
		return meetings[0]
	}

	// const checkOnSubmit=async()=> {
	// 	try {
	// 		const user = await loginCheck(this.usernameRef.current.value, this.passwordRef.current.value);

	// 		if (user[usersFields.role] === 'volunteer') {
	// 			this.props.history.push('/volunteer', user[usersFields.username]);
	// 		}
	// 		else if (user[usersFields.role] === 'elderly') {
	// 			Cookies.set(user.Username, user[usersFields.role]);
	// 			getCurrentWebSocket();
	// 			const nearestMeeting = await getElderlyNearestMeeting(user.Username);
	// 			this.props.history.push('/elderly', nearestMeeting);
	// 		}
	// 		else {
	// 			this.props.history.push('/' + user[usersFields.role], user[usersFields.organization]);
	// 		}

	// 		Cookies.set(usersFields.username, user[usersFields.username]);
	// 		Cookies.set(usersFields.organization, user[usersFields.organization]);
	// 	}
	// 	catch (error) {
			
	// 	}
	// }

	// const toggleModal=()=> {
	// 	setModalisOpen(!modalisOpen);
	// }

	// const forgotPassword=()=>{
	// 	this.props.history.push('/user/forgot-password');
	// }
	

	return (
		<div className="App">
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
				scope = { 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read'}
			/>
			}
    	</div>
	);
	// render() {
	// 	return (
	// 		<div className="login-wrapper">
	// 			<div className="shadow-box">
	// 				<div className="form-group">
	// 					<h2>התחברות</h2>
	// 					<br/>
	// 					<label>שם משתמש</label>
	// 					<input ref={this.usernameRef} type="text" id="username"/>
	// 					<label>סיסמה</label>
	// 					<input ref={this.passwordRef} type="password" id="password"/>
	// 					<div className="align-right">
	// 						<a className="forgot-password" href="" onClick={this.forgotPassword}>שכחתי סיסמה</a>
	// 					</div>
	// 					<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>כניסה</button>
	// 					{this.state.modalisOpen ?
	// 						<Modal
	// 							{...this.state}
	// 							closeModal={this.toggleModal}
	// 						/>
	// 						: null
	// 					}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }
}

export default LoginForm;
