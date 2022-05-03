import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
  Brightness7 as SunIcon,
  Brightness2 as MoonIcon,
} from '@material-ui/icons';

import { useTheme } from '~/hooks/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function DenseAppBar() {
  const classes = useStyles();
  const { darkMode, updateDarkMode } = useTheme();

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar variant="dense" className={classes.toolbar}>
          <div>
            <Typography variant="h6" color="inherit">
              Registros Nacionais
            </Typography>
          </div>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => updateDarkMode(!darkMode)}
          >
            {(darkMode && <MoonIcon />) || <SunIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
