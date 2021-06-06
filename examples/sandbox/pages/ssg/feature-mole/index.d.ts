type ZEUS_INTERFACES = never
type ZEUS_UNIONS = never

export type ValueTypes = {
    /** Reset password details */
["ResetPassword"]: {
	/** New password for the user */
	newPassword:string,
	/** token received from email */
	token:string
};
	["CreateDealRequest"]: {
	/** Deadline proposed by the user (must be sooner than deadline of feature request)  */
	deadline:string,
	/** Additional message */
	message?:string,
	/** Feature request issue URL */
	featureRequest:string
};
	["SignUp"]: {
	company?:string,
	firstName?:string,
	lastName?:string
};
	/** All queries of users system */
["UserQuery"]: AliasType<{
	/** Check if logged in user is admin<br> */
	isAdmin?:true,
	/** Check if there is admin already */
	isAdminClaimPossible?:true,
login?: [{	user:ValueTypes["UserBasicData"]},ValueTypes["LoggedInData"]],
		__typename?: true
}>;
	/** Request Issue help */
["FeatureRequest"]: AliasType<{
	/** comments on this issue */
	comments?:ValueTypes["Comments"],
	/** extra info about the issue and the worms and/or money offered for resolving the issue */
	content?:true,
	/** date of creation */
	createdAt?:true,
	/** author of the feature request */
	createdBy?:ValueTypes["MoleUser"],
	/** issueURL is the primary key. It points to the issue inside git portal */
	issueURL?:true,
	/** programming languages to be used to solve the issue */
	languages?:ValueTypes["ProgrammingLanguage"],
	/** worms offered for resolution of the issue */
	offeredWorms?:true,
	/** git repository url */
	repositoryURL?:true,
	/** Representative title of the issue in git portal */
	title?:true,
		__typename?: true
}>;
	["LoggedInData"]: AliasType<{
	token?:true,
		__typename?: true
}>;
	["MoleUserQuery"]: AliasType<{
	/** active deals I am in */
	deals?:ValueTypes["Deal"],
	/** my feature requests */
	featureRequests?:ValueTypes["FeatureRequest"],
	/** given deal requests for the feature */
	givenDealRequsts?:ValueTypes["DealRequest"],
	/** received deal requests for the feature */
	receivedDealRequests?:ValueTypes["DealRequest"],
		__typename?: true
}>;
	["MoleUserMutation"]: AliasType<{
acceptDealRequest?: [{	request:string},true],
closeDeal?: [{	deal:string},true],
createComment?: [{	comment:ValueTypes["CreateComment"]},true],
createFeatureRequest?: [{	featureRequest:ValueTypes["CreateFeatureRequest"]},true],
finishWork?: [{	deal:string},true],
offerDealRequest?: [{	request:ValueTypes["CreateDealRequest"]},true],
		__typename?: true
}>;
	["UserBasicData"]: {
	username:string,
	password:string
};
	["CreateFeatureRequest"]: {
	/** programming languages to be used to solve the issue */
	languages:string[],
	/** Extra information for featuremole.com users */
	content:string,
	/** git repository url */
	repositoryURL:string,
	/** url of the issue in the repository */
	issueURL?:string
};
	["Query"]: AliasType<{
featureRequest?: [{	featureRequest:string},ValueTypes["FeatureRequest"]],
	/** Feature requests displayed on the home page */
	home?:ValueTypes["FeatureRequest"],
	moleUserQuery?:ValueTypes["MoleUserQuery"],
	/** Queries for logged in users */
	user?:ValueTypes["UserQuery"],
		__typename?: true
}>;
	/** Comment on featuremole.com portal */
["Comments"]: AliasType<{
	/** content of the comment */
	content?:true,
	createdAt?:true,
	featureRequest?:ValueTypes["FeatureRequest"],
	/** primary key. Index of the comment */
	index?:true,
	replyTo?:ValueTypes["Comments"],
		__typename?: true
}>;
	["MoleUser"]: AliasType<{
	avatar?:true,
	company?:true,
	createdAt?:true,
	/** feature requests created by this user */
	featureRequests?:ValueTypes["FeatureRequest"],
	firstName?:true,
	lastName?:true,
	/** worms in the wallet */
	worms?:true,
		__typename?: true
}>;
	["DealStatus"]:DealStatus;
	["Mutation"]: AliasType<{
	/** pipe to mole user mutations */
	moleUser?:ValueTypes["MoleUserMutation"],
signUp?: [{	user?:ValueTypes["SignUp"]},true],
	/** pipe to user related mutations in users system */
	user?:ValueTypes["UserMutation"],
		__typename?: true
}>;
	["CreateComment"]: {
	/** If replying to another comment provide its index */
	replyToIndex?:number,
	/** feature request issue URL */
	featureRequest:string,
	/** content of the comment */
	content:string
};
	/** # Deal
Deal between 2 **MoleUsers**

## Creation of a deal
It happens when DealRequest is accepted by both parties */
["Deal"]: AliasType<{
	createdAt?:true,
	/** Deadline proposed by the supplier */
	deadline?:true,
	/** feature request for this deal */
	featureRequest?:ValueTypes["FeatureRequest"],
	/** Status of the deal */
	status?:true,
	/** Supplier accepted for the deal */
	user?:ValueTypes["MoleUser"],
		__typename?: true
}>;
	["ProgrammingLanguage"]: AliasType<{
	colour?:true,
	name?:true,
		__typename?: true
}>;
	/** Request to help on the issue */
["DealRequest"]: AliasType<{
	/** If offer is accepted */
	accepted?:true,
	createdAt?:true,
	/** Deadline proposed by the user (must be sooner than deadline of feature request) */
	deadline?:true,
	/** Feature request this deal is about */
	featureRequest?:ValueTypes["FeatureRequest"],
	/** Additional message */
	message?:true,
	/** OUser who offered deal */
	user?:ValueTypes["MoleUser"],
		__typename?: true
}>;
	/** All mutations of users system */
["UserMutation"]: AliasType<{
forgotPassword?: [{	username:string},true],
makeAdmin?: [{	/** username of admin user<br> */
	username:string},true],
register?: [{	user:ValueTypes["UserBasicData"]},ValueTypes["LoggedInData"]],
resetPassword?: [{	reset:ValueTypes["ResetPassword"]},true],
		__typename?: true
}>
  }

