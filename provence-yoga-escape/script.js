// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

// Smart Link Resolution for Local Development
if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  document.querySelectorAll('a[href*="theflowscape"]').forEach(a => {
    if (!a.getAttribute('href').startsWith('../')) {
      a.href = '../theflowscape/index.html';
    }
  });
}

// Local Storage Draft Persistence
const DRAFT_KEY = 'flowscape_guest_draft';
function loadGuestDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    if (draft.name) {
      const nameInput = document.getElementById('name');
      if (nameInput && !nameInput.value) nameInput.value = draft.name;
    }
    if (draft.email) {
      const emailInput = document.getElementById('email');
      if (emailInput && !emailInput.value) emailInput.value = draft.email;
    }
  } catch (e) {}
}

function saveGuestDraft(name, email) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, email }));
  } catch (e) {}
}

loadGuestDraft();

// Interactive Waitlist State Machine
const form = document.getElementById('waitlist-form');
if (form) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameError) nameError.style.display = 'none';
      nameInput.removeAttribute('aria-invalid');
      saveGuestDraft(nameInput.value, emailInput ? emailInput.value : '');
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailError) emailError.style.display = 'none';
      emailInput.removeAttribute('aria-invalid');
      saveGuestDraft(nameInput ? nameInput.value : '', emailInput.value);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Name
    if (!nameVal || nameVal.length < 2) {
      if (nameError) {
        nameError.textContent = 'Please enter your full name (at least 2 characters).';
        nameError.style.display = 'block';
      }
      if (nameInput) nameInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    // Validate Email
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
        emailError.style.display = 'block';
      }
      if (emailInput) emailInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('.submit-button');
    if (submitBtn) {
      submitBtn.textContent = 'Securing Priority Allocation...';
      submitBtn.disabled = true;
      form.setAttribute('aria-busy', 'true');
    }

    const season = form.querySelector('#season')?.value || 'Flexible';
    const guests = form.querySelector('#guests')?.value || '1 person';

    const payload = {
      _subject: `New Waitlist Lead — Provence Yoga Escape (${nameVal})`,
      _template: "table",
      _captcha: "false",
      Name: nameVal,
      Email: emailVal,
      "Preferred Retreat Season": season,
      "Places Desired": guests,
      "Retreat Sanctuary": "Provence Yoga Escape (France)",
      SubmittedAt: new Date().toISOString()
    };

    try {
      // 1. Attempt Cloudflare Edge Concierge API
      const edgeResponse = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          destination: 'Provence Yoga Escape (France)',
          season,
          accommodations: guests,
          website_check: form.querySelector('input[name="website_check"]')?.value || '',
        })
      });

      if (!edgeResponse.ok) {
        await fetch('https://formsubmit.co/ajax/bermondish@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      try {
        await fetch('https://formsubmit.co/ajax/bermondish@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (fallbackErr) {
        console.warn('Network intake logged:', fallbackErr);
      }
    }

    // Success State Presentation
    form.removeAttribute('aria-busy');
    const success = document.getElementById('form-success');
    if (success) {
      success.innerHTML = `<strong>Merci, ${nameVal}!</strong> Your interest in Provence Yoga Escape has been received. You will receive 48-hour advance booking priority and founder rates before public release.`;
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (submitBtn) {
      submitBtn.textContent = 'Priority Allocation Reserved ☼';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.85';
    }
  });
}

// ✦ Dynamic Multi-Currency Engine (EUR € · GBP £ · USD $)
const RATES_FROM_EUR = {
  EUR: { rate: 1.0, symbol: '€' },
  GBP: { rate: 0.85, symbol: '£' },
  USD: { rate: 1.08, symbol: '$' }
};

const CURRENCY_KEY = 'flowscape_currency';

function formatCurrency(amountEur, currency) {
  const conf = RATES_FROM_EUR[currency] || RATES_FROM_EUR.EUR;
  const converted = Math.round(amountEur * conf.rate);
  return `${conf.symbol}${converted.toLocaleString()}`;
}

function updateAllPrices(currency) {
  const priceElements = document.querySelectorAll('[data-price-eur]');
  priceElements.forEach(el => {
    const baseEur = parseFloat(el.getAttribute('data-price-eur'));
    if (!isNaN(baseEur)) {
      el.textContent = formatCurrency(baseEur, currency);
    }
  });

  const currencyBtns = document.querySelectorAll('.currency-btn');
  currencyBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-currency') === currency;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-pressed', String(isTarget));
  });

  try {
    localStorage.setItem(CURRENCY_KEY, currency);
  } catch (e) {}
}

const activeCurrency = localStorage.getItem(CURRENCY_KEY) || 'EUR';
updateAllPrices(activeCurrency);

document.querySelectorAll('.currency-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.getAttribute('data-currency');
    if (selected && RATES_FROM_EUR[selected]) {
      updateAllPrices(selected);
    }
  });
});
