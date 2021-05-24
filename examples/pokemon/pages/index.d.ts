
// Return html string from this function fo ssg;
declare const render: <T>(fn:Function) => void;
declare var html: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var css: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var md: (strings: TemplateStringsArray, ...expr: string[]) => string

type ZEUS_INTERFACES = never
type ZEUS_UNIONS = never

declare type ValueTypes = {
    /** Query any Pokémon by number or name */
["Query"]: AliasType<{
	query?:ValueTypes["Query"],
pokemons?: [{	first:number},ValueTypes["Pokemon"]],
pokemon?: [{	id?:string,	name?:string},ValueTypes["Pokemon"]],
		__typename?: true
}>;
	/** Represents a Pokémon */
["Pokemon"]: AliasType<{
	/** The ID of an object */
	id?:true,
	/** The identifier of this Pokémon */
	number?:true,
	/** The name of this Pokémon */
	name?:true,
	/** The minimum and maximum weight of this Pokémon */
	weight?:ValueTypes["PokemonDimension"],
	/** The minimum and maximum weight of this Pokémon */
	height?:ValueTypes["PokemonDimension"],
	/** The classification of this Pokémon */
	classification?:true,
	/** The type(s) of this Pokémon */
	types?:true,
	/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant?:true,
	/** The attacks of this Pokémon */
	attacks?:ValueTypes["PokemonAttack"],
	/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses?:true,
	fleeRate?:true,
	/** The maximum CP of this Pokémon */
	maxCP?:true,
	/** The evolutions of this Pokémon */
	evolutions?:ValueTypes["Pokemon"],
	/** The evolution requirements of this Pokémon */
	evolutionRequirements?:ValueTypes["PokemonEvolutionRequirement"],
	/** The maximum HP of this Pokémon */
	maxHP?:true,
	image?:true,
		__typename?: true
}>;
	/** Represents a Pokémon's dimensions */
["PokemonDimension"]: AliasType<{
	/** The minimum value of this dimension */
	minimum?:true,
	/** The maximum value of this dimension */
	maximum?:true,
		__typename?: true
}>;
	/** Represents a Pokémon's attack types */
["PokemonAttack"]: AliasType<{
	/** The fast attacks of this Pokémon */
	fast?:ValueTypes["Attack"],
	/** The special attacks of this Pokémon */
	special?:ValueTypes["Attack"],
		__typename?: true
}>;
	/** Represents a Pokémon's attack types */
["Attack"]: AliasType<{
	/** The name of this Pokémon attack */
	name?:true,
	/** The type of this Pokémon attack */
	type?:true,
	/** The damage of this Pokémon attack */
	damage?:true,
		__typename?: true
}>;
	/** Represents a Pokémon's requirement to evolve */
["PokemonEvolutionRequirement"]: AliasType<{
	/** The amount of candy to evolve */
	amount?:true,
	/** The name of the candy to evolve */
	name?:true,
		__typename?: true
}>
  }

declare type ModelTypes = {
    /** Query any Pokémon by number or name */
["Query"]: {
		query?:ModelTypes["Query"],
	pokemons?:(ModelTypes["Pokemon"] | undefined)[],
	pokemon?:ModelTypes["Pokemon"]
};
	/** Represents a Pokémon */
["Pokemon"]: {
		/** The ID of an object */
	id:string,
	/** The identifier of this Pokémon */
	number?:string,
	/** The name of this Pokémon */
	name?:string,
	/** The minimum and maximum weight of this Pokémon */
	weight?:ModelTypes["PokemonDimension"],
	/** The minimum and maximum weight of this Pokémon */
	height?:ModelTypes["PokemonDimension"],
	/** The classification of this Pokémon */
	classification?:string,
	/** The type(s) of this Pokémon */
	types?:(string | undefined)[],
	/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant?:(string | undefined)[],
	/** The attacks of this Pokémon */
	attacks?:ModelTypes["PokemonAttack"],
	/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses?:(string | undefined)[],
	fleeRate?:number,
	/** The maximum CP of this Pokémon */
	maxCP?:number,
	/** The evolutions of this Pokémon */
	evolutions?:(ModelTypes["Pokemon"] | undefined)[],
	/** The evolution requirements of this Pokémon */
	evolutionRequirements?:ModelTypes["PokemonEvolutionRequirement"],
	/** The maximum HP of this Pokémon */
	maxHP?:number,
	image?:string
};
	/** Represents a Pokémon's dimensions */
["PokemonDimension"]: {
		/** The minimum value of this dimension */
	minimum?:string,
	/** The maximum value of this dimension */
	maximum?:string
};
	/** Represents a Pokémon's attack types */
["PokemonAttack"]: {
		/** The fast attacks of this Pokémon */
	fast?:(ModelTypes["Attack"] | undefined)[],
	/** The special attacks of this Pokémon */
	special?:(ModelTypes["Attack"] | undefined)[]
};
	/** Represents a Pokémon's attack types */
["Attack"]: {
		/** The name of this Pokémon attack */
	name?:string,
	/** The type of this Pokémon attack */
	type?:string,
	/** The damage of this Pokémon attack */
	damage?:number
};
	/** Represents a Pokémon's requirement to evolve */
["PokemonEvolutionRequirement"]: {
		/** The amount of candy to evolve */
	amount?:number,
	/** The name of the candy to evolve */
	name?:string
}
    }

