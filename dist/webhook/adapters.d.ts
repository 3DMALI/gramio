import type { TelegramUpdate } from "@gramio/types";
import type { MaybePromise } from "../types";
export interface FrameworkHandler {
    update: MaybePromise<TelegramUpdate>;
    header: string;
    unauthorized: () => unknown;
    response?: () => unknown;
}
export type FrameworkAdapter = (...args: any[]) => FrameworkHandler;
export declare const frameworks: {
    elysia: ({ body, headers }: any) => {
        update: any;
        header: any;
        unauthorized: () => import("undici-types").Response;
    };
    fastify: (request: any, reply: any) => {
        update: any;
        header: any;
        unauthorized: () => any;
    };
    hono: (c: any) => {
        update: any;
        header: any;
        unauthorized: () => any;
    };
    express: (req: any, res: any) => {
        update: any;
        header: any;
        unauthorized: () => any;
    };
    koa: (ctx: any) => {
        update: any;
        header: any;
        unauthorized: () => void;
    };
    http: (req: any, res: any) => {
        update: Promise<TelegramUpdate>;
        header: any;
        unauthorized: () => any;
    };
    "std/http": (req: any) => {
        update: any;
        header: any;
        response: () => import("undici-types").Response;
        unauthorized: () => import("undici-types").Response;
    };
    "Bun.serve": (req: any) => {
        update: any;
        header: any;
        response: () => import("undici-types").Response;
        unauthorized: () => import("undici-types").Response;
    };
};
