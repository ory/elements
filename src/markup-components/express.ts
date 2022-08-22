import express, { Application } from 'express';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { oryTheme, Theme } from '../theme';

export const RegisterOryThemesExpress = (app: Application, theme: Theme) => {
  app.use('/theme.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...oryTheme,
        ...theme
      }).toString()}}`
    );
  });
  app.use('/', express.static('node_modules/@ory/themes/dist'));
};
