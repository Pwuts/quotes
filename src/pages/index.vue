<template>
  <main class="container">
    <QuoteList v-if="quotes" :quotes="quotes" />
  </main>
</template>

<script lang="ts" setup>
const authState = useAuthState();

/* fetch quotes & sort by date */
const { data: quotes, refresh: refreshQuotes } = await useFetch("/api/quotes", {
  headers: authState.getAuthHeader(),
  transform: (quotes) =>
    quotes
      .map((serializedObj) => ({
        ...serializedObj,
        createdAt: new Date(serializedObj.createdAt),
        updatedAt: new Date(serializedObj.updatedAt),
      }))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
});

watch(authState.value, () => refreshQuotes());
</script>
