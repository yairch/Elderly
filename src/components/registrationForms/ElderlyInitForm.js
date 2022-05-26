import './RegistrationForm.css';
import Navbar from '../navbar/Navbar';
import { useState } from 'react';
import Modal from '../modal/Modal.js';
import {fetchPostDailyForm} from '../../services/server';
import Select from 'react-select';
// import {initFormOptions} from '../../resources/lists';


const ElderlyDailyForm = (props) => {
	const statusOptions = [
		{value: 'רווק/ה', label: 'רווק/ה'},
		{value: 'נשוי/אה', label: 'נשוי/אה'},
		{value: 'גרוש/ה', label: 'גרוש/ה'},
		{value: 'פרוד/ה', label: 'פרוד/ה'},
		{value: 'גרוש/ה', label: 'גרוש/ה'},
	];
    
    const date = new Date().toLocaleDateString('en-us', {year:"numeric", month:"numeric", day:"numeric"})

    // const [happyVal, setHappyVal] = useState(50);
    const [values, setValues] = useState({
        age: 60,
		gender: '',
		status: ''
    });
    const handleChange = (e) => {                
        setValues({
          ...values,                                // spreading the unchanged values
          [e.target.name]: parseInt(e.target.value),          // changing the state of *changed value*
        });
      };
    
      const [modalisOpen, setModal] = useState(false);

      // eslint-disable-next-line no-unused-vars
      const toggleModal = () => {
		setModal(prevState => ({
			modalisOpen: !prevState.modalisOpen
		}));
	}


	
      const handleSubmit = async () => {
        console.log("handle Submit");
        try {

			const response = await fetchPostDailyForm(values,123,date);
			(await response).json();
            console.log("success");
            props.history.push('/elderly');
		}
		catch (error) {
			console.log(error)
		}
	}
                   
        return (
			<div>
				<Navbar history={props.history}/>
				<h2 className="header">
					זהו שאלון ראשוני נא מלא את פרטיך.
                </h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="container">
							<div className="register-form">
								<div className="form">
									<div className="field">
                                        <label>מהו גילך?</label>
                                           {/* <input type="range" id="myRange" min="0" max="100" step="10" />
                                            <p>{} <span id="value"></span></p>   */}
                                            <input type="number" id="age" name="age"
                                                min={0} max={120} step={1} data-orientation="vertical"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    
									<div className="wraper-container">
                                        <label>מהו מינך?</label>
                                       		
											<input type="radio" id="male" name="gender" value="" 
											   onChange={handleChange}
                                            />
                                            <div className='value'>{'זכר'}</div>
												<input type="radio" id="female" name="gender" value=""
                                                onChange={handleChange}/>
                                            <div className='value'>{'נקבה'}</div>
											<input type="radio" id="female" name="gender" value=""
                                                onChange={handleChange}/>
                                            <div className='value'>{'אחר'}</div>
                                    </div>

									<div className="field">
                                            <label>מהו מצבך המשפחתי (בחר בתשובה אחת בלבד)? </label>
											<Select
											isRtl
											placeholder="בחר/י..."
											name="status"
											className="status"
											value={values.status}
											options={statusOptions}
											onChange={handleChange}
										/>
										<div className='value'>{values['status']}</div>
                                    </div>
                                    
                                    <div className='field'>
                                            <label>4.	האם את/ה סובל/ת מכאב או אי נוחות פיזית עכשיו? [0-100%: כלל לא – מאוד]</label>
                                            <input
                                                type="range"
                                                id="pain"
                                                name="pain"
                                                min={0}                   
                                                max={100}                
                                                step={10}                   
                                                data-orientation="vertical" 
                                                onChange={handleChange}
                                            />
                                                <div className='value'>{values['pain']}</div>
                                        </div> 
									<div className="field">
                                            <label>5.	איך ישנת הלילה? [0-100%: ישנתי גרוע – ישנתי מצוין] </label>
                                            <input
                                                type="range"
                                                id="sleep"
                                                name="sleep"
                                                min={0}                    
                                                max={100}                
                                                step={10}                   
                                                data-orientation="vertical" 
                                                onChange={handleChange}
                                            />
                                                <div className='value'>{values['sleep']}</div>
									</div>
									<button className="sb-btn" type="button" onClick={handleSubmit}>סיום</button>
								</div>
							</div>
                            {modalisOpen ?
								<Modal
									text='שים/י לב'
									
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

export default ElderlyDailyForm;
