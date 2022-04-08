import { Gender } from './gender';
import {GenderToMeet} from './genderToMeet'

// FIXME: what types should each field be?
export interface Elderly {
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    phoneNumber: string;
    areasOfInterest: string[];
    languages: string[];
    organizationName: string;
    wantedServices: string[];
    genderToMeetWith: GenderToMeet;
    preferredDaysAndHours: string[];
    digitalDevices: string[];
    additionalInformation: string;
    contactName: string;
    kinship: string; //must? not sure who register them
    contactPhoneNumber: string;
    contactEmail: string; //delete
};




