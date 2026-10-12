(() => {
  const friends = Array.isArray(window.FRIENDS) ? window.FRIENDS : [];
  const $ = (id) => document.getElementById(id);
  const homeViews = [...document.querySelectorAll('.home-view')];
  const personalView = $('personalView');
  let activeFriend = null;
  let letterOpened = false;

  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const validPhoto = (src) => typeof src === 'string' && src.trim().length > 0;
  const placeholderMarkup = () => '<div class="photo-empty"><span>♡</span></div>';
  const photoMarkup = (photo, idx) => {
    const cls = photo.style === 'landscape' ? 'memory-photo landscape' : 'memory-photo portrait';
    const visual = validPhoto(photo.src)
      ? `<img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption || 'A memory')}" loading="lazy">`
      : placeholderMarkup();
    return `<figure class="scrap-photo ${idx % 2 ? 'tilt-right' : 'tilt-left'}"><div class="${cls}">${visual}</div><figcaption>${escapeHtml(photo.caption || 'a little memory')}</figcaption></figure>`;
  };
  function attachPhotoFallbacks(root) {
    root.querySelectorAll('.memory-photo img').forEach(img => {
      img.addEventListener('error', () => {
        img.replaceWith(document.createRange().createContextualFragment(placeholderMarkup()));
      }, { once: true });
    });
  }
  function renderWall() {
    const wall = $('friendWall');
    if (!wall) return;
    wall.innerHTML = friends.map((f, i) => `<button class="wall-card card-${i % 4}" data-slug="${escapeHtml(f.slug)}" type="button"><span class="wall-card-star">${['✳','♡','✿','✦'][i % 4]}</span><span class="wall-card-name">${escapeHtml(f.name)}</span><span class="wall-card-note">${escapeHtml(f.cardNote || 'a little corner for you')}</span><span class="wall-card-arrow">↗</span></button>`).join('');
  }
  function showHome() {
    activeFriend = null; letterOpened = false;
    homeViews.forEach(el => el.classList.remove('hidden'));
    personalView.classList.add('hidden');
    $('letterStage').classList.add('hidden'); $('letterPaper').classList.add('hidden');
    $('revealLetter').classList.remove('hidden');
    $('openEnvelope').classList.remove('opened');
    $('friendSearch').value = ''; $('searchResults').innerHTML = '';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function openFriend(slug) {
    const f = friends.find(item => item.slug.toLowerCase() === String(slug).toLowerCase());
    if (!f) { showHome(); $('searchHint').textContent = 'I couldn’t find that name. Try searching again ♡'; return; }
    activeFriend = f; loadCassette(f); letterOpened = false;
    homeViews.forEach(el => el.classList.add('hidden'));
    personalView.classList.remove('hidden');
    $('friendGreeting').textContent = f.greeting || `Hey, ${f.name}!`;
    $('friendIntro').textContent = f.intro || 'This little corner is yours.';
    const photos = (f.photos || []).filter(Boolean);
    const fallbackPhotos = [
      { caption: 'One of my favourite memories.' },
      { caption: 'A little moment worth keeping.' }
    ];
    $('personalScrapbook').innerHTML = (photos.length ? photos : fallbackPhotos).slice(0, 2).map(photoMarkup).join('');
    attachPhotoFallbacks($('personalScrapbook'));
    $('letterDate').textContent = f.letterDate || 'a little note, just because';
    $('letterTitle').textContent = f.letterTitle || `Dear ${f.name},`;
    $('letterBody').innerHTML = escapeHtml(f.letter || '').split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    $('letterSignoff').textContent = f.signoff || 'With love, always ♡';
    $('letterStage').classList.add('hidden'); $('letterPaper').classList.add('hidden');
    $('revealLetter').classList.remove('hidden'); $('openEnvelope').classList.remove('opened');
    $('envelopeCaption').textContent = 'Tap the envelope to open your letter.';
    history.replaceState(null, '', `#/letter/${encodeURIComponent(f.slug)}`);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function doSearch() {
    const q = $('friendSearch').value.trim().toLowerCase();
    const results = $('searchResults');
    if (!q) { results.innerHTML = ''; $('searchHint').textContent = 'Or open the personal link I sent you ♡'; return; }
    const matches = friends.filter(f => f.name.toLowerCase().includes(q) || f.slug.toLowerCase().includes(q));
    results.innerHTML = matches.length ? matches.map(f => `<button class="result-item" type="button" data-slug="${escapeHtml(f.slug)}"><span>${escapeHtml(f.name)}</span><span>open your corner ↗</span></button>`).join('') : '<p class="no-results">No name found just yet. Check the spelling and try again ♡</p>';
    $('searchHint').textContent = matches.length ? 'Is that you? Pick your name below.' : 'Try another spelling, or use the personal link I sent you.';
  }
  $('searchButton').addEventListener('click', doSearch);
  $('friendSearch').addEventListener('input', doSearch);
  $('friendSearch').addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $('searchResults').querySelector('[data-slug]'); if (first) openFriend(first.dataset.slug); } });
  document.addEventListener('click', e => { const button = e.target.closest('[data-slug]'); if (button) openFriend(button.dataset.slug); });
  $('backHome').addEventListener('click', () => { history.replaceState(null, '', location.pathname + location.search + '#/'); showHome(); });
  $('revealLetter').addEventListener('click', () => { $('letterStage').classList.remove('hidden'); $('revealLetter').classList.add('hidden'); $('letterStage').scrollIntoView({behavior:'smooth', block:'center'}); });
  function revealPaper() {
  if (letterOpened) return;

  letterOpened = true;

  $("openEnvelope").classList.add("opened");
  $("envelopeCaption").textContent =
    "A little something, from me to you.";

  window.setTimeout(() => {
    $("letterPaper").classList.remove("hidden");
    $("letterPaper").classList.add("letter-arrive");

    // Reveal the cassette underneath the letter.
    if (activeFriend?.song?.src) {
      cassette.section.classList.remove("hidden");
    }

    $("letterPaper").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 450);
}
  $('openEnvelope').addEventListener('click', revealPaper); $('skipAnimation').addEventListener('click', revealPaper);
  const music = $('backgroundMusic');
  const musicToggle = $('musicToggle');
  if (musicToggle && music) {
    musicToggle.addEventListener('click', async () => { try { if (music.paused) { await music.play(); musicToggle.setAttribute('aria-pressed','true'); $('musicLabel').textContent = 'Pause the soundtrack'; } else { music.pause(); musicToggle.setAttribute('aria-pressed','false'); $('musicLabel').textContent = 'A little soundtrack'; } } catch { $('musicLabel').textContent = 'Add audio/background.mp3'; } });
  }
  // Personal cassette player
const cassette = {
  section: $("cassetteSection"),
  audio: $("personalSong"),
  play: $("cassettePlay"),
  seek: $("cassetteSeek"),
  current: $("cassetteCurrentTime"),
  duration: $("cassetteDuration"),
  status: $("cassetteStatus"),
  leftReel: $("reelLeft"),
  rightReel: $("reelRight")
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function loadCassette(friend) {
  const song = friend?.song;

  // Reset cassette state
  cassette.section.classList.remove("playing");
  cassette.audio.pause();
  cassette.audio.removeAttribute("src");
  cassette.audio.load();

  cassette.section.classList.add("hidden");
  cassette.play.textContent = "▶ Play";
  cassette.seek.value = 0;
  cassette.current.textContent = "0:00";
  cassette.duration.textContent = "0:00";
  cassette.status.textContent = "";

  cassette.leftReel.classList.remove("spinning");
  cassette.rightReel.classList.remove("spinning");

  // Hide the cassette if no song is configured
  if (!song?.src) return;

  // Set song information
  $("cassetteFriend").textContent =
    `${friend.name.toUpperCase()} ♡`;

  $("cassetteSongTitle").textContent =
    song.title || "A song for you";

  $("cassetteArtist").textContent =
    song.artist || "";

  // Load the song
  cassette.audio.src = song.src;
  cassette.audio.load();

  // Show the cassette
  cassette.section.classList.remove("hidden");
}

cassette.play.addEventListener("click", async () => {
  if (!cassette.audio.src) {
    cassette.status.textContent = "No song found for this friend. ♡";
    return;
  }

  try {
    if (cassette.audio.paused) {
      await cassette.audio.play();
    } else {
      cassette.audio.pause();
    }
  } catch (error) {
    console.error("Song playback error:", error);

    cassette.status.textContent =
      "Couldn't play the song. Check that the audio file exists. ♡";
  }
});

cassette.audio.addEventListener("play", () => {
  cassette.section.classList.add("playing");
  cassette.play.textContent = "Pause";
  cassette.status.textContent = "Playing your little soundtrack ♡";

  cassette.leftReel.classList.add("spinning");
  cassette.rightReel.classList.add("spinning");
});

cassette.audio.addEventListener("pause", () => {
  cassette.section.classList.remove("playing");
  cassette.play.textContent = "▶ Play";

  cassette.leftReel.classList.remove("spinning");
  cassette.rightReel.classList.remove("spinning");
});

cassette.audio.addEventListener("ended", () => {
  cassette.status.textContent = "End of side A. ♡";
  cassette.play.textContent = "▶ Play again";
});

cassette.audio.addEventListener("loadedmetadata", () => {
  cassette.duration.textContent =
    formatTime(cassette.audio.duration);
});

cassette.audio.addEventListener("timeupdate", () => {
  const audio = cassette.audio;

  cassette.current.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    cassette.seek.value =
      (audio.currentTime / audio.duration) * 100;
  }
});

cassette.seek.addEventListener("input", () => {
  const audio = cassette.audio;

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number(cassette.seek.value) / 100) * audio.duration;
  }
});
  renderWall();
  const route = location.hash.match(/^#\/letter\/([^/?#]+)/);
  if (route) openFriend(decodeURIComponent(route[1]));
  window.addEventListener('hashchange', () => { const m = location.hash.match(/^#\/letter\/([^/?#]+)/); if (m) openFriend(decodeURIComponent(m[1])); else showHome(); });
})();

// Homepage photo gallery
(() => {
  const gallery = document.getElementById("photoGallery");
  const track = document.getElementById("galleryTrack");
  const dotsContainer = document.getElementById("galleryDots");
  const previous = document.getElementById("galleryPrev");
  const next = document.getElementById("galleryNext");

  if (!gallery || !track || !dotsContainer) return;

  const slides = Array.from(track.querySelectorAll(".gallery-slide"));
  if (!slides.length) return;

  let current = 0;
  let timer;
  let touchStartX = 0;
  let touchStartY = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".gallery-dot"));

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function previousSlide() {
    showSlide(current - 1);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function startTimer() {
    stopTimer();

    if (!reducedMotion && slides.length > 1) {
      timer = setInterval(nextSlide, 4000);
    }
  }

  function restartTimer() {
    startTimer();
  }

  next.addEventListener("click", () => {
    nextSlide();
    restartTimer();
  });

  previous.addEventListener("click", () => {
    previousSlide();
    restartTimer();
  });

  // Pause while the visitor interacts with the gallery.
  gallery.addEventListener("mouseenter", stopTimer);
  gallery.addEventListener("mouseleave", startTimer);
  gallery.addEventListener("focusin", stopTimer);
  gallery.addEventListener("focusout", startTimer);

  // Swipe support for phones and tablets.
  gallery.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
    stopTimer();
  }, { passive: true });

  gallery.addEventListener("touchend", event => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? nextSlide() : previousSlide();
    }

    startTimer();
  }, { passive: true });

  // Stop automatic movement when the browser tab is hidden.
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopTimer() : startTimer();
  });

  // Don't autoplay if the user prefers reduced motion.
  showSlide(0);
  startTimer();
})();

