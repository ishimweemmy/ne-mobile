import { View, Text, Alert } from 'react-native'
import React from 'react'
import { authService } from '@/services'
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const useAuth = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { setIsLoggedIn, setUser } = useGlobalContext();

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            if (response.status === 200) {
                Alert.alert("Login Success", "You have successfully logged in!");
                setUser(response.data);
                setIsLoggedIn(true);
                router.replace("/home")
            }

        } catch (error) {
            setIsLoggedIn(false);
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const register = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.register(email, password);
            if (response.status === 201) {
                Alert.alert("Registration Success", "You have successfully registered!");
                router.replace("/login")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        try {
            const response = await authService.logout();
            if (response.status === 200) {

                Alert.alert("Logout Success", "You have successfully logged out!");
                setIsLoggedIn(false);
                router.replace("/login")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return { loading, login, register }
}

export default useAuth;
