import { CallbackData } from "@gramio/callback-data";
import { type Attachment, type Context, type ContextType, type MaybeArray, type UpdateName } from "@gramio/contexts";
import type { APIMethodParams, APIMethods, SetMyCommandsParams, TelegramBotCommand, TelegramReactionTypeEmojiEmoji, TelegramUser } from "@gramio/types";
import type { AnyBot, AnyPlugin, BotOptions, DeriveDefinitions, ErrorDefinitions, Handler, Hooks, MaybePromise, SuppressedAPIMethods } from "./types";
import { Updates } from "./updates";
/** Bot instance
 *
 * @example
 * ```ts
 * import { Bot } from "gramio";
 *
 * const bot = new Bot("") // put you token here
 *     .command("start", (context) => context.send("Hi!"))
 *     .onStart(console.log);
 *
 * bot.start();
 * ```
 */
export declare class Bot<Errors extends ErrorDefinitions = {}, Derives extends DeriveDefinitions = DeriveDefinitions> {
    _: {
        /** @internal. Remap generic */
        derives: Derives;
    };
    /** @internal. Remap generic */
    __Derives: Derives;
    private filters;
    /** Options provided to instance */
    readonly options: BotOptions;
    /** Bot data (filled in when calling bot.init/bot.start) */
    info: TelegramUser | undefined;
    /**
     * Send API Request to Telegram Bot API
     *
     * @example
     * ```ts
     * const response = await bot.api.sendMessage({
     *     chat_id: "@gramio_forum",
     *     text: "some text",
     * });
     * ```
     *
     * [Documentation](https://gramio.dev/bot-api.html)
     */
    readonly api: SuppressedAPIMethods;
    private lazyloadPlugins;
    private dependencies;
    private errorsDefinitions;
    private errorHandler;
    /** This instance handle updates */
    updates: Updates;
    private hooks;
    constructor(token: string, options?: Omit<BotOptions, "token" | "api"> & {
        api?: Partial<BotOptions["api"]>;
    });
    constructor(options: Omit<BotOptions, "api"> & {
        api?: Partial<BotOptions["api"]>;
    });
    private runHooks;
    private runImmutableHooks;
    private _callApi;
    /**
     * Download file
     *
     * @example
     * ```ts
     * bot.on("message", async (context) => {
     *     if (!context.document) return;
     *     // download to ./file-name
     *     await context.download(context.document.fileName || "file-name");
     *     // get ArrayBuffer
     *     const buffer = await context.download();
     *
     *     return context.send("Thank you!");
     * });
     * ```
     * [Documentation](https://gramio.dev/files/download.html)
     */
    downloadFile(attachment: Attachment | {
        file_id: string;
    } | string): Promise<ArrayBuffer>;
    downloadFile(attachment: Attachment | {
        file_id: string;
    } | string, path: string): Promise<string>;
    /**
     * Register custom class-error for type-safe catch in `onError` hook
     *
     * @example
     * ```ts
     * export class NoRights extends Error {
     *     needRole: "admin" | "moderator";
     *
     *     constructor(role: "admin" | "moderator") {
     *         super();
     *         this.needRole = role;
     *     }
     * }
     *
     * const bot = new Bot(process.env.TOKEN!)
     *     .error("NO_RIGHTS", NoRights)
     *     .onError(({ context, kind, error }) => {
     *         if (context.is("message") && kind === "NO_RIGHTS")
     *             return context.send(
     *                 format`You don't have enough rights! You need to have an «${bold(
     *                     error.needRole
     *                 )}» role.`
     *             );
     *     });
     *
     * bot.updates.on("message", (context) => {
     *     if (context.text === "bun") throw new NoRights("admin");
     * });
     * ```
     */
    error<Name extends string, NewError extends {
        new (...args: any): any;
        prototype: Error;
    }>(kind: Name, error: NewError): Bot<Errors & { [name in Name]: InstanceType<NewError>; }, Derives>;
    /**
     * Set error handler.
     * @example
     * ```ts
     * bot.onError("message", ({ context, kind, error }) => {
     * 	return context.send(`${kind}: ${error.message}`);
     * })
     * ```
     */
    onError<T extends UpdateName>(updateName: MaybeArray<T>, handler: Hooks.OnError<Errors, ContextType<typeof this, T> & Derives["global"] & Derives[T]>): this;
    onError(handler: Hooks.OnError<Errors, Context<typeof this> & Derives["global"]>): this;
    /**
     * Derive some data to handlers
     *
     * @example
     * ```ts
     * new Bot("token").derive((context) => {
     * 		return {
     * 			superSend: () => context.send("Derived method")
     * 		}
     * })
     * ```
     */
    derive<Handler extends Hooks.Derive<Context<typeof this>>>(handler: Handler): Bot<Errors, Derives & {
        global: Awaited<ReturnType<Handler>>;
    }>;
    derive<Update extends UpdateName, Handler extends Hooks.Derive<ContextType<typeof this, Update>>>(updateName: MaybeArray<Update>, handler: Handler): Bot<Errors, Derives & {
        [K in Update]: Awaited<ReturnType<Handler>>;
    }>;
    decorate<Value extends Record<string, any>>(value: Value): Bot<Errors, Derives & {
        global: {
            [K in keyof Value]: Value[K];
        };
    }>;
    decorate<Name extends string, Value>(name: Name, value: Value): Bot<Errors, Derives & {
        global: {
            [K in Name]: Value;
        };
    }>;
    /**
     * This hook called when the bot is `started`.
     *
     * @example
     * ```typescript
     * import { Bot } from "gramio";
     *
     * const bot = new Bot(process.env.TOKEN!).onStart(
     *     ({ plugins, info, updatesFrom }) => {
     *         console.log(`plugin list - ${plugins.join(", ")}`);
     *         console.log(`bot username is @${info.username}`);
     * 		   console.log(`updates from ${updatesFrom}`);
     *     }
     * );
     *
     * bot.start();
     * ```
     *
     * [Documentation](https://gramio.dev/hooks/on-start.html)
     *  */
    onStart(handler: Hooks.OnStart): this;
    /**
     * This hook called when the bot stops.
     *
     * @example
     * ```typescript
     * import { Bot } from "gramio";
     *
     * const bot = new Bot(process.env.TOKEN!).onStop(
     *     ({ plugins, info, updatesFrom }) => {
     *         console.log(`plugin list - ${plugins.join(", ")}`);
     *         console.log(`bot username is @${info.username}`);
     *     }
     * );
     *
     * bot.start();
     * bot.stop();
     * ```
     *
     * [Documentation](https://gramio.dev/hooks/on-stop.html)
     *  */
    onStop(handler: Hooks.OnStop): this;
    /**
     * This hook called before sending a request to Telegram Bot API (allows us to impact the sent parameters).
     *
     * @example
     * ```typescript
     * import { Bot } from "gramio";
     *
     * const bot = new Bot(process.env.TOKEN!).preRequest((context) => {
     *     if (context.method === "sendMessage") {
     *         context.params.text = "mutate params";
     *     }
     *
     *     return context;
     * });
     *
     * bot.start();
     * ```
     *
     * [Documentation](https://gramio.dev/hooks/pre-request.html)
     *  */
    preRequest<Methods extends keyof APIMethods, Handler extends Hooks.PreRequest<Methods>>(methods: MaybeArray<Methods>, handler: Handler): this;
    preRequest(handler: Hooks.PreRequest): this;
    /**
     * This hook called when API return successful response
     *
     * [Documentation](https://gramio.dev/hooks/on-response.html)
     * */
    onResponse<Methods extends keyof APIMethods, Handler extends Hooks.OnResponse<Methods>>(methods: MaybeArray<Methods>, handler: Handler): this;
    onResponse(handler: Hooks.OnResponse): this;
    /**
     * This hook called when API return an error
     *
     * [Documentation](https://gramio.dev/hooks/on-response-error.html)
     * */
    onResponseError<Methods extends keyof APIMethods, Handler extends Hooks.OnResponseError<Methods>>(methods: MaybeArray<Methods>, handler: Handler): this;
    onResponseError(handler: Hooks.OnResponseError): this;
    /** Register handler to one or many Updates */
    on<T extends UpdateName>(updateName: MaybeArray<T>, handler: Handler<ContextType<typeof this, T> & Derives["global"] & Derives[T]>): this;
    /** Register handler to any Updates */
    use(handler: Handler<Context<typeof this> & Derives["global"]>): this;
    /**
     * Extend {@link Plugin} logic and types
     *
     * @example
     * ```ts
     * import { Plugin, Bot } from "gramio";
     *
     * export class PluginError extends Error {
     *     wow: "type" | "safe" = "type";
     * }
     *
     * const plugin = new Plugin("gramio-example")
     *     .error("PLUGIN", PluginError)
     *     .derive(() => {
     *         return {
     *             some: ["derived", "props"] as const,
     *         };
     *     });
     *
     * const bot = new Bot(process.env.TOKEN!)
     *     .extend(plugin)
     *     .onError(({ context, kind, error }) => {
     *         if (context.is("message") && kind === "PLUGIN") {
     *             console.log(error.wow);
     *         }
     *     })
     *     .use((context) => {
     *         console.log(context.some);
     *     });
     * ```
     */
    extend<NewPlugin extends AnyPlugin>(plugin: MaybePromise<NewPlugin>): Bot<Errors & NewPlugin["_"]["Errors"], Derives & NewPlugin["_"]["Derives"]>;
    /**
     * Register handler to reaction (`message_reaction` update)
     *
     * @example
     * ```ts
     * new Bot().reaction("👍", async (context) => {
     *     await context.reply(`Thank you!`);
     * });
     * ```
     * */
    reaction(trigger: MaybeArray<TelegramReactionTypeEmojiEmoji>, handler: (context: ContextType<typeof this, "message_reaction"> & Derives["global"] & Derives["message_reaction"]) => unknown): this;
    /**
     * Register handler to `callback_query` event
     *
     * @example
     * ```ts
     * const someData = new CallbackData("example").number("id");
     *
     * new Bot()
     *     .command("start", (context) =>
     *         context.send("some", {
     *             reply_markup: new InlineKeyboard().text(
     *                 "example",
     *                 someData.pack({
     *                     id: 1,
     *                 })
     *             ),
     *         })
     *     )
     *     .callbackQuery(someData, (context) => {
     *         context.queryData; // is type-safe
     *     });
     * ```
     */
    callbackQuery<Trigger extends CallbackData | string | RegExp>(trigger: Trigger, handler: (context: Omit<ContextType<typeof this, "callback_query">, "data"> & Derives["global"] & Derives["callback_query"] & {
        queryData: Trigger extends CallbackData ? ReturnType<Trigger["unpack"]> : RegExpMatchArray | null;
    }) => unknown): this;
    /** Register handler to `chosen_inline_result` update */
    chosenInlineResult<Ctx = ContextType<typeof this, "chosen_inline_result"> & Derives["global"] & Derives["chosen_inline_result"]>(trigger: RegExp | string | ((context: Ctx) => boolean), handler: (context: Ctx & {
        args: RegExpMatchArray | null;
    }) => unknown): this;
    /**
     * Register handler to `inline_query` update
     *
     * @example
     * ```ts
     * new Bot().inlineQuery(
     *     /regular expression with (.*)/i,
     *     async (context) => {
     *         if (context.args) {
     *             await context.answer(
     *                 [
     *                     InlineQueryResult.article(
     *                         "id-1",
     *                         context.args[1],
     *                         InputMessageContent.text("some"),
     *                         {
     *                             reply_markup: new InlineKeyboard().text(
     *                                 "some",
     *                                 "callback-data"
     *                             ),
     *                         }
     *                     ),
     *                 ],
     *                 {
     *                     cache_time: 0,
     *                 }
     *             );
     *         }
     *     },
     *     {
     *         onResult: (context) => context.editText("Message edited!"),
     *     }
     * );
     * ```
     * */
    inlineQuery<Ctx = ContextType<typeof this, "inline_query"> & Derives["global"] & Derives["inline_query"]>(trigger: RegExp | string | ((context: Ctx) => boolean), handler: (context: Ctx & {
        args: RegExpMatchArray | null;
    }) => unknown, options?: {
        onResult?: (context: ContextType<Bot, "chosen_inline_result"> & Derives["global"] & Derives["chosen_inline_result"] & {
            args: RegExpMatchArray | null;
        }) => unknown;
    }): this;
    /**
     * Register handler to `message` and `business_message` event
     *
     * new Bot().hears(/regular expression with (.*)/i, async (context) => {
     *     if (context.args) await context.send(`Params ${context.args[1]}`);
     * });
     */
    hears<Ctx = ContextType<typeof this, "message"> & Derives["global"] & Derives["message"]>(trigger: RegExp | string | ((context: Ctx) => boolean), handler: (context: Ctx & {
        args: RegExpMatchArray | null;
    }) => unknown): this;
    /**
     * Register handler to `message` and `business_message` event when entities contains a command
     *
     * new Bot().command("start", async (context) => {
     *     return context.send(`You message is /start ${context.args}`);
     * });
     */
    command(command: string, handler: (context: ContextType<typeof this, "message"> & Derives["global"] & Derives["message"] & {
        args: string | null;
    }) => unknown, options?: Omit<SetMyCommandsParams, "commands"> & Omit<TelegramBotCommand, "command">): this;
    /** Currently not isolated!!! */
    group(grouped: (bot: typeof this) => AnyBot): typeof this;
    /**
     * Init bot. Call it manually only if you doesn't use {@link Bot.start}
     */
    init(): Promise<void>;
    /**
     * Start receive updates via long-polling or webhook
     *
     * @example
     * ```ts
     * import { Bot } from "gramio";
     *
     * const bot = new Bot("") // put you token here
     *     .command("start", (context) => context.send("Hi!"))
     *     .onStart(console.log);
     *
     * bot.start();
     * ```
     */
    start({ webhook, dropPendingUpdates, allowedUpdates, }?: {
        webhook?: Omit<APIMethodParams<"setWebhook">, "drop_pending_updates" | "allowed_updates">;
        dropPendingUpdates?: boolean;
        allowedUpdates?: NonNullable<APIMethodParams<"getUpdates">>["allowed_updates"];
    }): Promise<TelegramUser | undefined>;
    /**
     * Stops receiving events via long-polling or webhook
     * Currently does not implement graceful shutdown
     * */
    stop(): Promise<void>;
}
