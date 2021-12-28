<template>
<QuoteList :quotes="quotes"/>
</template>

<script lang="ts" setup>
import { Quote, Subquote } from '@prisma/client'
const authState = useAuthState();

/* fetch quotes & sort by date */
const { data: quotes } = await useAsyncData(
  'quotes',
  async () => $fetch('/api/quotes', { headers: authState.getAuthHeader() }),
  {
    transform: (quotes) =>
      (quotes as unknown as (Quote & { subquotes: Omit<Subquote, 'quoteId'>[] })[])
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  }
);
</script>
