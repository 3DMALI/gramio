import type { APIMethods, TelegramAPIResponseError, TelegramResponseParameters } from "@gramio/types";
import type { MaybeSuppressedParams } from "./types";
/** Symbol to determine which error kind is it */
export declare const ErrorKind: symbol;
/** Represent {@link TelegramAPIResponseError} and thrown in API calls */
export declare class TelegramError<T extends keyof APIMethods> extends Error {
    /** Name of the API Method */
    method: T;
    /** Params that were sent */
    params: MaybeSuppressedParams<T>;
    /** See  {@link TelegramAPIResponseError.error_code}*/
    code: number;
    /** Describes why a request was unsuccessful. */
    payload?: TelegramResponseParameters;
    /** Construct new TelegramError */
    constructor(error: TelegramAPIResponseError, method: T, params: MaybeSuppressedParams<T>);
}
