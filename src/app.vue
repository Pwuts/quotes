<template>
  <div class="bar">
    <NuxtLink to="/">{{ getLocalizedString("home") }}</NuxtLink>

    <div class="sub" v-if="!authState.loggedIn">
      <NuxtLink to="/login">{{ getLocalizedString("signIn") }}</NuxtLink>
      <NuxtLink to="/register">{{ getLocalizedString("signUp") }}</NuxtLink>
    </div>
    <div class="sub" v-else>
      <a href="#" @click="logOut">{{ getLocalizedString("signOut") }}</a>
      <NuxtLink to="/profile">{{ getLocalizedString("profile") }}</NuxtLink>
    </div>
  </div>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { getLocalizedString } from "~/util/localization";
const authState = useAuthState();
const router = useRouter();

function logOut() {
  authState.reset();
  router.push("/");
}
</script>

<style lang="scss">
:root {
  font-size: 24px;

  --primary-bg: #222;
  --primary-text: #fff8;
  --secondary-text: #fff6;
  --tertiary-text: #fff4;
}

* {
  box-sizing: border-box;
}

body {
  background: var(--primary-bg);
  color: var(--primary-text);
  font-family: "Comic Sans MS", serif;

  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#__nuxt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.bar {
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;

  a {
    margin: 0 0.5em;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

main {
  flex-grow: 1;

  &.container {
    padding: 0.5em 2em 1.5em;

    @media screen and (max-width: 600px) {
      padding: 0.75em;
    }
  }
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  &.vcentered {
    justify-content: center;
  }

  > * {
    max-width: 100%;
  }
}

a,
a:visited {
  color: var(--secondary-text);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 500;
}

input[type="text"],
input[type="search"],
input[type="email"],
input[type="password"],
button,
input[type="button"] {
  padding: 0.25em 0.5em;
  border: solid #fff5;
  border-width: 0 0 2px;

  font-size: 1em;
  background: none;
  color: var(--secondary-text);

  &.error {
    border-color: red;
  }
}

button,
input[type="button"] {
  cursor: pointer;

  &.block {
    align-self: stretch;
  }
}

input[type="text"],
input[type="search"],
input[type="email"],
input[type="password"] {
  &::placeholder {
    color: var(--tertiary-text);
  }
}

i.icon,
.text-icon {
  font-style: normal;
  user-select: none;
  letter-spacing: -0.1em;
  color: #fffc;

  &.disabled {
    color: var(--tertiary-text);
  }
}
.text-icon {
  letter-spacing: 0;
  font-size: 1.25em;
  padding: 0 0.3em;
}
button,
span {
  i.icon {
    font-size: 0.8em;
  }
}

.clickable {
  user-select: none;

  &:not(.disabled) {
    cursor: pointer;
  }
}

.disabled,
.inactive {
  color: var(--tertiary-text);
}

.nowrap {
  white-space: nowrap;
}
</style>
