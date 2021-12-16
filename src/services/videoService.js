import AgoraRTC from 'agora-rtc-sdk-ng';

// const liveClient = AgoraRTC.createClient({mode: 'live', codec: 'vp8'});
const rtc = {
	// For the local client.
	client: null,
	// For the local audio and video tracks.
	localAudioTrack: null,
	localVideoTrack: null
};

const options = {
	appId: 'ba380425fc1d472d8a19ae63415672a3',
	// Set the channel name.
	channel: 'nadavziv',
	// Pass a token if your project enables the App Certificate.
	token: '006ba380425fc1d472d8a19ae63415672a3IADt0CH/41eTRNLKzhNOvS4s9+Npxiv7C6xj/zyoOtUnNCEv3qAAAAAAEADqgOQ9NzhLYAEAAQA2OEtg'
};

const startCall = async () => {
	rtc.client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
	const uid = await rtc.client.join(options.appId, options.channel, options.token, null);
	console.log(uid);
	// Create an audio track from the audio sampled by a microphone.
	rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
	// Create a video track from the video captured by a camera.
	rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
	// Publish the local audio and video tracks to the channel.
	await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

	console.log('publish success!');

	rtc.client.on('user-unpublished', user => {
		// Get the dynamically created DIV container.
		const playerContainer = document.getElementById(user.uid);
		// Destroy the container.
		playerContainer.remove();
	});
};

const leaveCall = async () => {
	// Destroy the local audio and video tracks.
	rtc.localAudioTrack.close();
	rtc.localVideoTrack.close();

	// Traverse all remote users.
	rtc.client.remoteUsers.forEach(user => {
		// Destroy the dynamically created DIV container.
		const playerContainer = document.getElementById(user.uid);
		playerContainer && playerContainer.remove();
	});

	// Leave the channel.
	await rtc.client.leave();
};

// rtc.client.on('user-published', async (user, mediaType) => {
// 	// Subscribe to a remote user.
// 	await rtc.client.subscribe(user, mediaType);
// 	console.log('subscribe success');
//
// 	// If the subscribed track is video.
// 	if (mediaType === 'video') {
// 		// Get `RemoteVideoTrack` in the `user` object.
// 		const remoteVideoTrack = user.videoTrack;
// 		// Dynamically create a container in the form of a DIV element for playing the remote video track.
// 		const playerContainer = document.createElement('div');
// 		// Specify the ID of the DIV container. You can use the `uid` of the remote user.
// 		playerContainer.id = user.uid.toString();
// 		playerContainer.style.width = '640px';
// 		playerContainer.style.height = '480px';
// 		document.body.append(playerContainer);
//
// 		// Play the remote video track.
// 		// Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
// 		remoteVideoTrack.play(playerContainer);
//
// 		// Or just pass the ID of the DIV container.
// 		// remoteVideoTrack.play(playerContainer.id);
// 	}
//
// 	// If the subscribed track is audio.
// 	if (mediaType === 'audio') {
// 		// Get `RemoteAudioTrack` in the `user` object.
// 		const remoteAudioTrack = user.audioTrack;
// 		// Play the audio track. No need to pass any DOM element.
// 		remoteAudioTrack.play();
// 	}
// });

export {
	startCall,
	leaveCall
};