export type ModelTypes = {
    /** Reset password details */
["ResetPassword"]: GraphQLTypes["ResetPassword"];
	["CreateDealRequest"]: GraphQLTypes["CreateDealRequest"];
	["SignUp"]: GraphQLTypes["SignUp"];
	/** All queries of users system */
["UserQuery"]: {
		/** Check if logged in user is admin<br> */
	isAdmin?:boolean,
	/** Check if there is admin already */
	isAdminClaimPossible?:boolean,
	/** Log user in */
	login?:ModelTypes["LoggedInData"]
};
	/** Request Issue help */
["FeatureRequest"]: {
		/** comments on this issue */
	comments:ModelTypes["Comments"][],
	/** extra info about the issue and the worms and/or money offered for resolving the issue */
	content:string,
	/** date of creation */
	createdAt:string,
	/** author of the feature request */
	createdBy:ModelTypes["MoleUser"],
	/** issueURL is the primary key. It points to the issue inside git portal */
	issueURL:string,
	/** programming languages to be used to solve the issue */
	languages:ModelTypes["ProgrammingLanguage"][],
	/** worms offered for resolution of the issue */
	offeredWorms:number,
	/** git repository url */
	repositoryURL:string,
	/** Representative title of the issue in git portal */
	title:string
};
	["LoggedInData"]: {
		token?:string
};
	["MoleUserQuery"]: {
		/** active deals I am in */
	deals:ModelTypes["Deal"][],
	/** my feature requests */
	featureRequests:ModelTypes["FeatureRequest"][],
	/** given deal requests for the feature */
	givenDealRequsts:ModelTypes["DealRequest"][],
	/** received deal requests for the feature */
	receivedDealRequests:ModelTypes["DealRequest"][]
};
	["MoleUserMutation"]: {
		/** accept offered deal request */
	acceptDealRequest?:boolean,
	/** close deal after the task is done by the supplier */
	closeDeal?:boolean,
	/** create comment underneath the feature request or another comment */
	createComment?:boolean,
	/** create new feature request */
	createFeatureRequest?:boolean,
	/** finish working on the feture request */
	finishWork?:boolean,
	/** offer a deal request */
	offerDealRequest?:boolean
};
	["UserBasicData"]: GraphQLTypes["UserBasicData"];
	["CreateFeatureRequest"]: GraphQLTypes["CreateFeatureRequest"];
	["Query"]: {
		/** detail view of the feature request. Should be used to fetch comments */
	featureRequest?:ModelTypes["FeatureRequest"],
	/** Feature requests displayed on the home page */
	home:ModelTypes["FeatureRequest"][],
	moleUserQuery?:ModelTypes["MoleUserQuery"],
	/** Queries for logged in users */
	user?:ModelTypes["UserQuery"]
};
	/** Comment on featuremole.com portal */
["Comments"]: {
		/** content of the comment */
	content:string,
	createdAt:string,
	featureRequest:ModelTypes["FeatureRequest"],
	/** primary key. Index of the comment */
	index:number,
	replyTo?:ModelTypes["Comments"]
};
	["MoleUser"]: {
		avatar?:string,
	company?:string,
	createdAt:string,
	/** feature requests created by this user */
	featureRequests:ModelTypes["FeatureRequest"][],
	firstName?:string,
	lastName?:string,
	/** worms in the wallet */
	worms:number
};
	["DealStatus"]: GraphQLTypes["DealStatus"];
	["Mutation"]: {
		/** pipe to mole user mutations */
	moleUser?:ModelTypes["MoleUserMutation"],
	/** sign up a new MoleUser */
	signUp?:boolean,
	/** pipe to user related mutations in users system */
	user?:ModelTypes["UserMutation"]
};
	["CreateComment"]: GraphQLTypes["CreateComment"];
	/** # Deal
Deal between 2 **MoleUsers**

## Creation of a deal
It happens when DealRequest is accepted by both parties */
["Deal"]: {
		createdAt:string,
	/** Deadline proposed by the supplier */
	deadline:string,
	/** feature request for this deal */
	featureRequest:ModelTypes["FeatureRequest"],
	/** Status of the deal */
	status?:ModelTypes["DealStatus"],
	/** Supplier accepted for the deal */
	user:ModelTypes["MoleUser"]
};
	["ProgrammingLanguage"]: {
		colour:string,
	name:string
};
	/** Request to help on the issue */
["DealRequest"]: {
		/** If offer is accepted */
	accepted?:boolean,
	createdAt:string,
	/** Deadline proposed by the user (must be sooner than deadline of feature request) */
	deadline:string,
	/** Feature request this deal is about */
	featureRequest:ModelTypes["FeatureRequest"],
	/** Additional message */
	message?:string,
	/** OUser who offered deal */
	user:ModelTypes["MoleUser"]
};
	/** All mutations of users system */
["UserMutation"]: {
		forgotPassword?:boolean,
	/** Make user a superadmin on a first call. Then you need to be an admin to call this */
	makeAdmin?:boolean,
	/** Register a new user<br> */
	register?:ModelTypes["LoggedInData"],
	resetPassword?:boolean
}
    }

