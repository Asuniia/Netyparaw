import type { Session } from "~/models";
import { Request } from "~/core/request";
import * as cheerio from "cheerio";
import { decodeReport, decodeReportDetails } from "~/decoders/report";
import { Report, ReportSubjectDetails, ReportSubjectResult } from "~/models/report";

export const report = async (session: Session): Promise<Report> => {
    if (!session.id) throw new Error("Session cookie is not defined ! You must login first.");
    if (!session.baseURL) throw new Error("Base URL is not defined ! You must login first.");

    const reportRequest = new Request(session.baseURL, `/apprenant/bulletin`);
    reportRequest.setSession(session);
    const reportResponse = await reportRequest.send();

    if (reportResponse.status !== 200) {
        throw new Error("Failed to fetch report: The session has expired");
    }

    const text = await reportResponse.text();
    const $reportResponse = cheerio.load(text);
    return decodeReport($reportResponse);
};

export const reportSubjectDetails = async (session: Session, subject: ReportSubjectResult, sessionId: number): Promise<ReportSubjectDetails> => {
    if (!session.id || !session.baseURL) throw new Error("Session is not valid ! You must login first.");

    const reportRequest = new Request(session.baseURL, `/apprenant/detail-notes/${subject.registration_id}/${subject.subject_id}/${sessionId}`);
    reportRequest.setSession(session);
    const reportResponse = await reportRequest.send();

    if (reportResponse.status !== 200) {
        throw new Error("Failed to fetch subject details: The session has expired");
    }

    const text = await reportResponse.text();
    const $reportResponse = cheerio.load(text);
    return decodeReportDetails($reportResponse);
};
