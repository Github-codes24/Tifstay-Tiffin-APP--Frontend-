import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

// Define the shape of the context value
type AppContextType = {
    tabVisible: boolean;
    setTabVisible: Dispatch<SetStateAction<boolean>>;
    loginToken: string;
    setLoginToken: Dispatch<SetStateAction<string>>;
    userData: string;
    setUserData: Dispatch<SetStateAction<string>>;
    userName: string;
    setUserName: Dispatch<SetStateAction<string>>;
    cartItems: any[];
    setCartItems: Dispatch<SetStateAction<any[]>>;
};

// Create the context with undefined as default to enforce usage within provider
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props for the provider component
type AppProviderProps = {
    children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // ✅ Create MMKV storage instance once
    const storage = useMemo(() => new MMKVLoader().initialize(), []);

    const [tabVisible, setTabVisible] = useState<boolean>(true);
    const [loginToken, setLoginToken] = useState<string>('');
    const [userData, setUserData] = useMMKVStorage<string>('userData', storage, '');
    const [userName, setUserName] = useState<string>('');
    const [cartItems, setCartItems] = useState<any[]>([]);

    const value: AppContextType = {
        tabVisible,
        setTabVisible,
        userData,
        setUserData,
        loginToken,
        setLoginToken,
        userName,
        setUserName,
        cartItems,
        setCartItems,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for consuming the context
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export { AppContext };