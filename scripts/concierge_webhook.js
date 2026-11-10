const fs = require('fs');
const path = require('path');

/**
 * The Flowscape Concierge Lead Processor & Autoresponder Generator
 * Reads intake payload and compiles the luxury personalized welcome email.
 */
function generateWelcomeEmail(lead) {
  const templatePath = path.resolve(__dirname, '../templates/welcome_email.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replace(/\{\{name\}\}/g, lead.name || 'Friend');
  html = html.replace(/\{\{destinations\}\}/g, lead.destinations || 'All European Sanctuaries');
  html = html.replace(/\{\{season\}\}/g, lead.season || 'Flexible anytime');
  html = html.replace(/\{\{guests\}\}/g, lead.guests || 'Solo Traveler (Single room)');

  return html;
}

// Example test execution
if (require.main === module) {
  const sampleLead = {
    name: 'Eleanor Vance',
    email: 'eleanor@example.com',
    destinations: '🌲 Schwarzwald (Germany), 🇫🇷 Provence (France)',
    season: 'Spring Renewal',
    guests: 'Solo Traveler (Single room)'
  };

  const rendered = generateWelcomeEmail(sampleLead);
  const outPath = path.resolve(__dirname, '../dist/sample_welcome_email.html');
  fs.writeFileSync(outPath, rendered, 'utf8');
  console.log('✓ Successfully rendered personalized welcome email to:', outPath);
}

module.exports = { generateWelcomeEmail };
