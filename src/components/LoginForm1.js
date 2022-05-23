import React, { useState, useEffect } from 'react';
import * as Cookies from 'js-cookie';
import Modal from './modal/Modal';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import './registrationForms/RegistrationForm.css';
import { fetchMeetingsFullDetails, loginCheck } from '../services/server';
import { getCurrentWebSocket } from '../services/notifacationService';
// import { filterMeetings } from '../server.js';
import {meetingFields, usersFields} from "../constants/collections";
import {userTypes} from '../constants/userTypes';
import {UserRole} from '../types/user'
import {pullFromApi, SetCookie, DeleteCookie, hasCookie } from './CookieManager.js';
const CLIENT_ID =  "454610489364-66snjbuq568fgvrluepjrusgjv8u1juv.apps.googleusercontent.com";//process.env.REACT_APP_CLIENT_ID;

function LoginForm(props) {
	const [user, setUser] = useState({ haslogin: false, accessToken: '' });
	const [modal, setModal] = useState(false);
	const [mess, setMess] = useState('');
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
		  const nearestMeeting = await getElderlyNearestMeeting(response.profileObj.givenName);
		  props.history.push('/elderly', nearestMeeting);
		
			SetCookie({
			...response.profileObj,
			accessToken: response.accessToken
			});
		}else{
			setMess('לא ניתן להתחבר עם גוגל. תתחבר עם שם משתמש וסיסמא');
			// setModal(true);
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

	const getElderlyNearestMeeting=async(userName)=> {
		let meetings = await fetchMeetingsFullDetails(userName, userTypes.elderly);
		// meetings = filterMeetings(meetings);
		if (meetings.length>0){
			meetings= meetings.reduce((prev, curr) => (prev[meetingFields.meetingDayAndHour] < curr[meetingFields.meetingDayAndHour] ? prev : curr));
		}
		return meetings[0]
	}
	
	const forgotPassword =()=>{
		props.history.push('/user/forgot-password');
	}

	function toggleModal() {
		setModal(!modal);
	}

	const checkOnSubmit = async()=> {
		try {

			const user = await loginCheck(document.getElementById('username').value, document.getElementById('password').value);

			if (user[usersFields.role] === 'volunteer') {
				props.history.push('/volunteer', user[usersFields.username]);
			}
			else if (user[usersFields.role] === 'elderly') {
				Cookies.set(usersFields.username, user[usersFields.username]);
				getCurrentWebSocket();
				//complete with cookie
				props.history.push('/elderly');
			}
			else if (user[usersFields.role] === UserRole.Responsible) {
				props.history.push(`/${UserRole.Responsible}`);
			}
			else if (user[usersFields.role] === 'researcher'){
				props.history.push('/researcher');
			}
			else {
				props.history.push('/' + user[usersFields.role], user[usersFields.organization]);
			}

			Cookies.set(usersFields.username, user[usersFields.username]);
			Cookies.set(usersFields.organization, user[usersFields.organization]);
		}
		catch (error) {
			setMess({message: error.message});
			toggleModal();
		}
	}
	// return (
    //     <div dir="rtl" className="shadow-box">
    //         <div style={{ position:"relative", right:"40%", top:"60px"}}>
    //             {user.haslogin ?
    //             <GoogleLogout
    //                 clientId={CLIENT_ID}
    //                 buttonText='Logout'
    //                 onLogoutSuccess={logout}
    //                 onFailure={handleLogoutFailure}
    //             >
    //             </GoogleLogout> : <GoogleLogin
    //                 clientId={CLIENT_ID}
    //                 buttonText='Login'
    //                 onSuccess={login}
    //                 onFailure={handleLoginFailure}
    //                 cookiePolicy={'single_host_origin'}
    //                 responseType='code,token'
    //                 scope = { 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read'}
    //             />
    //             }
    //         </div>
    //     </div>
	// );

	return (
		<div className="login-wrapper">
			<div className="shadow-box">
				<div className="form-group">
					<h2>התחברות</h2>
					<br/>
					<label>שם משתמש</label>
					<input type="text" id="username"/>
					<label>סיסמה</label>
					<input type="password" id="password"/>
					<div className="align-right">
						{/* FIXME: */}
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<a className="forgot-password" href="" onClick={forgotPassword}>שכחתי סיסמה</a>
					</div>
					<button className="sb-btn" type="button" onClick={checkOnSubmit}>כניסה</button><br /><br/><label style={{position:"relative", right:"50%"}}>או</label><br />
					<div >
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
								/>}
							{modal ?
							<Modal
								{...modal}
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
