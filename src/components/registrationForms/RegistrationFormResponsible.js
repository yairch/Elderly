import React, { Component } from 'react';
import Select from 'react-select';
import Modal from '../modal/Modal.js';
import { registerResponsible } from '../../services/server';
import { genderList, responsibleTypes } from '../../resources/lists';
// eslint-disable-next-line
import { generatePassword, regexes } from '../../ClientUtils';
import './RegistrationForm.css';
import Navbar from '../navbar/Navbar';

class RegistrationFormResponsible extends Component {
	constructor(props) {
		super(props);
		this.state = {
			organizationName: '',
			firstName: '',
			lastName: '',
			email: '',
			username: '',
			password: '',
			gender: '',
			responsibleType: '',
			valid: {
				firstName: true,
				lastName: true,
				username: true,
				password: true,
				email: true
			},
			touched: {
				firstName: false,
				lastName: false,
				username: false,
				password: false,
				email: false,
				gender: false
			},
			modalisOpen: false,
			hasErrors: false
		};

		this.rexExpMap = {
			firstName: regexes.hebrewEnglishRegex,
			lastName: regexes.hebrewEnglishRegex,
			username: regexes.usernameRegex,
			password: regexes.passwordRegex,
			email: regexes.emailRegex
		};

		this.handleChange = this.handleChange.bind(this);
		this.checkData = this.checkData.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.checkOnSubmit = this.checkOnSubmit.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	handleChange = (e, name) => {
		if (name === 'username' && this.state.password === '') {
			//FIXME: temporary. password is id
			// this.setState({password: generatePassword()});
		}
		this.setState({[e.target.name]: e.target.value}, () => {
			this.checkData(this.rexExpMap[name], this.state[name], this.state.valid[name], name);
		});
	};

	checkData(regExp, stateName, stateValid, name) {
		this.setState({
			touched: {...this.state.touched, [name]: true}
		});
		if (regExp.test(stateName)) {
			this.setState({
				valid: {...this.state.valid, [name]: true}
			});
		}
		else {
			this.setState({
				valid: {...this.state.valid, [name]: false}
			});
		}
	}

	validate(firstName, lastName, username, password, email) {
		return {
			firstName: firstName.length === 0,
			lastName: lastName.length === 0,
			username: username.length === 0,
			password: password.length === 0,
			email: email.length === 0
		};
	}

	requiredStyle(name) {
		const show = (this.state[name] === '' || !this.state.valid[name]) && this.state.touched[name];
		return {display: show ? 'block' : 'none'};
	}

	errorMessages(name) {
		const requiredStr = 'שדה חובה';
		const invalidStr = 'ערך לא תקין';
		return !this.state.valid[name] && this.state[name] !== '' ? invalidStr : requiredStr;
	}

	checkOnSubmit() {
		const {firstName, lastName, username, email} = this.state;
		const formFilled = !(firstName === '' || lastName === '' || username === '' || email === '');
		const formInvalid = Object.keys(this.state.valid).some(x => !this.state.valid[x]);
		const formHasErrors = !formFilled || formInvalid;

		if (!formHasErrors) {
			this.setState((prevState) => {
				return {password: prevState.username}
			}, this.handleSubmit);
		}
		else {
			this.setState({message: `אחד או יותר מהשדות לא תקינים`, hasErrors: true});
			this.toggleModal();
		}

		this.setState({
			touched: {
				firstName: true,
				lastName: true,
				username: true,
				password: true,
				email: true
			}
		});
	}

	async handleSubmit() {
		try {
			const response = await registerResponsible({
				...this.state,
				organizationName: this.state.organizationName.value,
				gender: this.state.gender.value,
				responsibleType: this.state.responsibleType.value,
			});
			await response.json();
			this.setState({message: 'הרישום הצליח', hasErrors: false});
		}
		catch (error) {
			this.setState({message: `הרישום נכשל. \n ${error.message}`, hasErrors: true});
		}

		this.toggleModal();
	}

	toggleModal() {
		this.setState(prevState => ({
			modalisOpen: !prevState.modalisOpen
		}));
	}

	closeModal() {
		this.setState({
			modalisOpen: false
		});

		if (!this.state.hasErrors) {
			this.props.history.push('/admin');
		}
	}

	render() {
		const errors = this.validate(this.state.firstName, this.state.lastName,
			this.state.username, this.state.password, this.state.email);
		const shouldMarkError = (field) => {
			const hasError = errors[field];
			const shouldShow = this.state.touched[field];
			return hasError ? shouldShow : false;
		};

		return (
			<div className="no-sidebar-page">
				<Navbar history={this.props.history}/>
				<h2 className="header">
					טופס רישום אחראי
				</h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="container"> 
							<div className="register-form">
								<div className="form">
									<div className="field">
										<label>
											שם ארגון
											<Select
												isRtl
												placeholder="בחר/י..."
												name="organizationName"
												value={this.state.organizationName}
												options={this.props.location.state.organizations}
												onChange={(value) => this.setState({organizationName: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('organizationName')}>{this.errorMessages('organizationName')}</span>
									</div>
									<div className="field">
										<label>
											שם פרטי
											<input
												type="text"
												value={this.state.firstName}
												name="firstName" id="firstName"
												className={shouldMarkError('firstName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'firstName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('firstName')}>{this.errorMessages('firstName')}</span>
									</div>

									<div className="field">
										<label>
											שם משפחה
											<input
												type="text"
												value={this.state.lastName}
												name="lastName" id="lastName"
												className={shouldMarkError('lastName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'lastName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('lastName')}>{this.errorMessages('lastName')}</span>
									</div>

									<div className="field">
										<label>
											מספר תעודת זהות
											<input
												type="text"
												value={this.state.username}
												name="username"
												className={shouldMarkError('username') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'username')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('username')}>{this.errorMessages('username')}</span>
									</div>

									<div className="field">
										<label>
											כתובת דואר אלקטרוני
											<input
												type="text"
												name="email"
												value={this.state.email}
												className={shouldMarkError('email') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'email')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('email')}>{this.errorMessages('email')}</span>
									</div>

									<div className="field">
										<label>
											מגדר
											<Select
												isRtl
												placeholder="בחר/י..."
												name="gender"
												className={shouldMarkError('gender') ? 'error' : ''}
												value={this.state.gender}
												options={genderList}
												onChange={(value) => {this.setState({gender: value})}}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('gender')}>{this.errorMessages('gender')}</span>
									</div>

									<div className="field">
										<label>
											סוג אחראי
											<Select
												isRtl
												placeholder="בחר/י..."
												name="responsibleType"
												className={shouldMarkError('responsibleType') ? 'error' : ''}
												value={this.state.responsibleType}
												options={responsibleTypes}
												onChange={(value) => this.setState({responsibleType: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('gender')}>{this.errorMessages('responsibleType')}</span>
									</div>
									<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>סיום</button>
								</div>
							</div>
							{this.state.modalisOpen ?
								<Modal
									{...this.state}
									closeModal={this.closeModal}
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

export default RegistrationFormResponsible;