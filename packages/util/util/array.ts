interface BeforeKeyAfterInterface {
    after?: string;
    before?: string;
    key: string;
}

export class ArrayUtil {
    static async sortByBeforeAndAfter(items: BeforeKeyAfterInterface[]): Promise<any> {
        const keys: string[] = [];

        // start: remove duplicate keys

        const cleanedItems: BeforeKeyAfterInterface[] = [];

        for (const item of items.reverse()) {
            if (keys.includes(item.key)) {
                continue;
            }
            cleanedItems.push(item);
            keys.push(item.key);
        }

        cleanedItems.reverse();
        keys.reverse();

        // end: remove duplicate keys

        // start: sort by after and before

        for (const item of cleanedItems) {
            if ('undefined' !== typeof item.after) {
                // check if 'after' is in keys
                if (!keys.includes(item.after)) {
                    throw new Error(`after '${item.after}' is not a valid key`);
                }

                // check if 'key' already after 'after'
                if (keys.indexOf(item.key) < keys.indexOf(item.after)) {
                    keys.splice(keys.indexOf(item.key), 1);
                    keys.splice(keys.indexOf(item.after) + 1, 0, item.key);
                }
            }

            if ('undefined' !== typeof item.before) {
                // check if 'before' is in keys
                if (!keys.includes(item.before)) {
                    throw new Error(`before '${item.before}' is not a valid key`);
                }

                // check if 'key' already after 'after'
                if (keys.indexOf(item.key) > keys.indexOf(item.before)) {
                    keys.splice(keys.indexOf(item.key), 1);
                    keys.splice(keys.indexOf(item.before), 0, item.key);
                }
            }
        }

        // end: sort by after and before

        // start: generate new array based on key sorting

        const newItems = [];

        for (const key of keys) {
            for (const item of cleanedItems) {
                if (key === item.key) {
                    newItems.push(item);
                }
            }
        }

        // end: generate new array based on key sorting

        return newItems;
    }
}
