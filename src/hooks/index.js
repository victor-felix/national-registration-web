import React from 'react';
import PropTypes from 'prop-types';

import { LoadingProvider } from '~/hooks/loading';
import { ThemeProvider } from '~/hooks/theme';

export default function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </ThemeProvider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
