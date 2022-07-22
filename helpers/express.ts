import express, {Application} from 'express';
import {lightTheme} from "../";
import {assignInlineVars} from '@vanilla-extract/dynamic';

export const registerStatic = (app: Application) => {
  app.use('/theme.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.send(`body{ ${assignInlineVars(lightTheme, {
      ...lightTheme,
      background: {
        canvas: '#FF1212',
        surface: '#ff0000',
      },
    }).toString()
    }`);
  })
  app.use('/', express.static('node_modules/@ory/themes/dist'))
}
