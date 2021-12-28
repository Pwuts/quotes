<template>
<form onsubmit="return false">
  <input type="email"
    autocomplete="email"
    placeholder="email"
    v-model="email"
    :class="{ error: loginFailed }"
  />

  <input type="password"
    autocomplete="current-password"
    placeholder="password"
    v-model="password"
    :class="{ error: loginFailed }"
  />

  <button @click="attemptLogin">log in</button>
</form>
</template>

<script lang="ts" setup>
const authState = useAuthState();
const router = useRouter();

if (authState.loggedIn) {
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
      user: { name: response.name, email: response.email },
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input, button {
    margin: 0.5em;
  }
}
</style>
