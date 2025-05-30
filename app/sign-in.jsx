import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useSignIn } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { isLoaded } = useSignIn();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const signInWithGoogle = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                // O AuthHandler no _layout.jsx já cuida do redirecionamento
                console.log('Login bem-sucedido!');
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, [startOAuthFlow]);

    if (!isLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bem-vindo!</Text>
                <Text style={styles.subtitle}>
                    Faça login para acessar sua conta
                </Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={signInWithGoogle}
                    activeOpacity={0.8}
                >
                    <Ionicons name="logo-google" size={24} color="#ffffff" />
                    <Text style={styles.googleButtonText}>
                        Continuar com Google
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 80,
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    googleButton: {
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: '#6366F1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    googleButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
});