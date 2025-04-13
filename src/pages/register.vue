<template>
  <main class="vcentered container">
    <form class="container" onsubmit="return false">
      <input
        type="text"
        autocomplete="name"
        :placeholder="getLocalizedString('name')"
        v-model="name"
        :class="{ error: signupFailed }"
      />

      <input
        type="email"
        autocomplete="email"
        :placeholder="getLocalizedString('email')"
        v-model="email"
        :class="{ error: signupFailed }"
      />

      <input
        type="password"
        autocomplete="new-password"
        :placeholder="getLocalizedString('password')"
        v-model="password"
        :class="{ error: signupFailed }"
      />

      <input
        type="text"
        autocomplete="one-time-code"
        :placeholder="getLocalizedString('inviteToken')"
        v-model="inviteToken"
        :class="{ error: signupFailed }"
      />

      <button @click="attemptSignup" v-text="getLocalizedString('signUp')"></button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute, useRouter } from "nuxt/app";

import { getLocalizedString } from "~/util/localization";
import useAuthState from "~/composables/useAuthState";

const authState = useAuthState();
const router = useRouter();
const route = useRoute();

if (authState.value.loggedIn) {
  router.push("/profile");
}

let name = ref("");
let email = ref("");
let password = ref("");
let inviteToken = ref((route.query.inviteToken as string | undefined) ?? "");
let signupFailed = ref(false);

function attemptSignup() {
  $fetch("/api/user/register", {
    method: "POST",
    body: {
      name: name.value,
      email: email.value,
      password: password.value,
      inviteToken: inviteToken.value,
    },
  })
    .then((response) => {
      signupFailed.value = false;
      authState.set({
        loggedIn: true,
        jwt: response.token,
        user: { id: response.id, name: response.name, email: response.email },
      });
      router.push("/");
    })
    .catch((e) => {
      console.error(e);
      signupFailed.value = true;
    });
}
</script>

<style lang="scss">
form {
  input,
  button {
    margin: 0.5em;
  }
}
</style>
