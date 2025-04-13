import { useRequestHeaders } from "nuxt/app";

type Language = {
  strings: Record<
    // words & terms
    | "yes"
    | "no"
    | "today"
    | "yesterday"
    | "edit"
    | "email"
    | "home"
    | "invitee"
    | "invitees"
    | "inviteToken"
    | "lineAdd"
    | "lineDelete"
    | "lineMoveDown"
    | "lineMoveUp"
    | "name"
    | "password"
    | "profile"
    | "quote"
    | "quotes"
    | "saveQuote"
    | "updateQuote"
    | "search"
    | "signIn"
    | "signOut"
    | "signUp"
    | "user"
    | "users"

    // sentences
    | "clickToInvite"
    | "shouldQuoteBePublic"
    | "thisQuoteNotPublic"

    // errors
    | "errorNameTooShort"
    | "errorTextEmpty",
    string
  >;
};

type SupportedLanguage = "nl" | "en";

const languages: Record<SupportedLanguage, Language> = {
  nl: {
    strings: {
      yes: "ja",
      no: "nee",
      today: "vandaag",
      yesterday: "gisteren",

      edit: "bewerken",
      email: "e-mail",
      home: "start",
      invitee: "gebruiker uitgenodigd",
      invitees: "gebruikers uitgenodigd",
      inviteToken: "uitnodigingscode",
      lineAdd: "een regel toevoegen",
      lineDelete: "deze regel verwijderen",
      lineMoveDown: "deze regel omlaag verplaatsen",
      lineMoveUp: "deze regel omhoog verplaatsen",
      name: "naam",
      password: "wachtwoord",
      profile: "profiel",
      quote: "quote",
      quotes: "quotes",
      saveQuote: "quotuleer",
      updateQuote: "werk bij",
      search: "zoeken",
      signIn: "log in",
      signOut: "log uit",
      signUp: "registreer",
      user: "gebruiker",
      users: "gebruikers",

      clickToInvite: "klik hier om een uitnodigingslink te maken",
      shouldQuoteBePublic: "Mag deze quote publiek zijn?",
      thisQuoteNotPublic: "deze quote is niet publiek",

      errorNameTooShort: "naam moet 3 tekens of langer zijn",
      errorTextEmpty: "regel moet tekst bevatten",
    },
  },

  en: {
    strings: {
      yes: "yes",
      no: "no",
      today: "today",
      yesterday: "yesterday",

      edit: "edit",
      email: "email",
      home: "home",
      invitee: "invitee",
      invitees: "invitees",
      inviteToken: "invite token",
      lineAdd: "add a line",
      lineDelete: "delete this line",
      lineMoveDown: "move this line down",
      lineMoveUp: "move this line up",
      name: "name",
      password: "password",
      profile: "profile",
      quote: "quote",
      quotes: "quotes",
      saveQuote: "save quote",
      updateQuote: "update quote",
      search: "search",
      signIn: "log in",
      signOut: "log out",
      signUp: "sign up",
      user: "user",
      users: "users",

      clickToInvite: "click here to make an invite link",
      shouldQuoteBePublic: "Should this quote be public?",
      thisQuoteNotPublic: "this quote is not public",

      errorNameTooShort: "name must be 3 or more characters",
      errorTextEmpty: "line must contain text",
    },
  },
};

export function getLocalizedString(name: keyof Language["strings"]): string {
  return getLanguage().strings[name];
}

const FALLBACK_LOCALE: `${SupportedLanguage}-${string}` = "nl-NL";
const FALLBACK_LANGUAGE: SupportedLanguage = FALLBACK_LOCALE.slice(
  0,
  2,
) as SupportedLanguage;

export function getLanguage(): Language {
  return languages[getLocale()];
}

export function getDateFormatter(
  options: Intl.DateTimeFormatOptions = {},
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(getLocale(), options);
}

function getLocale(): SupportedLanguage {
  return _getSupportedPreferredLocales()[0] ?? FALLBACK_LANGUAGE;
}

function _getSupportedPreferredLocales(): SupportedLanguage[] {
  if (import.meta.server) {
    const reqLanguagesHeader = useRequestHeaders(["accept-language"])[
      "accept-language"
    ];
    if (reqLanguagesHeader) {
      return _parseLanguageHeader(reqLanguagesHeader).filter(
        (l) => l.includes("-") && l.slice(0, 2) in languages,
      ) as SupportedLanguage[];
    }
  } else if (import.meta.client) {
    return navigator.languages.filter(
      (l) => l.includes("-") && l.slice(0, 2) in languages,
    ) as SupportedLanguage[];
  }

  return [];
}

function _parseLanguageHeader(header: string): string[] {
  return !header
    ? []
    : header
        .split(";")
        .flatMap((ls) => ls.split(",").filter((l) => !l.startsWith("q=")));
}
