export type Session = Readonly<{
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
