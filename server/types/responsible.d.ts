import {Gender} from './gender'

export const enum ResponsibleType {
    Elderly = 'elderly',
    Volunteer = 'volunteer',
    Both = 'both'
}

export interface Responsible {
    username: string; //Number?
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender; 
    organizationName: string; //create enum?
    responsibleType: ResponsibleType;
};

