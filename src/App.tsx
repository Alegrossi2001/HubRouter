import { CssBaseline, ThemeProvider } from '@mui/material'
import HubRouterLandingPage from './website/HubRouter/HubRouterLandingPage'
import HubRouterTheme from './website/HubRouter/HubRouterTheme'
function App() {

  return (
    <div className="App">
      <ThemeProvider theme={HubRouterTheme}>
        <CssBaseline />
        <HubRouterLandingPage />
      </ThemeProvider>
    </div>
  )
}

export default App
