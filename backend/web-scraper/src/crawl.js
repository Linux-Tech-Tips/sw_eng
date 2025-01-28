import { BasicCrawler } from 'crawlee';

export const crawler  = new BasicCrawler({

    async requestHandler({ pushData, request, sendRequest, log}) {
        const { url } = request;
        log.info(`Processing ${url}...`);
        const { body } = await sendRequest();

        await pushData({
            url,
            html: body,
        })
    }
})