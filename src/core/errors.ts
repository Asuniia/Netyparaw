export class NetYPareoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppSchoError";
    }
}

export class InternalServerError extends NetYPareoError {
    constructor() {
        super("Internal server error, please try again later");
        this.name = "InternalServerError";
    }
}

export class NoPlanningSubscriptionError extends NetYPareoError {
    constructor() {
        super("Your account does not have a planning subscription, please check your intranet");
        this.name = "NoPlanningSubscriptionError";
    }
}

export class NotFoundError extends NetYPareoError {
    constructor() {
        super("Not found, your instance probably doesn't have this feature");
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError extends NetYPareoError {
    constructor() {
        super("Unauthorized, please check your credentials or token");
        this.name = "UnauthorizedError";
    }
}
