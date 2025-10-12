import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useState, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { color } from "highcharts";
import { hexToRgba } from "@coreui/utils";

export const ColorModeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo( 
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" 
            ? {
                primary: {
                  main: "#1976D2",
                },
                background: {
                  default: "#ffffff",
                  paper: "#f5f5f5",
                  sidebar:"#1D1D1E",
                  create: "#f5f5f5",
                  footer: "#212631",
                  card:"rgba(196, 196, 219, 0.94)",
                  gatewaycard:"#F8F9FA"

                },
                text: {
                  primary: "#344767",
                  tableText:'#6C757D',
                  TextColor: 'black'
                },
                table: {
                  background: "#f0f0f0",
                },
                line:{
                  paper:'rgba(173, 48, 10, 0.96)'
                },
                circle:{
                  paper:'rgba(31, 172, 26, 0.82)',
                }
              }
            : {
                primary: {
                  main: "#90caf9",
                },
                background: {
                  default: "#1A2035", // Dark background color
                  paper: "rgba(10, 12, 19, 0.17)", // Table or card background color
                  sidebar:"#2B344A",
                  create: "rgb(53, 68, 107)",
                  footer: "#212631", 
                  card:"rgba(95, 95, 106, 0.89)",
                  gatewaycard:"rgb(53, 68, 107)"
                },
                text: {
                  primary:  "#cccccc",
                  secondary: "#a0a0a0",
                  tableText:'rgb(212, 212, 212)',
                  TextColor: '#cccccc'


                },
                table: {
                  background: "#202940",
                },
                line:{
                  paper:'rgba(35, 237, 72, 0.96)'
                },
                circle:{
                  paper:'rgba(210, 7, 183, 0.92)',
                }
            
              }),
        },
              typography: {
        fontFamily: `"Century Gothic", "Arial", "sans-serif"`,
      },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};