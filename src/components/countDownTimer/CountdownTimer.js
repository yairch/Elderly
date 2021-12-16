import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './countDownTimer.css';

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
	isPlaying: true,
	size: 120,
	strokeWidth: 6
};

const renderTime = (dimension, time) => {
	return (
		<div className="time-wrapper">
			<div className="time">{time}</div>
			<div>{dimension}</div>
		</div>
	);
};

const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const CountdownTimer = ({dateToCountDownTo}) => {
	console.log(dateToCountDownTo.getTime());
	console.log(Date.now());
	const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
	const endTime = dateToCountDownTo / 1000; // use UNIX timestamp in seconds

	const remainingTime = endTime - startTime;
	const days = Math.ceil(remainingTime / daySeconds);
	const daysDuration = days * daySeconds;

	return (
		<div className="timers">
			<CountdownCircleTimer
				{...timerProps}
				colors={[['#76b2f3']]}
				duration={hourSeconds}
				initialRemainingTime={remainingTime % hourSeconds}
				onComplete={(totalElapsedTime) => [
					remainingTime - totalElapsedTime > minuteSeconds
				]}
			>
				{({elapsedTime}) =>
					renderTime('דקות', getTimeMinutes(hourSeconds - elapsedTime))
				}
			</CountdownCircleTimer>
			<CountdownCircleTimer
				{...timerProps}
				colors={[['#457b9d']]}
				duration={daySeconds}
				initialRemainingTime={remainingTime % daySeconds}
				onComplete={(totalElapsedTime) => [
					remainingTime - totalElapsedTime > hourSeconds
				]}
			>
				{({elapsedTime}) =>
					renderTime('שעות', getTimeHours(daySeconds - elapsedTime))
				}
			</CountdownCircleTimer>
			<CountdownCircleTimer
				{...timerProps}
				colors={[['#1d3557']]}
				duration={daysDuration}
				initialRemainingTime={remainingTime}
			>
				{({elapsedTime}) =>
					renderTime('ימים', getTimeDays(daysDuration - elapsedTime))
				}
			</CountdownCircleTimer>
		</div>
	);
};

export default CountdownTimer;
