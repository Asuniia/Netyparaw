import type { Session } from "~/models";
import { Request } from "~/core/request";
import { decodePlanningDay } from "~/decoders/planning-day";
import { regex } from "~/const/regex";
import { PlanningDay } from "~/models/planning-day";
import { decodePlanningWeek } from "~/decoders/planning-week";

export const planningFromDay = async (session: Session, date: Date): Promise<PlanningDay> => {
    if (!session.id) throw new Error("Session cookie is not defined ! You must login first.");
    if (!session.baseURL) throw new Error("Base URL is not defined ! You must login first.");

    const isoDate = date.toISOString().split("T")[0];
    const dateUrl = isoDate.split("-").reverse().join("/");

    const planningRequest = new Request(session.baseURL, `/planning/jour/ajax/${dateUrl}`);
    planningRequest.setSession(session);
    const planningResponse = await planningRequest.send();

    if (planningResponse.status !== 200) {
        throw new Error("Failed to fetch planning: The session has expired");
    }

    try {
        const text = await planningResponse.text();
        const planning = JSON.parse(text);
        return decodePlanningDay(planning);
    } catch (error) {
        throw new Error(`Failed to parse the planning: ${error}`);
    }
};

export const planningFromWeek = async (session: Session, years: string, weekNumber: string) => {
    if (!session.id) throw new Error("Session cookie is not defined ! You must login first.");
    if (!session.baseURL) throw new Error("Base URL is not defined ! You must login first.");

    const planningRequest = new Request(session.baseURL, `/apprenant/planning/courant/?semaineDebut=${years}${weekNumber}`);
    planningRequest.setSession(session);
    const planningResponse = await planningRequest.send();

    if (planningResponse.status !== 200) {
        throw new Error("Failed to fetch timetable: The session has expired");
    }

    try {
        const text = await planningResponse.text();
        const studentTimetableMatch = text.match(regex.student_timetable);
        if (!studentTimetableMatch) throw new Error("Failed to get student timetable");

        const planning = JSON.parse(studentTimetableMatch[1]);
        console.log("planning", planning);
        return decodePlanningWeek(planning);
    } catch (error) {
        throw new Error(`Failed to parse the planning: ${error}`);
    }
};
