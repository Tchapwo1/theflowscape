/**
 * TSCAPE TV — Hybrid Media Engine (YouTube Privacy Embeds + Supabase/Local Storage)
 * Zero-cost streaming architecture for The Flowscape.
 */

(() => {
  const gridEl = document.getElementById('tv-grid');
  const emptyEl = document.getElementById('tv-empty-state');
  const resetBtn = document.getElementById('tv-reset-btn');
  const searchInput = document.getElementById('tv-search');
  const filterBtns = document.querySelectorAll('.tv-filter-btn');
  const sourceLabel = document.getElementById('tv-source-label');
  const statusLive = document.getElementById('tv-live-region');

  // Spotlight elements
  const heroBackdrop = document.getElementById('tv-hero-backdrop');
  const heroTitle = document.getElementById('tv-hero-title');
  const heroDesc = document.getElementById('tv-hero-desc');
  const heroMeta = document.getElementById('tv-hero-meta');
  const heroPlayBtn = document.getElementById('tv-hero-play-btn');

  // Theater Modal elements
  const modal = document.getElementById('tv-modal');
  const modalClose = document.getElementById('tv-modal-close');
  const modalTitle = document.getElementById('tv-modal-title');
  const modalDesc = document.getElementById('tv-modal-desc');
  const modalStage = document.getElementById('tv-stage');
  const modalSanctuaryLink = document.getElementById('tv-modal-sanctuary-link');

  let allVideos = [];
  let activeCategory = 'all';
  let searchQuery = '';
  let lastFocusedTrigger = null;

  const isLocalEnv =
    window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  // Resolve clean production vs local sanctuary routes
  function resolveSanctuaryHref(video) {
    if (!isLocalEnv) {
      if (video.sanctuary === 'schwarzwald') return '/schwarzwald/';
      if (video.sanctuary === 'provence') return '/provence/';
      if (video.sanctuary === 'london') return '/london/';
      if (video.sanctuary === 'tuscany') return '/tuscany/';
      if (video.sanctuary === 'swiss-alps') return '/swiss-alps/';
      return '/#collection';
    }
    return video.sanctuary_url || '../index.html#collection';
  }

  // Extract 11-char YouTube ID safely whether supplied as ID or full URL
  function parseYouTubeId(input) {
    if (!input) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input.trim();
  }

  function getSourceBadge(sourceType) {
    if (sourceType === 'youtube') return 'YouTube 4K Stream';
    if (sourceType === 'supabase') return 'Supabase Cloud Reel';
    return 'Direct Sanctuary MP4';
  }

  // Load Broadcast Catalog (Supabase via Cloudflare Worker API -> static catalog.json fallback)
  async function loadCatalog() {
    let loaded = false;

    if (!isLocalEnv) {
      try {
        const res = await fetch('/api/tv/catalog', { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.videos) && data.videos.length > 0) {
            allVideos = data.videos;
            if (sourceLabel) {
              sourceLabel.textContent =
                data.source === 'supabase'
                  ? 'Live Sync: Supabase Storage & Postgres Active'
                  : 'Edge CDN Stream: All Transmissions Ready';
            }
            loaded = true;
          }
        }
      } catch (err) {
        console.warn('Edge catalog check skipped, falling back to local manifest:', err);
      }
    }

    if (!loaded) {
      try {
        const res = await fetch('catalog.json');
        if (res.ok) {
          allVideos = await res.json();
          if (sourceLabel) {
            sourceLabel.textContent = 'Hybrid Broadcast Engine Ready (YouTube + Direct MP4 / Supabase Ready)';
          }
        }
      } catch (err) {
        console.error('Failed to load TSCAPE TV catalog:', err);
      }
    }

    initSpotlight();
    renderCatalog();
  }

  function initSpotlight() {
    if (!allVideos.length) return;
    const featured = allVideos.find(v => v.is_featured) || allVideos[0];

    if (heroBackdrop) {
      heroBackdrop.style.backgroundImage = `url('${featured.poster_url}')`;
    }
    if (heroTitle) {
      heroTitle.innerHTML = featured.title.replace(':', ':<br><em>') + (featured.title.includes(':') ? '</em>' : '');
    }
    if (heroDesc) heroDesc.textContent = featured.description;
    if (heroMeta) {
      heroMeta.textContent = `${featured.sanctuary_label || 'The Flowscape'} · ${featured.duration_label} · ${getSourceBadge(featured.source_type)}`;
    }
    if (heroPlayBtn) {
      heroPlayBtn.onclick = () => openTheater(featured, heroPlayBtn);
    }
  }

  function renderCatalog() {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const q = searchQuery.toLowerCase().trim();
    const filtered = allVideos.filter(video => {
      const catMatch = activeCategory === 'all' || video.category === activeCategory;
      const textMatch =
        !q ||
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        (video.sanctuary_label || '').toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    if (statusLive) {
      statusLive.textContent = `Showing ${filtered.length} broadcast${filtered.length === 1 ? '' : 's'}.`;
    }

    if (filtered.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    filtered.forEach(video => {
      const card = document.createElement('article');
      card.className = 'tv-card';

      const targetHref = resolveSanctuaryHref(video);
      const sourceBadge = getSourceBadge(video.source_type);

      card.innerHTML = `
        <button type="button" class="tv-thumb-btn" aria-label="Watch ${video.title}">
          <img class="tv-thumb-img" src="${video.poster_url}" alt="${video.title}" loading="lazy">
          <div class="tv-play-overlay">
            <span class="tv-play-circle" aria-hidden="true">▶</span>
          </div>
          <span class="tv-badge-source">${sourceBadge}</span>
          <span class="tv-badge-duration">${video.duration_label}</span>
        </button>
        <div class="tv-card-body">
          <div class="tv-card-meta">${video.sanctuary_label || video.category}</div>
          <h3 class="tv-card-title">${video.title}</h3>
          <p class="tv-card-desc">${video.description}</p>
          <div class="tv-card-footer">
            <button type="button" class="tv-watch-link">Watch Transmission ▶</button>
            <a class="tv-sanctuary-link" href="${targetHref}">Explore Retreat ↗</a>
          </div>
        </div>
      `;

      const thumbBtn = card.querySelector('.tv-thumb-btn');
      const watchBtn = card.querySelector('.tv-watch-link');

      thumbBtn.addEventListener('click', () => openTheater(video, thumbBtn));
      watchBtn.addEventListener('click', () => openTheater(video, watchBtn));

      gridEl.appendChild(card);
    });
  }

  // Open Focus-Trapped Hybrid Cinema Modal
  function openTheater(video, triggerEl) {
    if (!modal || !modalStage) return;
    lastFocusedTrigger = triggerEl || document.activeElement;

    if (modalTitle) modalTitle.textContent = video.title;
    if (modalDesc) modalDesc.textContent = video.description;

    if (modalSanctuaryLink) {
      modalSanctuaryLink.href = resolveSanctuaryHref(video);
      modalSanctuaryLink.textContent = `Explore ${video.sanctuary_label || 'Sanctuary'} ↗`;
    }

    modalStage.innerHTML = '';

    if (video.source_type === 'youtube') {
      const ytId = parseYouTubeId(video.video_url);
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = video.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      modalStage.appendChild(iframe);
    } else {
      // Direct Storage Mode (Supabase Bucket OR Local Website /tv/media/ MP4)
      const videoEl = document.createElement('video');
      videoEl.src = video.video_url;
      videoEl.poster = video.poster_url;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.preload = 'metadata';

      videoEl.onerror = () => {
        modalStage.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;color:#f7f4ee;">
            <p style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:8px;">Stream temporarily resting</p>
            <p style="font-size:13px;color:#b0bab0;max-width:420px;">This direct media transmission could not load right now. Explore the retreat sanctuary directly below.</p>
          </div>
        `;
      };

      modalStage.appendChild(videoEl);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeTheater() {
    if (!modal || !modalStage) return;
    modal.classList.remove('open');
    modalStage.innerHTML = ''; // Halts YouTube or MP4 audio/bandwidth instantly
    document.body.style.overflow = '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  // Filter Pills & Search Event Bindings
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      renderCatalog();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      renderCatalog();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      filterBtns.forEach(b => {
        const isAll = b.getAttribute('data-category') === 'all';
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
      renderCatalog();
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeTheater);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeTheater();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeTheater();
    }
  });

  // Resolve static [data-prod] links in production vs local development
  if (!isLocalEnv) {
    document.querySelectorAll('a[data-prod]').forEach(a => {
      const prodHref = a.getAttribute('data-prod');
      if (prodHref) a.href = prodHref;
    });
  }

  // Start Engine
  loadCatalog();
})();
