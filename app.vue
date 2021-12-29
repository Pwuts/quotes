<template>
<div class="bar">
  <NuxtLink to="/">start</NuxtLink>

  <div class="sub">
    <NuxtLink to="/login" v-if="!authState.loggedIn">log in</NuxtLink>
    <a href="#"           v-else @click="logOut">log uit</a>

    <NuxtLink to="/register" v-if="!authState.loggedIn">registreer</NuxtLink>
    <NuxtLink to="/profile"  v-else>profiel</NuxtLink>
  </div>
</div>
<div class="container">
  <NuxtPage/>
</div>
</template>

<script lang="ts" setup>
const authState = useAuthState();
const router = useRouter();

function logOut()
{
  authState.reset();
  router.push('/');
}
</script>

<style lang="scss">
:root {
  font-size: 24px;

  --primary-bg: #222;
  --primary-text: #FFF8;
  --secondary-text: #FFF6;
  --tertiary-text: #FFF4;
}

body {
  background: var(--primary-bg);
  color: var(--primary-text);
  font-family: "Comic Sans MS", serif;

  margin: 0;
  padding: 0;
  min-height: 100vh;
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

.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.5em 2em 1.5em;
}


a, a:visited {
  color: var(--secondary-text);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 500;
}

.clickable {
  cursor: pointer;
}

.inactive {
  color: var(--tertiary-text);
}

input[type=text], input[type=search],
input[type=email], input[type=password],
button, input[type=button] {
  border: solid #FFF5;
  border-width: 0 0 2px;
  padding: 0.25em 0.5em;
  background: none;
  color: var(--secondary-text);

  font-size: 1.2rem;

  &.error {
    border-color: red;
  }
}

button, input[type=button] {
  cursor: pointer;

  &.block {
    align-self: stretch;
  }
}

input[type=text], input[type=search],
input[type=email], input[type=password] {
  &::placeholder {
    color: var(--tertiary-text);
  }
}
</style>
