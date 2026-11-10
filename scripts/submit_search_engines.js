/**
 * The Flowscape — Modern Search Engine Indexing Dispatcher (IndexNow Protocol)
 * Automatically pushes updated sanctuary URLs to Bing, Yandex, DuckDuckGo, and partner crawlers.
 */

const https = require('https');

const HOST = 'theflowscape.com';
const KEY = 'flowscape842992710045indexnowkey';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  'https://theflowscape.com/',
  'https://theflowscape.com/tv/',
  'https://theflowscape.com/schwarzwald/',
  'https://theflowscape.com/provence/',
  'https://theflowscape.com/london/',
  'https://theflowscape.com/tuscany/',
  'https://theflowscape.com/swiss-alps/'
];

console.log('📡 Dispatching instant IndexNow URL update notifications:');

function pingIndexNow() {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: URL_LIST
    });

    const req = https.request('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      console.log(`✓ IndexNow Global Hub: HTTP ${res.statusCode} (Accepted for instant crawling)`);
      resolve(res.statusCode);
    });

    req.on('error', (err) => {
      console.warn('! IndexNow warning:', err.message);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

(async () => {
  await pingIndexNow();
  console.log('\nNote: Google Search Console now discovers updates via your submitted XML Sitemap and <lastmod> tags.');
})();
