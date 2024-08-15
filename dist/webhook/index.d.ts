import type { Bot } from "../bot";
import { frameworks } from "./adapters";
/** Union type of webhook handlers name */
export type WebhookHandlers = keyof typeof frameworks;
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
export declare function webhookHandler<Framework extends keyof typeof frameworks>(bot: Bot, framework: Framework, secretToken?: string): ReturnType<(typeof frameworks)[Framework]> extends {
    response: () => any;
} ? (...args: Parameters<(typeof frameworks)[Framework]>) => ReturnType<ReturnType<(typeof frameworks)[Framework]>["response"]> : (...args: Parameters<(typeof frameworks)[Framework]>) => void;
