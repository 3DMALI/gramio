"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const node_buffer_1 = require("node:buffer");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_fetch_commonjs_1 = __importStar(require("node-fetch-commonjs"));
const callback_data_1 = require("@gramio/callback-data");
const contexts_1 = require("@gramio/contexts");
const files_1 = require("@gramio/files");
const format_1 = require("@gramio/format");
const debug_1 = __importDefault(require("debug"));
const inspectable_1 = require("inspectable");
const errors_1 = require("./errors");
const plugin_1 = require("./plugin");
const updates_1 = require("./updates");
const $debugger = (0, debug_1.default)("gramio");
const debug$api = $debugger.extend("api");
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
let Bot = (() => {
    let _classDecorators = [(0, inspectable_1.Inspectable)({
            serialize: () => ({}),
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Bot = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Bot = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        _ = {
            /** @internal. Remap generic */
            derives: {},
        };
        /** @internal. Remap generic */
        __Derives;
        filters = {
            context: (name) => (context) => context.is(name),
        };
        /** Options provided to instance */
        options;
        /** Bot data (filled in when calling bot.init/bot.start) */
        info;
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
        api = new Proxy({}, {
            get: (_target, method) => 
            // @ts-expect-error
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            (_target[method] ??= (args) => this._callApi(method, args)),
        });
        lazyloadPlugins = [];
        dependencies = [];
        errorsDefinitions = {
            TELEGRAM: errors_1.TelegramError,
        };
        errorHandler(context, error) {
            if (!this.hooks.onError.length)
                throw error;
            return this.runImmutableHooks("onError", {
                context,
                //@ts-expect-error ErrorKind exists if user register error-class with .error("kind", SomeError);
                kind: error.constructor[errors_1.ErrorKind] ?? "UNKNOWN",
                error: error,
            });
        }
        /** This instance handle updates */
        updates = new updates_1.Updates(this, this.errorHandler.bind(this));
        hooks = {
            preRequest: [],
            onResponse: [],
            onResponseError: [],
            onError: [],
            onStart: [],
            onStop: [],
        };
        constructor(tokenOrOptions, options) {
            const token = typeof tokenOrOptions === "string"
                ? tokenOrOptions
                : tokenOrOptions?.token;
            if (!token || typeof token !== "string")
                throw new Error(`Token is ${typeof token} but it should be a string!`);
            this.options = {
                ...(typeof tokenOrOptions === "object" ? tokenOrOptions : options),
                token,
                api: {
                    baseURL: "https://api.telegram.org/bot",
                    retryGetUpdatesWait: 1000,
                    ...options?.api,
                },
            };
            if (!(options?.plugins &&
                "format" in options.plugins &&
                !options.plugins.format))
                this.extend(new plugin_1.Plugin("@gramio/format").preRequest((context) => {
                    if (!context.params)
                        return context;
                    // @ts-ignore
                    const formattable = format_1.FormattableMap[context.method];
                    // @ts-ignore add AnyTelegramMethod to @gramio/format
                    if (formattable)
                        context.params = formattable(context.params);
                    return context;
                }));
        }
        async runHooks(type, context) {
            let data = context;
            for await (const hook of this.hooks[type]) {
                data = await hook(data);
            }
            return data;
        }
        async runImmutableHooks(type, ...context) {
            for await (const hook of this.hooks[type]) {
                //TODO: solve that later
                //@ts-expect-error
                await hook(...context);
            }
        }
        async _callApi(method, params = {}) {
            const debug$api$method = debug$api.extend(method);
            const url = `${this.options.api.baseURL}${this.options.token}/${method}`;
            // Omit<
            // 	NonNullable<Parameters<typeof fetch>[1]>,
            // 	"headers"
            // > & {
            // 	headers: Headers;
            // }
            // idk why it cause https://github.com/gramiojs/gramio/actions/runs/10388006206/job/28762703484
            // also in logs types differs
            const reqOptions = {
                method: "POST",
                ...this.options.api.fetchOptions,
                // @ts-ignore types node/bun and global missmatch
                headers: new node_fetch_commonjs_1.Headers(this.options.api.fetchOptions?.headers),
            };
            const context = await this.runHooks("preRequest", 
            // TODO: fix type error
            // @ts-expect-error
            {
                method,
                params,
            });
            // biome-ignore lint/style/noParameterAssign: mutate params
            params = context.params;
            // @ts-ignore
            if (params && (0, files_1.isMediaUpload)(method, params)) {
                // @ts-ignore
                const formData = await (0, files_1.convertJsonToFormData)(method, params);
                reqOptions.body = formData;
            }
            else {
                reqOptions.headers.set("Content-Type", "application/json");
                reqOptions.body = JSON.stringify(params);
            }
            debug$api$method("options: %j", reqOptions);
            const response = await (0, node_fetch_commonjs_1.default)(url, reqOptions);
            const data = (await response.json());
            debug$api$method("response: %j", data);
            if (!data.ok) {
                const err = new errors_1.TelegramError(data, method, params);
                // @ts-expect-error
                this.runImmutableHooks("onResponseError", err, this.api);
                if (!params?.suppress)
                    throw err;
                return err;
            }
            this.runImmutableHooks("onResponse", 
            // TODO: fix type error
            // @ts-expect-error
            {
                method,
                params,
                response: data.result,
            });
            return data.result;
        }
        async downloadFile(attachment, path) {
            function getFileId(attachment) {
                if (attachment instanceof contexts_1.PhotoAttachment) {
                    return attachment.bigSize.fileId;
                }
                if ("fileId" in attachment && typeof attachment.fileId === "string")
                    return attachment.fileId;
                if ("file_id" in attachment)
                    return attachment.file_id;
                throw new Error("Invalid attachment");
            }
            const fileId = typeof attachment === "string" ? attachment : getFileId(attachment);
            const file = await this.api.getFile({ file_id: fileId });
            const url = `${this.options.api.baseURL.replace("/bot", "/file/bot")}${this.options.token}/${file.file_path}`;
            const res = await (0, node_fetch_commonjs_1.default)(url);
            const buffer = await res.arrayBuffer();
            if (path) {
                await promises_1.default.writeFile(path, node_buffer_1.Buffer.from(buffer));
                return path;
            }
            return buffer;
        }
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
        error(kind, error) {
            //@ts-expect-error Set ErrorKind
            error[errors_1.ErrorKind] = kind;
            this.errorsDefinitions[kind] = error;
            return this;
        }
        onError(updateNameOrHandler, handler) {
            if (typeof updateNameOrHandler === "function") {
                this.hooks.onError.push(updateNameOrHandler);
                return this;
            }
            if (handler) {
                this.hooks.onError.push(async (errContext) => {
                    if (errContext.context.is(updateNameOrHandler))
                        // TODO:  Sorry... fix later
                        //@ts-expect-error
                        await handler(errContext);
                });
            }
            return this;
        }
        derive(updateNameOrHandler, handler) {
            this.updates.composer.derive(updateNameOrHandler, handler);
            return this;
        }
        decorate(nameOrRecordValue, value) {
            for (const contextName of Object.keys(contexts_1.contextsMappings)) {
                if (typeof nameOrRecordValue === "string")
                    // @ts-expect-error
                    Object.defineProperty(contexts_1.contextsMappings[contextName].prototype, name, {
                        value,
                    });
                else
                    Object.defineProperties(
                    // @ts-expect-error
                    contexts_1.contextsMappings[contextName].prototype, Object.keys(nameOrRecordValue).reduce((acc, key) => {
                        acc[key] = { value: nameOrRecordValue[key] };
                        return acc;
                    }, {}));
            }
            return this;
        }
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
        onStart(handler) {
            this.hooks.onStart.push(handler);
            return this;
        }
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
        onStop(handler) {
            this.hooks.onStop.push(handler);
            return this;
        }
        preRequest(methodsOrHandler, handler) {
            if (typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) {
                // TODO: error
                if (!handler)
                    throw new Error("TODO:");
                const methods = typeof methodsOrHandler === "string"
                    ? [methodsOrHandler]
                    : methodsOrHandler;
                // TODO: remove error
                // @ts-expect-error
                this.hooks.preRequest.push(async (context) => {
                    // TODO: remove ts-ignore
                    // @ts-expect-error
                    if (methods.includes(context.method))
                        return handler(context);
                    return context;
                });
            }
            else
                this.hooks.preRequest.push(methodsOrHandler);
            return this;
        }
        onResponse(methodsOrHandler, handler) {
            if (typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) {
                // TODO: error
                if (!handler)
                    throw new Error("TODO:");
                const methods = typeof methodsOrHandler === "string"
                    ? [methodsOrHandler]
                    : methodsOrHandler;
                this.hooks.onResponse.push(async (context) => {
                    // TODO: remove ts-ignore
                    // @ts-expect-error
                    if (methods.includes(context.method))
                        return handler(context);
                    return context;
                });
            }
            else
                this.hooks.onResponse.push(methodsOrHandler);
            return this;
        }
        onResponseError(methodsOrHandler, handler) {
            if (typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) {
                // TODO: error
                if (!handler)
                    throw new Error("TODO:");
                const methods = typeof methodsOrHandler === "string"
                    ? [methodsOrHandler]
                    : methodsOrHandler;
                this.hooks.onResponseError.push(async (context) => {
                    // TODO: remove ts-ignore
                    // @ts-expect-error
                    if (methods.includes(context.method))
                        return handler(context);
                    return context;
                });
            }
            else
                this.hooks.onResponseError.push(methodsOrHandler);
            return this;
        }
        // onExperimental(
        // 	// filter: Filters,
        // 	filter: (
        // 		f: Filters<
        // 			Context<typeof this> & Derives["global"],
        // 			[{ equal: { prop: number }; addition: { some: () => 2 } }]
        // 		>,
        // 	) => Filters,
        // 	handler: Handler<Context<typeof this> & Derives["global"]>,
        // ) {}
        /** Register handler to one or many Updates */
        on(updateName, handler) {
            this.updates.composer.on(updateName, handler);
            return this;
        }
        /** Register handler to any Updates */
        use(handler) {
            this.updates.composer.use(handler);
            return this;
        }
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
        extend(plugin) {
            if (plugin instanceof Promise) {
                this.lazyloadPlugins.push(plugin);
                return this;
            }
            if (plugin._.dependencies.some((dep) => !this.dependencies.includes(dep)))
                throw new Error(`The «${plugin._.name}» plugin needs dependencies registered before: ${plugin._.dependencies
                    .filter((dep) => !this.dependencies.includes(dep))
                    .join(", ")}`);
            if (plugin._.composer.length) {
                this.use(plugin._.composer.composed);
            }
            this.decorate(plugin._.decorators);
            for (const [key, value] of Object.entries(plugin._.errorsDefinitions)) {
                if (this.errorsDefinitions[key])
                    this.errorsDefinitions[key] = value;
            }
            for (const value of plugin._.preRequests) {
                const [preRequest, updateName] = value;
                if (!updateName)
                    this.preRequest(preRequest);
                else
                    this.preRequest(updateName, preRequest);
            }
            for (const value of plugin._.onResponses) {
                const [onResponse, updateName] = value;
                if (!updateName)
                    this.onResponse(onResponse);
                else
                    this.onResponse(updateName, onResponse);
            }
            for (const value of plugin._.onResponseErrors) {
                const [onResponseError, updateName] = value;
                if (!updateName)
                    this.onResponseError(onResponseError);
                else
                    this.onResponseError(updateName, onResponseError);
            }
            for (const handler of plugin._.groups) {
                this.group(handler);
            }
            this.dependencies.push(plugin._.name);
            return this;
        }
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
        reaction(trigger, handler) {
            const reactions = Array.isArray(trigger) ? trigger : [trigger];
            return this.on("message_reaction", (context, next) => {
                const newReactions = [];
                for (const reaction of context.newReactions) {
                    if (reaction.type !== "emoji")
                        continue;
                    const foundIndex = context.oldReactions.findIndex((oldReaction) => oldReaction.type === "emoji" &&
                        oldReaction.emoji === reaction.emoji);
                    if (foundIndex === -1) {
                        newReactions.push(reaction);
                    }
                    else {
                        // TODO: REFACTOR
                        context.oldReactions.splice(foundIndex, 1);
                    }
                }
                if (!newReactions.some((x) => x.type === "emoji" && reactions.includes(x.emoji)))
                    return next();
                return handler(context);
            });
        }
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
        callbackQuery(trigger, handler) {
            return this.on("callback_query", (context, next) => {
                if (!context.data)
                    return next();
                if (typeof trigger === "string" && context.data !== trigger)
                    return next();
                if (trigger instanceof callback_data_1.CallbackData &&
                    !trigger.regexp().test(context.data))
                    return next();
                if (trigger instanceof RegExp && !trigger.test(context.data))
                    return next();
                if (trigger instanceof callback_data_1.CallbackData)
                    // @ts-expect-error
                    context.queryData = trigger.unpack(context.data);
                //@ts-expect-error
                return handler(context);
            });
        }
        /** Register handler to `chosen_inline_result` update */
        chosenInlineResult(trigger, handler) {
            return this.on("chosen_inline_result", (context, next) => {
                if ((typeof trigger === "string" && context.query === trigger) ||
                    // @ts-expect-error
                    (typeof trigger === "function" && trigger(context)) ||
                    (trigger instanceof RegExp &&
                        context.query &&
                        trigger.test(context.query))) {
                    //@ts-expect-error
                    context.args =
                        trigger instanceof RegExp ? context.query?.match(trigger) : null;
                    // TODO: remove
                    //@ts-expect-error
                    return handler(context);
                }
                return next();
            });
        }
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
        inlineQuery(trigger, handler, options = {}) {
            // @ts-expect-error fix later...
            if (options.onResult)
                this.chosenInlineResult(trigger, options.onResult);
            return this.on("inline_query", (context, next) => {
                if ((typeof trigger === "string" && context.query === trigger) ||
                    // @ts-expect-error
                    (typeof trigger === "function" && trigger(context)) ||
                    (trigger instanceof RegExp &&
                        context.query &&
                        trigger.test(context.query))) {
                    //@ts-expect-error
                    context.args =
                        trigger instanceof RegExp ? context.query?.match(trigger) : null;
                    // TODO: remove
                    //@ts-expect-error
                    return handler(context);
                }
                return next();
            });
        }
        /**
         * Register handler to `message` and `business_message` event
         *
         * new Bot().hears(/regular expression with (.*)/i, async (context) => {
         *     if (context.args) await context.send(`Params ${context.args[1]}`);
         * });
         */
        hears(trigger, handler) {
            return this.on("message", (context, next) => {
                if ((typeof trigger === "string" && context.text === trigger) ||
                    // @ts-expect-error
                    (typeof trigger === "function" && trigger(context)) ||
                    (trigger instanceof RegExp &&
                        context.text &&
                        trigger.test(context.text))) {
                    //@ts-expect-error
                    context.args =
                        trigger instanceof RegExp ? context.text?.match(trigger) : null;
                    // TODO: remove
                    //@ts-expect-error
                    return handler(context);
                }
                return next();
            });
        }
        /**
         * Register handler to `message` and `business_message` event when entities contains a command
         *
         * new Bot().command("start", async (context) => {
         *     return context.send(`You message is /start ${context.args}`);
         * });
         */
        command(command, handler, options) {
            if (command.startsWith("/"))
                throw new Error("Do not use / in command name");
            return this.on(["message", "business_message"], (context, next) => {
                // TODO: change to find
                if (context.entities?.some((entity) => {
                    if (entity.type !== "bot_command" || entity.offset > 0)
                        return false;
                    const cmd = context.text
                        ?.slice(1, entity.length)
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        ?.replace(`@${this.info.username}`, "");
                    // @ts-expect-error
                    context.args = context.text?.slice(entity.length).trim() || null;
                    return cmd === command;
                }))
                    // @ts-expect-error
                    return handler(context);
                return next();
            });
        }
        /** Currently not isolated!!! */
        group(grouped) {
            return grouped(this);
        }
        /**
         * Init bot. Call it manually only if you doesn't use {@link Bot.start}
         */
        async init() {
            await Promise.all(this.lazyloadPlugins.map(async (plugin) => this.extend(await plugin)));
            this.info = await this.api.getMe();
        }
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
        async start({ webhook, dropPendingUpdates, allowedUpdates, } = {}) {
            await this.init();
            if (!webhook) {
                await this.api.deleteWebhook({
                    drop_pending_updates: dropPendingUpdates,
                });
                await this.updates.startPolling({
                    allowed_updates: allowedUpdates,
                });
                this.runImmutableHooks("onStart", {
                    plugins: this.dependencies,
                    // biome-ignore lint/style/noNonNullAssertion: bot.init() guarantees this.info
                    info: this.info,
                    updatesFrom: "long-polling",
                });
                return this.info;
            }
            if (this.updates.isStarted)
                this.updates.stopPolling();
            await this.api.setWebhook({
                ...webhook,
                drop_pending_updates: dropPendingUpdates,
                allowed_updates: allowedUpdates,
            });
            this.runImmutableHooks("onStart", {
                plugins: this.dependencies,
                // biome-ignore lint/style/noNonNullAssertion: bot.init() guarantees this.info
                info: this.info,
                updatesFrom: "webhook",
            });
            return this.info;
        }
        /**
         * Stops receiving events via long-polling or webhook
         * Currently does not implement graceful shutdown
         * */
        async stop() {
            if (this.updates.isStarted)
                this.updates.stopPolling();
            else
                await this.api.deleteWebhook();
            await this.runImmutableHooks("onStop", {
                plugins: this.dependencies,
                // biome-ignore lint/style/noNonNullAssertion: bot.init() guarantees this.info
                info: this.info,
            });
        }
    };
    return Bot = _classThis;
})();
exports.Bot = Bot;
