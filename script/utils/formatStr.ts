import flow from "lodash/flow";
import nodeEmoji from "node-emoji";

const { emojify } = nodeEmoji;

export default function formatStr(str: string): string {
  return flow(
    () => str.replace(/[\s\n\r]+/g, " "),
    (str) => str.trim(),
    (str) => emojify(str)
  )();
}
