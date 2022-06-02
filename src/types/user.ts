
export const enum UserRole {
    Admin = 'admin',
    Elderly = 'elderly',
    Responsible = 'responsible',
    Volunteer = 'volunteer',
    Researcher='researcher'
}

export interface User {
    username: string;
    password: string;
    role: UserRole;
    organization: string;
};

