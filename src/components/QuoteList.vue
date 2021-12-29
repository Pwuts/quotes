<template>
<div class="quote-list">
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
const filteredQuotes = computed(() => !query ? quotes :
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
  display: flex;
  flex-direction: column;
  align-items: center;

  .quote:not(:first-of-type) {
    margin-top: 5em;
  }
}
</style>