// Gallery for the "Some people just stick" section
// Continuous Polaroid carousel with touch and drag support
// Seamlessly looping Polaroid carousel
(() => {
  const gallery = document.getElementById("memoryGallery");
  const track = document.getElementById("memoryGalleryTrack");

  if (!gallery || !track) return;

  // Prevent duplicating the photos multiple times.
  if (track.dataset.duplicated === "true") return;

  const originalPhotos = Array.from(track.children);

  if (!originalPhotos.length) return;

  // Duplicate the complete set for a seamless loop.
  originalPhotos.forEach(photo => {
    track.appendChild(photo.cloneNode(true));
  });

  track.dataset.duplicated = "true";

  // Pause when the visitor hovers over the gallery.
  gallery.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });

  gallery.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });

  // Support manual swiping and dragging.
  let dragging = false;
  let startX = 0;
  let moved = false;

  gallery.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragging = true;
    moved = false;
    startX = event.clientX;

    track.style.animationPlayState = "paused";
    gallery.setPointerCapture(event.pointerId);
  });

  gallery.addEventListener("pointermove", event => {
    if (!dragging) return;

    if (Math.abs(event.clientX - startX) > 8) {
      moved = true;
    }
  });

  function finishDragging() {
    if (!dragging) return;

    dragging = false;

    // Resume the seamless automatic loop.
    track.style.animationPlayState = "running";
  }

  gallery.addEventListener("pointerup", finishDragging);
  gallery.addEventListener("pointercancel", finishDragging);

  // Prevent accidental image dragging.
  track.querySelectorAll("img").forEach(img => {
    img.draggable = false;
  });
})();
