import { createTheme } from '@material-ui/core/styles';
import { blue, purple } from '@material-ui/core/colors';

export default function theme(dark) {
  return createTheme({
    palette: {
      type: (dark && 'dark') || 'light',
      primary: {
        light: blue['200'],
        main: blue['500'],
        dark: blue['800'],
        contrastText: '#fff',
      },
      secondary: {
        light: purple['200'],
        main: purple['500'],
        dark: purple['800'],
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: ['Roboto'].join(','),
    },
    overrides: {
      MuiLink: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  });
}
