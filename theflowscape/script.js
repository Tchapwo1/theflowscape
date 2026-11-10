// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
}

// Smart Link Resolution for Local Development
if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  document.querySelectorAll('a[data-local-href]').forEach(a => {
    const local = a.getAttribute('data-local-href');
    if (local) {
      a.href = local;
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  });

  document.querySelectorAll('.footer-col a[href*="github.io"]').forEach(a => {
    if (a.href.includes('schwarzwald')) a.href = '../schwarzwald-yoga-escape/index.html';
    else if (a.href.includes('provence')) a.href = '../provence-yoga-escape/index.html';
    else if (a.href.includes('london')) a.href = '../london-yoga-escape/index.html';
    a.removeAttribute('target');
    a.removeAttribute('rel');
  });
}

// Local Storage Draft Persistence
const DRAFT_KEY = 'flowscape_guest_draft';
function loadGuestDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    if (draft.name) {
      const nameInput = document.getElementById('circle-name');
      if (nameInput && !nameInput.value) nameInput.value = draft.name;
    }
    if (draft.email) {
      const emailInput = document.getElementById('circle-email');
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

// Destination Filtering, Search & Empty State Machine
const filterButtons = document.querySelectorAll('.filter-btn');
const destCards = document.querySelectorAll('.dest-card');
const searchInput = document.getElementById('sanctuary-search');
const emptyStateEl = document.getElementById('dest-empty-state');
const emptyStateResetBtn = document.getElementById('empty-state-reset-btn');
const teaserCircleBtn = document.getElementById('teaser-circle-btn');

let activeFilter = 'all';
let searchQuery = '';

function applySanctuaryFilters() {
  let visibleCount = 0;
  const q = searchQuery.toLowerCase().trim();

  destCards.forEach(card => {
    const category = card.getAttribute('data-category') || '';
    const textContent = card.innerText.toLowerCase();

    // When 'all' is selected, show active sanctuaries (future is shown on future tab)
    const matchesCategory = (activeFilter === 'all') 
      ? true 
      : category.includes(activeFilter);

    const matchesSearch = !q || textContent.includes(q);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      visibleCount++;
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });

  if (emptyStateEl) {
    emptyStateEl.style.display = (visibleCount === 0) ? 'block' : 'none';
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    activeFilter = btn.getAttribute('data-filter') || 'all';
    applySanctuaryFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    applySanctuaryFilters();
  });
}

if (emptyStateResetBtn) {
  emptyStateResetBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    activeFilter = 'all';
    filterButtons.forEach(b => {
      const isAll = b.getAttribute('data-filter') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-selected', String(isAll));
    });
    applySanctuaryFilters();
  });
}

if (teaserCircleBtn) {
  teaserCircleBtn.addEventListener('click', () => {
    const futureCheck = document.querySelector('input[name="destinations"][value="Future"]');
    if (futureCheck) futureCheck.checked = true;
    const nameInput = document.getElementById('circle-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 300);
  });
}

// Priority Circle Form
const form = document.getElementById('circle-form');
if (form) {
  const nameInput = document.getElementById('circle-name');
  const emailInput = document.getElementById('circle-email');
  const nameError = document.getElementById('circle-name-error');
  const emailError = document.getElementById('circle-email-error');
  const destError = document.getElementById('circle-dest-error');

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const destElements = form.querySelectorAll('input[name="destinations"]:checked');

    // Name validation
    if (!nameVal || nameVal.length < 2) {
      if (nameError) {
        nameError.textContent = 'Please enter your full name (at least 2 characters).';
        nameError.style.display = 'block';
      }
      if (nameInput) nameInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    // Email validation
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.display = 'block';
      }
      if (emailInput) emailInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    // Destination selection validation
    if (destElements.length === 0) {
      if (destError) {
        destError.textContent = 'Please select at least one sanctuary or future destination.';
        destError.style.display = 'block';
      }
      isValid = false;
    } else if (destError) {
      destError.style.display = 'none';
    }

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting Application...';
      submitBtn.disabled = true;
      form.setAttribute('aria-busy', 'true');
    }

    const destinations = Array.from(destElements).map(el => el.value).join(', ');
    const guests = form.querySelector('#circle-guests')?.value || '';
    const season = form.querySelector('#circle-season')?.value || '';

    const payload = {
      _subject: `New Priority Circle Lead — The Flowscape (${nameVal})`,
      _template: "table",
      _captcha: "false",
      Name: nameVal,
      Email: emailVal,
      "Preferred Sanctuaries": destinations,
      "Places Desired": guests,
      "Preferred Season": season,
      "Source Site": "theflowscape.com",
      SubmittedAt: new Date().toISOString()
    };

    try {
      // 1. Attempt edge worker serverless concierge API (Cloudflare Worker)
      const edgePromise = fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          destination: destinations,
          accommodations: guests,
          season: season,
          website_check: form.querySelector('input[name="website_check"]')?.value || '',
        })
      });

      // 2. Fallback to FormSubmit if offline or running outside Worker
      const response = await edgePromise;
      if (!response.ok) {
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
        console.warn('Priority Circle intake offline fallback recorded:', fallbackErr);
      }
    }

    // Success State
    form.removeAttribute('aria-busy');
    const success = document.getElementById('circle-success');
    if (success) {
      success.innerHTML = `<strong>Welcome to The Flowscape, ${nameVal}!</strong> Your priority circle application has been received for <em>${destinations}</em>. Our concierge will be in touch with private release dates and room allocations.`;
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (submitBtn) {
      submitBtn.textContent = 'Invitation Request Received 🪷';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.85';
    }
  });
}

// Privacy & Cookie Toast
const privacyToast = document.getElementById('privacy-toast');
const acceptBtn = document.getElementById('privacy-accept');
const closeBtn = document.getElementById('privacy-close');

if (privacyToast && !localStorage.getItem('flowscape_privacy_accepted')) {
  window.setTimeout(() => {
    privacyToast.classList.add('show');
  }, 1200);
}

function dismissPrivacyToast() {
  if (privacyToast) {
    privacyToast.classList.remove('show');
    localStorage.setItem('flowscape_privacy_accepted', 'true');
  }
}

if (acceptBtn) acceptBtn.addEventListener('click', dismissPrivacyToast);
if (closeBtn) closeBtn.addEventListener('click', dismissPrivacyToast);

// ✦ Dynamic Multi-Currency Engine (EUR € · GBP £ · USD $)
const RATES_FROM_EUR = {
  EUR: { rate: 1.0, symbol: '€', code: 'EUR' },
  GBP: { rate: 0.85, symbol: '£', code: 'GBP' },
  USD: { rate: 1.08, symbol: '$', code: 'USD' }
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

