export default class DefaultPage extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#20252c" />

          <title>hay</title>

          <link rel="manifest" href="/manifest.json" />
          <link rel="stylesheet" href="css/main.css" />
        </head>
        <body>
          { this.props.content }
        </body>
      </html>
    );
  }
}
