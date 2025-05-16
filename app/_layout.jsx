import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './sign-in';

const tokenCache = {
    async getToken(key) {
        return SecureStore.getItemAsync(key);
    },
    async saveToken(key, value) {
        return SecureStore.setItemAsync(key, value);
    },
};

const CLERKPUBLIC_KEY = 'pk_test_cHJlY2lvdXMtZ3JhY2tsZS03OS5jbGVyay5hY2NvdW50cy5kZXYk';

export default function App() {
    return (
        <ClerkProvider
            publishableKey={CLERKPUBLIC_KEY}
            tokenCache={tokenCache}
        >
            <LoginScreen />
        </ClerkProvider>
    );
}
