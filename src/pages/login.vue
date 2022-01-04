<template>
<main class="vcentered container">
  <form class="container" onsubmit="return false">
    <input type="email"
      autocomplete="email"
      :placeholder="getLocalizedString('email')"
      v-model="email"
      :class="{ error: loginFailed }"
    />

    <input type="password"
      autocomplete="current-password"
      :placeholder="getLocalizedString('password')"
      v-model="password"
      :class="{ error: loginFailed }"
    />

    <button @click="attemptLogin" v-text="getLocalizedString('signIn')"></button>
  </form>
</main>
</template>

<script lang="ts" setup>
import { getLocalizedString } from '~/util/localization'
const authState = useAuthState();
const router = useRouter();

if (authState.value.loggedIn) {
  router.push('/profile');
}

let email = ref('');
let password = ref('');
let loginFailed = ref(false);

function attemptLogin()
{
  $fetch('/api/user/login', {
    method: 'POST',
    body: { email: email.value, password: password.value },
  })
  .then(response => {
    loginFailed.value = false;
    authState.set({
      loggedIn: true,
      jwt: (response as { token: string }).token,
      user: { id: response.id, name: response.name, email: response.email },
    });
    router.push('/');
  })
  .catch((e) => {
    console.error(e);
    loginFailed.value = true;
  });
}
</script>

<style lang="scss">
form {
  input, button {
    flex: 0 1 auto;
    margin: 0.5em;
  }
}
</style>
