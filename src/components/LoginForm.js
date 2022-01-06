import React from 'react';
import * as Cookies from 'js-cookie';
import Modal from './modal/Modal';
import { fetchMeetingsFullDetails, loginCheck } from '../services/server';
import { getCurrentWebSocket } from '../services/notifacationService';
// import { filterMeetings } from '../server.js';
import {usersFields} from "../constants/collections"
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			message: '',
			modalisOpen: false
		};

		this.usernameRef = React.createRef();
		this.passwordRef = React.createRef();
		this.checkOnSubmit = this.checkOnSubmit.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
	}

	async getElderlyNearestMeeting(userName) {
		const response = await fetchMeetingsFullDetails(userName, 'קשישים');
		let meetings = await response.json();
		meetings = meetings.map((dic) => ({
				meetingDate: dic.meeting,
				...dic
			})
		);
		// meetings = filterMeetings(meetings);
		return meetings.reduce((prev, curr) => (prev.date < curr.date ? prev : curr));
	}

	async checkOnSubmit() {
		try {
			const user = await loginCheck(this.usernameRef.current.value, this.passwordRef.current.value);

			if (user[usersFields.role] === 'volunteer') {
				this.props.history.push('/volunteer', user[usersFields.username]);
			}
			else if (user[usersFields.role] === 'elderly') {
				Cookies.set(user.Username, user[usersFields.role]);
				getCurrentWebSocket();
				const nearestMeeting = await this.getElderlyNearestMeeting(user.Username);
				this.props.history.push('/elderly', nearestMeeting);
			}
			else {
				this.props.history.push('/' + user[usersFields.role], user[usersFields.organization]);
			}

			Cookies.set(usersFields.username, user[usersFields.username]);
			Cookies.set(usersFields.organization, user[usersFields.organization]);
		}
		catch (error) {
			this.setState({message: error.message});
			this.toggleModal();
		}
	}

	toggleModal() {
		this.setState(prevState => ({
			modalisOpen: !prevState.modalisOpen
		}));
	}

	forgotPassword(){
		this.props.history.push('/user/forgot-password');
	}

	render() {
		return (
			<div className="login-wrapper">
				<div className="shadow-box">
					<div className="form-group">
						<h2>התחברות</h2>
						<br/>
						<label>שם משתמש</label>
						<input ref={this.usernameRef} type="text" id="username"/>
						<label>סיסמה</label>
						<input ref={this.passwordRef} type="password" id="password"/>
						<div className="align-right">
							<a className="forgot-password" href="" onClick={this.forgotPassword}>שכחתי סיסמה</a>
						</div>
						<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>כניסה</button>
						{this.state.modalisOpen ?
							<Modal
								{...this.state}
								closeModal={this.toggleModal}
							/>
							: null
						}
					</div>
				</div>
			</div>
		);
	}
}

export default LoginForm;