declare type GraphQLTypes = {
    /** Query any Pokémon by number or name */
["Query"]: {
	__typename: "Query",
	query: GraphQLTypes["Query"] | null,
	pokemons: Array<GraphQLTypes["Pokemon"] | null> | null,
	pokemon: GraphQLTypes["Pokemon"] | null
};
	/** Represents a Pokémon */
["Pokemon"]: {
	__typename: "Pokemon",
	/** The ID of an object */
	id: string,
	/** The identifier of this Pokémon */
	number: string | null,
	/** The name of this Pokémon */
	name: string | null,
	/** The minimum and maximum weight of this Pokémon */
	weight: GraphQLTypes["PokemonDimension"] | null,
	/** The minimum and maximum weight of this Pokémon */
	height: GraphQLTypes["PokemonDimension"] | null,
	/** The classification of this Pokémon */
	classification: string | null,
	/** The type(s) of this Pokémon */
	types: Array<string | null> | null,
	/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant: Array<string | null> | null,
	/** The attacks of this Pokémon */
	attacks: GraphQLTypes["PokemonAttack"] | null,
	/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses: Array<string | null> | null,
	fleeRate: number | null,
	/** The maximum CP of this Pokémon */
	maxCP: number | null,
	/** The evolutions of this Pokémon */
	evolutions: Array<GraphQLTypes["Pokemon"] | null> | null,
	/** The evolution requirements of this Pokémon */
	evolutionRequirements: GraphQLTypes["PokemonEvolutionRequirement"] | null,
	/** The maximum HP of this Pokémon */
	maxHP: number | null,
	image: string | null
};
	/** Represents a Pokémon's dimensions */
["PokemonDimension"]: {
	__typename: "PokemonDimension",
	/** The minimum value of this dimension */
	minimum: string | null,
	/** The maximum value of this dimension */
	maximum: string | null
};
	/** Represents a Pokémon's attack types */
["PokemonAttack"]: {
	__typename: "PokemonAttack",
	/** The fast attacks of this Pokémon */
	fast: Array<GraphQLTypes["Attack"] | null> | null,
	/** The special attacks of this Pokémon */
	special: Array<GraphQLTypes["Attack"] | null> | null
};
	/** Represents a Pokémon's attack types */
["Attack"]: {
	__typename: "Attack",
	/** The name of this Pokémon attack */
	name: string | null,
	/** The type of this Pokémon attack */
	type: string | null,
	/** The damage of this Pokémon attack */
	damage: number | null
};
	/** Represents a Pokémon's requirement to evolve */
["PokemonEvolutionRequirement"]: {
	__typename: "PokemonEvolutionRequirement",
	/** The amount of candy to evolve */
	amount: number | null,
	/** The name of the candy to evolve */
	name: string | null
}
    }



declare type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
declare type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
  UnwrapPromise<ReturnType<T>>
>;
declare type ZeusHook<
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
declare interface GraphQLResponse {
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



declare type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
declare type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
declare type OperationToGraphQL<V, T> = <Z extends V>(o: Z | V, variables?: Record<string, any>) => Promise<InputType<T, Z>>;
declare type SubscriptionToGraphQL<V, T> = <Z extends V>(
  o: Z | V,
  variables?: Record<string, any>,
) => {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void;
  error: (e: { data?: InputType<T, Z>; message?: string }) => void;
  open: () => void;
};
declare type CastToGraphQL<V, T> = (resultOfYourQuery: any) => <Z extends V>(o: Z | V) => InputType<T, Z>;
declare type SelectionFunction<V> = <T>(t: T | V) => T;
declare type fetchOptions = ArgsType<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
  ...args: infer R
) => WebSocket
  ? R
  : never;
declare type chainOptions =
  | [fetchOptions[0], fetchOptions[1] & {websocket?: websocketOptions}]
  | [fetchOptions[0]];
declare type FetchFunction = (
  query: string,
  variables?: Record<string, any>,
) => Promise<any>;
declare type SubscriptionFunction = (
  query: string,
  variables?: Record<string, any>,
) => void;
type NotUndefined<T> = T extends undefined ? never : T;
declare type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

declare  function Thunder(
  fn: FetchFunction
):{
  query: OperationToGraphQL<ValueTypes["Query"],GraphQLTypes["Query"]>
}

declare  function Chain(
  ...options: chainOptions
):{
  query: OperationToGraphQL<ValueTypes["Query"],GraphQLTypes["Query"]>
}

declare  const Zeus: {
  query: (o: ValueTypes["Query"]) => string
}

declare  const Cast: {
  query: CastToGraphQL<
  ValueTypes["Query"],
  GraphQLTypes["Query"]
>
}

declare  const Selectors: {
  query: SelectionFunction<ValueTypes["Query"]>
}

declare  const resolverFor : <
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

declare  const Gql: ReturnType<typeof Chain>
