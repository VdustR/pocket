import { getContext } from "svelte";
import type { Store } from "./store";

export default function useQs() {
  const qs = getContext<Store>("qs");
  return qs;
}
