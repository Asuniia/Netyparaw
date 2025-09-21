import { Request } from "~/core/request";
import type { Session } from "~/models";
import { regex } from "~/const/regex";
import parse from "node-html-parser";

function parseCookies(headers: Headers): string[] {
    const raw = headers.get("set-cookie");
    if (!raw) return [];

    const cookiePattern = /(?:[^,]+?=[^;]+(?:;[^,]*)*)(?=, |$)/g;

    return raw.match(cookiePattern)?.map((s) => s.trim()) || [];
}

export const loginCredentials = async (baseURL: string, username: string, password: string, cookieName: string = "NYSESSID"): Promise<Session> => {
    const checkRequest = new Request(baseURL, "/");
    const checkResponse = await checkRequest.send();
    const checkResponseContent = await checkResponse.text();

    if (checkResponse.status !== 302) {
        if (!regex.check_instance_netypareo.test(checkResponseContent)) {
            throw new Error("Failed to verify instance. Not a valid NetYPareo instance netypareo");
        }
        if (!regex.check_instance_ymag.test(checkResponseContent)) {
            throw new Error("Failed to verify instance. Not a valid NetYPareo instance ymag");
        }
    }

    const instanceURL = checkResponse.headers.get("location") || "";

    const tokenRequest = new Request(baseURL, `/${instanceURL}/login/`);
    const tokenResponse = await tokenRequest.send();
    const cookies = parseCookies(tokenResponse.headers);

    const tokenCookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
    if (!tokenCookie) throw new Error("Failed to get CSRF token cookie");

    let serverIdCookie = cookies.find((c) => c.startsWith("SERVERID=")) ?? "SERVERID=local";
    console.log("Server ID cookie:", serverIdCookie);

    if (serverIdCookie === undefined) throw new Error("Failed to get SERVERID cookie");

    const tokenResponseContent = await tokenResponse.text();

    console.log(tokenResponseContent);

    const tokenCsrfMatch = tokenResponseContent.match(regex.login_token_csrf);
    if (!tokenCsrfMatch) throw new Error("Failed to get CSRF token");
    const tokenCsrf = tokenCsrfMatch[1];

    const root = parse(tokenResponseContent);
    const formUrl = root.querySelector("form")?.getAttribute("action");
    if (!formUrl) throw new Error("Failed to get form URL");

    const form = new URLSearchParams();
    form.append("login", username);
    form.append("password", password);
    form.append("screenWidth", "1680");
    form.append("screenHeight", "1050");
    form.append("token_csrf", tokenCsrf);
    form.append("btnSeConnecter", "Se%20connecter");

    const loginRequest = new Request(baseURL.endsWith("index.php") ? baseURL.slice(0, -10) : baseURL, `/${formUrl}`);
    loginRequest.setFormData(form.toString());
    loginRequest["headers"].set("Cookie", `${tokenCookie}; ${serverIdCookie}`);

    const loginResponse = await loginRequest.send();
    const loginResponseCookies = parseCookies(loginResponse.headers);

    if (![200, 303].includes(loginResponse.status)) {
        throw new Error("Failed to login: Server respond with " + loginResponse.status);
    }

    if (loginResponse.status === 303 && loginResponse.headers.get("location")?.includes("8")) {
        throw new Error("Failed to login: Connection refused.");
    }
    if (loginResponse.status === 303 && !loginResponse.headers.get("location")) {
        throw new Error("Failed to login: No location header found.");
    }
    if (loginResponse.status === 303 && !loginResponseCookies.find((c) => c.startsWith(`${cookieName}=`))) {
        throw new Error("Failed to login: No session cookie found.");
    }
    if (loginResponse.status === 303 && loginResponse.headers.get("location")?.includes("2")) {
        throw new Error("Failed to login: Invalid credentials.");
    }
    if (loginResponse.status === 303 && loginResponse.headers.get("location")?.includes("4")) {
        throw new Error("Failed to login: Account locked or not activated.");
    }

    const session: Session = {
        id: loginResponseCookies
            .find((c) => c.startsWith(`${cookieName}=`))!
            .split("=")[1]
            .split(";")[0],
        baseURL: `${baseURL}${instanceURL ? instanceURL.split(".")[1] + ".php" : ""}`,
        serverId: serverIdCookie.split("=")[1],
        cookieName: tokenCookie.split("=")[0],
    };

    console.log("sess", session);

    return session;
};

//todo
export const loginCookie = async (baseURL: string, cookie: string, serverId: string): Promise<Session> => {
    const checkRequest = new Request(baseURL, "/");
    const checkResponse = await checkRequest.send();
    const checkResponseContent = await checkResponse.text();

    if (checkResponse.status !== 302) {
        if (!regex.check_instance_netypareo.test(checkResponseContent)) {
            throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
        }
        if (!regex.check_instance_ymag.test(checkResponseContent)) {
            throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
        }
    }

    const instanceURL = checkResponse.headers.get("location") || "";

    const session: Session = {
        id: cookie,
        baseURL: `${baseURL}${instanceURL ? instanceURL.split(".")[1] + ".php" : ""}`,
        serverId,
        cookieName: "NYSESSID",
    };

    const checkCookieRequest = new Request(session.baseURL, "/apprenant/accueil");
    checkCookieRequest.setSession(session);
    const checkCookieResponse = await checkCookieRequest.send();

    if (checkCookieResponse.status !== 200) {
        throw new Error("Failed to login: Server respond with " + checkCookieResponse.status);
    }

    return session;
};
