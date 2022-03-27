export type UserRole = 'admin' | ' elderly' | ' responsible' | 'volunteer';
export interface User {
    username: string;
    password: string;
    role: UserRole;
    organization: string;
};