<template>
<div class="quote new-quote">
  <p>
    Mag deze quote publiek zijn?
    <span class="clickable"
      :class="{ inactive: !newQuote.public }"
      @click="newQuote.public = true">
      ja
    </span>
    &nbsp;
    <span class="clickable"
      :class="{ inactive: newQuote.public }"
      @click="newQuote.public = false">
      nee
    </span>
  </p>
  <table>
  <tbody>
    <tr class="subquote" v-for="(subquote, i) in newQuote.subquotes">
      <td class="quotee">
        <input type="text"
          placeholder="iedereen"
          :class="{ error: saveError }"
          v-model="subquote.quotee"
        />:
      </td>

      <td class="subquote-text" :class="{ action: subquote.isAction }">
        <span class="clickable"
          @click="subquote.isAction = !subquote.isAction"
          v-text='subquote.isAction ? "*" : "\""'>
        </span>

        <input type="text"
          placeholder="haha deze site is echt cool"
          :class="{ error: saveError }"
          v-model="subquote.text"
        />

        <span class="clickable"
          @click="subquote.isAction = !subquote.isAction"
          v-text='subquote.isAction ? "*" : "\""'>
        </span>
      </td>

      <td class="actions">
        <span class="clickable" @click="newQuote.subquotes.splice(i, 1)">×</span>
      </td>
    </tr>
    <tr>
      <td colspan="3">
        <h2 class="clickable add-subquote" @click="addSubquote">+</h2>
      </td>
    </tr>
    <tr>
      <td colspan="3">
        <button @click="attemptSaveQuote">quotuleer</button>
      </td>
    </tr>
  </tbody>
  </table>
</div>
</template>

<script lang="ts" setup>
import { Quote as QuoteType, Subquote as SubquoteType } from '@prisma/client'
const authState = useAuthState();
const router = useRouter();

if (!authState.value.loggedIn) {
  router.push('/');
}

let newQuote: EmptyQuote = reactive({
  authorId: authState.value.user?.id,
  public: true,
  subquotes: [
    {
      quotee: '',
      text: '',
      isAction: false,
    }
  ],
});

function addSubquote()
{
  newQuote.subquotes.push({
    isAction: false,
    quotee: '',
    text: '',
  });
}

let saveError = false;
function attemptSaveQuote()
{
  if (!newQuote.subquotes.every(
    subquote => subquote.quotee.length >= 3 && subquote.text.length > 0
  )) {
    alert('te weinig tekst in de vakjes :(');
    saveError = true;
    return;
  }

  $fetch('/api/quotes', {
    headers: authState.getAuthHeader(),
    method: 'POST',
    body: {
      public: newQuote.public,
      subquotes: newQuote.subquotes.map((sq, i) => ({ ...sq, subquoteId: i + 1 })),
    },
  })
  .then(() => {
    saveError = false;
    router.push('/');
  })
  .catch(() => {
    saveError = true;
  });
}

type EmptyQuote =
  Omit<QuoteType, 'id' | 'createdAt' | 'updatedAt'>
  & { subquotes: Omit<SubquoteType, 'quoteId' | 'subquoteId'>[] };
</script>

<style lang="scss">
.quote.new-quote {
  table {
    width: 80vw;
    max-width: 40em;

    td > input[type=text] {
      width: calc(100% - 2em);
    }

    td[colspan] {
      text-align: center;
    }
  }
  tr.subquote {
    @media screen and (max-width: 800px) {
      display: flex;
      flex-direction: column;
      margin-top: 1em;
    }

    .quotee {
      white-space: nowrap;
      width: 8em;
    }

    .subquote-text {
      white-space: nowrap;
      width: auto;

      &.action input[type=text] {
        font-style: italic;
      }
    }
  }
}
</style>
