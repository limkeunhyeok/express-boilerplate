import App from './app';

async function startServer() {
  const app = new App();

  app.listen();
}

startServer();
