import {Gender} from './gender'

export interface Volunteer {
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    areasOfInterest: string[];
    languages: string[];
    services: string[]; 
    preferredDaysAndHours: string[];
    digitalDevices: string[];
    phoneNumber: string;
    organizationName: string;
    additionalInformation: string;
};