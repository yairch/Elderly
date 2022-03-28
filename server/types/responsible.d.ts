import {Gender} from './gender'
type ResponsibleType = 'elderly' | 'volunteer' | 'both';

interface Responsible {
    username: string; //Number?
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender; 
    organizationName: string; //create enum?
    responsibleType: ResponsibleType;
};

module.exports = module
