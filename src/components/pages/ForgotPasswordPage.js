import React, { useCallback, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { forgotPassword } from '../../services/server';

const ForgotPasswordPage = () => {
	const [state, setState] = useState({message: '', modalisOpen: false});
	const userName = useRef('');
	const email = useRef('');

	const handleChange = useCallback(
		(e) => {
			setState({[e.target.name]: e.target.value});
		}, []);

	const checkOnSubmit = async () => {
		try {
			const response = await forgotPassword(userName.current.value, email.current.value);
			setState({
				modalisOpen: true,
				message: 'התהליך הושלם בהצלחה \n נשלח אליך אימייל לשחזור הסיסמה'
			});
		}
		catch (error) {
			setState({
				modalisOpen: true,
				message: 'שם המשתמש אינו קיים במערכת. \n אנא בדוק שהקלדת נכון את תעודת הזהות'
			});
		}
	};

	return (
		<div className="no-sidebar-page">
			<div className="login-wrapper">
				<div className="shadow-box">
					<div className="register-form">
						<div className="form">
							<div className="field">
								<label>
									תעודת זהות
									<input
										ref={userName}
										minLength={8}
										type="text"
										name="userName"
										onChange={(e) => handleChange(e)}/>
								</label>
							</div>

							<div className="field">
								<label>
									כתובת מייל
									<input
										ref={email}
										minLength={8}
										type="email"
										name="email"
										onChange={(e) => handleChange(e)}/>
								</label>
							</div>

							<button className="sb-btn" type="button" onClick={checkOnSubmit}>אישור</button>
						</div>
					</div>
				</div>
			</div>
			{state.modalisOpen ?
				<Modal
					{...state}
					closeModal={() => {
						setState({modalisOpen: !state.modalisOpen});
					}}
				/>
				: null
			}
		</div>
	);
};

export default ForgotPasswordPage;
