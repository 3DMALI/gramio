"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
const middleware_io_1 = require("middleware-io");
/** Base-composer without chainable type-safety */
class Composer {
    composer = middleware_io_1.Composer.builder();
    length = 0;
    composed;
    onError;
    constructor(onError) {
        this.onError =
            onError ||
                ((_, error) => {
                    throw error;
                });
        this.recompose();
    }
    /** Register handler to one or many Updates */
    on(updateName, handler) {
        return this.use(async (context, next) => {
            if (context.is(updateName))
                return await handler(context, next);
            return await next();
        });
    }
    /** Register handler to any Update */
    use(handler) {
        this.composer.caught(this.onError).use(handler);
        return this.recompose();
    }
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
    derive(updateNameOrHandler, handler) {
        if (typeof updateNameOrHandler === "function")
            this.use(async (context, next) => {
                for (const [key, value] of Object.entries(await updateNameOrHandler(context))) {
                    context[key] = value;
                }
                next();
            });
        else if (handler)
            this.on(updateNameOrHandler, async (context, next) => {
                for (const [key, value] of Object.entries(await handler(context))) {
                    context[key] = value;
                }
                next();
            });
        return this;
    }
    recompose() {
        // @ts-expect-error middleware-io moment
        this.composed = this.composer.compose();
        this.length = this.composer.length;
        return this;
    }
    compose(context, next = middleware_io_1.noopNext) {
        this.composed(context, next);
    }
}
exports.Composer = Composer;
