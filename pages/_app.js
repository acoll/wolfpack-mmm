import "../styles/globals.css";
import { ThemeProvider } from "theme-ui";
import { deep } from "@theme-ui/presets";

const theme = {
  ...deep,
  colors: { ...deep.colors, background: "rgba(0,0,0,0.9)" },
};

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ height: "100%" }}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>{" "}
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: "20px",
          textAlign: "center",
        }}
      >
        {`WIFI PW: gei37r5d8rhtk3538`}
      </div>
    </div>
  );
}

export default MyApp;
