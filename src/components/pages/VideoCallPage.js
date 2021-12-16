import React from 'react';
import { VideoComponent } from '../video/VideoComponent';

const VideoCallPage = (props) => {
	const videoOptions = props.history.location.state.videoOptions;
	const isElderly = props.history.location.state.isElderly;

	return (
		<div className="no-sidebar-page">
			<VideoComponent videoOptions={videoOptions} isElderly={isElderly} history={props.history}/>
		</div>
	);
}

export default VideoCallPage;