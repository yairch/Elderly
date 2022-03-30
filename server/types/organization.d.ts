export const enum OrganizationType {
    Elderly = 'elderly',
    Volunteer = 'volunteer',
    Both = 'both'
}

export interface Organization {
    name: string;
    englishName: string;
    type: OrganizationType;
    phoneNumber: string;
};