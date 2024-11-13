import { useContext, useEffect, useReducer } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { userToken } from '../services/authentication';
import { TokenAction, TokenContext } from '../states/token.state';
import { useBlockedUserHandler } from './useBlockedUserHandler';

enum ActionType {
  REQUEST_START = 'REQUEST_START',
  REQUEST_END = 'REQUEST_END',
}

type State<T> = {
  loading: boolean;
  error?: AxiosError;
  response?: AxiosResponse;
  data?: T;
};
type Action = { type: ActionType; error?: boolean; payload?: any };

function reducer(state: State<any>, action: Action): State<any> {
  switch (action.type) {
    case ActionType.REQUEST_START:
      // console.log('request start', (state));

      return {
        ...state,
        loading: true,
      };
    case ActionType.REQUEST_END:
      console.log(
        action.payload.config.baseURL + '-->' + action.payload.config.url,
        'API Response with > Resp > ',
        action.payload.data,
      );

      return {
        ...state,
        loading: false,
        ...(action.error
          ? { error: action.payload }
          : {
              error: undefined,
              response: action.payload,
              data: action.payload.data,
            }),
      };
    default:
      return state;
  }
}

export type AxiosResult = { error?: AxiosError; response: AxiosResponse };

export type UseAxiosConfig<T = any> = Partial<AxiosRequestConfig> & {
  initial?: boolean;
  token?: { currentToken: string; dispatch: React.Dispatch<TokenAction> };
  onSuccess?: (response: AxiosResponse<T>) => void;
  onError?: (error: AxiosError) => void;
  transform?: (data: any) => T;
};

async function request<T = any>(
  { onError, onSuccess, token, ...config }: UseAxiosConfig<T>,
  dispatch: (action: Action) => any,
): Promise<AxiosResult> {
  try {
    dispatch({ type: ActionType.REQUEST_START });
    // Update token context if different from new one
    const newToken = await userToken(false);
    if (newToken && token?.currentToken !== newToken) {
      if (token) {
        token.dispatch({ type: 'setToken', token: newToken });
      }
    }

    const response = await axios({
      ...config,
      headers: { Authorization: `Bearer ${newToken}` },
    });
    console.log(
      axios.defaults.baseURL + ' --> ' + config.url,
      response.config.method + ' > Body > ' + response.config.data,
      ' < 2nd response > response > ',
      response,
    );
    if (typeof config.transform === 'function') {
      response.data = config.transform(response.data);
    }
    dispatch({ type: ActionType.REQUEST_END, payload: response });
    if (onSuccess) {
      onSuccess(response);
    }
    return {
      response,
      error: undefined,
    };
  } catch (error) {
    dispatch({ type: ActionType.REQUEST_END, payload: error, error: true });
    if (onError) {
      onError(error);
    }
    return {
      response: undefined,
      error,
    } as any;
  }
}

export function useAxios<T = any>(
  config: UseAxiosConfig<T> | string,
): [
  State<T>,
  (configOverride?: Partial<UseAxiosConfig>) => Promise<AxiosResult>,
] {
  const {
    state: { token },
    dispatch: dispatchToken,
  } = useContext(TokenContext);
  // console.log('API called with > ', axios.defaults.baseURL, JSON.stringify(config));
  const { checkAndSetBlockedUser } = useBlockedUserHandler();

  const onError = (error: AxiosError) => {
    checkAndSetBlockedUser(error);
    if (typeof config !== 'string' && config.onError) {
      config.onError(error);
    }
  };

  const tokenConfig = {
    token: {
      currentToken: token,
      dispatch: dispatchToken,
    },
  };

  const combinedConfig =
    typeof config === 'string'
      ? {
          url: config,
          initial: false,
          onError,
          ...tokenConfig,
        }
      : {
          ...config,
          onError,
          ...tokenConfig,
        };

  const [state, dispatch] = useReducer(reducer, {
    loading: !!combinedConfig.initial,
  });

  useEffect(() => {
    if (combinedConfig.initial) {
      request<T>(combinedConfig, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config)]);

  return [
    state,
    (configOverride?) =>
      request<T>({ ...combinedConfig, ...configOverride }, dispatch),
  ];
}
