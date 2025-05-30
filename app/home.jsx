import { useAuth } from '@clerk/clerk-expo';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const { signOut } = useAuth();
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Bem-vindo à Home!</Text>
            <Button title="Sair" onPress={() => {
                signOut();
                router.replace('/sign-in');
            }} />
        </View>
    );
}