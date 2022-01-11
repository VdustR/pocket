import isEqual from "lodash/isEqual";
import type { ParsedQs } from "qs";
import { parse, stringify } from "qs";
import type { Readable } from "svelte/store";
import { derived, writable } from "svelte/store";

function stringifyQs(qs: unknown) {
  return stringify(qs, { addQueryPrefix: true, encoder: encodeURIComponent });
}
function getCurrentQs() {
  return parse(window.location.search.substring(1));
}

const defaultQs = getCurrentQs();

const qs = writable(defaultQs);
const currentSearch = derived(qs, ($qs) => stringifyQs($qs));

/**
 * listen url changed
 * https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
 */
window.addEventListener("popstate", function () {
  const currentQs = getCurrentQs();
  if (isEqual(currentSearch, stringifyQs(currentQs))) return;
  qs.set(currentQs);
});

const setQs = derived(currentSearch, ($currentSearch) => (nextQs: ParsedQs) => {
  const url = stringifyQs(nextQs);
  qs.set(nextQs);
  if (url === $currentSearch) return;
  history.pushState(undefined, "", url || location.pathname);
});

export type Store = Readable<{
  qs: {
    q: string;
    tags: string[];
  };
  setQs({ q, tags }: { q?: string; tags?: string[] }): void;
}>;

const store: Store = derived([qs, setQs], ([$qs, $setQs]) => {
  return {
    qs: {
      q: $qs.q ? String($qs.q) : "",
      tags: $qs.tags ? parseTags($qs.tags) : [],
    },
    setQs({ q, tags }: { q?: string; tags?: string[] }) {
      const draft = { ...$qs };
      if (typeof q !== "undefined") {
        if (q) {
          draft.q = q;
        } else {
          delete draft.q;
        }
      }
      if (typeof tags !== "undefined") {
        if (tags.length === 0) {
          delete draft.tags;
        } else {
          draft.tags = tags;
        }
      }
      $setQs(draft);
    },
  };
});

function parseTags(tags: unknown) {
  if (typeof tags === "string") return [tags];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag));
  if (!tags) return [];
  return [String(tags)];
}

export default store;
