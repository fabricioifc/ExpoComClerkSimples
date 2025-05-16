import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { useOAuth, useUser, useClerk } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useSignIn } from '@clerk/clerk-expo';
import { ActivityIndicator } from 'react-native-web';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { signOut } = useClerk();
    const { user, isSignedIn } = useUser();
    const { isLoaded } = useSignIn();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onSuccessfulLogin = useCallback(() => {
        // Redirecionar para a tela inicial ou qualquer outra ação após o login
        console.log('Login bem-sucedido!');
        // Aqui você pode navegar para outra tela ou realizar qualquer ação necessária

    }, []);

    const signInWithGoogle = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow()

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                // Redirecionar após login bem-sucedido
                onSuccessfulLogin();
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };


    if (!isLoaded) {
        return (
            <ActivityIndicator size="large" color="#0000ff" />
        );
    }

    return (
        <>
            <SignedIn>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Bem-vindo, {user?.primaryEmailAddress?.emailAddress}!</Text>
                    <Button title="Sair" onPress={() => signOut()} color='red' />
                </View>
            </SignedIn>
            <SignedOut>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Login com Google</Text>
                    <Button title="Entrar com Google" onPress={signInWithGoogle} />
                </View>
            </SignedOut>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    titulo: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
});