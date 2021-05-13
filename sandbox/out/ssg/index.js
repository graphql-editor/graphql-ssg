export const AllTypesProps = {
	Mutation:{
		signUp:{
			user:{
				type:"SignUp",
				array:false,
				arrayRequired:false,
				required:false
			}
		}
	},
	MoleUserMutation:{
		acceptDealRequest:{
			request:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		closeDeal:{
			deal:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		createComment:{
			comment:{
				type:"CreateComment",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		createFeatureRequest:{
			featureRequest:{
				type:"CreateFeatureRequest",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		finishWork:{
			deal:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		offerDealRequest:{
			request:{
				type:"CreateDealRequest",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	UserQuery:{
		login:{
			user:{
				type:"UserBasicData",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	SignUp:{
		firstName:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		},
		lastName:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		},
		company:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		}
	},
	CreateFeatureRequest:{
		issueURL:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		},
		languages:{
			type:"String",
			array:true,
			arrayRequired:true,
			required:true
		},
		content:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		repositoryURL:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	Query:{
		featureRequest:{
			featureRequest:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	DealStatus: "enum",
	CreateDealRequest:{
		featureRequest:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		deadline:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		message:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		}
	},
	ResetPassword:{
		token:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		newPassword:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	CreateComment:{
		content:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		replyToIndex:{
			type:"Int",
			array:false,
			arrayRequired:false,
			required:false
		},
		featureRequest:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	UserMutation:{
		forgotPassword:{
			username:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		makeAdmin:{
			username:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		register:{
			user:{
				type:"UserBasicData",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		resetPassword:{
			reset:{
				type:"ResetPassword",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	UserBasicData:{
		username:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		password:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	}
}

export const ReturnTypes = {
	Mutation:{
		moleUser:"MoleUserMutation",
		signUp:"Boolean",
		user:"UserMutation"
	},
	MoleUserMutation:{
		acceptDealRequest:"Boolean",
		closeDeal:"Boolean",
		createComment:"Boolean",
		createFeatureRequest:"Boolean",
		finishWork:"Boolean",
		offerDealRequest:"Boolean"
	},
	UserQuery:{
		isAdmin:"Boolean",
		isAdminClaimPossible:"Boolean",
		login:"LoggedInData"
	},
	DealRequest:{
		accepted:"Boolean",
		createdAt:"String",
		deadline:"String",
		featureRequest:"FeatureRequest",
		message:"String",
		user:"MoleUser"
	},
	Comment:{
		content:"String",
		createdAt:"String",
		featureRequest:"FeatureRequest",
		index:"Int",
		replyTo:"Comment"
	},
	Query:{
		featureRequest:"FeatureRequest",
		home:"FeatureRequest",
		moleUserQuery:"MoleUserQuery",
		user:"UserQuery"
	},
	LoggedInData:{
		token:"String"
	},
	MoleUserQuery:{
		deals:"Deal",
		featureRequests:"FeatureRequest",
		givenDealRequsts:"DealRequest",
		receivedDealRequests:"DealRequest"
	},
	FeatureRequest:{
		comments:"Comment",
		content:"String",
		createdAt:"String",
		createdBy:"MoleUser",
		issueURL:"String",
		languages:"ProgrammingLanguage",
		offeredWorms:"Int",
		repositoryURL:"String",
		title:"String"
	},
	MoleUser:{
		avatar:"String",
		company:"String",
		createdAt:"String",
		featureRequests:"FeatureRequest",
		firstName:"String",
		lastName:"String",
		worms:"Int"
	},
	Deal:{
		createdAt:"String",
		deadline:"String",
		featureRequest:"FeatureRequest",
		status:"DealStatus",
		user:"MoleUser"
	},
	UserMutation:{
		forgotPassword:"Boolean",
		makeAdmin:"Boolean",
		register:"LoggedInData",
		resetPassword:"Boolean"
	},
	ProgrammingLanguage:{
		colour:"String",
		name:"String"
	}
}


export class GraphQLError extends Error {
    constructor(response) {
      super("");
      this.response = response;
      console.error(response);
    }
    toString() {
      return "GraphQL Response Error";
    }
  }



export const ScalarResolver = (scalar, value) => {
  switch (scalar) {
    case 'String':
      return  `${JSON.stringify(value)}`;
    case 'Int':
      return `${value}`;
    case 'Float':
      return `${value}`;
    case 'Boolean':
      return `${value}`;
    case 'ID':
      return `"${value}"`;
    case 'enum':
      return `${value}`;
    case 'scalar':
      return `${value}`;
    default:
      return false;
  }
};  


export const TypesPropsResolver = ({
    value,
    type,
    name,
    key,
    blockArrays
}) => {
    if (value === null) {
        return `null`;
    }
    let resolvedValue = AllTypesProps[type][name];
    if (key) {
        resolvedValue = resolvedValue[key];
    }
    if (!resolvedValue) {
        throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`)
    }
    const typeResolved = resolvedValue.type;
    const isArray = resolvedValue.array;
    const isArrayRequired = resolvedValue.arrayRequired;
    if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
        const isRequired = resolvedValue.required ? '!' : '';
        let t = `${typeResolved}`;
        if (isArray) {
          if (isRequired) {
              t = `${t}!`;
          }
          t = `[${t}]`;
          if(isArrayRequired){
            t = `${t}!`;
          }
        }else{
          if (isRequired) {
                t = `${t}!`;
          }
        }
        return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
    }
    if (isArray && !blockArrays) {
        return `[${value
        .map((v) => TypesPropsResolver({ value: v, type, name, key, blockArrays: true }))
        .join(',')}]`;
    }
    const reslovedScalar = ScalarResolver(typeResolved, value);
    if (!reslovedScalar) {
        const resolvedType = AllTypesProps[typeResolved];
        if (typeof resolvedType === 'object') {
        const argsKeys = Object.keys(resolvedType);
        return `{${argsKeys
            .filter((ak) => value[ak] !== undefined)
            .map(
            (ak) => `${ak}:${TypesPropsResolver({ value: value[ak], type: typeResolved, name: ak })}`
            )}}`;
        }
        return ScalarResolver(AllTypesProps[typeResolved], value);
    }
    return reslovedScalar;
};


const isArrayFunction = (
  parent,
  a
) => {
  const [values, r] = a;
  const [mainKey, key, ...keys] = parent;
  const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');

  if (!keys.length) {
      return keyValues.length > 0
        ? `(${keyValues
            .map(
              (v) =>
                `${v}:${TypesPropsResolver({
                  value: values[v],
                  type: mainKey,
                  name: key,
                  key: v
                })}`
            )
            .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
        : traverseToSeekArrays(parent, r);
    }

  const [typeResolverKey] = keys.splice(keys.length - 1, 1);
  let valueToResolve = ReturnTypes[mainKey][key];
  for (const k of keys) {
    valueToResolve = ReturnTypes[valueToResolve][k];
  }

  const argumentString =
    keyValues.length > 0
      ? `(${keyValues
          .map(
            (v) =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: valueToResolve,
                name: typeResolverKey,
                key: v
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  return argumentString;
};


const resolveKV = (k, v) =>
  typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;


const objectToTree = (o) =>
  `{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;


const traverseToSeekArrays = (parent, a) => {
  if (!a) return '';
  if (Object.keys(a).length === 0) {
    return '';
  }
  let b = {};
  if (Array.isArray(a)) {
    return isArrayFunction([...parent], a);
  } else {
    if (typeof a === 'object') {
      Object.keys(a)
        .filter((k) => typeof a[k] !== 'undefined')    
        .map((k) => {
        if (k === '__alias') {
          Object.keys(a[k]).map((aliasKey) => {
            const aliasOperations = a[k][aliasKey];
            const aliasOperationName = Object.keys(aliasOperations)[0];
            const aliasOperation = aliasOperations[aliasOperationName];
            b[
              `${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
            ] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
          });
        } else {
          b[k] = traverseToSeekArrays([...parent, k], a[k]);
        }
      });
    } else {
      return '';
    }
  }
  return objectToTree(b);
};  


const buildQuery = (type, a) =>
  traverseToSeekArrays([type], a)  


const inspectVariables = (query) => {
  const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
  let result;
  const AllVariables = [];
  while ((result = regex.exec(query))) {
    if (AllVariables.includes(result[0])) {
      continue;
    }
    AllVariables.push(result[0]);
  }
  if (!AllVariables.length) {
    return query;
  }
  let filteredQuery = query;
  AllVariables.forEach((variable) => {
    while (filteredQuery.includes(variable)) {
      filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
    }
  });
  return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
    .map(([variableName, variableType]) => `${variableName}:${variableType}`)
    .join(', ')})${filteredQuery}`;
};


export const queryConstruct = (t, tName) => (o) => `${t.toLowerCase()}${inspectVariables(buildQuery(tName, o))}`;  


const fullChainConstruct = (fn) => (t,tName) => (o, variables) => fn(queryConstruct(t, tName)(o), variables).then(r => { 
  seekForAliases(r)
  return r
});

export const fullChainConstructor = (
  fn,
  operation,
  key,
) =>
  ((o, variables) => fullChainConstruct(fn)(operation, key)(o, variables))


const fullSubscriptionConstruct = (fn) => (
  t,
  tName,
) => (o, variables) =>
  fn(queryConstruct(t, tName)(o), variables);
  
export const fullSubscriptionConstructor = (
  fn,
  operation,
  key,
) =>
  ((o, variables) => fullSubscriptionConstruct(fn)(operation, key)(o, variables))


const seekForAliases = (o) => {
  const traverseAlias = (value) => {
    if (Array.isArray(value)) {
      value.forEach(seekForAliases);
    } else {
      if (typeof value === 'object') {
        seekForAliases(value);
      }
    }
  };
  if (typeof o === 'object' && o) {
    const keys = Object.keys(o);
    if (keys.length < 1) {
      return;
    }
    keys.forEach((k) => {
      const value = o[k];
      if (k.indexOf('__alias__') !== -1) {
        const [operation, alias] = k.split('__alias__');
        o[alias] = {
          [operation]: value
        };
        delete o[k];
      }
      traverseAlias(value);
    });
  }
};


export const $ = (t) => `ZEUS_VAR$${t.join('')}`;

export const ZeusSelect = () => (t) => t

export const resolverFor = (
  type,
  field,
  fn
) => fn;


const handleFetchResponse = response => {
  if (!response.ok) {
    return new Promise((resolve, reject) => {
      response.text().then(text => {
        try { reject(JSON.parse(text)); }
        catch (err) { reject(text); }
      }).catch(reject);
    });
  }
  return response.json();
};

export const apiFetch = (options) => (query, variables = {}) => {
    const fetchFunction = fetch;
    let queryString = query;
    let fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      queryString = encodeURIComponent(query);
      return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          seekForAliases(response.data)
          return response.data;
        });
    }
    return fetchFunction(`${options[0]}`, {
      body: JSON.stringify({ query: queryString, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
      .then(handleFetchResponse)
      .then((response) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        seekForAliases(response.data)
        return response.data;
      });
  };

export const apiSubscription = (options) => (
    query,
    variables,
  ) => {
    try {
      const queryString = options[0] + '?query=' + encodeURIComponent(query);
      const wsString = queryString.replace('http', 'ws');
      const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
      const webSocketOptions = options[1]?.websocket || [host];
      const ws = new WebSocket(...webSocketOptions);
      return {
        ws,
        on: (e) => {
          ws.onmessage = (event) => {
            if(event.data){
              const parsed = JSON.parse(event.data)
              const data = parsed.data
              if (data) {
                seekForAliases(data);
              }
              return e(data);
            }
          };
        },
        off: (e) => {
          ws.onclose = e;
        },
        error: (e) => {
          ws.onerror = e;
        },
        open: (e) => {
          ws.onopen = e;
        },
      };
    } catch {
      throw new Error('No websockets implemented');
    }
  };

  
export const Thunder = (fn) => ({
  query: fullChainConstructor(fn,'query', 'Query'),
mutation: fullChainConstructor(fn,'mutation', 'Mutation')
});

export const Chain = (...options) => ({
  query: fullChainConstructor(apiFetch(options),'query', 'Query'),
mutation: fullChainConstructor(apiFetch(options),'mutation', 'Mutation')
});
export const Zeus = {
  query: (o) => queryConstruct('query', 'Query')(o),
mutation: (o) => queryConstruct('mutation', 'Mutation')(o)
};
export const Cast = {
  query: (o) => (b) => o,
mutation: (o) => (b) => o
};
export const Selectors = {
  query: ZeusSelect(),
mutation: ZeusSelect()
};
    

  import {Remarkable} from 'https://cdn.skypack.dev/remarkable';
  export const html =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
  export const css =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
  const remarkableRenderer = new Remarkable()
  export const md = (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return remarkableRenderer.render(str);
  } 
  