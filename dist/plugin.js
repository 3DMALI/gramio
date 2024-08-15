"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const inspectable_1 = require("inspectable");
const composer_1 = require("./composer");
const errors_1 = require("./errors");
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
let Plugin = (() => {
    let _classDecorators = [(0, inspectable_1.Inspectable)({
            serialize: (plugin) => ({
                name: plugin._.name,
                dependencies: plugin._.dependencies,
            }),
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Plugin = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Plugin = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * 	@internal
         * 	Set of Plugin data
         *
         *
         */
        _ = {
            /** Name of plugin */
            name: "",
            /** List of plugin dependencies. If user does't extend from listed there dependencies it throw a error */
            dependencies: [],
            /** remap generic type. {} in runtime */
            Errors: {},
            /** remap generic type. {} in runtime */
            Derives: {},
            /**	Composer */
            composer: new composer_1.Composer(),
            /** Store plugin preRequests hooks */
            preRequests: [],
            /** Store plugin onResponses hooks */
            onResponses: [],
            /** Store plugin onResponseErrors hooks */
            onResponseErrors: [],
            /**
             * Store plugin groups
             *
             * If you use `on` or `use` in group and on plugin-level groups handlers are registered after plugin-level handlers
             *  */
            groups: [],
            /** Store plugin onStarts hooks */
            onStarts: [],
            /** Store plugin onStops hooks */
            onStops: [],
            /** Store plugin onErrors hooks */
            onErrors: [],
            /** Map of plugin errors */
            errorsDefinitions: {},
            decorators: {},
        };
        /** Create new Plugin. Please provide `name` */
        constructor(name, { dependencies } = {}) {
            this._.name = name;
            if (dependencies)
                this._.dependencies = dependencies;
        }
        /** Currently not isolated!!!
         *
         * > [!WARNING]
         * > If you use `on` or `use` in a `group` and at the plugin level, the group handlers are registered **after** the handlers at the plugin level
         */
        group(grouped) {
            this._.groups.push(grouped);
            return this;
        }
        /**
         * Register custom class-error in plugin
         **/
        error(kind, error) {
            //@ts-expect-error Set ErrorKind
            error[errors_1.ErrorKind] = kind;
            this._.errorsDefinitions[kind] = error;
            return this;
        }
        derive(updateNameOrHandler, handler) {
            this._.composer.derive(updateNameOrHandler, handler);
            return this;
        }
        decorate(nameOrValue, value) {
            if (typeof nameOrValue === "string")
                this._.decorators[nameOrValue] = value;
            else {
                for (const [name, value] of Object.entries(nameOrValue)) {
                    this._.decorators[name] = value;
                }
            }
            return this;
        }
        /** Register handler to one or many Updates */
        on(updateName, handler) {
            this._.composer.on(updateName, handler);
            return this;
        }
        /** Register handler to any Updates */
        use(handler) {
            this._.composer.use(handler);
            return this;
        }
        preRequest(methodsOrHandler, handler) {
            if ((typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) &&
                handler)
                this._.preRequests.push([handler, methodsOrHandler]);
            else if (typeof methodsOrHandler === "function")
                this._.preRequests.push([methodsOrHandler, undefined]);
            return this;
        }
        onResponse(methodsOrHandler, handler) {
            if ((typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) &&
                handler)
                this._.onResponses.push([handler, methodsOrHandler]);
            else if (typeof methodsOrHandler === "function")
                this._.onResponses.push([methodsOrHandler, undefined]);
            return this;
        }
        onResponseError(methodsOrHandler, handler) {
            if ((typeof methodsOrHandler === "string" ||
                Array.isArray(methodsOrHandler)) &&
                handler)
                this._.onResponseErrors.push([handler, methodsOrHandler]);
            else if (typeof methodsOrHandler === "function")
                this._.onResponseErrors.push([methodsOrHandler, undefined]);
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
            this._.onStarts.push(handler);
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
            this._.onStops.push(handler);
            return this;
        }
        onError(updateNameOrHandler, handler) {
            if (typeof updateNameOrHandler === "function") {
                this._.onErrors.push(updateNameOrHandler);
                return this;
            }
            if (handler) {
                this._.onErrors.push(async (errContext) => {
                    if (errContext.context.is(updateNameOrHandler))
                        await handler(errContext);
                });
            }
            return this;
        }
    };
    return Plugin = _classThis;
})();
exports.Plugin = Plugin;
