import { getCurrentUser } from "@/lib/appwrite";
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Models } from "react-native-appwrite";

// Define the type for the context value
type TGlobalContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: Models.Document | null;
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
  isLoading: boolean;
};

// Define the type for the component props
interface ChildrenProps {
  children: ReactNode;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<TGlobalContext | undefined>(undefined);

// Custom hook to use the GlobalContext
export const useGlobalContext = (): TGlobalContext => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// GlobalProvider component
const GlobalProvider: FC<ChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isLoading, user, setUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
