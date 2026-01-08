import { createTheme } from '@mui/material/styles';

// HubRouter Theme - Typography focused
const HubRouterTheme = createTheme({
    typography: {
        // Modern SaaS font stack - Plus Jakarta Sans is trendy, clean, geometric
        fontFamily: [
            '"Plus Jakarta Sans"',
            '"DM Sans"',
            '"Satoshi"',
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            'sans-serif',
        ].join(','),

        // Base font size bumped up for better readability
        fontSize: 24,
        htmlFontSize: 16,

        // Font weights
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,

        // Heading variants - generous sizing for modern SaaS feel (+30%)
        h1: {
            fontSize: '5.85rem',     // 93.6px - hero impact
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
        },
        h2: {
            fontSize: '4.25rem',     // 68px - section headers
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontSize: '3.25rem',     // 52px
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
        },
        h4: {
            fontSize: '2.6rem',      // 41.6px
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontSize: '1.95rem',     // 31.2px
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.005em',
        },
        h6: {
            fontSize: '1.625rem',    // 26px
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: '0',
        },

        // Subtitle variants
        subtitle1: {
            fontSize: '1.8rem',      // 28.8px
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0',
        },
        subtitle2: {
            fontSize: '1.45rem',     // 23.2px
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0',
        },

        // Body text variants - larger for readability
        body1: {
            fontSize: '1.45rem',     // 23.2px
            fontWeight: 400,
            lineHeight: 1.7,
            letterSpacing: '0.01em',
        },
        body2: {
            fontSize: '1rem',      // 20.8px
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
        },

        // Button text
        button: {
            fontSize: '1.4rem',      // 22.4px
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0.01em',
            textTransform: 'none',   // No uppercase - modern look
        },

        // Caption and overline
        caption: {
            fontSize: '1.15rem',     // 18.4px
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
        },
        overline: {
            fontSize: '1.05rem',     // 16.8px
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
        },
    },

    // Shape - slightly more rounded for modern feel
    shape: {
        borderRadius: 10,
    },

    // Component overrides for consistent typography
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
                body: {
                    fontSize: '1.45rem',
                    lineHeight: 1.7,
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    h1: 'h1',
                    h2: 'h2',
                    h3: 'h3',
                    h4: 'h4',
                    h5: 'h5',
                    h6: 'h6',
                    subtitle1: 'p',
                    subtitle2: 'p',
                    body1: 'p',
                    body2: 'p',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 10,
                },
                sizeLarge: {
                    fontSize: '1.45rem',
                    padding: '18px 42px',
                },
                sizeMedium: {
                    fontSize: '1.4rem',
                    padding: '16px 36px',
                },
                sizeSmall: {
                    fontSize: '1.2rem',
                    padding: '10px 26px',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
                sizeMedium: {
                    fontSize: '1.3rem',
                    height: 46,
                },
                sizeSmall: {
                    fontSize: '1.15rem',
                    height: 36,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '1.45rem',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '1.4rem',
                    fontWeight: 500,
                },
            },
        },
    },

    // Basic palette (can be customized later)
    palette: {
        primary: {
            main: '#27A36F',
            light: '#4BB88A',
            dark: '#1E8259',
        },
        secondary: {
            main: '#4B8DBA',
            light: '#6BA3C8',
            dark: '#3A7095',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F8F9FA',
        },
        text: {
            primary: '#1A1A2E',
            secondary: '#4A4A68',
        },
    },
});

export default HubRouterTheme;
