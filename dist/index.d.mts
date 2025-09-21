type Session = Readonly<{
    /**
     * Content of session cookie.
     */
    id: string;
    /**
     * Base URL of the YPareo instance.
     */
    baseURL: string;
    /**
     * ID of the server, used to identify the instance.
     */
    serverId: string;
    /**
     * Name of the session cookie.
     */
    cookieName: string;
}>;

declare const loginCredentials: (baseURL: string, username: string, password: string, cookieName?: string) => Promise<Session>;
declare const loginCookie: (baseURL: string, cookie: string, serverId: string) => Promise<Session>;

type PlanningIcon = Readonly<{
    web_class: string;
    text: string;
}>;

type PlanningItem = Readonly<{
    id: number;
    type: number;
    color: string;
    name: string;
    start: Date;
    end: Date;
    duration: number;
    details: ReadonlyArray<string>;
    icon: ReadonlyArray<PlanningIcon>;
    subject_id: number;
    subject_coefficient: number;
    subject_groups: ReadonlyArray<number>;
}>;

type PlanningDay = Readonly<{
    day_start_in_minutes: number;
    day_end_in_minutes: number;
    day_number: number;
    week_id: number;
    week_start: Date;
    week_text: string;
    slots: ReadonlyArray<PlanningItem>;
}>;

declare const planningFromDay: (session: Session, date: Date) => Promise<PlanningDay>;
declare const planningFromWeek: (session: Session, years: string, weekNumber: string) => Promise<Readonly<{
    week_id: number;
    week_start: Date;
    week_text: string;
    slots: ReadonlyArray<PlanningItem>;
}>>;

type Profile = Readonly<{
    /**
     * First name of the profile.
     */
    firstName: string;
    /**
     * Last name of the profile.
     */
    lastName: string;
    /**
     * Full name of the profile.
     */
    fullName: string;
    /**
     * Email address of the profile.
     */
    email: string;
    /**
     * Phone number of the profile.
     */
    phone: string;
    /**
     * Address of the profile.
     */
    address: string;
    /**
     * Postal code of the profile.
     */
    postalCode: string;
    /**
     * City of the profile.
     */
    city: string;
    /**
     * Country of the profile.
     */
    country: string;
    /**
     * Gender of the profile.
     */
    gender: "M" | "F" | "O";
    /**
     * Date of birth of the profile.
     */
    dateOfBirth: string;
    /**
     * Class Name of the profile.
     */
    className: string;
    /**
     * Group Name of the profile.
     */
    groupName: string;
    /**
     * Current school cycle of the profile.
     */
    currentSchoolCycle: string | null;
}>;

declare const getProfile: (session: Session) => Promise<Profile>;

export { type Session, getProfile, loginCookie, loginCredentials, planningFromDay, planningFromWeek };
