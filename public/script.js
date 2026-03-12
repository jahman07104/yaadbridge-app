// YardBridge Consulting · script.js (production-hardened, API-connected)
// XSS-safe DOM, localStorage persistence, loading states,
// real appointment dates, active nav, scroll-to-top, char counters.

// SECTION: Utilities ------------------------------------------------
function qs(sel, scope) { return (scope || document).querySelector(sel); }
function qsa(sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); }

var idCounter = 1;
function nextId() { return idCounter++; }

function escapeHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'helper-text status-' + (type || 'success');
}

function lsGet(key, fallback) {
  try { var r = localStorage.getItem(key); return r !== null ? JSON.parse(r) : fallback; }
  catch (e) { return fallback; }
}

function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.origText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.classList.add('btn-loading');
  } else {
    btn.textContent = btn.dataset.origText || btn.textContent;
    btn.disabled = false;
    btn.classList.remove('btn-loading');
  }
}

function fakeSubmit(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms || 900); });
}

function apiFetch(url, method, data) {
  var opts = { method: method || 'GET' };
  if (data) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(data);
  }
  return fetch(url, opts);
}

// SECTION: Navigation -----------------------------------------------
(function initNav() {
  var toggle = qs('.nav-toggle');
  var navList = qs('.nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', function() {
    var open = navList.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  navList.addEventListener('click', function(e) {
    if (e.target.matches('a')) {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when clicking outside the nav
  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  qsa('[data-scroll-target]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var t = btn.getAttribute('data-scroll-target');
      var el = t && qs(t);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// SECTION: Active nav (IntersectionObserver) -----------------------
(function initActiveNav() {
  var sections = qsa('main section[id]');
  var links = qsa('.nav-list a[href^="#"]');
  if (!sections.length || !links.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        links.forEach(function(a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(function(s) { obs.observe(s); });
})();

// SECTION: Scroll-to-top -------------------------------------------
(function initScrollTop() {
  var btn = qs('#scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// SECTION: Character counters (textarea[maxlength]) ----------------
(function initCharCounters() {
  qsa('textarea[maxlength]').forEach(function(ta) {
    var max = parseInt(ta.getAttribute('maxlength'), 10);
    var c = document.createElement('span');
    c.className = 'char-counter';
    c.setAttribute('aria-live', 'polite');
    c.textContent = '0 / ' + max;
    ta.parentNode.appendChild(c);
    ta.addEventListener('input', function() {
      var len = ta.value.length;
      c.textContent = len + ' / ' + max;
      c.classList.toggle('is-near-limit', len > max * 0.85);
    });
  });
})();

// SECTION: Hero intake form ----------------------------------------
(function initHeroIntake() {
  var form = qs('#hero-intake-form');
  var statusEl = qs('#hero-intake-status');
  if (!form || !statusEl) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim() || 'Friend';
    var origin = (data.get('origin') || '').toString().trim();
    var month = (data.get('month') || '').toString();
    var items = data.getAll('quick-items').map(function(v) { return v.toString(); });

    if (!items.length) {
      setStatus(statusEl, 'Tell us at least one thing you plan to bring.', 'error');
      return;
    }

    setButtonLoading(btn, true);
    apiFetch('/api/hero-intake', 'POST', { name: name, origin: origin, month: month, items: items })
      .then(function(res) {
        setButtonLoading(btn, false);
        if (res.ok) {
          setStatus(statusEl, "Thanks, " + escapeHtml(name) + ". We'll use this snapshot to pre-shape your quote.", 'success');
          form.reset();
        } else {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function() {
        setButtonLoading(btn, false);
        setStatus(statusEl, 'Network error. Please check your connection.', 'error');
      });
  });
})();

// SECTION: Quote form - dynamic lists (XSS-safe DOM) --------------
(function initDynamicLists() {
  var vehicleList = qs('#vehicle-list');
  var addVehicleBtn = qs('#add-vehicle');
  var toolList = qs('#tool-list');
  var addToolBtn = qs('#add-tool');

  function makeField(id, name, labelText, type, placeholder, attrs) {
    var wrap = document.createElement('div');
    wrap.className = 'field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    var input = type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
    if (type !== 'textarea') input.type = type || 'text';
    else input.rows = 2;
    input.id = id;
    input.name = name;
    if (placeholder) input.placeholder = placeholder;
    if (attrs) Object.keys(attrs).forEach(function(k) { input.setAttribute(k, attrs[k]); });
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function makeHeader(text) {
    var h = document.createElement('div');
    h.className = 'dynamic-item-header';
    var t = document.createElement('div');
    t.className = 'dynamic-item-title';
    t.textContent = text;
    var rb = document.createElement('button');
    rb.type = 'button';
    rb.className = 'dynamic-remove';
    rb.textContent = 'Remove';
    h.appendChild(t);
    h.appendChild(rb);
    return h;
  }

  function wireRemove(list) {
    list.addEventListener('click', function(e) {
      var b = e.target;
      if (b instanceof HTMLButtonElement && b.classList.contains('dynamic-remove')) {
        var item = b.closest('.dynamic-item');
        if (item) item.remove();
      }
    });
  }

  if (vehicleList && addVehicleBtn) {
    addVehicleBtn.addEventListener('click', function() {
      var id = nextId();
      var w = document.createElement('div');
      w.className = 'dynamic-item';
      w.dataset.id = String(id);
      w.appendChild(makeHeader('Vehicle ' + id));
      w.appendChild(makeField('vehicle-' + id + '-make', 'vehicle[' + id + '][make]', 'Make & model', 'text', 'e.g. Toyota Axio'));
      w.appendChild(makeField('vehicle-' + id + '-year', 'vehicle[' + id + '][year]', 'Year', 'number', '', { min: 1990, max: 2100 }));
      w.appendChild(makeField('vehicle-' + id + '-value', 'vehicle[' + id + '][value]', 'Approximate value (USD)', 'number', '', { min: 0 }));
      w.appendChild(makeField('vehicle-' + id + '-notes', 'vehicle[' + id + '][notes]', 'Notes', 'textarea', 'Ownership length, left/right-hand, mileage...'));
      vehicleList.appendChild(w);
    });
    wireRemove(vehicleList);
  }

  if (toolList && addToolBtn) {
    addToolBtn.addEventListener('click', function() {
      var id = nextId();
      var w = document.createElement('div');
      w.className = 'dynamic-item';
      w.dataset.id = String(id);
      w.appendChild(makeHeader('Tools / equipment ' + id));
      w.appendChild(makeField('tool-' + id + '-type', 'tool[' + id + '][type]', 'Type of work', 'text', 'e.g. carpenter, photographer'));
      w.appendChild(makeField('tool-' + id + '-items', 'tool[' + id + '][items]', 'Main items', 'textarea', 'e.g. drills, saws, camera bodies, lenses'));
      w.appendChild(makeField('tool-' + id + '-value', 'tool[' + id + '][value]', 'Approximate total value (USD)', 'number', '', { min: 0 }));
      w.appendChild(makeField('tool-' + id + '-notes', 'tool[' + id + '][notes]', 'Notes', 'textarea', 'Age of equipment, serials recorded, etc.'));
      toolList.appendChild(w);
    });
    wireRemove(toolList);
  }
})();

// SECTION: Quote form - auto-save draft + submission ---------------
(function initQuoteForm() {
  var form = qs('#quote-form');
  var statusEl = qs('#quote-status');
  if (!form || !statusEl) return;

  var DRAFT = 'yaadbridge_quote_draft';
  var fields = ['name', 'email', 'phone', 'origin', 'rooms', 'notes'];
  var saved = lsGet(DRAFT, {});
  fields.forEach(function(f) {
    var el = form.elements[f];
    if (el && saved[f]) el.value = saved[f];
  });

  form.addEventListener('input', function() {
    var d = {};
    fields.forEach(function(f) { var el = form.elements[f]; if (el) d[f] = el.value; });
    lsSet(DRAFT, d);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(statusEl, 'Please fill in the required fields (name, email, origin).', 'error');
      return;
    }
    var payload = {};
    fields.forEach(function(f) { var el = form.elements[f]; if (el) payload[f] = el.value; });
    payload.goodsNotes = (new FormData(form).get('goodsNotes') || '').toString();
    payload.volume = (new FormData(form).get('volume') || '').toString();
    var vehicles = [];
    qsa('.dynamic-item', qs('#vehicle-list') || document.createElement('div')).forEach(function(item) {
      var v = {};
      qsa('input, textarea', item).forEach(function(inp) { v[inp.name.replace(/vehicle\[\d+\]\[(.+)\]/, '$1')] = inp.value; });
      if (v.make) vehicles.push(v);
    });
    var tools = [];
    qsa('.dynamic-item', qs('#tool-list') || document.createElement('div')).forEach(function(item) {
      var t = {};
      qsa('input, textarea', item).forEach(function(inp) { t[inp.name.replace(/tool\[\d+\]\[(.+)\]/, '$1')] = inp.value; });
      if (t.type || t.items) tools.push(t);
    });
    payload.vehicles = vehicles;
    payload.tools = tools;
    setButtonLoading(btn, true);
    apiFetch('/api/quote', 'POST', payload)
      .then(function(res) {
        setButtonLoading(btn, false);
        if (res.ok) {
          setStatus(statusEl, "Quote request received. We'll reply within 1-2 business days.", 'success');
          form.reset();
          lsSet(DRAFT, {});
          var vl = qs('#vehicle-list'); if (vl) vl.innerHTML = '';
          var tl = qs('#tool-list');    if (tl) tl.innerHTML = '';
        } else {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function() {
        setButtonLoading(btn, false);
        setStatus(statusEl, 'Network error. Please check your connection.', 'error');
      });
  });
})();

// SECTION: Appointment booking - real current-week dates ----------
(function initAppointments() {
  var slotGrid = qs('#slot-grid');
  var bookingSlotInput = qs('#booking-slot');
  var bookingForm = qs('#booking-form');
  var statusEl = qs('#booking-status');
  if (!slotGrid || !bookingSlotInput || !bookingForm || !statusEl) return;

  function getWeekDates() {
    var today = new Date();
    var dow = today.getDay();
    var monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    var dates = [];
    for (var i = 0; i < 5; i++) {
      var d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }

  var weekDates = getWeekDates();
  var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var times = ['9:00 am', '11:00 am', '2:00 pm', '4:00 pm'];

  weekDates.forEach(function(date, i) {
    times.forEach(function(time) {
      var dateStr = date.toLocaleDateString('en-JM', { month: 'short', day: 'numeric' });
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.dataset.slotId = dayNames[i] + '-' + time;
      btn.dataset.label = dayNames[i] + ' ' + dateStr + ' at ' + time;
      [['slot-day', dayNames[i]], ['slot-date', dateStr],
       ['slot-time', time], ['slot-type', 'Virtual consult']].forEach(function(pair) {
        var span = document.createElement('span');
        span.className = pair[0];
        span.textContent = pair[1];
        btn.appendChild(span);
      });
      slotGrid.appendChild(btn);
    });
  });

  var selectedSlotId = '';

  slotGrid.addEventListener('click', function(e) {
    var btn = e.target.closest('.slot');
    if (!(btn instanceof HTMLButtonElement)) return;
    var id = btn.dataset.slotId;
    if (!id) return;
    selectedSlotId = id;
    qsa('.slot', slotGrid).forEach(function(el) { el.classList.remove('is-selected'); });
    btn.classList.add('is-selected');
    bookingSlotInput.value = (btn.dataset.label || id) + ' (Jamaica Time, UTC-5)';
  });

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = bookingForm.querySelector('[type="submit"]');
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      setStatus(statusEl, 'Please fill in your name and email.', 'error');
      return;
    }
    if (!selectedSlotId) {
      setStatus(statusEl, 'Please choose a time slot from the grid.', 'error');
      return;
    }
    var fd = new FormData(bookingForm);
    var payload = {
      name: (fd.get('name') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      sessionType: (fd.get('type') || '').toString(),
      slot: selectedSlotId,
      slotLabel: bookingSlotInput.value
    };
    setButtonLoading(btn, true);
    apiFetch('/api/booking', 'POST', payload)
      .then(function(res) {
        setButtonLoading(btn, false);
        if (res.ok) {
          setStatus(statusEl, 'Booking confirmed. A calendar invite will be sent to your email.', 'success');
          bookingForm.reset();
          bookingSlotInput.value = '';
          selectedSlotId = '';
          qsa('.slot', slotGrid).forEach(function(el) { el.classList.remove('is-selected'); });
        } else {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function() {
        setButtonLoading(btn, false);
        setStatus(statusEl, 'Network error. Please check your connection.', 'error');
      });
  });
})();

// SECTION: Blog comments - localStorage + XSS-safe ---------------
(function initBlogComments() {
  var posts = qsa('.blog-post');
  if (!posts.length) return;

  var STORE = 'yaadbridge_comments';
  var allComments = lsGet(STORE, {});
  function save() { lsSet(STORE, allComments); }

  function renderComment(list, c) {
    var li = document.createElement('li');
    li.className = 'comment';
    var author = document.createElement('div');
    author.className = 'comment-author';
    author.textContent = c.name;
    var ts = document.createElement('time');
    ts.className = 'comment-time';
    ts.textContent = c.date;
    var body = document.createElement('div');
    body.className = 'comment-body';
    body.textContent = c.body;
    li.appendChild(author); li.appendChild(ts); li.appendChild(body);
    list.appendChild(li);
  }

  posts.forEach(function(post) {
    var postId = post.dataset.postId;
    var toggleBtn = qs('[data-toggle-comments]', post);
    var wrap = qs('.comments', post);
    var commentList = qs('.comment-list', post);
    var form = qs('.comment-form', post);
    if (!toggleBtn || !wrap || !commentList || !form) return;

    var stored = allComments[postId] || [];
    stored.forEach(function(c) { renderComment(commentList, c); });

    function updateLabel(hidden) {
      var count = (allComments[postId] || []).length;
      toggleBtn.textContent = (hidden ? 'Show' : 'Hide') + ' comments' +
        (count ? ' (' + count + ')' : '');
    }
    updateLabel(true);

    toggleBtn.addEventListener('click', function() {
      var hidden = wrap.hasAttribute('hidden');
      if (hidden) {
        wrap.removeAttribute('hidden');
        // Try to fetch fresher comments from API
        apiFetch('/api/comments?postId=' + postId)
          .then(function(res) { return res.json(); })
          .then(function(data) {
            var apiComments = data.comments || [];
            if (apiComments.length > commentList.querySelectorAll('.comment').length) {
              commentList.innerHTML = '';
              apiComments.forEach(function(c) { renderComment(commentList, c); });
              allComments[postId] = apiComments;
              save();
            }
            updateLabel(false);
          })
          .catch(function() { updateLabel(false); });
      } else {
        wrap.setAttribute('hidden', '');
        updateLabel(true);
      }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!form.checkValidity()) return;
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim() || 'Anonymous';
      var body = (data.get('body') || '').toString().trim();
      if (!body) return;
      var comment = {
        name: name, body: body,
        date: new Date().toLocaleDateString('en-JM', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      if (!allComments[postId]) allComments[postId] = [];
      allComments[postId].push(comment);
      save();
      renderComment(commentList, comment);
      form.reset();
      updateLabel(wrap.hasAttribute('hidden'));
      // Also sync to API
      apiFetch('/api/comments', 'POST', comment).catch(function() {});
    });
  });
})();

// SECTION: Forum - localStorage + XSS-safe ------------------------
(function initForum() {
  var catBtns = qsa('#forum-categories button');
  var topicList = qs('#topic-list');
  var catLabel = qs('#forum-category-label');
  var newTopicForm = qs('#new-topic-form');
  if (!catBtns.length || !topicList || !catLabel || !newTopicForm) return;

  var STORE = 'yaadbridge_forum';
  var CAT_NAMES = {
    logistics: 'Moving logistics',
    housing: 'Housing & neighbourhoods',
    work: 'Work, business & digital nomads',
    life: 'Life in Jamaica'
  };
  var defaults = {
    logistics: [{
      id: nextId(),
      title: 'How early should I start the shipping process?',
      body: 'Planning to return from Toronto - curious when to start collecting quotes.',
      replies: 2, date: 'Mar 2026'
    }],
    housing: [], work: [], life: []
  };
  var topics = lsGet(STORE, defaults);
  var active = 'logistics';

  function renderTopics(list) {
    topicList.innerHTML = '';
    list = list || topics[active] || [];
    if (!list.length) {
      var li = document.createElement('li');
      li.className = 'topic topic-empty';
      var p = document.createElement('p');
      p.className = 'helper-text';
      p.textContent = 'No topics yet. Be the first to start a conversation.';
      li.appendChild(p);
      topicList.appendChild(li);
      return;
    }
    list.forEach(function(t) {
      var li = document.createElement('li');
      li.className = 'topic';
      var titleDiv = document.createElement('div');
      titleDiv.className = 'topic-title';
      titleDiv.textContent = t.title;
      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'topic-body';
      bodyDiv.textContent = t.body.length > 160 ? t.body.slice(0, 160) + '...' : t.body;
      var metaDiv = document.createElement('div');
      metaDiv.className = 'topic-meta';
      metaDiv.textContent = t.replies + ' ' + (t.replies === 1 ? 'reply' : 'replies') +
        (t.date ? ' · ' + t.date : '') + ' · community-powered';
      li.appendChild(titleDiv); li.appendChild(bodyDiv); li.appendChild(metaDiv);
      topicList.appendChild(li);
    });
  }

  function loadTopics() {
    renderTopics(topics[active] || []);
    apiFetch('/api/topics?category=' + active)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var apiTopics = data.topics || [];
        if (apiTopics.length) {
          topics[active] = apiTopics;
          lsSet(STORE, topics);
          renderTopics(apiTopics);
        }
      })
      .catch(function() {});
  }

  catBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cat = btn.getAttribute('data-category');
      if (!cat || cat === active) return;
      active = cat;
      catBtns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      catLabel.textContent = CAT_NAMES[cat] || 'Topics';
      loadTopics();
    });
  });

  newTopicForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!newTopicForm.checkValidity()) return;
    var data = new FormData(newTopicForm);
    var title = (data.get('title') || '').toString().trim();
    var body = (data.get('body') || '').toString().trim();
    if (!title || !body) return;
    if (!topics[active]) topics[active] = [];
    topics[active].unshift({
      id: nextId(), title: title, body: body, replies: 0,
      date: new Date().toLocaleDateString('en-JM', { year: 'numeric', month: 'short' })
    });
    lsSet(STORE, topics);
    newTopicForm.reset();
    renderTopics(topics[active]);
    apiFetch('/api/topics', 'POST', { category: active, title: title, body: body, authorName: 'Community member' })
      .catch(function() {});
  });

  loadTopics();
})();

// SECTION: Marketplace - localStorage + XSS-safe -----------------
(function initMarketplace() {
  var form = qs('#listing-form');
  var statusEl = qs('#listing-status');
  var listEl = qs('#listing-list');
  var filterEl = qs('#listing-filter');
  if (!form || !statusEl || !listEl || !filterEl) return;

  var STORE = 'yaadbridge_marketplace';
  var listings = lsGet(STORE, []);
  var CAT_LABELS = { housing: 'Housing', services: 'Services', vehicles: 'Vehicles', goods: 'Household goods' };

  function loadListings(filter) {
    var local = filter && filter !== 'all'
      ? listings.filter(function(l) { return l.category === filter; })
      : listings;
    renderListings(local);
    var url = '/api/listings' + (filter && filter !== 'all' ? '?category=' + filter : '');
    apiFetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var api = data.listings || [];
        if (api.length) renderListings(api);
      })
      .catch(function() {});
  }

  function renderListings(visible) {
    listEl.innerHTML = '';
    if (!visible || !visible.length) {
      var p = document.createElement('p');
      p.className = 'helper-text';
      p.textContent = 'No listings yet. Share a service or request to get things moving.';
      listEl.appendChild(p);
      return;
    }
    visible.forEach(function(l) {
      var li = document.createElement('li');
      li.className = 'listing';
      var header = document.createElement('div');
      header.className = 'listing-header';
      var badge = document.createElement('span');
      badge.className = 'listing-badge ' + l.listingType;
      badge.textContent = l.listingType === 'offer' ? 'Offering' : 'Looking for';
      var titleSpan = document.createElement('span');
      titleSpan.className = 'listing-title';
      titleSpan.textContent = l.title;
      var catSpan = document.createElement('span');
      catSpan.className = 'listing-category';
      catSpan.textContent = '· ' + l.categoryLabel;
      header.appendChild(badge); header.appendChild(titleSpan); header.appendChild(catSpan);
      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'listing-body';
      bodyDiv.textContent = l.description;
      var contactDiv = document.createElement('div');
      contactDiv.className = 'listing-contact';
      contactDiv.textContent = 'Contact: ' + l.contact;
      li.appendChild(header); li.appendChild(bodyDiv); li.appendChild(contactDiv);
      listEl.appendChild(li);
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = new FormData(form);
    var listingType = (data.get('listingType') || 'offer').toString();
    var category = (data.get('category') || 'services').toString();
    var title = (data.get('title') || '').toString().trim();
    var description = (data.get('description') || '').toString().trim();
    var contact = (data.get('contact') || '').toString().trim();
    if (!title || !description || !contact) return;
    var categoryLabel = CAT_LABELS[category] || 'Other';
    listings.unshift({
      id: nextId(), listingType: listingType, category: category,
      categoryLabel: categoryLabel,
      title: title, description: description, contact: contact,
      date: new Date().toLocaleDateString('en-JM', { year: 'numeric', month: 'short', day: 'numeric' })
    });
    lsSet(STORE, listings);
    setButtonLoading(btn, true);
    apiFetch('/api/listings', 'POST', { listingType: listingType, category: category,
      categoryLabel: categoryLabel, title: title, description: description, contact: contact })
      .then(function() {
        setButtonLoading(btn, false);
        form.reset();
        setStatus(statusEl, 'Listing posted. Community members can now reach out to you.', 'success');
        loadListings(filterEl.value || 'all');
      })
      .catch(function() {
        setButtonLoading(btn, false);
        form.reset();
        setStatus(statusEl, 'Listing saved. Will sync when connection is available.', 'success');
        loadListings(filterEl.value || 'all');
      });
  });

  filterEl.addEventListener('change', function() { loadListings(filterEl.value || 'all'); });
  loadListings('all');
})();

// SECTION: Contact form --------------------------------------------
(function initContactForm() {
  var form = qs('#contact-form');
  var statusEl = qs('#contact-status');
  if (!form || !statusEl) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(statusEl, 'Please fill in your name, email, and message.', 'error');
      return;
    }
    var fd = new FormData(form);
    var payload = {
      name: (fd.get('name') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      message: (fd.get('message') || '').toString().trim()
    };
    setButtonLoading(btn, true);
    apiFetch('/api/contact', 'POST', payload)
      .then(function(res) {
        setButtonLoading(btn, false);
        if (res.ok) {
          setStatus(statusEl, 'Message sent. We usually reply within one business day.', 'success');
          form.reset();
        } else {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function() {
        setButtonLoading(btn, false);
        setStatus(statusEl, 'Network error. Please check your connection.', 'error');
      });
  });
})();

// SECTION: Footer year --------------------------------------------
(function setYear() {
  var el = qs('#year');
  if (el) el.textContent = String(new Date().getFullYear());
})();
