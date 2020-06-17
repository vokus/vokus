import https, { RequestOptions } from 'https';
import { Response } from '../core/response';
import http from 'http';

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
                        const response: Response = Object.create(http.ServerResponse.prototype);

                        response.writeHead(Number(res.statusCode), {
                            'Content-Length': Buffer.byteLength(body),
                            'Content-Type': 'text/plain',
                        });

                        response.write(body);

                        resolve(response);
                    });
                })
                .on('error', reject)
                .end();
        });
    }
}
