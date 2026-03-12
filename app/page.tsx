export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand" id="top">
            <span className="brand-mark">YB</span>
            <div className="brand-text">
              <span className="brand-name">YardBridge Consulting</span>
              <span className="brand-tagline">Returning Residents · Jamaica</span>
            </div>
          </a>
          <nav className="nav" aria-label="Primary">
            <button className="nav-toggle" aria-expanded="false" aria-label="Toggle navigation">
              <span className="nav-toggle-bar"></span>
              <span className="nav-toggle-bar"></span>
            </button>
            <ul className="nav-list">
              <li><a href="#services">Services</a></li>
              <li><a href="#quote">Get a Quote</a></li>
              <li><a href="#appointments">Book</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#forum">Forum</a></li>
              <li><a href="#marketplace">Marketplace</a></li>
              <li><a href="#contact" className="btn btn-ghost btn-small">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Warm returns · Smooth landings</p>
              <h1 id="hero-heading">Consulting for Jamaicans coming back home.</h1>
              <p className="hero-lede">
                We help returning residents, expats, and digital nomads repatriate{' '}
                <strong>household goods</strong>, <strong>vehicles</strong>, and{' '}
                <strong>tools of trade</strong>—stress-free and compliant.
              </p>
              <div className="hero-actions">
                <a href="#quote" className="btn btn-primary">Start your quote</a>
                <button className="btn btn-ghost" data-scroll-target="#appointments">
                  Book a consultation
                </button>
              </div>
              <dl className="hero-highlights">
                <div>
                  <dt>Customs guidance</dt>
                  <dd>Returning resident eligibility, exemptions &amp; paperwork.</dd>
                </div>
                <div>
                  <dt>End‑to‑end support</dt>
                  <dd>From port logistics to door delivery in Jamaica.</dd>
                </div>
              </dl>
            </div>

            <div className="hero-card shadow-dramatic gradient-border">
              <div className="hero-card-header">
                <h2>Quick Snapshot</h2>
                <p>Share your move in under a minute.</p>
              </div>
              <form className="hero-intake" id="hero-intake-form" noValidate>
                <div className="field">
                  <label htmlFor="hero-name">Name</label>
                  <input id="hero-name" name="name" type="text" autoComplete="name" />
                </div>
                <div className="field field-inline">
                  <div>
                    <label htmlFor="hero-origin">Moving from</label>
                    <input id="hero-origin" name="origin" type="text" placeholder="London, Toronto…" />
                  </div>
                  <div>
                    <label htmlFor="hero-date">Target month</label>
                    <input id="hero-date" name="month" type="month" />
                  </div>
                </div>
                <fieldset className="field field-pill-group">
                  <legend>What are you bringing?</legend>
                  <div className="pill-options">
                    <label><input type="checkbox" name="quick-items" value="household" /> Household goods</label>
                    <label><input type="checkbox" name="quick-items" value="vehicle" /> Vehicle</label>
                    <label><input type="checkbox" name="quick-items" value="tools" /> Tools of trade</label>
                  </div>
                </fieldset>
                <button type="submit" className="btn btn-primary btn-block">Send snapshot</button>
                <p className="helper-text" id="hero-intake-status" aria-live="polite"></p>
              </form>
            </div>
          </div>
          <div className="floating-shape" aria-hidden="true"></div>
        </section>

        {/* SERVICES */}
        <section id="services" className="section" aria-labelledby="services-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="services-heading">Specialised services for your return</h2>
              <p>Consulting tailored to Jamaican returning residents, from first question to final delivery.</p>
            </header>
            <div className="service-grid">
              <article className="card service-card shadow-soft">
                <h3>Household Goods Repatriation</h3>
                <p>We walk you through inventory planning, packing standards, customs allowances, and documentation so your furniture and personal effects clear the port without surprises.</p>
                <ul className="tag-list">
                  <li>Inventory planning</li>
                  <li>Customs exemptions</li>
                  <li>Door‑to‑door options</li>
                </ul>
              </article>
              <article className="card service-card shadow-soft">
                <h3>Vehicle Import &amp; Compliance</h3>
                <p>From purchase checks abroad to valuation, age rules, and duty calculations—we help you bring in cars, SUVs, and light trucks legally and cost‑effectively.</p>
                <ul className="tag-list">
                  <li>Eligibility checks</li>
                  <li>Duty estimates</li>
                  <li>Port &amp; licensing support</li>
                </ul>
              </article>
              <article className="card service-card shadow-soft">
                <h3>Tools of Trade &amp; Business Gear</h3>
                <p>Creative, technical, and trade professionals get step‑by‑step support importing equipment under tools‑of‑trade concessions.</p>
                <ul className="tag-list">
                  <li>Equipment classification</li>
                  <li>Concession guidance</li>
                  <li>Startup setup support</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* QUOTE FORM */}
        <section id="quote" className="section section-alt" aria-labelledby="quote-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="quote-heading">Request a detailed quote</h2>
              <p>List your goods, vehicles, and tools—get a tailored estimate for your move home.</p>
            </header>
            <form id="quote-form" className="panel" noValidate>
              <div className="form-grid-two">
                <div className="field">
                  <label htmlFor="quote-name">Full name</label>
                  <input id="quote-name" name="name" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="quote-email">Email</label>
                  <input id="quote-email" name="email" type="email" required />
                </div>
              </div>
              <div className="form-grid-two">
                <div className="field">
                  <label htmlFor="quote-phone">Phone / WhatsApp</label>
                  <input id="quote-phone" name="phone" type="tel" />
                </div>
                <div className="field">
                  <label htmlFor="quote-origin">Moving from (city, country)</label>
                  <input id="quote-origin" name="origin" type="text" required />
                </div>
              </div>
              <fieldset className="fieldset-group">
                <legend>Household goods summary</legend>
                <div className="form-grid-two">
                  <div className="field">
                    <label htmlFor="quote-rooms">Number of furnished rooms</label>
                    <input id="quote-rooms" name="rooms" type="number" min={0} />
                  </div>
                  <div className="field">
                    <label htmlFor="quote-volume">Estimated volume (m³) or number of barrels</label>
                    <input id="quote-volume" name="volume" type="text" placeholder="e.g. 3 barrels, 20 m³" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="quote-goods-notes">Key items</label>
                  <textarea id="quote-goods-notes" name="goodsNotes" rows={2} maxLength={600} placeholder="Sofas, beds, appliances, special items…"></textarea>
                </div>
              </fieldset>
              <fieldset className="fieldset-group">
                <legend>Vehicle details</legend>
                <div id="vehicle-list" className="dynamic-list" aria-live="polite"></div>
                <button type="button" className="btn btn-ghost btn-small" id="add-vehicle">+ Add a vehicle</button>
              </fieldset>
              <fieldset className="fieldset-group">
                <legend>Tools of trade / professional equipment</legend>
                <div id="tool-list" className="dynamic-list" aria-live="polite"></div>
                <button type="button" className="btn btn-ghost btn-small" id="add-tool">+ Add a tool or equipment set</button>
              </fieldset>
              <div className="field">
                <label htmlFor="quote-notes">Anything else we should know?</label>
                <textarea id="quote-notes" name="notes" rows={3} maxLength={1000}></textarea>
              </div>
              <div className="form-footer">
                <button type="submit" className="btn btn-primary">Submit quote request</button>
                <p className="helper-text" id="quote-status" aria-live="polite"></p>
              </div>
            </form>
          </div>
        </section>

        {/* APPOINTMENTS */}
        <section id="appointments" className="section" aria-labelledby="appointments-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="appointments-heading">Book a consultation</h2>
              <p>Choose a time for a 30‑minute call or virtual meeting.</p>
            </header>
            <div className="appointments-layout">
              <div className="calendar panel shadow-soft" aria-label="Consultation time slots">
                <h3>Available this week</h3>
                <div className="slot-grid" id="slot-grid"></div>
              </div>
              <form id="booking-form" className="panel" noValidate>
                <div className="field">
                  <label htmlFor="booking-name">Name</label>
                  <input id="booking-name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="booking-email">Email</label>
                  <input id="booking-email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="booking-type">Session type</label>
                  <select id="booking-type" name="type">
                    <option value="discover">Returning resident overview</option>
                    <option value="goods">Household goods focus</option>
                    <option value="vehicle">Vehicle import focus</option>
                    <option value="tools">Tools of trade / business setup</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="booking-slot">Selected time</label>
                  <input id="booking-slot" name="slot" type="text" readOnly placeholder="Choose a slot from the grid" />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Confirm booking</button>
                <p className="helper-text" id="booking-status" aria-live="polite"></p>
              </form>
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section id="blog" className="section section-alt" aria-labelledby="blog-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="blog-heading">Insights for your move home</h2>
              <p>Short guides for returning residents, expats, and digital nomads eyeing Jamaica.</p>
            </header>
            <div className="blog-grid">
              <article className="card blog-post" data-post-id="1">
                <header>
                  <h3>5 things to sort before you ship to Jamaica</h3>
                  <p className="meta">Returning resident tips · 4 min read</p>
                </header>
                <p>From documenting your inventory to checking port storage rules, here are the essentials to handle before your container leaves.</p>
                <button className="btn-link" type="button" data-toggle-comments="">Show comments</button>
                <div className="comments" hidden>
                  <ul className="comment-list" aria-label="Comments"></ul>
                  <form className="comment-form">
                    <div className="field">
                      <label htmlFor="comment-1-name">Name</label>
                      <input id="comment-1-name" name="name" type="text" required />
                    </div>
                    <div className="field">
                      <label htmlFor="comment-1-body">Comment</label>
                      <textarea id="comment-1-body" name="body" rows={2} maxLength={500} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-ghost btn-small">Post comment</button>
                  </form>
                </div>
              </article>

              <article className="card blog-post" data-post-id="2">
                <header>
                  <h3>Can your vehicle qualify for returning resident concessions?</h3>
                  <p className="meta">Vehicle import · 3 min read</p>
                </header>
                <p>Age limits, ownership history, and your time abroad all affect whether your car can enter under concessions.</p>
                <button className="btn-link" type="button" data-toggle-comments="">Show comments</button>
                <div className="comments" hidden>
                  <ul className="comment-list" aria-label="Comments"></ul>
                  <form className="comment-form">
                    <div className="field">
                      <label htmlFor="comment-2-name">Name</label>
                      <input id="comment-2-name" name="name" type="text" required />
                    </div>
                    <div className="field">
                      <label htmlFor="comment-2-body">Comment</label>
                      <textarea id="comment-2-body" name="body" rows={2} maxLength={500} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-ghost btn-small">Post comment</button>
                  </form>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FORUM */}
        <section id="forum" className="section" aria-labelledby="forum-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="forum-heading">Community forum</h2>
              <p>Ask questions, share experiences, and support each other&apos;s move.</p>
            </header>
            <div className="forum-layout">
              <aside className="forum-sidebar panel shadow-soft" aria-label="Forum categories">
                <h3>Categories</h3>
                <ul className="forum-categories" id="forum-categories">
                  <li><button type="button" data-category="logistics" className="is-active">Moving logistics</button></li>
                  <li><button type="button" data-category="housing">Housing &amp; neighbourhoods</button></li>
                  <li><button type="button" data-category="work">Work, business &amp; digital nomads</button></li>
                  <li><button type="button" data-category="life">Life in Jamaica</button></li>
                </ul>
              </aside>
              <div className="forum-main">
                <div className="panel shadow-soft">
                  <h3 id="forum-topic-heading">
                    Topics in <span id="forum-category-label">Moving logistics</span>
                  </h3>
                  <ul className="topic-list" id="topic-list" aria-label="Forum topics"></ul>
                  <form id="new-topic-form" className="new-topic-form">
                    <div className="field">
                      <label htmlFor="topic-title">Start a new topic</label>
                      <input id="topic-title" name="title" type="text" placeholder="e.g. Best time of year to ship a container?" required />
                    </div>
                    <div className="field">
                      <label htmlFor="topic-body">Details</label>
                      <textarea id="topic-body" name="body" rows={3} maxLength={1000} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-ghost btn-small">Post topic</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKETPLACE */}
        <section id="marketplace" className="section section-alt" aria-labelledby="marketplace-heading">
          <div className="container">
            <header className="section-header">
              <h2 id="marketplace-heading">Marketplace &amp; exchange</h2>
              <p>List services, housing, and goods to support the returning resident community.</p>
            </header>
            <div className="marketplace-layout">
              <form id="listing-form" className="panel" noValidate>
                <div className="form-grid-two">
                  <div className="field">
                    <label htmlFor="listing-type">Listing type</label>
                    <select id="listing-type" name="listingType">
                      <option value="offer">Offering</option>
                      <option value="need">Looking for</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="listing-category">Category</label>
                    <select id="listing-category" name="category">
                      <option value="housing">Housing</option>
                      <option value="services">Services</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="goods">Household goods</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="listing-title">Title</label>
                  <input id="listing-title" name="title" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="listing-description">Description</label>
                  <textarea id="listing-description" name="description" rows={3} maxLength={800} required></textarea>
                </div>
                <div className="field">
                  <label htmlFor="listing-contact">Preferred contact (email / phone / handle)</label>
                  <input id="listing-contact" name="contact" type="text" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Post listing</button>
                <p className="helper-text" id="listing-status" aria-live="polite"></p>
              </form>
              <div className="panel shadow-soft">
                <div className="marketplace-filter">
                  <label htmlFor="listing-filter">Filter by category</label>
                  <select id="listing-filter">
                    <option value="all">All</option>
                    <option value="housing">Housing</option>
                    <option value="services">Services</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="goods">Household goods</option>
                  </select>
                </div>
                <ul id="listing-list" className="listing-list" aria-label="Marketplace listings"></ul>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section" aria-labelledby="contact-heading">
          <div className="container contact-layout">
            <div>
              <header className="section-header">
                <h2 id="contact-heading">Contact YardBridge Consulting</h2>
                <p>Reach out for a quick question or full walk‑through of your plans.</p>
              </header>
              <ul className="contact-list">
                <li>
                  <span className="contact-label">Phone / WhatsApp</span>
                  <a href="tel:+18765551234">+1 (876) 555‑1234</a>
                </li>
                <li>
                  <span className="contact-label">Email</span>
                  <a href="mailto:hello@yardbridgeconsulting.com">hello@yardbridgeconsulting.com</a>
                </li>
                <li>
                  <span className="contact-label">Based in</span>
                  <span>Kingston, Jamaica · Serving Jamaicans worldwide</span>
                </li>
              </ul>
            </div>
            <form id="contact-form" className="panel" noValidate>
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={3} maxLength={1000} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Send message</button>
              <p className="helper-text" id="contact-status" aria-live="polite"></p>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>&copy; {new Date().getFullYear()} YardBridge Consulting. All rights reserved.</p>
          <p className="footer-note">Information provided here is general guidance and not legal or tax advice.</p>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/18765551234" className="whatsapp-fab" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Scroll-to-top */}
      <button id="scroll-top" className="scroll-top" aria-label="Scroll to top" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  )
}
