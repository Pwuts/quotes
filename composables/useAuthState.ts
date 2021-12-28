import { useCookie } from '#app'

type _AuthState = {
  loggedIn: boolean,
  user?: {
    name: string,
    email: string,
  },

  jwt?: string,
}

export type AuthState = _AuthState & {
  getAuthHeader: () => Record<string, string>,
  set(state: _AuthState): void,
  reset(): void,
}

const _defaultAuthState: _AuthState = {
  loggedIn: false,
  user: undefined,
  jwt: undefined,
};

export default function useAuthState()
{
  const authStateStorage = useCookie<string>(
    'authState',
    {
      maxAge: 149*24*3600,
      default: () => JSON.stringify(_defaultAuthState),
    }
  );

  function _load(): _AuthState {
    // dirty hack because server does implicit JSON parse
    return typeof authStateStorage.value == 'string'
      ? JSON.parse(authStateStorage.value)
      : authStateStorage.value;
  }
  function _store(obj: _AuthState) {
    authStateStorage.value = JSON.stringify(obj);
  }

  const authState: AuthState = {
    get loggedIn() {
      return _load().loggedIn;
    },

    get jwt() {
      return _load().jwt;
    },

    get user() {
      return _load().user;
    },

    set loggedIn(value: boolean) {
      _store({
        ..._load(),
        loggedIn: value,
      });
    },

    set jwt(value: string) {
      _store({
        ..._load(),
        jwt: value,
      });
    },

    set user(value: _AuthState['user']) {
      _store({
        ..._load(),
        user: value,
      });
    },

    getAuthHeader(): Record<string, string>
    {
      return !authState.jwt ? {} : {
        'authorization': `Bearer ${authState.jwt}`
      };
    },

    set(state: _AuthState): void
    {
      _store(state);
    },

    reset(): void
    {
      _store(_defaultAuthState);
    },
  }

  return authState;
}
