"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = webhookHandler;
const adapters_1 = require("./adapters");
/**
 * Setup handler with yours web-framework to receive updates via webhook
 *
 *	@example
 * ```ts
 * import { Bot } from "gramio";
 * import Fastify from "fastify";
 *
 * const bot = new Bot(process.env.TOKEN as string).on(
 * 	"message",
 * 	(context) => {
 * 		return context.send("Fastify!");
 * 	},
 * );
 *
 * const fastify = Fastify();
 *
 * fastify.post("/telegram-webhook", webhookHandler(bot, "fastify"));
 *
 * fastify.listen({ port: 3445, host: "::" });
 *
 * bot.start({
 *     webhook: {
 *         url: "https://example.com:3445/telegram-webhook",
 *     },
 * });
 * ```
 */
function webhookHandler(bot, framework, secretToken) {
    const frameworkAdapter = adapters_1.frameworks[framework];
    return (async (...args) => {
        // @ts-expect-error
        const { update, response, header, unauthorized } = frameworkAdapter(
        // @ts-expect-error
        ...args);
        if (secretToken && header !== secretToken)
            return unauthorized();
        await bot.updates.handleUpdate(await update);
        if (response)
            return response();
    });
}
