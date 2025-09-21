import { Session } from "~/models";
import { Profile } from "~/models/profile";
import { decodeProfile } from "~/decoders/profile";
import * as cheerio from "cheerio";
import { Request } from "~/core/request";

export const getProfile = async (session: Session): Promise<Profile> => {
    if (!session.id) throw new Error("Session cookie is not defined ! You must login first.");
    if (!session.baseURL) throw new Error("Base URL is not defined ! You must login first.");

    const req = new Request(session.baseURL, "/apprenant/details");
    req.setSession(session);

    console.log("reqqq", req);

    const res = await req.send();

    console.log("status", res.status);

    if (res.status !== 200) {
        throw new Error("Failed to fetch profile: The session has expired");
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = buffer.toString("latin1");

    try {
        const $profile_response = cheerio.load(text);
        return decodeProfile($profile_response);
    } catch (error) {
        throw new Error(`Failed to parse the profile: ${error}`);
    }
};