export type GraphQLTypes = {
    /** Reset password details */
["ResetPassword"]: {
		/** New password for the user */
	newPassword: string,
	/** token received from email */
	token: string
};
	["CreateDealRequest"]: {
		/** Deadline proposed by the user (must be sooner than deadline of feature request)  */
	deadline: string,
	/** Additional message */
	message?: string,
	/** Feature request issue URL */
	featureRequest: string
};
	["SignUp"]: {
		company?: string,
	firstName?: string,
	lastName?: string
};
	/** All queries of users system */
["UserQuery"]: {
	__typename: "UserQuery",
	/** Check if logged in user is admin<br> */
	isAdmin?: boolean,
	/** Check if there is admin already */
	isAdminClaimPossible?: boolean,
	/** Log user in */
	login?: GraphQLTypes["LoggedInData"]
};
	/** Request Issue help */
["FeatureRequest"]: {
	__typename: "FeatureRequest",
	/** comments on this issue */
	comments: Array<GraphQLTypes["Comments"]>,
	/** extra info about the issue and the worms and/or money offered for resolving the issue */
	content: string,
	/** date of creation */
	createdAt: string,
	/** author of the feature request */
	createdBy: GraphQLTypes["MoleUser"],
	/** issueURL is the primary key. It points to the issue inside git portal */
	issueURL: string,
	/** programming languages to be used to solve the issue */
	languages: Array<GraphQLTypes["ProgrammingLanguage"]>,
	/** worms offered for resolution of the issue */
	offeredWorms: number,
	/** git repository url */
	repositoryURL: string,
	/** Representative title of the issue in git portal */
	title: string
};
	["LoggedInData"]: {
	__typename: "LoggedInData",
	token?: string
};
	["MoleUserQuery"]: {
	__typename: "MoleUserQuery",
	/** active deals I am in */
	deals: Array<GraphQLTypes["Deal"]>,
	/** my feature requests */
	featureRequests: Array<GraphQLTypes["FeatureRequest"]>,
	/** given deal requests for the feature */
	givenDealRequsts: Array<GraphQLTypes["DealRequest"]>,
	/** received deal requests for the feature */
	receivedDealRequests: Array<GraphQLTypes["DealRequest"]>
};
	["MoleUserMutation"]: {
	__typename: "MoleUserMutation",
	/** accept offered deal request */
	acceptDealRequest?: boolean,
	/** close deal after the task is done by the supplier */
	closeDeal?: boolean,
	/** create comment underneath the feature request or another comment */
	createComment?: boolean,
	/** create new feature request */
	createFeatureRequest?: boolean,
	/** finish working on the feture request */
	finishWork?: boolean,
	/** offer a deal request */
	offerDealRequest?: boolean
};
	["UserBasicData"]: {
		username: string,
	password: string
};
	["CreateFeatureRequest"]: {
		/** programming languages to be used to solve the issue */
	languages: Array<string>,
	/** Extra information for featuremole.com users */
	content: string,
	/** git repository url */
	repositoryURL: string,
	/** url of the issue in the repository */
	issueURL?: string
};
	["Query"]: {
	__typename: "Query",
	/** detail view of the feature request. Should be used to fetch comments */
	featureRequest?: GraphQLTypes["FeatureRequest"],
	/** Feature requests displayed on the home page */
	home: Array<GraphQLTypes["FeatureRequest"]>,
	moleUserQuery?: GraphQLTypes["MoleUserQuery"],
	/** Queries for logged in users */
	user?: GraphQLTypes["UserQuery"]
};
	/** Comment on featuremole.com portal */
["Comments"]: {
	__typename: "Comments",
	/** content of the comment */
	content: string,
	createdAt: string,
	featureRequest: GraphQLTypes["FeatureRequest"],
	/** primary key. Index of the comment */
	index: number,
	replyTo?: GraphQLTypes["Comments"]
};
	["MoleUser"]: {
	__typename: "MoleUser",
	avatar?: string,
	company?: string,
	createdAt: string,
	/** feature requests created by this user */
	featureRequests: Array<GraphQLTypes["FeatureRequest"]>,
	firstName?: string,
	lastName?: string,
	/** worms in the wallet */
	worms: number
};
	["DealStatus"]: DealStatus;
	["Mutation"]: {
	__typename: "Mutation",
	/** pipe to mole user mutations */
	moleUser?: GraphQLTypes["MoleUserMutation"],
	/** sign up a new MoleUser */
	signUp?: boolean,
	/** pipe to user related mutations in users system */
	user?: GraphQLTypes["UserMutation"]
};
	["CreateComment"]: {
		/** If replying to another comment provide its index */
	replyToIndex?: number,
	/** feature request issue URL */
	featureRequest: string,
	/** content of the comment */
	content: string
};
	/** # Deal
Deal between 2 **MoleUsers**

## Creation of a deal
It happens when DealRequest is accepted by both parties */
["Deal"]: {
	__typename: "Deal",
	createdAt: string,
	/** Deadline proposed by the supplier */
	deadline: string,
	/** feature request for this deal */
	featureRequest: GraphQLTypes["FeatureRequest"],
	/** Status of the deal */
	status?: GraphQLTypes["DealStatus"],
	/** Supplier accepted for the deal */
	user: GraphQLTypes["MoleUser"]
};
	["ProgrammingLanguage"]: {
	__typename: "ProgrammingLanguage",
	colour: string,
	name: string
};
	/** Request to help on the issue */
["DealRequest"]: {
	__typename: "DealRequest",
	/** If offer is accepted */
	accepted?: boolean,
	createdAt: string,
	/** Deadline proposed by the user (must be sooner than deadline of feature request) */
	deadline: string,
	/** Feature request this deal is about */
	featureRequest: GraphQLTypes["FeatureRequest"],
	/** Additional message */
	message?: string,
	/** OUser who offered deal */
	user: GraphQLTypes["MoleUser"]
};
	/** All mutations of users system */
["UserMutation"]: {
	__typename: "UserMutation",
	forgotPassword?: boolean,
	/** Make user a superadmin on a first call. Then you need to be an admin to call this */
	makeAdmin?: boolean,
	/** Register a new user<br> */
	register?: GraphQLTypes["LoggedInData"],
	resetPassword?: boolean
}
    }
