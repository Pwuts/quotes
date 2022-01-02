<template>
<main class="container">
  <p class="public-prompt">
    Mag deze quote publiek zijn?&nbsp;

    <span class="nowrap">
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
    </span>
  </p>

  <div class="quote new-quote">
    <table>
    <tbody>
      <tr class="subquote" v-for="(subquote, i) in newQuote.subquotes"
        :ref="(el: HTMLTableRowElement) => { if (el) subquoteLines[i] = el; }"
      >
        <td class="quotee nowrap">
          <input type="text"
            placeholder="iedereen"
            :class="{ error: saveError }"
            v-model="subquote.quotee"
          />:
        </td>

        <td class="subquote-text nowrap" :class="{ action: subquote.isAction }">
          <span class="clickable"
            @click="subquote.isAction = !subquote.isAction"
            v-text='subquote.isAction ? "*" : "\""'>
          </span>

          <input type="text"
            placeholder="haha deze site is echt cool"
            :class="{ error: saveError }"
            v-model="subquote.text"
            @keyup.enter="gotoNext(i)"
          />

          <span class="clickable"
            @click="subquote.isAction = !subquote.isAction"
            v-text='subquote.isAction ? "*" : "\""'>
          </span>
        </td>

        <td class="actions nowrap">
          <i class="clickable icon" v-if="newQuote.subquotes.length > 1"
            @click="removeSubquote(i)"
            title="deze regel verwijderen">
            🗑️
          </i>
          <i class="clickable icon disabled" v-else>🗑️</i>

          <i class="clickable icon" v-if="i > 0"
            @click="moveSubquoteUp(i)"
            title="deze regel omhoog verplaatsen">
            ⬆️
          </i>
          <i class="clickable icon disabled" v-else>⬆️</i>

          <i class="clickable icon" v-if="i < newQuote.subquotes.length - 1"
            @click="moveSubquoteDown(i)"
            title="deze regel omlaag verplaatsen">
            ⬇️
          </i>
          <i class="clickable icon disabled" v-else>⬇️</i>

          <i class="clickable text-icon"
            @click="addSubquote(i)"
            title="een regel toevoegen"
          >+</i>
        </td>
      </tr>
    </tbody>
    </table>
  </div>

  <button class="attempt-save"
    :class="{ error: saveError }"
    @click="attemptSaveQuote"
  >
    quotuleer &nbsp;<i class="icon">💾</i>
  </button>
</main>
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

const subquoteLines = ref<HTMLTableRowElement[]>([]);
onBeforeUpdate(() => subquoteLines.value = []);

function gotoNext(from: number)
{
  if (from == newQuote.subquotes.length - 1) {
    addSubquote();
  }

  nextTick(() => {
    const nextLineQuotee: HTMLElement = subquoteLines.value[from + 1].querySelector('.quotee input');
    nextLineQuotee.focus();
  });
}

function addSubquote(i?: number)
{
  newQuote.subquotes.splice(
    i != null ? i + 1 : newQuote.subquotes.length,
    0,
    {
      isAction: false,
      quotee: '',
      text: '',
    }
  );
}

function removeSubquote(i: number)
{
  newQuote.subquotes.splice(i, 1);
}

function moveSubquoteUp(i: number)
{
  newQuote.subquotes.splice(
    i - 1,
    2,
    ...newQuote.subquotes
    .slice(i - 1, i + 1)
    .reverse()
  );
}

function moveSubquoteDown(i: number)
{
  newQuote.subquotes.splice(
    i,
    2,
    ...newQuote.subquotes
    .slice(i, i + 2)
    .reverse()
  );
}

let saveError = false;
function attemptSaveQuote()
{
  if (newQuote.subquotes.length == 0) {
    saveError = true;
    alert('geen regels = geen quote :(');
    console.debug(saveError);
    return;
  }

  if (!newQuote.subquotes.every(
    subquote => subquote.quotee.length >= 3 && subquote.text.length > 0
  )) {
    saveError = true;
    alert('te weinig tekst in de vakjes :(');
    console.debug(saveError);
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
    console.debug('blab');
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
p.public-prompt {
  font-size: 1.2em;
  text-align: center;
}

.quote.new-quote {
  table {
    width: auto;
    max-width: 40em;
    table-layout: auto;

    .subquote {
      .subquote-text,
      .quotee {
        font-size: 1em;
      }
    }
  }
  tr.subquote {
    .quotee {
      width: 1%;

      input {
        width: 7.5em;
      }
    }

    .subquote-text {
      width: 100%;

      input {
        width: 95%;
      }

      &.action input[type=text] {
        font-style: italic;
      }
    }

    .actions {
      width: 1%;
      font-size: 0.8em;

      > * {
        vertical-align: middle;
      }
    }

    @media screen and (max-width: 900px) {
      display: flex;
      flex-direction: column;

      &:not(:first-of-type) {
        margin-top: 1em;
      }

      > :not(:first-child) {
        margin-top: 0.5em;
      }

      .quotee {
        width: auto;
        text-align: initial;
      }

      .subquote-text {
        padding-left: 1.5em;
      }

      .actions {
        align-self: flex-end;
        width: auto;
      }
    }
  }

  .add-subquote {
    font-size: 1.25em;
  }
}
.attempt-save {
  margin-top: 1em;
}
</style>
