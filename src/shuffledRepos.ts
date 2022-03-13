import shuffle from "lodash/shuffle";
import { writable } from "svelte/store";
import sites from "./repos";

function getShuffledRepos() {
  return shuffle(sites);
}

const shuffledRepos = writable(getShuffledRepos());

export function shuffleRepos() {
  shuffledRepos.set(getShuffledRepos());
}

export default shuffledRepos;
