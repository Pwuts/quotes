<template>
<div class="container quote-list">
  <input type="search" placeholder="zoeken" v-model="query"/>

  <h2 class="clickable add-quote"
    v-if="authState.loggedIn"
    @click="$router.push('/compose')">
  +
  </h2>

  <Quote :quote="quote" v-for="quote in filteredQuotes" />
</div>
</template>

<script lang="ts" setup>
import { Quote as QuoteType, Subquote as SubquoteType } from '@prisma/client'
const authState = useAuthState();

const { quotes } = defineProps<{
  quotes: (QuoteType & { subquotes: Omit<SubquoteType, 'quoteId'>[]})[],
}>();

/* filter quotes by search query */
let query = ref('');
const filteredQuotes = computed(() => !query.value ? quotes :
  quotes.filter(q =>
    q.subquotes.some(sq =>
      sq.text.toLowerCase().includes(query.value.toLowerCase())
      || sq.quotee.toLowerCase().includes(query.value.toLowerCase())
    )
  )
);
</script>

<style lang="scss">
.quote-list {
  @media screen and (max-width: 500px) {
    font-size: 0.75rem;
  }

  .quote {
    margin-top: 5em;
  }
  h2.add-quote + .quote {
    margin-top: 1em;
  }
}
</style>
