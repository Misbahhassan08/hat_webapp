import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';
import { ThemeContextProvider } from './views/theme/ThemeContext';
import { UserProvider } from './Context/UserContext';
import AccessDenied from './views/AccessDenied/AccessDenied';
import ProtectedRoute from '../src/components/ProtectedRoutes'; // Import your ProtectedRoute
import { AuthProvider } from './Context/AuthContext'

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('EMS');
    const storedTheme = useSelector((state) => state.theme);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
        if (theme) {
            setColorMode(theme);
        }
        if (isColorModeSet()) {
            return;
        }
        setColorMode(storedTheme);
    }, []);

    return (
        
        <UserProvider>
            <AuthProvider>
          <ThemeContextProvider>
                <Router>
                    <Suspense
                        fallback={
                            <div className="pt-3 text-center">
                                <CSpinner color="primary" variant="grow" />
                            </div>
                        }
                    >
                        <Routes>
                            <Route exact path="/AccessDenied" name="AccessDenied" element={<AccessDenied />} />
                            <Route exact path="/login" name="Login Page" element={<Login />} />
                            <Route exact path="/register" name="Register Page" element={<Register />} />

                            {/* Wrap DefaultLayout with ProtectedRoute */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="*" name="Home" element={<DefaultLayout />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </Router>
                </ThemeContextProvider>
                </AuthProvider>
    </UserProvider>

    );
};

export default App;
