import React from 'react';
import { Link } from 'react-router-dom';

const LOGO_PLACEHOLDER = 'https://via.placeholder.com/120x40?text=LOGO';
const FEATURE_PLACEHOLDER = 'https://via.placeholder.com/360x220?text=Preview+Image';
const DOODLE_PLACEHOLDER = 'https://via.placeholder.com/280x80?text=Doodles';

function WelcomeScreen() {
  return (
    <div className="landing-page" id="pocetna">
      <header className="landing-header">
        <div className="landing-max">
          <div className="landing-logo-group">
            <img src={LOGO_PLACEHOLDER} alt="OIP logo" className="landing-logo" />
            <span className="landing-tagline">Aplikacija za sedmični školski jelovnik</span>
          </div>
          <nav className="landing-nav" aria-label="Primary navigation">
            <a href="#kako-radi">Kako radi</a>
            <a href="#planovi">Planovi jelovnika</a>
            <a href="#filteri">Filteri</a>
            <a href="#podrska">Podrška</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-grid" id="planovi">
          <aside className="landing-filters" aria-labelledby="filters-title" id="filteri">
            <div>
              <h3 id="filters-title">Filtriraj jelovnik</h3>
              <div className="landing-search">
                <input type="text" placeholder="Razred ili grupa" aria-label="Filtriraj prema razredu ili grupi" />
                <input type="text" placeholder="Alergeni i ograničenja" aria-label="Filtriraj prema alergenima" />
              </div>
            </div>
            <div className="landing-actions">
              <Link to="/upload/imh">Generiši jelovnik | Montessori House</Link>
              <Link to="/upload/idss">Generiši jelovnik | IDSS School</Link>
            </div>
          </aside>

          <section className="landing-feature" id="kako-radi">
            <article className="landing-feature-content">
              <h1>Prilagođeni sedmični jelovnici za školu ili vrtić</h1>
              <p>
                Učitajte postojeće Word ili PDF dokumente i AI će automatski izdvojiti doručak, užinu i ručak po danima.
                Prije preuzimanja, pregledajte jelovnik, dopunite nutritivne informacije i podijelite ga s roditeljima.
              </p>
              <p>
                Naš sistem čuva predloške za različite razrede i olakšava praćenje alergena, posebnih potreba i unaprijed
                pripremljenih jelovnika. Potrebni su vam samo dokument i nekoliko minuta.
              </p>
              <div className="landing-feature-stats">
                <span><span role="img" aria-label="Dnevni obroci">🍽️</span> 120+ planiranih obroka tjedno</span>
                <span><span role="img" aria-label="Roditelji">�‍👩‍👧‍👦</span> 450 roditelja informirano na vrijeme</span>
                <div className="landing-cta">
                  <Link to="/upload/imh">Započni generisanje →</Link>
                </div>
              </div>
            </article>
            <div className="landing-feature-image" aria-hidden="true">
              <img src={FEATURE_PLACEHOLDER} alt="Konferencija" />
            </div>
          </section>
        </div>

        <section className="landing-contact" id="podrska">
          <button type="button" onClick={() => window.location.assign('mailto:menu-support@example.com')}>
            Kontaktirajte tim za jelovnike
          </button>
        </section>
      </main>

      <footer className="landing-footer" id="kontakt">
        <div className="landing-footer-inner">
          <div>
            <p>
              Digitalni asistent za planiranje ishrane u obrazovnim ustanovama. Kreirajte, prilagodite i podijelite sedmične
              jelovnike uz podršku nutricionista i AI preporuka.
            </p>
            <p>
              Privatnost &amp; Uslovi | Razvoj — Weekly Menu tim
            </p>
          </div>
          <div className="landing-footer-visual" aria-hidden="true">
            <img src={DOODLE_PLACEHOLDER} alt="Dekorativni prikaz" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomeScreen;
