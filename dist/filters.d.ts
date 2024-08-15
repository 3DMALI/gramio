import type { Context, ContextType, MaybeArray, UpdateName } from "@gramio/contexts";
import type { Bot } from "./bot";
export interface AdditionDefinitions {
    equal: any;
    addition: Record<string, any>;
}
type ReturnIfNonNever<T> = [T] extends [never] ? {} : T;
export type Filters<BotType extends Bot = Bot, Base = Context<BotType>, ConditionalAdditions extends AdditionDefinitions[] = []> = {
    _s: Base;
    _ad: ConditionalAdditions;
    __filters: ((context: Context<BotType>) => boolean)[];
    context<T extends UpdateName>(updateName: MaybeArray<T>): Filters<BotType, ContextType<BotType, T>, ConditionalAdditions>;
    is2(): Filters<BotType, 2, ConditionalAdditions>;
} & ReturnIfNonNever<{
    [K in keyof ConditionalAdditions & number]: ConditionalAdditions[K] extends {
        equal: infer E;
        addition: infer T;
    } ? Base extends E ? T : {} : {};
}[number]>;
export {};
