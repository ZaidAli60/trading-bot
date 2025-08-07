import React from "react"
import { ConfigProvider } from "antd";
import { useAuthContext } from "contexts/Auth";
import "bootstrap/dist/js/bootstrap.bundle"
import './App.scss'

import Routes from "pages/Routes"
import ScreenLoader from "components/ScreenLoader";

function App() {

  const { isAppLoading } = useAuthContext()

  return (
    <ConfigProvider theme={{
      token: { colorPrimary: "#1F2937", fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", },
      components: { Button: { boxShadow: "none", controlOutlineWidth: 0 } }
    }}>
      {!isAppLoading
        ? <Routes />
        : <ScreenLoader />
      }
    </ConfigProvider>
  );
}

export default App;
