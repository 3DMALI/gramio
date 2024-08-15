import type { Context, ContextType, MaybeArray, UpdateName } from "@gramio/contexts";
import { type CaughtMiddlewareHandler, type Middleware, Composer as MiddlewareComposer } from "middleware-io";
import type { AnyBot, Handler, Hooks } from "./types";
/** Base-composer without chainable type-safety */
export declare class Composer {
    protected composer: MiddlewareComposer<Context<AnyBot> & {
        [key: string]: unknown;
    }, Context<AnyBot> & {
        [key: string]: unknown;
    }>;
    length: number;
    composed: Middleware<Context<AnyBot>>;
    protected onError: CaughtMiddlewareHandler<Context<AnyBot>>;
    constructor(onError?: CaughtMiddlewareHandler<Context<any>>);
    /** Register handler to one or many Updates */
    on<T extends UpdateName>(updateName: MaybeArray<T>, handler: Handler<any>): this;
    /** Register handler to any Update */
    use(handler: Handler<any>): this;
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
    derive<Update extends UpdateName, Handler extends Hooks.Derive<ContextType<AnyBot, Update>>>(updateNameOrHandler: MaybeArray<Update> | Handler, handler?: Handler): this;
    protected recompose(): this;
    compose(context: Context<AnyBot>, next?: import("middleware-io").NextMiddleware): void;
}
