export type OrganizationType = 'elderly' | 'volunteer' | 'both';

export interface Organization {
    name: string;
    englishName: string;
    type: OrganizationType;
    phoneNumber: string;
};