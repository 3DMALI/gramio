import type { Context, ContextType, MaybeArray, UpdateName } from "@gramio/contexts";
import type { APIMethods } from "@gramio/types";
import type { Bot } from "./bot";
import { Composer } from "./composer";
import type { AnyBot, DeriveDefinitions, ErrorDefinitions, Handler, Hooks } from "./types";
/**
 * `Plugin` is an object  from which you can extends in Bot instance and adopt types
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
export declare class Plugin<Errors extends ErrorDefinitions = {}, Derives extends DeriveDefinitions = DeriveDefinitions> {
    /**
     * 	@internal
     * 	Set of Plugin data
     *
     *
     */
    _: {
        /** Name of plugin */
        name: string;
        /** List of plugin dependencies. If user does't extend from listed there dependencies it throw a error */
        dependencies: string[];
        /** remap generic type. {} in runtime */
        Errors: Errors;
        /** remap generic type. {} in runtime */
        Derives: Derives;
        /**	Composer */
        composer: Composer;
        /** Store plugin preRequests hooks */
        preRequests: [Hooks.PreRequest<any>, MaybeArray<keyof APIMethods> | undefined][];
        /** Store plugin onResponses hooks */
        onResponses: [Hooks.OnResponse<any>, MaybeArray<keyof APIMethods> | undefined][];
        /** Store plugin onResponseErrors hooks */
        onResponseErrors: [Hooks.OnResponseError<any>, MaybeArray<keyof APIMethods> | undefined][];
        /**
         * Store plugin groups
         *
         * If you use `on` or `use` in group and on plugin-level groups handlers are registered after plugin-level handlers
         *  */
        groups: ((bot: AnyBot) => AnyBot)[];
        /** Store plugin onStarts hooks */
        onStarts: Hooks.OnStart[];
        /** Store plugin onStops hooks */
        onStops: Hooks.OnStop[];
        /** Store plugin onErrors hooks */
        onErrors: Hooks.OnError<any, any>[];
        /** Map of plugin errors */
        errorsDefinitions: Record<string, {
            new (...args: any): any;
            prototype: Error;
        }>;
        decorators: Record<string, unknown>;
    };
    /** Create new Plugin. Please provide `name` */
    constructor(name: string, { dependencies }?: {
        dependencies?: string[];
    });
    /** Currently not isolated!!!
     *
     * > [!WARNING]
     * > If you use `on` or `use` in a `group` and at the plugin level, the group handlers are registered **after** the handlers at the plugin level
     */
    group(grouped: (bot: Bot<Errors, Derives>) => AnyBot): this;
    /**
     * Register custom class-error in plugin
     **/
    error<Name extends string, NewError extends {
        new (...args: any): any;
        prototype: Error;
    }>(kind: Name, error: NewError): Plugin<Errors & { [name in Name]: InstanceType<NewError>; }, Derives>;
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
    derive<Handler extends Hooks.Derive<Context<AnyBot>>>(handler: Handler): Plugin<Errors, Derives & {
        global: Awaited<ReturnType<Handler>>;
    }>;
    derive<Update extends UpdateName, Handler extends Hooks.Derive<ContextType<AnyBot, Update>>>(updateName: MaybeArray<Update>, handler: Handler): Plugin<Errors, Derives & {
        [K in Update]: Awaited<ReturnType<Handler>>;
    }>;
    decorate<Value extends Record<string, any>>(value: Value): Plugin<Errors, Derives & {
        global: {
            [K in keyof Value]: Value[K];
        };
    }>;
    decorate<Name extends string, Value>(name: Name, value: Value): Plugin<Errors, Derives & {
        global: {
            [K in Name]: Value;
        };
    }>;
    /** Register handler to one or many Updates */
    on<T extends UpdateName>(updateName: MaybeArray<T>, handler: Handler<ContextType<AnyBot, T> & Derives["global"] & Derives[T]>): this;
    /** Register handler to any Updates */
    use(handler: Handler<Context<AnyBot> & Derives["global"]>): this;
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
     * Set error handler.
     * @example
     * ```ts
     * bot.onError("message", ({ context, kind, error }) => {
     * 	return context.send(`${kind}: ${error.message}`);
     * })
     * ```
     */
    onError<T extends UpdateName>(updateName: MaybeArray<T>, handler: Hooks.OnError<Errors, ContextType<Bot, T> & Derives["global"] & Derives[T]>): this;
    onError(handler: Hooks.OnError<Errors, Context<AnyBot> & Derives["global"]>): this;
}
