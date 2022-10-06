import "../styles/globals.css";
import "../styles/main.scss";
import { AppContext } from '../lib/reactContexts';
import { useEffect, useReducer } from 'react';

function appReducer(state, action) {
    switch (action.type) {
        default:
            throw new Error('Unknown reducer action');
    }
}

function App({ Component, pageProps }) {
    const [appState, dispatchAppAction] = useReducer(appReducer, {})

    return (
        <AppContext.Provider value={{ appState, dispatchAppAction }}>
            <Component {...pageProps} />
        </AppContext.Provider>
    );
}

export default App