<template>
<div class="quote">
  <p v-if="quote.subquotes.length == 1">
    <span class="subquote-text">"{{quote.subquotes[0].text}}"</span> <span class="quotee">~ {{quote.subquotes[0].quotee}}</span>
  </p>

  <table v-else>
  <tbody>
    <tr class="subquote" v-for="subquote in quote.subquotes">
      <td class="quotee">{{subquote.quotee}}: </td>
      <td class="subquote-text" :class="{ action: subquote.isAction }" v-text="formatSubquote(subquote)"></td>
    </tr>
  </tbody>
  </table>

  <span class="date" v-text="formatDate(quote.createdAt)"></span>
</div>
</template>

<script lang="ts" setup>
import { Quote, Subquote } from '@prisma/client'
import { formatDate } from '~/util/date-helpers'

const { quote } = defineProps<{
  quote: (Quote & { subquotes: Omit<Subquote, 'quoteId'>[]}),
}>();

function formatSubquote(subquote: Omit<Subquote, 'quoteId'>): string
{
  return subquote.isAction ? `*${subquote.text}*` : `"${subquote.text}"`;
}
</script>

<style lang="scss">
.quote {
  table {
    border-spacing: 0.75em;
  }

  .subquote-text {
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
  .quotee + .subquote-text, .subquote-text + .quotee {
    margin-left: 1em;
  }
  .date {
    float: right;
    color: var(--tertiary-text);
  }
}
</style>
