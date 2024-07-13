import { SetStateAction, useEffect, useCallback, Dispatch } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface RefreshHandlerProps {
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const RefreshHandler = ({ setIsAuthenticated }: RefreshHandlerProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkAuthentication = useCallback(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);
            if (location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/register'
            ) {
                navigate('/', { replace: false });
            }
        }
    }, [location.pathname, navigate, setIsAuthenticated]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);
    
    
    return null;
}

export default RefreshHandler