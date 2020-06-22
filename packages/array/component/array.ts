import { Injectable } from '../../cms/node_modules/@vokus/dependency-injection';

interface BeforeKeyAfterInterface {
    after?: string;
    before?: string;
    key: string;
}

@Injectable()
export class Array {
    async sortByBeforeAndAfter(items: BeforeKeyAfterInterface[]): Promise<any> {
        const keys: string[] = [];
        const cleanedItems: BeforeKeyAfterInterface[] = [];

        for (const item of items) {
            if (!keys.includes(item.key)) {
                cleanedItems.push(item);
            }
        }

        // TODO: remove duplicate entries with same key

        // add key to keys
        for (const item of items) {
            if ('undefined' !== typeof item.after) {
                if (!keys.includes(item.after)) {
                    keys.push(item.after);
                } else {
                    if (keys.includes(item.key)) {
                        keys.splice(keys.indexOf(item.key), 1);
                    }
                    keys.splice(keys.indexOf(item.after) + 1, 0, item.key);
                }
            }

            if (!keys.includes(item.key)) {
                keys.push(item.key);
            }

            if ('undefined' !== typeof item.before) {
                if (!keys.includes(item.before)) {
                    keys.push(item.before);
                } else {
                    if (keys.includes(item.key)) {
                        keys.splice(keys.indexOf(item.key), 1);
                    }
                    keys.splice(keys.indexOf(item.before) - 1, 0, item.key);
                }
            }
        }

        const newItems = [];

        for (const key of keys) {
            for (const item of items) {
                if (key === item.key) {
                    newItems.push(item);
                }
            }
        }

        return newItems;
    }
}
