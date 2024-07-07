import { createContext, useReducer, useEffect, ReactNode } from 'react'

// Define the shape of the user object
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  verified: boolean;
}

// Define the shape of the auth state
interface AuthState {
  user: User | null;
}

// Define the possible action types
type AuthAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

// Define the shape of the context value
interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON) as User;
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}