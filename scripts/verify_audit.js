const fs = require('fs');

const files = [
  'theflowscape/index.html',
  'london-yoga-escape/index.html',
  'provence-yoga-escape/index.html',
  'schwarzwald-yoga-escape/index.html',
  'tuscany-yoga-escape/index.html',
  'swiss-alps-yoga-escape/index.html'
];

let allValid = true;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}...`);

  // Check Schema.org JSON-LD if present
  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      if (parsed['@graph']) {
        const types = parsed['@graph'].map(item => item['@type']).join(', ');
        console.log(`  ✓ JSON-LD Graph valid (${types})`);
      } else {
        console.log(`  ✓ JSON-LD Schema valid (@type: ${parsed['@type']})`);
      }
    } catch (e) {
      console.error(`  ✗ JSON-LD Error in ${file}:`, e.message);
      allValid = false;
    }
  }

  // Check Canonical Link
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)">/);
  if (canonicalMatch) {
    console.log(`  ✓ Canonical URL: ${canonicalMatch[1]}`);
  } else {
    console.warn(`  ! Missing canonical link in ${file}`);
    allValid = false;
  }

  // Check OpenGraph Tags
  const ogTitle = content.match(/<meta property="og:title" content="([^"]+)">/);
  const ogDesc = content.match(/<meta property="og:description" content="([^"]+)">/);
  if (ogTitle && ogDesc) {
    console.log(`  ✓ OpenGraph Title & Description present`);
  } else {
    console.warn(`  ! Missing OpenGraph tags in ${file}`);
    allValid = false;
  }

  // Check Skip link
  if (content.includes('class="skip-link"')) {
    console.log(`  ✓ Skip link present`);
  } else {
    console.warn(`  ! Missing skip link in ${file}`);
    allValid = false;
  }

  // Check Lotus brand SVG
  if (content.includes('brand-lotus')) {
    console.log(`  ✓ Scalable Brand Lotus SVG present`);
  }
});

// Check sitemap and robots
if (fs.existsSync('theflowscape/sitemap.xml')) {
  console.log('✓ Sitemap XML present (theflowscape/sitemap.xml)');
} else {
  console.warn('! Missing sitemap.xml');
  allValid = false;
}

if (fs.existsSync('theflowscape/robots.txt')) {
  console.log('✓ robots.txt present (theflowscape/robots.txt)');
} else {
  console.warn('! Missing robots.txt');
  allValid = false;
}

console.log(`\nAudit result: ${allValid ? 'ALL 6 DESTINATIONS & SEO ASSETS PASSED AUDIT ✓' : 'SOME CHECKS NEED ATTENTION'}`);
