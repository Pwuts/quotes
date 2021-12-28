<template>
<div class="quote-list">
  <input type="search" placeholder="zoeken" v-model="query"/>

  <div class="quote" v-for="quote in filteredQuotes">
    <p v-if="quote.subquotes.length == 1">
      <span class="subquote">"{{quote.subquotes[0].text}}"</span> <span class="quotee">~ {{quote.subquotes[0].quotee}}</span>
    </p>
    <table v-else>
    <tbody>
      <tr v-for="subquote in quote.subquotes">
        <td class="quotee">{{subquote.quotee}}: </td>
        <td class="subquote" :class="{ action: subquote.isAction }" v-text="formatSubquote(subquote)"></td>
      </tr>
    </tbody>
    </table>
    <span class="date" v-text="formatDate(quote.createdAt)"></span>
  </div>
</div>
</template>

<script lang="ts" setup>
import { Quote, Subquote } from '@prisma/client'
import { formatDate } from '~~/util/date-helpers'

const { quotes } = defineProps<{
  quotes: (Quote & { subquotes: Omit<Subquote, 'quoteId'>[]})[],
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

function formatSubquote(subquote: Omit<Subquote, 'quoteId'>): string
{
  return subquote.isAction ? subquote.text : `"${subquote.text}"`;
}
</script>

<style lang="scss">
.quote-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  .quote {
    margin-top: 5em;

    table {
      border-spacing: 0.75em;
    }

    .subquote {
      font-size: 1.5em;

      &.action {
        font-style: italic;
      }
    }
    .quotee {
      font-size: 1.4em;
      color: var(--secondary-text);
    }
    td.quotee {
      text-align: right;
      padding-top: 0.1em;
      vertical-align: baseline;
    }
    .quotee + .subquote, .subquote + .quotee {
      margin-left: 1em;
    }
    .date {
      float: right;
      color: var(--tertiary-text);
    }
  }
}
</style>
