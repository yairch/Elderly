import './RegistrationForm.css';
import Navbar from '../navbar/Navbar';
import { useState } from 'react';
import Modal from '../modal/Modal.js';
import {fetchInitForm} from '../../services/server';
import Select from 'react-select';

import {religiousType,
    statusOptions,
    religiousLevel,
    economiOptions,
    educationOptions,
    jobOptions,
    healthOptions} from '../../resources/lists/initForm';


const ElderlyDailyForm = (props) => {
	
	
	const [numValues, setNum] = useState({
		age: 60,
		gender: '',
		welmed: '',
		asstimated_age: 60,
		sociel_miss:'',
		outsider: '',
		lonely: ''
	});
    const [catValues, setCat] = useState({
		religiousType:'',
		status: '',
		religious: '',
		economi: '',
		education: '',
		job: '',
		health: '',
		doctor: [],
	
    });
    const handleNum = (e) => {                
        setNum({
          ...numValues,                                // spreading the unchanged values
          [e.target.name]:	parseInt(e.target.value),          // changing the state of *changed value*
        });
      };
	  const handleCat = (e) => {                
		console.log(e)
        setCat({
          ...catValues,                                // spreading the unchanged values
          [e.label]:String(e.value),          // changing the state of *changed value*
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
        try {
			const date = new Date().toLocaleDateString('en-us', {year:"numeric", month:"numeric", day:"numeric"})
            let uid = 123;
			const response = await fetchInitForm(numValues,catValues,uid,date);
			(await response).json();
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
					?????? ?????????? ???????????? ???? ?????? ???? ??????????.
                </h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="init-container">
							<div className="register-form">
								<div className="form">
									<div className="field">
                                        <label><b>?????? ?????????</b></label>
                                           {/* <input type="range" id="myRange" min="0" max="100" step="10" />
                                            <p>{} <span id="value"></span></p>   */}
                                            <input type="number" id="age" name="age"
                                                min={0} max={120} step={1} data-orientation="vertical"
                                                onChange={handleNum} style={{width:'40%'}}
                                            />
                                        </div>    
                                        <div className='field'>    
                                        <label><b>???? ?????? ?????????</b></label>                
                                            <div className='radio-con'>
                                                <input type={'radio'} name='gender' id='??????' value={"??????"} 
                                                onChange={handleCat}/>
                                                <label for='??????'>??????</label>
                                                
                                                <input type={'radio'} name='gender' id='????????' value={"????????"}
                                                onChange={handleCat}/>
                                                <label for='????????'>????????</label>

                                                <input type={'radio'} name='gender' id='??????' value={"??????"}
                                                onChange={handleCat}/>
                                                <label for='??????'>??????</label>

                                            </div>
                                           
                                        </div>
										<div className="field">
                                            <label><b>?????? ???????</b> </label>
											<label>{catValues.religiousType}</label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="religiousType" 
											id= "religiousType"
											className="religiousType"
											value={catValues.status}
											options={religiousType}
											onChange={handleCat}
										/>
									
                                    </div>
									<div className="field">
                                            <label><b>?????? ???????? ???????????????</b> </label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="status"
											id = "status"
											className="status"
											value={catValues.status}
											options={statusOptions}
											onChange={handleCat}
										/>
                                    </div>
                                    <div className="field">
                                            <label><b>?????? ???????? ???????????? ???????</b></label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="religious"
											id="religious"
											className="religious"
											value={catValues.religious}
											options={religiousLevel}
											onChange={handleCat}
										/>
                                    </div>
                                    <div className="field">
                                            <label><b>???????? ???????? ??????????/?? ???? ???????? ?????????????</b></label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="economi"
											id="economi"
											className="economi"
											value={catValues.economi}
											options={economiOptions}
											onChange={handleCat}
										/>
                                    </div>
                                    <div className="field">
                                            <label><b>?????? ?????? ???????????? ???????????? ?????????? ???????????</b></label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="education"
											id="education"
											className="education"
											value={catValues.status}
											options={educationOptions}
											onChange={handleCat}
										/>
                                    </div>
                                    <div className="field">
                                            <label><b>?????? ???????? ?????????????????</b> </label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="job"
											id="job"
											className="job"
											value={catValues.job}
											options={jobOptions}
											onChange={handleCat}
										/>
                                    </div>
									<div className="field">
                                            <label><b>???????? ???????? ??????????/?? ???? ???????? ???????????????? ?????????</b> </label>
											<Select
											isRtl
											placeholder='??????/??...'
											name="health"
											id="health"
											className="health"
											value={catValues.job}
											options={healthOptions}
											onChange={handleCat}
										/>
                                    </div>
									<div className="field">
                                            <label><b>?????? ???????? ???? ?????? ?????? ???? ??????/?? ????????/?? ???????? ???????????? ???????????      (??????/?? ???? ???? ???? ????????????)</b> </label>
											<Select
											isRtl
											placeholder="???????? ????????"
											name="doctor"
											id="doctor"
											className="doctor"
											value={catValues.job}
											options={""}
											onChange={handleCat}
										/>
                                    </div>
									<div className='field'>
                                            <label><b>?????? ??????, ?????? ?????? ?????? ???????? ?????????? ?????????</b></label>
                                            <input
                                                type="range"
                                                id="welmed"
                                                name="welmed"
                                                min={0}                   
                                                max={10}                
                                                step={1}                   
                                                data-orientation="vertical" 
                                                onChange={handleNum}
                                            />
                                                <div className='welmed'>{numValues['welmed']}</div>
                                        </div> 
										<label><b>?????????? ?????? ????/?? ??????????/?? ???????????</b> </label>
                                            <input type="number" id="asstimated_age" name="asstimated_age"
                                                min={0} max={120} step={1} data-orientation="vertical"
                                                onChange={handleNum} style={{width:'40%'}}
                                            />

										<div>
										<label><b><u>???????????? ?????????? ???????????? ???????? ??????/?? ??????????/?? ?????????? ?????????????? ?????????? ???? ????????. ???????? ???? ?????? ??????, ?????? ????????/?? ?????????? ???????????? ?????? ???? ???????????????? ????????????????</u></b></label>
										</div>
									<div className="field">
                                            <label><b>?????????? ???????????? ????/?? ????/?? ?????? ???????????? ???????????????</b></label>
											<div className='radio-con'>
                                                <input type={'radio'} name='sociel_miss' id='1' value={"1"} 
                                                onChange={handleNum}/>
                                                <label for='1'>1</label>
                                                
                                                <input type={'radio'} name='sociel_miss' id='2' value={"2"}
                                                onChange={handleNum}/>
                                                <label for='2'>2</label>

                                                <input type={'radio'} name='sociel_miss' id='3' value={"3"}
                                                onChange={handleNum}/>
                                                <label for='3'>3</label>

                                            </div>
                                    </div>
									<div className="field">
                                            <label><b>?????????? ???????????? ????/?? ????/?? ??????????/?? ???? ???????? ?????????????????</b> </label>
											<div className='radio-con'>
                                                <input type={'radio'} name='outsider' id='1' value={"1"} 
                                                onChange={handleNum}/>
                                                <label for='1'>1</label>
                                                
                                                <input type={'radio'} name='outsider' id='2' value={"2"}
                                                onChange={handleNum}/>
                                                <label for='2'>2</label>

                                                <input type={'radio'} name='outsider' id='2' value={"2"}
                                                onChange={handleNum}/>
                                                <label for='3'>3</label>

                                            </div>
                                    </div>

                      
									<div className="field">
                                            <label><b>?????????? ???????????? ????/?? ????/?? ??????????/?? ?????????????</b> </label>
											<div className='radio-con'>
                                                <input type={'radio'} name='lonely' id='1' value={"1"} 
                                                onChange={handleNum}/>
                                                <label for='1'>1</label>
                                                
                                                <input type={'radio'} name='lonely' id='2' value={"2"}
                                                onChange={handleNum} placeholder={2}/>
                                                <label for='2'>2</label>

                                                <input type={'radio'} name='lonely' id='2' value={"2"}
                                                onChange={handleNum}/>
                                                <label for='3'>3</label>

                                            </div>
                                    </div>
									<button className="sb-btn" type="button" onClick={handleSubmit}>????????</button>
								</div>
							</div>
                            {modalisOpen ?
								<Modal
									text='??????/?? ????'
									
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
