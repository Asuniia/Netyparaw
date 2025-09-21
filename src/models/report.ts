import type { Grade } from "~/models/grades";

export type Report = Readonly<{
    session: ReportSessionDictionary;
    session_list: Array<ReportSessionOption>;
}>;

export type ReportSession = Readonly<{
    average?: number;
    group_average?: number;
    group_average_max?: number;
    group_average_min?: number;
    registration_id: number;
    student_id: number;
    subject_list: Array<ReportSubjectResult>;
    teacher_comment?: string;
}>;

export interface ReportSessionDictionary {
    [Key: number]: ReportSession;
}

export type ReportSessionOption = Readonly<{
    name: string;
    session_code: number;
    session_id: number;
}>;

export type ReportSubjectDetails = Readonly<{
    average?: number;
    grades: Array<Grade>;
    group_average?: number;
    group_average_max?: number;
    group_average_min?: number;
    subject_coefficient: number;
    subject_name: string;
    teacher_comment?: string;
}>;

export type ReportSubjectResult = Readonly<{
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
