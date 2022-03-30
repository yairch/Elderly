import {Gender} from './gender'

// FIXME: what types should each field be?
interface Volunteer {
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    areasOfInterest: string; //arr?
    languages: string; //arr?
    services: string; //arr?
    preferredDaysAndHours: string;
    digitalDevices: string; //arr?
    phoneNumber: string;
    organizationName: string;
    additionalInformation: string;
};

module.exports = module