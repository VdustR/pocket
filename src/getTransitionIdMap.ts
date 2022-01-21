import { v4 } from "uuid";

export default function getTransitionIdMap<Item = unknown>() {
  let itemIdMap = new Map<Item, string>();
  function getItemId(item: Item) {
    const id = itemIdMap.get(item);
    if (id) return id;
    const newId = v4();
    itemIdMap.set(item, newId);
    return newId;
  }
  function syncMap(items: Item[]) {
    itemIdMap.forEach((_id, item) => {
      if (!items.includes(item)) {
        itemIdMap.delete(item);
      }
    });
  }
  return {
    getItemId,
    syncMap,
  };
}
