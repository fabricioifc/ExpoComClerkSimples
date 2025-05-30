import { useAuth } from '@clerk/clerk-expo';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function LogoutScreen() {
    const { signOut } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        // Mostra um alert de confirmação ao entrar na tela
        Alert.alert(
            'Confirmar Saída',
            'Tem certeza que deseja sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => router.back(),
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: handleSignOut,
                },
            ]
        );
    }, []);

    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);
            await signOut();
            // A navegação será tratada automaticamente pelo Auth component
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert(
                'Erro',
                'Não foi possível fazer logout. Tente novamente.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoggingOut) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Saindo...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Ionicons name="log-out-outline" size={64} color="#6B7280" />
            <Text style={styles.message}>Processando saída...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});