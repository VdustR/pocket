import flow from "lodash/flow";
import nodeEmoji from "node-emoji";

const { emojify } = nodeEmoji;

const formatStr = flow(
  (str: unknown) => (!str ? "" : String(str)),
  (str) => str.replace(/[\s\n\r]+/g, " "),
  (str) => str.trim(),
  (str) => emojify(str)
);

export default formatStr;
