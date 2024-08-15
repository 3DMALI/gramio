"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// type filter = Filters<
// 	Context<Bot> & {prop: 2},
// 	[{ equal: { prop: 2 }; addition: { some: 2 } }]
// >;
// const a = {} as filter;
// // a.s;
// type S = [{ equal: { prop: 2 }; addition: { some: 2 } }];
// type C = {[K in keyof S & number]: S[K]};
// type SA = {
// 	[K in keyof S & number]: S[K] extends {
// 		equal: infer E;
// 		addition: infer T;
// 	} ? Context<Bot> & {prop: 2} extends E ? T : {} : {}}[number];
// type A = Context<Bot> & {prop: 2} extends SA ? true : false;
// export const filters: Filters = {
// 	__filters: [],
// 	context(updateName) {
// 		this.__filters.push((context) => context.is(updateName));
// 		return this;
// 	},
// };
