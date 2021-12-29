import { useCookie } from '#app'
import { Ref } from 'nuxt3/dist/app/compat/capi'

type _AuthState = {
  loggedIn: boolean,
  user?: {
    id: number,
    name: string,
    email: string,
  },

  jwt?: string,
}

export type AuthState = Ref<_AuthState> & {
  getAuthHeader: () => Record<string, string>,
  set(state: _AuthState): void,
  reset(): void,
}

const _defaultAuthState: _AuthState = {
  loggedIn: false,
  user: undefined,
  jwt: undefined,
};

export default function useAuthState(): AuthState
{
  const authStateStorage = useCookie<string>(
    'authStateStorage',
    {
      maxAge: 149*24*3600,
      default: () => JSON.stringify(_defaultAuthState),
    }
  );

  const authState: Ref<_AuthState> = useState(
    'authState',
    () => {
      return typeof authStateStorage.value == 'string'
        ? JSON.parse(authStateStorage.value)
        : authStateStorage.value;
    },
  );

  watch(authState.value, (newState) => authStateStorage.value = JSON.stringify(newState));

  return Object.assign(authState, {
    getAuthHeader(): Record<string, string>
    {
      return !authState.value.jwt ? {} : {
        'authorization': `Bearer ${authState.value.jwt}`
      };
    },

    set(state: _AuthState): void
    {
      Object.assign(authState.value, _defaultAuthState, state);
    },

    reset(): void
    {
      Object.assign(authState.value, _defaultAuthState);
    },
  });
}
