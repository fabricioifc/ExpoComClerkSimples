import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { useOAuth, useUser, useClerk } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useSignIn } from '@clerk/clerk-expo';
import { ActivityIndicator } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { signOut } = useClerk();
    const { user, isSignedIn } = useUser();
    const { isLoaded } = useSignIn();
    const nome = user?.unsafeMetadata.firstName + ' ' + user?.unsafeMetadata.lastName

    const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({ strategy: 'oauth_github' });
    const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({ strategy: 'oauth_google' });

    const onSuccessfulLogin = useCallback(() => {
        // Redirecionar para a tela inicial ou qualquer outra ação após o login
        console.log('Login bem-sucedido!');
        // Aqui você pode navegar para outra tela ou realizar qualquer ação necessária

    }, []);

    const signInWithGoogle = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlowGoogle()

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                // Redirecionar após login bem-sucedido
                onSuccessfulLogin();
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    const signInWithGitHub = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlowGitHub()

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
                    <Image source={{uri: user?.imageUrl}} style={styles.avatar} resizeMode='cover'  />
                    <View>
                        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
                        <Text style={styles.texto}>{nome}</Text>
                    </View>
                    <Button title="Sair" onPress={() => signOut()} color='red' />
                </View>
            </SignedIn>
            <SignedOut>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Login com Clerk</Text>
                    </View>
                    <View style={styles.icones}>
                        <Entypo name="google--with-circle" size={50} color="red" onPress={signInWithGoogle} style={styles.icone} />
                        <AntDesign style={styles.icone} name="github" size={50} color="black" onPress={signInWithGitHub} />
                    </View>
                </View>
            </SignedOut>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 24,
    },
    header: {
        flex: 1,
        justifyContent: 'center'
    },
    titulo: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    email: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    texto: {
        fontSize: 16,
        textAlign: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderColor: '#333',
        borderWidth: 4,
        marginBottom: 10,
    },
    botao: {
        backgroundColor: 'red',
        padding: 10,
        marginBottom: 5,
    },
    botaoTexto: {
        color: 'white'
    },
    icones: {
        flexDirection: 'row',
        borderColor: '#7d0ac8',
        borderWidth: 4,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'space-evenly',
        
    },
    icone: {
        padding: 10
    }
});