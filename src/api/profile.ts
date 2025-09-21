import { Session } from "~/models";
import { Profile } from "~/models/profile";
import { decodeProfile } from "~/decoders/profile";
import { Request } from "~/core/request";
import { parse } from "node-html-parser";

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
        // On parse le HTML en DOM-like object
        const root = parse(text);

        // decodeProfile prend le HTML root ou directement le string (selon ta version)
        // Passe le texte brut si decodeProfile attend un HTMLElement du navigateur
        //@ts-ignore
        return decodeProfile(root);
    } catch (error) {
        throw new Error(`Failed to parse the profile: ${error}`);
    }
};
