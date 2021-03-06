#!/usr/bin/env node

// remove warning message for NODE_TLS_REJECT_UNAUTHORIZED
process.removeAllListeners('warning');

// allow unauthorized requests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/* eslint-disable no-console */
import chalk from 'chalk';
import crawler from 'simplecrawler';
import url from 'url';

try {
    new url.URL(process.argv[2]);
} catch (err) {
    console.log(chalk.red('Please enter a valid url as command line parameter'));
    process.exit();
}

const c = new crawler(process.argv[2]);

c.interval = 1;
c.maxConcurrency = 10;
c.maxDepth = 100;

let counter = 0;

c.on('fetchcomplete', function (queueItem, body) {
    const results = [];

    results.push(chalk.green(queueItem.stateData.code));
    results.push(chalk.grey(queueItem.url));

    try {
        const matches = body.toString().match(/<title[^>]*>([^<]+)<\/title>/);

        if (null !== matches && matches[1]) {
            results.push(chalk.blue(matches[1]));
        }
    } catch (err) {}

    console.log(results.join(' '));

    counter++;
});

c.on('fetch404', function (queueItem) {
    const results = [];

    results.push(chalk.yellow(queueItem.stateData.code));
    results.push(chalk.grey(queueItem.url));

    console.log(results.join(' '));

    counter++;
});

c.on('fetcherror', function (queueItem) {
    const results = [];

    if (499 < queueItem.stateData.code) {
        results.push(chalk.red(queueItem.stateData.code));
    } else {
        results.push(chalk.yellow(queueItem.stateData.code));
    }

    results.push(chalk.grey(queueItem.url));

    console.log(results.join(' '));

    counter++;
});

c.on('complete', () => {
    console.log(chalk.green(counter + ' resources completed'));
});

c.start();
