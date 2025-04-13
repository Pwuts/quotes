<template>
  <main class="profile vcentered container">
    <h1 class="name">{{ authState.user?.name ?? "Loading..." }}</h1>
    <h4 class="email">{{ authState.user?.email ?? "Loading..." }}</h4>
    <span class="stats" v-if="profile">
      <em>{{ profile._count.authoredQuotes }}</em>
      {{ getLocalizedString(profile._count.authoredQuotes == 1 ? "quote" : "quotes") }}
      &nbsp; - &nbsp;
      <em>
        {{ profile._count.invitees }}
      </em>
      <a
        href="#"
        @click="invite"
        :title="getLocalizedString('clickToInvite')"
        v-text="
          getLocalizedString(profile._count.invitees == 1 ? 'invitee' : 'invitees')
        "
      >
      </a>
    </span>

    <QuoteList v-if="profile" :quotes="profile.authoredQuotes" />
  </main>
</template>

<script lang="ts" setup>
import { getLocalizedString } from "~/util/localization";

const authState = useAuthState();
const router = useRouter();

if (!authState.value.loggedIn) {
  router.push("/login");
}

const { data: profile } = await useFetch("/api/user", {
  headers: authState.getAuthHeader(),
  transform: (profile) => ({
    ...profile,
    authoredQuotes: profile.authoredQuotes
      .map((serializedObj) => ({
        ...serializedObj,
        createdAt: new Date(serializedObj.createdAt),
        updatedAt: new Date(serializedObj.updatedAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  }),
}).then((result) => {
  if (result.data.value) {
    useSeoMeta({ title: `${result.data.value.name} @ QuoteDB` });
  }
  return result;
});

function invite() {
  if (!profile.value) return;
  if (profile.value._count.invitations >= 5) {
    alert("je hebt al 5 uitnodigingen aangemaakt");
    return;
  }

  $fetch("/api/user/invite", { headers: authState.getAuthHeader() })
    .then(
      (result: {
        inviteToken: string;
        otherInvites: { token: string; id: number }[];
        invitesLeft: number;
      }) => {
        navigator.clipboard.writeText(
          `${window.location.origin}/register?inviteToken=${result.inviteToken}`,
        );
        alert("uitnodigingslink gekopieerd :)");
      },
    )
    .catch((e) => console.warn("invite failed:", e));
}
</script>

<style lang="scss">
main.profile {
  .name,
  .email {
    margin: 0.25em 0;
  }

  .stats {
    margin-top: 1em;
    font-size: 0.75em;
    color: var(--secondary-text);

    > em {
      color: var(--primary-text);
    }
  }

  .quote-list {
    margin-top: 2em;
  }
}
</style>
