import { Response } from './response';

test('response', async () => {
    const response = new Response(400, 'test');

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('test');
});
