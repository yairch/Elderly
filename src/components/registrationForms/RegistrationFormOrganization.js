import React, { Component } from 'react';
import Modal from '../modal/Modal.js';
import Select from 'react-select';
import { organizationTypes } from '../../resources/lists';
import { registerOrganization } from '../../services/server';
import { regexes } from '../../ClientUtils';
import './RegistrationForm.css';
import Navbar from '../navbar/Navbar';
import { OrganizationType } from '../../types/organization';

class RegistrationFormOrganization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			organizationName: '',
			organizationEnglishName: '',
			organizationType: '',
			phoneNumber: '',
			valid: {
				organizationName: true,
				organizationEnglishName: true,
				organizationType: true,
				phoneNumber: true
			},
			touched: {
				organizationName: false,
				organizationEnglishName: false,
				organizationType: false,
				phoneNumber: false
			},
			modalisOpen: false,
			hasErrors: false
		};

		this.rexExpMap = {
			organizationName: regexes.hebrewEnglishRegex,
			organizationEnglishName: regexes.englishRegex,
			organizationType: regexes.hebrewEnglishRegex,
			phoneNumber: regexes.phoneNumberRegex
		};

		this.handleChange = this.handleChange.bind(this);
		this.checkData = this.checkData.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.checkOnSubmit = this.checkOnSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.registerOrganization = this.registerOrganization.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	handleChange = (e, name) => {
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

	validate(organizationName, organizationEnglishName, organizationType, phoneNumber) {
		return {
			organizationName: organizationName.length === 0,
			organizationEnglishName: organizationEnglishName.length === 0,
			organizationType: organizationType.length === 0,
			phoneNumber: phoneNumber.length === 0
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

	async checkOnSubmit() {
		const {organizationName, organizationEnglishName, organizationType, phoneNumber} = this.state;
		const formFilled = !(organizationName === '' || organizationType === '' || phoneNumber === '' || organizationEnglishName === '');
		const formInvalid = Object.keys(this.state.valid).some(input => !this.state.valid[input]);
		const formHasErrors = !formFilled || formInvalid;

		if (!formHasErrors) {
			await this.handleSubmit();
		}
		else {
			this.setState({message: `אחד או יותר מהשדות לא תקינים`, hasErrors: true});
			this.toggleModal();
		}
		this.setState({
			touched: {
				organizationName: true,
				organizationEnglishName: true,
				organizationType: true,
				phoneNumber: true
			}
		});
	}

	convertOrganizationTypeInput(input) {
		const convertedInput = {...input};
		switch(input.value){
			case 'מתנדבים':
				convertedInput.value = OrganizationType.Volunteer;
				break;
			case 'קשישים':
				convertedInput.value = OrganizationType.Elderly;
				break;
			case 'מתנדבים וקשישים':
			default: // FIXME: add default case
				convertedInput.value = OrganizationType.Both;
				break;
		}
		return convertedInput;
	}

	async registerOrganization() {
		try {
			const response = await registerOrganization(this.state);
			await response.json();
			this.setState({message: 'הרישום הצליח', hasErrors: false}, this.toggleModal);
		}
		catch (error) {
			this.setState({message: `הרישום נכשל. \n ${error.message}`, hasErrors: true}, this.toggleModal);
		}
	}
	 
	handleSubmit() {
		this.setState((prevState) => {
			const convertedOrganizationType = this.convertOrganizationTypeInput(prevState.organizationType)
			return {
				organizationType: convertedOrganizationType,
			};
		}, this.registerOrganization);
	}

	toggleModal() {
		this.setState(prevState => ({
			modalisOpen: !prevState.modalisOpen
		}));
	}

	closeModal() {
		this.toggleModal();

		if (!this.state.hasErrors) {
			this.props.history.push('/admin');
		}
	}

	render() {
		const errors = this.validate(this.state.organizationName, this.state.organizationEnglishName, this.state.organizationType, this.state.phoneNumber);
		const shouldMarkError = (field) => {
			const hasError = errors[field];
			const shouldShow = this.state.touched[field];
			return hasError ? shouldShow : false;
		};

		return (
			<div>
				<Navbar history={this.props.history}/>
				<h2 className="header">
					טופס רישום ארגון
				</h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="container">
							<div className="register-form">
								<div className="form">
									<div className="field">
										<label>
											שם ארגון
											<input
												type="text"
												value={this.state.organizationName}
												name="organizationName"
												className={shouldMarkError('organizationName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'organizationName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('organizationName')}>{this.errorMessages('organizationName')}</span>
									</div>
									<div className="field">
										<label>
											שם ארגון באנגלית
											<input
												type="text"
												value={this.state.organizationEnglishName}
												name="organizationEnglishName"
												className={shouldMarkError('organizationEnglishName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'organizationEnglishName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('organizationEnglishName')}>{this.errorMessages('organizationEnglishName')}</span>
									</div>
									<div className="field">
										<label>
											סוג ארגון
											<Select
												isRtl
												placeholder="בחר/י..."
												name="organizationType"
												className={shouldMarkError('organizationType') ? 'error' : ''}
												value={this.state.organizationType}
												options={organizationTypes}
												onChange={(value) => this.setState({organizationType: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('organizationType')}>{this.errorMessages('organizationType')}</span>
									</div>

									<div className="field">
										<label>
											מספר טלפון
											<input
												type="text"
												value={this.state.phoneNumber}
												name="phoneNumber" id="phoneNumber"
												className={shouldMarkError('phoneNumber') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'phoneNumber')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('phoneNumber')}>{this.errorMessages('phoneNumber')}</span>
									</div>
									<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>סיום</button>
								</div>
							</div>
							{this.state.modalisOpen ?
								<Modal
									text='שים/י לב'
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

export default RegistrationFormOrganization;
