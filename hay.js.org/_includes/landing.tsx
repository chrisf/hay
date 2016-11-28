import * as React from 'react';

import Logo from './logo';

export default class Landing extends React.Component<{}, {}> {
  render() {
    return (
      <section className="landing">
        <div className="landing__background">
        </div>
        <div className="landing__network">
          <canvas></canvas>
        </div>

        <div className="landing__content">
          <header className="landing__header">
            <div className="landing__logo-container">
              <a rel="noopener" href="/" className="logo logo--big">
                <Logo includeText={ true } />
              </a>
            </div>
            <h3>simple static website builder</h3>
          </header>
          <div>
            <nav className="navigation">
              <ul className="navigation__list">
                <li className="navigation__item">
                  <a rel="noopener" href="/docs" className="navigation__link">
                    Docs
                  </a>
                </li>
                <li className="navigation__item">
                <a rel="noopener" target="_blank" href="https://github.com/rynclark/hay" className="navigation__link">
                  GitHub
                </a>
                </li>
              </ul>
            </nav>
            <div className="console">
              <header className="console__header">
              <span className="console__header__buttons">
                <span className="console__header__button console__header__button--red"></span>
                <span className="console__header__button console__header__button--yellow"></span>
                <span className="console__header__button console__header__button--green"></span>
              </span>
                hay
              </header>
              <table style={ { borderSpacing: 0 } }>
                <tbody>
                <tr>
                  <td className="gutter" style={ { textAlign: 'center' } }>
                    <pre><span className="dollar">$</span></pre>
                    <pre><span className="dollar">$</span></pre>
                    <pre><span className="dollar">$</span></pre>
                    <pre><span className="dollar">$</span></pre>
                  </td>
                  <td className="code">
                    <pre><span className="comment">yarn</span> global add <span className="green">hay</span><span className="dark-blue" style={ { userSelect: 'none' } }> # or npm install -g hay</span></pre>
                    <pre><span className="comment">hay</span> new my-website</pre>
                    <pre><span className="comment">cd</span> my-website</pre>
                    <pre><span className="green bold">hay</span> bale<span style={ { userSelect: 'none' } } className="dark-blue"> # or serve with hay serve</span></pre>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
