import type { Session } from "~/models";

export class Request {
    private readonly url: URL;
    private method: string = "GET";
    private headers: Headers;
    private body?: string;
    private redirect: RequestRedirect;

    public constructor(baseURL: string, path: string, redirect: RequestRedirect = "manual") {
        this.url = new URL(baseURL + path);
        this.headers = new Headers();
        this.redirect = redirect;
    }

    public setFormData(data: string): void {
        this.method = "POST";
        this.body = data;
        this.headers.set("Content-Type", "application/x-www-form-urlencoded");
    }

    public setSession(session: Session): void {
        const cookies = [`SERVERID=${session.serverId}`, `${session.cookieName}=${session.id}`];
        this.headers.set("Cookie", cookies.join("; "));
    }

    public async send(): Promise<Response> {
        this.headers.set("Accept-Encoding", "gzip, deflate, br");
        this.headers.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        this.headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");

        return fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: this.body,
            redirect: this.redirect,
        });
    }
}
