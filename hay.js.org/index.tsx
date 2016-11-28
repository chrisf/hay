/*---
 layout: default
 ---*/
import * as React from 'react';

import Landing from './_includes/landing';
import Logo from './_includes/logo';
import Console from './_includes/console';

export default class HomePage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Landing />

        <section className="about">
          <div className="about__line about__line--white"></div>
          <div className="about__line about__line--normal"></div>
          <div className="about__line about__line--red"></div>
          <div className="about__line about__line--orange"></div>
          <div className="about__line about__line--yellow"></div>
          <div className="about__line about__line--green"></div>
          <div className="about__line about__line--blue"></div>
          <div className="about__line about__line--purple"></div>
          <div className="get-started">
            <div className="get-started__container">
              <div className="get-started__button">
                <a rel="noopener" href="/get-started" className="button button--large">
                  Get started
                </a>
                <span className="get-started__ripples get-started__ripples--black">
              <span className="get-started__ripple get-started__ripple--one"></span>
              <span className="get-started__ripple get-started__ripple--two"></span>
              <span className="get-started__ripple get-started__ripple--three"></span>
              <span className="get-started__ripple get-started__ripple--four"></span>
              <span className="get-started__ripple get-started__ripple--five"></span>
            </span>
              </div>
            </div>
          </div>
          <ul className="about__list">
            <li className="about__item">
              <div className="about__icon">
                <span className="typcn typcn-flash-outline" style={ { color: '#f8d26a' } }></span>
              </div>

              <h4>easy &amp; simple</h4>

              <p>
                hay builds your website in a flash - converting your website into static assets ready for deployment anywhere
              </p>

              <p>
                already using jekyll with GitHub pages? hay will work with your setup straight out of the box
              </p>
            </li>
            <li className="about__item">
              <div className="about__icon">
                <span className="typcn typcn-device-laptop" style={ { color: '#f86ae9' } }></span>
              </div>
              <h4>pluggable</h4>

              <p>
                if you don't want to use markdown to format your pages, you don't have to!
              </p>

              <p>hay let's you write your pages in markdown or React.js components out of the box - if that isn't enough, plugins let you take it wherever you'd like</p>
            </li>
            <li className="about__item">
              <div className="about__icon">
                <span className="typcn typcn-infinity-outline" style={ { color: '#b76af8' } }></span>
              </div>

              <h4>extra as standard</h4>

              <p>
                hay can paginate your blog posts, deploy to GitHub pages and even butter your toast<sup>*</sup> at your request
              </p>

              <p>
                you can speed up your development workflow by using the inbuilt dev server, which can seamlessly integrated
              </p>

              <p className="about__clarification">
                * sorry this is a lie
              </p>
            </li>
          </ul>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature__main">
              <Console>
                <table style={ { borderSpacing: '0' } } data-tabName="hay.config.json">
                  <tbody>
                  <tr>
                    <td className="gutter" style={ { textAlign: 'center' } }>
                      <pre><span className="dollar">1</span></pre>
                      <pre><span className="dollar">2</span></pre>
                      <pre><span className="dollar">3</span></pre>
                      <pre><span className="dollar">4</span></pre>
                      <pre><span className="dollar">5</span></pre>
                      <pre><span className="dollar">6</span></pre>
                    </td>
                    <td className="code">
                      <pre>{ '{' }</pre>
                      <pre>  <span className="green">"name"</span>: <span className="orange">"hay"</span>,</pre>
                      <pre>  <span className="green">"description"</span>: <span className="orange">"simple static website builder"</span>,</pre>
                      <pre>  <span className="green">"url"</span>: <span className="orange">"https://hay.js.org"</span>,</pre>
                      <pre>  <span className="green">"paginate"</span>: <span className="orange">"true"</span></pre>
                      <pre>{ '}' }</pre>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <table style={ { borderSpacing: '0' } } data-tabName="hay.config.js">
                  <tbody>
                  <tr>
                    <td className="gutter" style={ { textAlign: 'center' } }>
                      <pre><span className="dollar">1</span></pre>
                      <pre><span className="dollar">2</span></pre>
                      <pre><span className="dollar">3</span></pre>
                      <pre><span className="dollar">4</span></pre>
                      <pre><span className="dollar">5</span></pre>
                      <pre><span className="dollar">6</span></pre>
                    </td>
                    <td className="code">
                      <pre><span className="purple">export default</span> { '{' }</pre>
                      <pre>  <span className="green">name</span>: <span className="orange">'hay'</span>,</pre>
                      <pre>  <span className="green">description</span>: <span className="orange">'simple static website builder'</span>,</pre>
                      <pre>  <span className="green">url</span>: <span className="orange">'https://hay.js.org'</span>,</pre>
                      <pre>  <span className="green">paginate</span>: <span className="orange">'true'</span></pre>
                      <pre>{ '}' }</pre>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <table style={ { borderSpacing: '0' } } data-tabName="hay.config.yml">
                  <tbody>
                  <tr>
                    <td className="gutter" style={ { textAlign: 'center' } }>
                      <pre><span className="dollar">1</span></pre>
                      <pre><span className="dollar">2</span></pre>
                      <pre><span className="dollar">3</span></pre>
                      <pre><span className="dollar">4</span></pre>
                    </td>
                    <td className="code">
                      <pre><span className="green">name</span>: <span className="orange">hay</span></pre>
                      <pre><span className="green">description</span>: <span className="orange">simple static website builder</span></pre>
                      <pre><span className="green">url</span>: <span className="orange">https://hay.js.org</span></pre>
                      <pre><span className="green">paginate</span>: <span className="orange">true</span></pre>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </Console>
            </div>

            <div className="feature__description">
              <h4>easily configurable</h4>

              <p>
                you can configure hay with JavaScript, JSON or YAML. it's really not fussy.
              </p>

              <p>
                <a rel="noopener" href="/docs">check out the docs</a> for all the stuff that can be configured
              </p>
            </div>
          </div>

          <div className="feature">
            <div className="feature__description" style={ { textAlign: 'right' } }>
              <h4>easily configurable</h4>

              <p>
                you can configure hay with JavaScript, JSON or YAML. it's really not fussy.
              </p>

              <p>
                <a rel="noopener" href="/docs">check out the docs</a> for all the stuff that can be configured
              </p>
            </div>
            <div className="feature__main">
              <div className="console">
                <header className="console__header">
              <span className="console__header__buttons">
                <span className="console__header__button console__header__button--red"></span>
                <span className="console__header__button console__header__button--yellow"></span>
                <span className="console__header__button console__header__button--green"></span>
              </span>

                  hay
                </header>
                <table style={ { borderSpacing: '0' } }>
                  <tbody>
                  <tr>
                    <td className="gutter" style={ { textAlign: 'center' } }>
                      <pre><span className="dollar">$</span></pre>
                    </td>
                    <td className="code">
                      <pre><span className="green bold">hay</span> serve</pre>
                      <pre><span className="bold">hay serve v1.0.0</span></pre>
                      <pre>&nbsp;</pre>
                      <pre><span className="white">   hay config</span></pre>
                      <pre><span className="dim">       source  ::</span> <span className="gray"> /Users/Ryan/projects/hay</span></pre>
                      <pre><span className="dim">        posts  ::</span> <span className="gray"> /Users/Ryan/projects/hay/_posts</span></pre>
                      <pre><span className="dim">      layouts  ::</span> <span className="gray"> /Users/Ryan/projects/hay/_layouts</span></pre>
                      <pre><span className="dim">     partials  ::</span> <span className="gray"> /Users/Ryan/projects/hay/_partials</span></pre>
                      <pre>&nbsp;</pre>
                      <pre><span className="dim">  destination  ::</span> <span className="gray"> /Users/Ryan/projects/hay/build</span></pre>
                      <pre>&nbsp;</pre>
                      <pre><span className="dim">          1/2</span><span className="dim">  ::</span> <span className="gray"> layouts</span></pre>
                      <pre><span className="green">           <span className="tick"><span className="tick"></span></span></span>  <span className="dim">  ::</span> <span className="white"> compiled layouts</span></pre>
                      <pre>&nbsp;</pre>
                      <pre><span className="dim">          2/2</span><span className="dim">  ::</span> <span className="gray"> posts</span></pre>
                      <pre><span className="green">           <span className="tick"><span className="tick"></span></span></span>  <span className="dim">  ::</span> <span className="white"> parsed posts</span></pre>
                      <pre>&nbsp;</pre>
                      <pre><span className="blue">         info </span><span className="dim"> ::</span> <span className="gray"> bale took 0.58s</span></pre>
                      <pre>&nbsp;</pre>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="feature__description">
              <h4>easily configurable</h4>

              <p>
                you can configure hay with JavaScript, JSON or YAML. it's really not fussy.
              </p>

              <p>
                <a rel="noopener" href="/docs">check out the docs</a> for all the stuff that can be configured
              </p>
            </div>
          </div>

          <div className="feature">
            <div className="feature__description" style={ { textAlign: 'right' } }>
              <h4>easily configurable</h4>

              <p>
                you can configure hay with JavaScript, JSON or YAML. it's really not fussy.
              </p>

              <p>
                <a rel="noopener" href="/docs">check out the docs</a> for all the stuff that can be configured
              </p>
            </div>
            <div className="feature__main">
              <div className="console">
                <header className="console__header">
              <span className="console__header__buttons">
                <span className="console__header__button console__header__button--red"></span>
                <span className="console__header__button console__header__button--yellow"></span>
                <span className="console__header__button console__header__button--green"></span>
              </span>

                  hay
                </header>
                <div className="file-name">
              <span className="file-name__file file-name__file--selected">
                hay.config.json
              </span>
                  <span className="file-name__file">
                hay.config.js
              </span>
                  <span className="file-name__file">
                hay.config.yml
              </span>
                </div>
                <table style={ { borderSpacing: 0 } }>
                  <tbody>
                  <tr>
                    <td className="gutter" style={ { textAlign: 'center' } }>
                      <pre><span className="dollar">1</span></pre>
                      <pre><span className="dollar">2</span></pre>
                      <pre><span className="dollar">3</span></pre>
                      <pre><span className="dollar">4</span></pre>
                      <pre><span className="dollar">5</span></pre>
                      <pre><span className="dollar">6</span></pre>
                    </td>
                    <td className="code">
                      <pre>{ '{' }</pre>
                      <pre> <span className="pink">"name"</span>: <span className="orange">"hay"</span>,</pre>
                      <pre> <span className="pink">"description"</span>: <span className="orange">"simple static website..."</span>,</pre>
                      <pre> <span className="pink">"url"</span>: <span className="orange">"https://hay.js.org"</span>,</pre>
                      <pre> <span className="pink">"paginate"</span>: <span className="orange">"true"</span></pre>
                      <pre>{ '}' }</pre>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        <footer className="footer">
          <div className="footer__background">
            <div className="footer__container">
              <div className="footer__links">
                <span className="footer__link-header">Docs</span>

                <a rel="noopener" href="/docs">Documentation</a>
                <a rel="noopener" href="/get-started">Get Started</a>
                <a rel="noopener" href="/example-project">Example Project</a>
              </div>
              <div className="footer__links">
                <span className="footer__link-header">Source</span>

                <a rel="noopener" target="_blank" href="https://github.com/rynclark/hay">GitHub</a>
                <a rel="noopener" target="_blank" href="https://github.com/rynclark/hay/blob/master/CONTRIBUTING.md">Contribute</a>
                <a rel="noopener" target="_blank" href="https://github.com/rynclark/hay/issues">Issues</a>
                <a rel="noopener" target="_blank" href="https://github.com/rynclark/hay/releases">Change Log</a>
              </div>
              <div className="footer__links">
                <span className="footer__link-header">Other Projects</span>

                <a rel="noopener" target="_blank" href="https://nglr.io">nglr</a>
                <a rel="noopener" target="_blank" href="https://parceljs.com">parceljs</a>
                <a rel="noopener" target="_blank" href="https://github.com/rynclark">rynclark</a>
              </div>
              <div className="footer__logo">
                <a rel="noopener" href="/" className="logo-only">
                  <Logo />
                </a>
              </div>
            </div>
            <div className="footer__author">
              by <a rel="noopener" href="https://ryanclark.me" target="_blank">Ryan Clark</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
