import { Elderly } from "./elderly";
import { Volunteer } from "./volunteer";

export interface Match {
    elderly: Elderly;
    volunteerUsername: Volunteer[keyof Pick<Volunteer, 'username'>];
    preferredDay: Elderly[keyof Pick<Elderly, 'preferredDaysAndHours'>];
    finalRank: string;
    commonAreaOfInterest: Elderly[keyof Pick<Elderly, 'areasOfInterest'>];
    commonLanguages: Elderly[keyof Pick<Elderly, 'languages'>];
    commonPreferredDays: Elderly[keyof Pick<Elderly, 'preferredDaysAndHours'>];
    commonServices: Elderly[keyof Pick<Elderly, 'wantedServices'>];
    preferredGender: Elderly[keyof Pick<Elderly, 'genderToMeetWith'>];
}
