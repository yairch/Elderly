exports.collectionIds = {
    users: 'Users',
    meetings: 'Meetings',
    volunteerUsers: 'Volunteers',
    elderlyUsers: 'Elderlies',
    responsibleUsers: 'ResponsibleUsers',
}

exports.meetingsCollectionFields = {
    volunteerUsername: 'Volunteer Username',
    elderlyUsername: 'Elderly Username',
    meetingDayAndHour: 'Date',
    meetingSubject: 'Meeting Subject',
    channelName: 'Channel Name'
}

exports.organizationsFields = {
    name: 'Name',
    englishName: 'English Name',
    type: 'Type',
    phoneNumber: 'Phone Number',
}

exports.usersFields = {
    username: 'Username',
    password: 'Password',
    role: 'Role',
    organization: 'Organization',
}

exports.responsiblesFields = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    gender: 'Gender',
    organization: 'Organization',
    responsibleType: 'Responsible Type',
}