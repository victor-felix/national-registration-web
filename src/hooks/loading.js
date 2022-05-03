import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
  const [loadingShowed, setShowShowed] = useState(false);
  const [progress, setProgress] = useState(null);

  const hideLoading = useCallback(() => {
    setShowShowed(false);
    setProgress(null);
  }, []);

  const showLoading = useCallback(() => {
    setProgress(null);
    setShowShowed(true);
  }, []);

  const setPercentage = useCallback((progressEvent) => {
    if (progressEvent && progressEvent.total > 0) {
      setProgress((progressEvent.loaded * 100) / progressEvent.total);
    }

    setProgress(null);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        loadingShowed,
        showLoading,
        hideLoading,
        setPercentage,
        progress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export function useLoading() {
  const context = useContext(LoadingContext);

  return context;
}
