import React from 'react';
import * as Cookies from 'js-cookie';
import Modal from './modal/Modal';
import { fetchMeetingsFullDetails, loginCheck } from '../services/server';
import { getCurrentWebSocket } from '../services/notifacationService';
// import { filterMeetings } from '../server.js';
import {meetingFields, usersFields} from "../constants/collections";
import {userTypes} from '../constants/userTypes';
import {UserRole} from '../types/user'

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
		const meetings = await fetchMeetingsFullDetails(userName, userTypes.elderly);
		// meetings = filterMeetings(meetings);
		return meetings.length === 0 ? null : meetings.reduce((prev, curr) => (prev[meetingFields.date] < curr[meetingFields.date] ? prev : curr));
	}

	async checkOnSubmit() {
		try {
			const user = await loginCheck(this.usernameRef.current.value, this.passwordRef.current.value);

			if (user[usersFields.role] === 'volunteer') {
				this.props.history.push('/volunteer', user[usersFields.username]);
			}
			else if (user[usersFields.role] === 'elderly') {
				Cookies.set(usersFields.username, user[usersFields.username]);
				getCurrentWebSocket();
				// const nearestMeeting = await this.getElderlyNearestMeeting(user.username);
				this.props.history.push('/googleLogin');
			}
			else if (user[usersFields.role] === UserRole.Responsible) {
				this.props.history.push(`/${UserRole.Responsible}`);
			}
			else if (user[usersFields.role] === 'researcher'){
				this.props.history.push('/researcher');
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
			<div>
			<div className="login-wrapper">
				<div className="shadow-box">
					<div className="form-group">
						<h2>??????????</h2>
						<br/>
						
						<input ref={this.usernameRef} type="text" id="username" placeholder='???? ??????????'/>
						<input ref={this.passwordRef} type="password" id="password"placeholder='??????????'/>
						<div className="align-right">
							{/* FIXME: */}
							{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
							<a className="forgot-password" href="" onClick={this.forgotPassword}>?????????? ??????????</a>
						</div>
						<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>??????????</button>
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
			</div>
		);
	}
}

export default LoginForm;
