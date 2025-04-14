<template>
  <div class="container quote-list">
    <input type="search" :placeholder="getLocalizedString('search')" v-model="query" />

    <h2
      class="clickable add-quote"
      v-if="authState.loggedIn"
      @click="$router.push('/compose')"
    >
      +
    </h2>

    <Quote :quote="quote" v-for="quote in filteredQuotes" />
  </div>
</template>

<script lang="ts" setup>
import { type Quote as QuoteType, type Subquote as SubquoteType } from "@prisma/client";
import { getLocalizedString } from "~/util/localization";
const authState = useAuthState();

const { quotes } = defineProps<{
  quotes: (QuoteType & { subquotes: Omit<SubquoteType, "quoteId">[] })[];
}>();

/* filter quotes by search query */
let query = ref("");
const filteredQuotes = computed(() =>
  (!query.value
    ? quotes
    : quotes.filter((q) =>
        q.subquotes.some(
          (sq) =>
            sq.text.toLowerCase().includes(query.value.toLowerCase()) ||
            sq.quotee.toLowerCase().includes(query.value.toLowerCase()),
        ),
      )
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
);
</script>

<style lang="scss">
.quote-list {
  .quote-wrapper {
    margin-top: 5em;
  }
  h2.add-quote + .quote-wrapper {
    margin-top: 1em;
  }
}
</style>
