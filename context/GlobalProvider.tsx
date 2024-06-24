import { getCurrentUser } from "@/lib/appwrite";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Models } from "react-native-appwrite";

type TGlobalContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: Models.Document | null;
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
  isLoading: boolean;
};

interface ChildrenProps {
  children: ReactNode;
}

const GlobalContext = createContext<TGlobalContext | undefined>(undefined);

export const useGlobalContext = (): TGlobalContext => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider: FC<ChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isLoading, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
