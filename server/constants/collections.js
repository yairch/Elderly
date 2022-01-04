exports.collectionIds = {
    users: 'users',
    meetings: 'meetings',
    volunteerUsers: 'volunteerUsers',
    elderlyUsers: 'elderlyUsers'
}

exports.meetingsCollectionFields = {
    volunteerUsername: 'volunteerUsername',
    elderlyUsername: 'elderlyUsername',
    meetingDayAndHour: 'meetingDayAndHour',
    meetingSubject: 'meetingSubject',
    channelName: 'channelName'
}
exports.usersCollectionFields = {
    username: 'username',
    hashes_pass: 'password',
    userRole: 'userRole',
    organizationName: 'organizationName'
}
exports.volunteersCollectionFields = {
    volunteerUsername: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    birthYear: 'birthYear',
    email: 'email',
    city: 'city',
    gender: 'gender',
    phoneNumber: 'phoneNumber',
    organizationName: 'organizationName'
}

exports.elderlyCollectionFields = {
    elderlyUsername: 'elderlyUsername',
    firstName: 'firstName',
    lastName: 'lastName',
    birthYear: 'birthYear',
    email: 'email',
    city: 'city',
    gender: 'gender',
    phoneNumber: 'phoneNumber',
    areasOfInterest: 'areasOfInterest',
    languages: 'languages',
    organizationName: 'organizationName',
    wantedServices: 'wantedServices',
    genderToMeetWith: 'genderToMeetWith',
    preferredDaysAndHours: 'preferredDaysAndHours',
    digitalDevices: 'digitalDevices',
    additionalInformation: 'additionalInformation',
    contactName: 'contactName',
    kinship: 'kinship',
    contactPhoneNumber: 'contactPhoneNumber',
    contactEmail: 'contactEmail'
}