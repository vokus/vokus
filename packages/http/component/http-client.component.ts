import https, { RequestOptions } from 'https';
import { Response } from '../core/response';

export class HTTPClientComponent {
    protected _options: RequestOptions;

    constructor(options?: RequestOptions) {
        if ('object' !== typeof options) {
            options = {};
        }

        this._options = options;
    }

    async get(url: string): Promise<Response> {
        const parsedUrl = new URL(url);

        const options: RequestOptions = {
            method: 'GET',
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
        };

        return this.request(options);
    }

    async request(options: RequestOptions): Promise<Response> {
        options = Object.assign(this._options, options);

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
                        resolve(new Response(Number(res.statusCode), body));
                    });
                })
                .on('error', reject)
                .end();
        });
    }
}
