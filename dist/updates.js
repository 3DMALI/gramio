"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updates = void 0;
const promises_1 = require("node:timers/promises");
const contexts_1 = require("@gramio/contexts");
const composer_1 = require("./composer");
const errors_1 = require("./errors");
class Updates {
    bot;
    isStarted = false;
    offset = 0;
    composer;
    constructor(bot, onError) {
        this.bot = bot;
        this.composer = new composer_1.Composer(onError);
    }
    async handleUpdate(data) {
        const updateType = Object.keys(data).at(1);
        this.offset = data.update_id + 1;
        const UpdateContext = contexts_1.contextsMappings[updateType];
        if (!UpdateContext)
            throw new Error(updateType);
        const updatePayload = data[updateType];
        if (!updatePayload)
            throw new Error("");
        try {
            let context = new UpdateContext({
                bot: this.bot,
                update: data,
                // @ts-expect-error
                payload: updatePayload,
                type: updateType,
                updateId: data.update_id,
            });
            if ("isEvent" in context && context.isEvent() && context.eventType) {
                const payload = data.message ??
                    data.edited_message ??
                    data.channel_post ??
                    data.edited_channel_post ??
                    data.business_message;
                if (!payload)
                    throw new Error("Unsupported event??");
                context = new contexts_1.contextsMappings[context.eventType]({
                    bot: this.bot,
                    update: data,
                    payload,
                    // @ts-expect-error
                    type: context.eventType,
                    updateId: data.update_id,
                });
            }
            this.composer.compose(context);
        }
        catch (error) {
            throw new Error(`[UPDATES] Update type ${updateType} not supported.`);
        }
    }
    /** @deprecated use bot.start instead @internal */
    async startPolling(params = {}) {
        if (this.isStarted)
            throw new Error("[UPDATES] Polling already started!");
        this.isStarted = true;
        this.startFetchLoop(params);
        return;
    }
    async startFetchLoop(params = {}) {
        while (this.isStarted) {
            const updates = await this.bot.api.getUpdates({
                ...params,
                offset: this.offset,
                suppress: true,
            });
            if (updates instanceof errors_1.TelegramError || typeof updates === "undefined") {
                await promises_1.scheduler.wait(this.bot.options.api.retryGetUpdatesWait);
            }
            else {
                for await (const update of updates) {
                    //TODO: update errors
                    await this.handleUpdate(update).catch(console.error);
                }
            }
        }
    }
    stopPolling() {
        this.isStarted = false;
    }
}
exports.Updates = Updates;
