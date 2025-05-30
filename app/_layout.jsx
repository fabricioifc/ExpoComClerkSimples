import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Stack, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configuração do cache de tokens seguros
const tokenCache = {
    async getToken(key) {
        return SecureStore.getItemAsync(key);
    },
    async saveToken(key, value) {
        return SecureStore.setItemAsync(key, value);
    },
};

// Chave pública do Clerk
const CLERK_PUBLIC_KEY = 'pk_test_cHJlY2lvdXMtZ3JhY2tsZS03OS5jbGVyay5hY2NvdW50cy5kZXYk';

function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
        </View>
    );
}

// Configuração das telas do Drawer
function DrawerNavigation() {
    return (
        <Drawer
            screenOptions={{
                headerStyle: styles.headerStyle,
                headerTintColor: styles.headerTintColor,
                headerTitleStyle: styles.headerTitleStyle,
                drawerStyle: styles.drawerStyle,
                drawerActiveTintColor: styles.drawerActiveTintColor,
                drawerInactiveTintColor: styles.drawerInactiveTintColor,
                drawerLabelStyle: styles.drawerLabelStyle,
                drawerItemStyle: styles.drawerItemStyle,
                drawerActiveBackgroundColor: styles.drawerActiveBackgroundColor,
            }}
        >
            <Drawer.Screen
                name="home"
                options={{
                    title: 'Início',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="sign-out"
                options={{
                    title: 'Sair',
                    drawerIcon: ({ size }) => (
                        <Ionicons name="log-out-outline" size={size} color="#EF4444" />
                    ),
                    drawerLabelStyle: {
                        fontWeight: 'bold',
                        color: '#EF4444',
                    },
                }}
            />
            <Drawer.Screen
                name="sign-in"
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerShown: false,
                }}
            />
        </Drawer>
    );
}

// Configuração das telas de autenticação
function AuthStackNavigation() {
    return (
        <Stack
            screenOptions={{
                headerStyle: styles.headerStyle,
                headerTintColor: styles.headerTintColor,
                headerTitleStyle: styles.headerTitleStyle,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="sign-in"
                options={{
                    title: 'Entrar',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}

// Componente principal de autenticação - AGORA DENTRO DO PROVIDER
function AuthHandler() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    // Tela de loading enquanto verifica autenticação
    if (!isLoaded) {
        return <LoadingScreen />;
    }

    // Se usuário está logado, mostra o Drawer
    if (isSignedIn) {
        return <DrawerNavigation />;
    }

    // Se não está logado, mostra Stack para páginas de autenticação
    return <AuthStackNavigation />;
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLIC_KEY} tokenCache={tokenCache}>
            <AuthHandler />
        </ClerkProvider>
    );
}

const styles = {
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    headerStyle: {
        backgroundColor: '#6366F1',
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
        fontWeight: '600',
    },
    drawerStyle: {
        backgroundColor: '#ffffff',
        width: 280,
    },
    drawerActiveTintColor: '#6366F1',
    drawerInactiveTintColor: '#6B7280',
    drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
    },
    drawerItemStyle: {
        marginVertical: 4,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    drawerActiveBackgroundColor: '#EEF2FF',
};