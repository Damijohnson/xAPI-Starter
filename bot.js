const { TwitterApi } = require('twitter-api-v2');
const config = require('./config');
const axios = require('axios');

const client = new TwitterApi({
    appKey: config.consumer_key,
    appSecret: config.consumer_secret,
    accessToken: config.access_token,
    accessSecret: config.access_token_secret,
});

async function fetchDataset() {
    try {
        const response = await axios.get('https://example.com/dataset', {
            headers: {
                'X-API-Key': config.api_key,
                'X-API-Host': 'example.com',
            },
            params: {
                language: 'en',
            },
        });

        if (response.data && response.data.data && response.data.data.items && response.data.data.items.length > 0) {
            const item = response.data.data.items[0];
            return `${item.title} - ${item.source} ${item.url}`;
        } else {
            console.log("No relevant items found in the dataset.");
            return null;
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching data from dataset:`, error);
        return null;
    }
}

async function postTweet() {
    const tweetContent = await fetchDataset();
    if (!tweetContent) return;

    try {
        const tweet = await client.v2.tweet(tweetContent);
        console.log(`[${new Date().toISOString()}] Tweet posted: ${tweet.data.text}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error posting tweet:`, error);
    }
}

postTweet();