export enum DealStatus {
	WIP = "WIP",
	REJECTED = "REJECTED",
	ACCEPTED = "ACCEPTED",
	WAITING = "WAITING"
}


export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
  UnwrapPromise<ReturnType<T>>
>;
export type ZeusHook<
  T extends (
    ...args: any[]
  ) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>
> = ZeusState<ReturnType<T>[N]>;

type WithTypeNameValue<T> = T & {
  __typename?: true;
};
type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

type NotUnionTypes<SRC extends DeepAnify<DST>, DST> = {
  [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
}[keyof DST];

type ExtractUnions<SRC extends DeepAnify<DST>, DST> = {
  [P in keyof SRC]: SRC[P] extends '__union' & infer R
    ? P extends keyof DST
      ? IsArray<R, DST[P] & { __typename: true }>
      : {}
    : never;
}[keyof SRC];

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
  ? ExtractUnions<SRC, DST> &
      {
        [P in keyof Omit<Pick<SRC, NotUnionTypes<SRC, DST>>, '__typename'>]: DST[P] extends true
          ? SRC[P]
          : IsArray<SRC[P], DST[P]>;
      }
  : {
      [P in keyof Pick<SRC, keyof DST>]: DST[P] extends true ? SRC[P] : IsArray<SRC[P], DST[P]>;
    };



export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
export type OperationToGraphQL<V, T> = <Z extends V>(o: Z | V, variables?: Record<string, any>) => Promise<InputType<T, Z>>;
export type SubscriptionToGraphQL<V, T> = <Z extends V>(
  o: Z | V,
  variables?: Record<string, any>,
) => {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void;
  error: (e: { data?: InputType<T, Z>; message?: string }) => void;
  open: () => void;
};
export type CastToGraphQL<V, T> = (resultOfYourQuery: any) => <Z extends V>(o: Z | V) => InputType<T, Z>;
export type SelectionFunction<V> = <T>(t: T | V) => T;
export type fetchOptions = ArgsType<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
  ...args: infer R
) => WebSocket
  ? R
  : never;
