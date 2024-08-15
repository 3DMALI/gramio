import { type Context } from "@gramio/contexts";
import type { APIMethodParams, TelegramUpdate } from "@gramio/types";
import type { CaughtMiddlewareHandler } from "middleware-io";
import { Composer } from "./composer";
import type { AnyBot } from "./types";
export declare class Updates {
    private readonly bot;
    isStarted: boolean;
    private offset;
    composer: Composer;
    constructor(bot: AnyBot, onError: CaughtMiddlewareHandler<Context<any>>);
    handleUpdate(data: TelegramUpdate): Promise<void>;
    /** @deprecated use bot.start instead @internal */
    startPolling(params?: APIMethodParams<"getUpdates">): Promise<void>;
    startFetchLoop(params?: APIMethodParams<"getUpdates">): Promise<void>;
    stopPolling(): void;
}
