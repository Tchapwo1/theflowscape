const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

function copyDirRecursive(src, dest, ignorePatterns = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (ignorePatterns.some(pattern => entry.name.match(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, ignorePatterns);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🚀 Building The Flowscape for Cloudflare Pages Deployment...');

// 1. Clean dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 2. Copy theflowscape (Umbrella Portal) to dist root
console.log('📦 Bundling Master Umbrella Portal (theflowscape)...');
copyDirRecursive(
  path.join(ROOT_DIR, 'theflowscape'),
  DIST_DIR,
  [/^\.git/, /node_modules/]
);

// 3. Copy regional escapes to respective subdirectories
console.log('🌲 Bundling Schwarzwald Yoga Escape to dist/schwarzwald/...');
copyDirRecursive(
  path.join(ROOT_DIR, 'schwarzwald-yoga-escape'),
  path.join(DIST_DIR, 'schwarzwald'),
  [/^\.git/, /node_modules/, /^page\.html$/, /^theflowscape\.html$/]
);

console.log('🇫🇷 Bundling Provence Yoga Escape to dist/provence/...');
copyDirRecursive(
  path.join(ROOT_DIR, 'provence-yoga-escape'),
  path.join(DIST_DIR, 'provence'),
  [/^\.git/, /node_modules/]
);

console.log('🇬🇧 Bundling London Yoga Escape to dist/london/...');
copyDirRecursive(
  path.join(ROOT_DIR, 'london-yoga-escape'),
  path.join(DIST_DIR, 'london'),
  [/^\.git/, /node_modules/]
);

console.log('☼ Bundling Tuscany Yoga Escape to dist/tuscany/...');
copyDirRecursive(
  path.join(ROOT_DIR, 'tuscany-yoga-escape'),
  path.join(DIST_DIR, 'tuscany'),
  [/^\.git/, /node_modules/]
);

console.log('⛰ Bundling Swiss Alps Yoga Escape to dist/swiss-alps/...');
copyDirRecursive(
  path.join(ROOT_DIR, 'swiss-alps-yoga-escape'),
  path.join(DIST_DIR, 'swiss-alps'),
  [/^\.git/, /node_modules/]
);

// 4. Ensure Cloudflare _headers and _redirects are in root
fs.copyFileSync(path.join(ROOT_DIR, 'theflowscape', '_headers'), path.join(DIST_DIR, '_headers'));
fs.copyFileSync(path.join(ROOT_DIR, 'theflowscape', '_redirects'), path.join(DIST_DIR, '_redirects'));

console.log('✨ Build successful! Production output ready in dist/\n');
console.log('Distribution structure:');
console.log('dist/');
console.log('├── index.html        (The Flowscape Umbrella Hub)');
console.log('├── styles.css');
console.log('├── script.js');
console.log('├── sitemap.xml       (SEO Sitemap)');
console.log('├── robots.txt        (Crawler Directives)');
console.log('├── _headers          (Cloudflare CSP & Cache)');
console.log('├── _redirects        (Cloudflare URL Normalization)');
console.log('├── schwarzwald/      (The Forest Flow, Germany)');
console.log('├── provence/         (The Sunlit Flow, France)');
console.log('├── london/           (The Urban Flow, UK)');
console.log('├── tuscany/          (The Sunlit Terroir Flow, Italy)');
console.log('└── swiss-alps/       (The Alpine Thermal Flow, Switzerland)');
