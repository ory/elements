import express, {Application} from 'express';

export const registerStatic = (app: Application) => {
  app.use("/", express.static( "../dist"));
  app.use('/theme.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.send();
  })
}
