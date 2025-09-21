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

type Grade = Readonly<{
    teacher_name: string;
    teacher_initials: string;
    grade_type: string;
    subject_name?: string;
    subject_id?: number;
    date: Date;
    name: string;
    coefficient: number;
    grade?: number;
    absent?: boolean;
    absence_reason?: string;
}>;

type Report = Readonly<{
    session: ReportSessionDictionary;
    session_list: Array<ReportSessionOption>;
}>;
type ReportSession = Readonly<{
    average?: number;
    group_average?: number;
    group_average_max?: number;
    group_average_min?: number;
    registration_id: number;
    student_id: number;
    subject_list: Array<ReportSubjectResult>;
    teacher_comment?: string;
}>;
interface ReportSessionDictionary {
    [Key: number]: ReportSession;
}
type ReportSessionOption = Readonly<{
    name: string;
    session_code: number;
    session_id: number;
}>;
type ReportSubjectDetails = Readonly<{
    average?: number;
    grades: Array<Grade>;
    group_average?: number;
    group_average_max?: number;
    group_average_min?: number;
    subject_coefficient: number;
    subject_name: string;
    teacher_comment?: string;
}>;
type ReportSubjectResult = Readonly<{
    average?: number;
    coefficient: number;
    group_average?: number;
    group_average_max?: number;
    group_average_min?: number;
    registration_id: number;
    student_id: number;
    subject_id: number;
    subject_name: string;
    teacher_comment?: string;
}>;

declare const report: (session: Session) => Promise<Report>;
declare const reportSubjectDetails: (session: Session, subject: ReportSubjectResult, sessionId: number) => Promise<ReportSubjectDetails>;

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

export { type Session, getProfile, loginCookie, loginCredentials, planningFromDay, planningFromWeek, report, reportSubjectDetails };
