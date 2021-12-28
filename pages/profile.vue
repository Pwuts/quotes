<template>
<div class="profile">
  <h1 class="name">{{authState.user.name}}</h1>
  <h4 class="email">{{authState.user.email}}</h4>
  <span class="stats">
    <em>{{ profile._count.authoredQuotes }}</em> quotes
    &nbsp; - &nbsp;
    <em>{{ profile._count.invitees }}</em> gebruikers <a href="#" @click="invite">uitgenodigd</a>
  </span>
  <QuoteList :quotes="profile.authoredQuotes"/>
</div>
</template>

<script lang="ts" setup>
const authState = useAuthState();
const router = useRouter();

if (!authState.loggedIn) {
  router.push('/login');
}

const { data: profile } = await useAsyncData(
  'profile',
  async () => $fetch('/api/user', { headers: authState.getAuthHeader() }),
  {
    transform: (profile) => ({
      ...profile,
      authoredQuotes: profile.authoredQuotes.sort((a, b) =>
        String(b.createdAt).localeCompare(String(a.createdAt))
      ),
    })
  }
);

function invite()
{
  if (profile.value._count.invitations >= 5) {
    alert('je hebt al 5 uitnodigingen aangemaakt');
    return;
  }

  $fetch('/api/user/invite', { headers: authState.getAuthHeader() })
  .then((result: { inviteToken: string, otherInvites: { token: string, id: number, }[], invitesLeft: number }) =>
    navigator.clipboard.writeText(`${window.location.origin}/register?inviteToken=${result.inviteToken}`)
  )
  .catch(e => console.warn('invite failed:', e));
}
</script>

<style lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .name, .email {
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
