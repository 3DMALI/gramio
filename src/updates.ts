import { Context, contextsMappings } from "@gramio/contexts";
import type { TelegramUpdate } from "@gramio/types";
import { Composer, noopNext } from "middleware-io";
import { Bot } from ".";
import { THandler, UpdateNames } from "./types";

export class Updates {
	private readonly bot: Bot;
	private isStarted = false;
	private offset = 0;
	private composer = Composer.builder<
		Context & {
			[key: string]: unknown;
		}
	>();

	constructor(bot: Bot) {
		this.bot = bot;
	}

	on<T extends UpdateNames>(
		updateName: T,
		handler: THandler<InstanceType<(typeof contextsMappings)[T]>>,
	) {
		return this.use((context, next) => {
			//TODO: fix typings
			if (context.is(updateName))
				handler(context as InstanceType<(typeof contextsMappings)[T]>, next);
			else next();
		});
	}

	use(handler: THandler<Context>) {
		this.composer.use(handler);

		return this;
	}

	async handleUpdate(data: TelegramUpdate) {
		const updateType = Object.keys(data).at(1) as UpdateNames;

		this.offset = data.update_id + 1;

		try {
			const context = new contextsMappings[updateType]({
				//@ts-expect-error
				bot: this.bot,
				//@ts-expect-error
				update: data,
				//TODO: fix
				//@ts-ignore
				payload: data[updateType as Exclude<keyof typeof data, "update_id">],
				type: updateType,
				updateId: data.update_id,
				// raw: {
				// 	update: data,
				// 	updateId: data.update_id,
				// 	updateType,
				// },
			});

			this.composer.compose()(
				//TODO: fix typings
				context as unknown as Context & {
					[key: string]: unknown;
				},
				noopNext,
			);
		} catch (error) {
			throw new Error(`Update type ${updateType} not supported.`);
		}
	}

	async startPolling() {
		if (this.isStarted) throw new Error("[UPDATES] Polling already started!");

		this.isStarted = true;

		this.startFetchLoop();
		return null;
	}

	async startFetchLoop() {
		while (this.isStarted) {
			const updates = await this.bot.api.getUpdates({
				offset: this.offset,
			});

			for await (const update of updates) {
				//TODO: update errors
				await this.handleUpdate(update).catch(console.error);
			}
		}
	}

	stopPolling() {
		this.isStarted = false;
	}
}
