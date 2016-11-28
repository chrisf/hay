import * as React from 'react';

export default class DefaultPage extends React.Component<{ content: React.ReactChildren }, {}> {
  componentDidMount() {
    (window as any).GoogleAnalyticsObject = 'ga';
    (window as any).ga = (window as any).ga || function(...args: any[]) {
      (window as any).ga.q = (window as any).ga.q || [];
      (window as any).ga.q.concat(args)
    };
    (window as any).ga.l = Date.now();

    let a: HTMLScriptElement = document.createElement('script');
    let m: HTMLScriptElement = document.getElementsByTagName('script')[0];
    a.async = true;
    a.src = 'https://www.google-analytics.com/analytics.js';
    m.parentNode.insertBefore(a,m);

    (window as any).ga('create', 'UA-87373116-1', 'auto');
    (window as any).ga('send', 'pageview');
  }

  render() {
    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#20252c" />

          <title>hay</title>

          <link rel="manifest" href="/manifest.json" />
          <link rel="stylesheet" href="https://cloud.typography.com/7275356/6039172/css/fonts.css" />
          <link rel="stylesheet" href="css/main.css" />
        </head>
        <body>
          { this.props.content }
        </body>
      </html>
    );
  }
}
