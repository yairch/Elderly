import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Cookies from 'js-cookie';
import { tryLogin, updatePassword } from '../../services/server';
import Modal from '../modal/Modal';

function ChangePasswordPage() {
	const [state, setState] = useState({message: '', modalisOpen: false});
	const newPassword = useRef('');
	const confirmNewPassword = useRef('');
	const {username, password} = useParams();

	const toggleModal = useCallback(
		() => {
			setState({modalisOpen: !state.modalisOpen});
		}, [state.modalisOpen]);

	useEffect(() => {
		async function tryToLogin() {
			try {
				await tryLogin(username, password);
				Cookies.set('userName', username);
			}
			catch (error) {
				setState({
					modalisOpen: true,
					message: 'שם המשתמש או הסיסמה לא קיימים במערכת. \n לא ניתן להחליף סיסמה,\n אנא פנה לאחראי המערכת'
				});
			}
		}

		tryToLogin();
	}, [username, password]);

	const handleChange = useCallback(
		(e) => {
			setState({[e.target.name]: e.target.value});
		}, []);

	const checkOnSubmit = useCallback(
		async () => {
			console.log('checkOnSubmit password');
			if (newPassword.current.value === confirmNewPassword.current.value) {
				console.log('same password');
				await updatePassword(username, newPassword.current.value);
				setState({
					modalisOpen: true,
					message: 'הסיסמה שונתה בהצלחה'
				});

			}
			else {
				console.log('not the same');
				setState({
					modalisOpen: true,
					message: 'הסיסמאות לא זהות'
				});
			}

		}, [newPassword, confirmNewPassword, username]);

	return (
		<div className="no-sidebar-page">
			<div className="register-wrapper">
				<div className="register-form">
					<div className="form">
						<div className="field">
							<label>
								סיסמה חדשה
								<input
									ref={newPassword}
									minLength={8}
									type="password"
									name="newPassword"
									onChange={(e) => handleChange(e)}/>
							</label>
						</div>

						<div className="field">
							<label>
								אשר סיסמה חדשה
								<input
									ref={confirmNewPassword}
									minLength={8}
									type="password"
									name="confirmNewPassword"
									onChange={(e) => handleChange(e)}/>
							</label>
						</div>

						<button className="sb-btn" type="button" onClick={checkOnSubmit}>אישור</button>
					</div>
				</div>
			</div>
			{state.modalisOpen ?
				<Modal
					{...state}
					closeModal={toggleModal}
				/>
				: null
			}
		</div>
	);
}

export { ChangePasswordPage };
