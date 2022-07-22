import express, {Application} from 'express';
import {lightTheme, defaultLightTheme} from "../";
import {assignInlineVars} from '@vanilla-extract/dynamic';

export const registerStatic = (app: Application) => {
  app.use('/theme.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.send(`body#app {${assignInlineVars(lightTheme, {
      ...lightTheme,
      ...defaultLightTheme
    }).toString()}}`);
  })
  app.use('/', express.static('node_modules/@ory/themes/dist'))
}
