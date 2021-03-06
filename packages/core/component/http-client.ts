import https, { RequestOptions } from 'https';
import { Injectable } from '../decorator/injectable';

@Injectable()
export class HttpClient {
    private options: RequestOptions = {};

    constructor() {
        this.options.rejectUnauthorized = false; // TODO: find better way
    }

    async get(url: string): Promise<{ statusCode: number; body: string }> {
        const parsedUrl = new URL(url);

        const options: RequestOptions = {
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            method: 'GET',
            path: parsedUrl.pathname + parsedUrl.search,
            port: parsedUrl.port,
        };

        return this.request(options);
    }

    async request(options: RequestOptions): Promise<{ statusCode: number; body: string }> {
        options = Object.assign(this.options, options);

        options.protocol = 'https:';

        return new Promise((resolve, reject) => {
            https
                .request(options, (res) => {
                    res.setEncoding('utf8');
                    let body = '';
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve({ body: body, statusCode: Number(res.statusCode) });
                    });
                })
                .on('error', reject)
                .end();
        });
    }
}
