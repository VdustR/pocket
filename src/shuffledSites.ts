import shuffle from "lodash/shuffle";
import { writable } from "svelte/store";
import sites from "./sites";

function getShuffledSites() {
  return shuffle(sites);
}

const shuffledSites = writable(getShuffledSites());

export function shuffleSites() {
  shuffledSites.set(getShuffledSites());
}

export default shuffledSites;
