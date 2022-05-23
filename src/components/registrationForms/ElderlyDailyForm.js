import './RegistrationForm.css';
import Navbar from '../navbar/Navbar';
import { useState } from 'react';
import Modal from '../modal/Modal.js';
import {fetchPostDailyForm} from '../../services/server';


const ElderlyDailyForm = (props) => {
    
    const date = new Date().toLocaleDateString('en-us', {year:"numeric", month:"numeric", day:"numeric"})

    // const [happyVal, setHappyVal] = useState(50);
    const [values, setValues] = useState({
        happy: 50,
        sad: 50,
        lonely: 50,
        pain: 50,
        sleep:50,
    });
    const handleChange = (e) => {                
        setValues({
          ...values,                                // spreading the unchanged values
          [e.target.name]: parseInt(e.target.value),          // changing the state of *changed value*
        });
      };
    
      const [modalisOpen, setModal] = useState(false);

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
					זהו שאלון יומי עבור {date}
                </h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="container">
							<div className="register-form">
								<div className="form">
									<div className="field">
                                        <label>1.	כמה שמח/ה את/ה מרגיש/ה עכשיו? [0-100%: כלל לא – מאוד]</label>
                                           {/* <input type="range" id="myRange" min="0" max="100" step="10" />
                                            <p>{} <span id="value"></span></p>   */}
                                            <input
                                                type="range"
                                                id="happy"
                                                name="happy"
                                                min={0}                    
                                                max={100}
                                                step={10}                   
                                                data-orientation="vertical" 
                                                onChange={handleChange}
                                            />
                                                <div className='value'>{values['happy']}</div>

                                        </div>
                                    
									<div className="field">
                                        <label>2.	כמה עצוב/ה את/ה מרגיש/ה עכשיו? [0-100%: כלל לא – מאוד]</label>
                                        <input
                                                type="range"
                                                id="sad"
                                                name="sad"
                                                min={0}                   
                                                max={100}
                                                step={10}
                                                data-orientation="vertical" 
                                                onChange={handleChange}
                                            />
                                                <div className='value'>{values['sad']}</div>
                                        
                                    </div>

									<div className="field">
                                            <label>3.	כמה בודד/ה את/ה מרגיש/ה עכשיו? [0-100%: כלל לא – מאוד]</label>
                                            <input
                                                type="range"
                                                id="lonely"
                                                name="lonely"
                                                min={0}                   
                                                max={100}
                                                step={10}                   
                                                data-orientation="vertical" 
                                                onChange={handleChange}
                                            />
                                                <div className='value'>{values['lonely']}</div>
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
