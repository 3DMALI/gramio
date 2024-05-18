import type { Buffer } from "node:buffer";
import type { TelegramUpdate } from "@gramio/types";
import { Response } from "undici";
import type { MaybePromise } from "../types";

const SECRET_TOKEN_HEADER = "X-Telegram-Bot-Api-Secret-Token";
const WRONG_TOKEN_ERROR = "secret token is invalid";

export interface FrameworkHandler {
	update: MaybePromise<TelegramUpdate>;
	header: string;
	unauthorized: () => unknown;
	response?: () => unknown;
}
export type FrameworkAdapter = (...args: any[]) => FrameworkHandler;

export const frameworks = {
	elysia: ({ body, headers }) => ({
		update: body,
		header: headers[SECRET_TOKEN_HEADER],
		unauthorized: () => new Response(WRONG_TOKEN_ERROR, { status: 401 }),
	}),
	fastify: (request, reply) => ({
		update: request.body,
		header: request.headers[SECRET_TOKEN_HEADER],
		unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
	}),
	hono: (c) => ({
		update: c.req.json(),
		header: c.req.header(SECRET_TOKEN_HEADER),
		unauthorized: () => c.text(WRONG_TOKEN_ERROR, 401),
	}),
	express: (req, res) => ({
		update: req.body,
		header: req.header(SECRET_TOKEN_HEADER),
		unauthorized: () => res.status(401).send(WRONG_TOKEN_ERROR),
	}),
	koa: (ctx) => ({
		update: ctx.request.body,
		header: ctx.get(SECRET_TOKEN_HEADER),
		unauthorized: () => {
			ctx.status === 401;
			ctx.body = WRONG_TOKEN_ERROR;
		},
	}),
	http: (req, res) => ({
		update: new Promise((resolve) => {
			let body = "";

			req.on("data", (chunk: Buffer) => {
				body += chunk.toString();
			});

			req.on("end", () => resolve(JSON.parse(body)));
		}),
		header: req.headers[SECRET_TOKEN_HEADER.toLowerCase()],
		unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
	}),
	"std/http": (req) => ({
		update: req.json(),
		header: req.headers.get(SECRET_TOKEN_HEADER),
		response: () => new Response("ok!"),
		unauthorized: () => new Response(WRONG_TOKEN_ERROR, { status: 401 }),
	}),
	"Bun.serve": (req) => ({
		update: req.json(),
		header: req.headers.get(SECRET_TOKEN_HEADER),
		response: () => new Response("ok!"),
		unauthorized: () => new Response(WRONG_TOKEN_ERROR, { status: 401 }),
	}),
} satisfies Record<string, FrameworkAdapter>;
