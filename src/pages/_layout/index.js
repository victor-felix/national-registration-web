import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { ConfirmProvider } from 'material-ui-confirm';

import { useLoading } from '~/hooks/loading';
import { useTheme } from '~/hooks/theme';

import Loading from '~/components/loading';
import AppBar from '~/components/app-bar';

import userTheme from '~/styles/theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    marginTop: '100px',
  },
  functionalities: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  const { loadingShowed } = useLoading();
  const { darkMode } = useTheme();

  return (
    <ThemeProvider theme={userTheme(darkMode)}>
      <ConfirmProvider
        defaultOptions={{
          confirmationText: 'Confirmar',
          cancellationText: 'Cancelar',
          confirmationButtonProps: { variant: 'contained', color: 'primary' },
          cancellationButtonProps: { variant: 'contained', color: 'secondary' },
        }}
      >
        <AppBar />
        <Container maxWidth="md" className={classes.container}>
          {children}
          {loadingShowed && <Loading />}
        </Container>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
