"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramError = exports.ErrorKind = void 0;
/** Symbol to determine which error kind is it */
exports.ErrorKind = Symbol("ErrorKind");
/** Represent {@link TelegramAPIResponseError} and thrown in API calls */
class TelegramError extends Error {
    /** Name of the API Method */
    method;
    /** Params that were sent */
    params;
    /** See  {@link TelegramAPIResponseError.error_code}*/
    code;
    /** Describes why a request was unsuccessful. */
    payload;
    /** Construct new TelegramError */
    constructor(error, method, params) {
        super(error.description);
        this.name = method;
        this.method = method;
        this.params = params;
        this.code = error.error_code;
        if (error.parameters)
            this.payload = error.parameters;
    }
}
exports.TelegramError = TelegramError;
//@ts-expect-error
TelegramError.constructor[exports.ErrorKind] = "TELEGRAM";