export type chainOptions =
  | [fetchOptions[0], fetchOptions[1] & {websocket?: websocketOptions}]
  | [fetchOptions[0]];
export type FetchFunction = (
  query: string,
  variables?: Record<string, any>,
) => Promise<any>;
export type SubscriptionFunction = (
  query: string,
  variables?: Record<string, any>,
) => void;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export declare function Thunder(
  fn: FetchFunction,
  subscriptionFn: SubscriptionFunction
):{
  query: OperationToGraphQL<ValueTypes["Query"],GraphQLTypes["Query"]>,mutation: OperationToGraphQL<ValueTypes["Mutation"],GraphQLTypes["Mutation"]>
}

export declare function Chain(
  ...options: chainOptions
):{
  query: OperationToGraphQL<ValueTypes["Query"],GraphQLTypes["Query"]>,mutation: OperationToGraphQL<ValueTypes["Mutation"],GraphQLTypes["Mutation"]>
}

export declare const Zeus: {
  query: (o: ValueTypes["Query"]) => string,mutation: (o: ValueTypes["Mutation"]) => string
}

export declare const Cast: {
  query: CastToGraphQL<
  ValueTypes["Query"],
  GraphQLTypes["Query"]
>,mutation: CastToGraphQL<
  ValueTypes["Mutation"],
  GraphQLTypes["Mutation"]
>
}

export declare const Selectors: {
  query: SelectionFunction<ValueTypes["Query"]>,mutation: SelectionFunction<ValueTypes["Mutation"]>
}

export declare const resolverFor : <
  T extends keyof ValueTypes,
  Z extends keyof ValueTypes[T],
  Y extends (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> : any
>(
  type: T,
  field: Z,
  fn: Y,
) => (args?:any, source?:any) => void;

export declare const Gql: ReturnType<typeof Chain>
