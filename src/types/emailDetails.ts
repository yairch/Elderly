// This type is temporary fix and might be removed in the future after reorganizing types and cleaning televol code

export interface ConfirmationEmailDetails {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    message?: string;
}

export interface MeetingEmailData {
    date: Date;
    elderlyName: string;
    subject: string;
}

export interface MeetingEmailDetails {
    email: string;
    firstName: string;
    lastName: string;
    meeting: MeetingEmailData;
}