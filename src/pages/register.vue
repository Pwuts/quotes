<template>
<main class="vcentered container">
  <form class="container" onsubmit="return false">
    <input type="text"
      autocomplete="name"
      placeholder="name"
      v-model="name"
      :class="{ error: signupFailed }"
    />

    <input type="email"
      autocomplete="email"
      placeholder="email"
      v-model="email"
      :class="{ error: signupFailed }"
    />

    <input type="password"
      autocomplete="new-password"
      placeholder="password"
      v-model="password"
      :class="{ error: signupFailed }"
    />

    <input type="text"
      autocomplete="one-time-code"
      placeholder="invite token"
      v-model="inviteToken"
      :class="{ error: signupFailed }"
    />

    <button @click="attemptSignup">registreer</button>
  </form>
</main>
</template>

<script lang="ts" setup>
const authState = useAuthState();
const router = useRouter();

if (authState.value.loggedIn) {
  router.push('/profile');
}

let name = ref('');
let email = ref('');
let password = ref('');
let inviteToken = ref(router.currentRoute.value.query.inviteToken ?? '');
let signupFailed = ref(false);

function attemptSignup()
{
  $fetch('/api/user/register', {
    method: 'POST',
    body: {
      name: name.value,
      email: email.value,
      password: password.value,
      inviteToken: inviteToken.value,
    },
  })
  .then(response => {
    signupFailed.value = false;
    authState.set({
      loggedIn: true,
      jwt: (response as { token: string }).token,
      user: { id: response.id, name: response.name, email: response.email },
    });
    router.push('/');
  })
  .catch((e) => {
    console.error(e);
    signupFailed.value = true;
  });
}
</script>

<style lang="scss">
form {
  input, button {
    margin: 0.5em;
  }
}
</style>
