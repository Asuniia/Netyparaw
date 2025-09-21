import * as netypareo from "../src";
import { credentials, secure } from "./_credentials";

void (async function main() {
    const session = await netypareo.loginCredentials(credentials.baseURL!, credentials.username!, credentials.password!, credentials.cookieName);
    // you're now authenticated with the session !
    console.log("You're authenticated with the session", secure(session.id));

    // Get the profile
    const profile = await netypareo.getProfile(session);
    console.log("Profile:", profile);
})();
