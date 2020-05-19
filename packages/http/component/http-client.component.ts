import https from 'https';
import { RequestOptionsType } from '../type/request-options.type';
import { Response } from '../core/response';

export class HTTPClientComponent {
    protected _options: RequestOptionsType;

    constructor(options?: RequestOptionsType) {
        if ('object' !== typeof options) {
            options = {};
        }

        this._options = options;
    }

    public async get(url: string): Promise<Response> {
        const parsedUrl = new URL(url);

        const options: RequestOptionsType = {
            method: 'GET',
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
        };

        return this.request(options);
    }

    public async request(options: RequestOptionsType): Promise<Response> {
        options = Object.assign(this._options, options);

        options.protocol = 'https:';

        return new Promise((resolve, reject) => {
            https
                .request(options, res => {
                    res.setEncoding('utf8');
                    let body = '';
                    res.on('data', chunk => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        if ('number' !== typeof res.statusCode) {
                            throw new Error('no status code');
                        }

                        resolve(new Response(res.statusCode, body));
                    });
                })
                .on('error', reject)
                .end();
        });
    }
}