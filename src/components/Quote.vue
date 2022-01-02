<template>
<div class="quote-wrapper">
<div class="quote">
  <p class="subquote" v-if="quote.subquotes.length == 1">
    <span class="subquote-text">
      "{{quote.subquotes[0].text}}"
    </span> <span class="quotee nowrap">
      ~ {{quote.subquotes[0].quotee}}
    </span>
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
.quote-wrapper {
  text-align: center;
}
.quote {
  text-align: left;
  display: inline;

  font-size: 1.25em;

  @media screen and (max-width: 600px) {
    font-size: 1em;
  }

  .subquote {
    .subquote-text {
      &.action {
        font-style: italic;
      }
    }

    .quotee {
      font-size: 0.96em;
      color: var(--secondary-text);
    }
  }

  p.subquote {
    display: inline;
    text-align: right !important;

    &::after {
      content: '';
      display: block;
      height: 0.75em;
    }

    .subquote-text + .quotee::after {
      content: '';
      display: block;
    }
  }

  table {
    border-spacing: 0.75em;

    tr.subquote {
      .quotee {
        text-align: right;
        padding-top: 0.1em;
        vertical-align: baseline;
      }

      .subquote-text {
        display: inline;
        vertical-align: baseline;
      }
    }
  }

  .date {
    font-size: 0.8em;
    float: right;
    color: var(--tertiary-text);
  }
}
</style>
