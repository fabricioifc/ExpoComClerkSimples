import { useUser } from '@clerk/clerk-expo';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Divider, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function ProfileScreen() {
    const { user, isLoaded } = useUser();
    const [selectedImage, setSelectedImage] = useState(null);

    // Snackbar state
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarError, setSnackbarError] = useState(false);

    if (!isLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    const initialValues = {
        firstName: user.unsafeMetadata?.firstName || '',
        lastName: user.unsafeMetadata?.lastName || '',
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Primeiro nome é obrigatório'),
        lastName: Yup.string().required('Sobrenome é obrigatório'),
    });

    const pickImage = async () => {
        Alert.alert(
            'Selecionar Imagem',
            'Escolha uma opção:',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Galeria', onPress: () => openImagePicker() },
                { text: 'Câmera', onPress: () => openCamera() },
            ]
        );
    };

    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await user.update({
                unsafeMetadata: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                },
            });

            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                await user.setProfileImage({ file: blob });
            }

            setSnackbarMessage('Perfil atualizado com sucesso!');
            setSnackbarError(false);
            setSnackbarVisible(true);
        } catch (error) {
            setSnackbarMessage('Erro ao atualizar o perfil. Tente novamente.');
            setSnackbarError(true);
            setSnackbarVisible(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // behavior serve para ajustar o teclado em dispositivos iOS
            // No Android, o comportamento padrão já é adequado
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <>
                        <ScrollView
                            style={styles.container}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.avatarSection}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={{ uri: selectedImage || user.imageUrl || 'https://via.placeholder.com/120x120/E5E7EB/9CA3AF?text=?' }}
                                        style={styles.avatar}
                                    />
                                    <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                                        <Ionicons name="camera" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Divider style={{ marginVertical: 4, backgroundColor: '#E5E7EB' }} />

                            <View style={styles.formContainer}>
                                {/* Primeiro Nome */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        <Ionicons name="person-outline" size={16} color="#6B7280" />
                                        {' '}Primeiro Nome
                                    </Text>
                                    <View style={[
                                        styles.inputContainer,
                                        touched.firstName && errors.firstName && styles.inputError
                                    ]}>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('firstName')}
                                            onBlur={handleBlur('firstName')}
                                            value={values.firstName}
                                            placeholder="Digite seu primeiro nome"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    {touched.firstName && errors.firstName && (
                                        <View style={styles.errorContainer}>
                                            <Ionicons name="alert-circle" size={16} color="#EF4444" />
                                            <Text style={styles.errorText}>{errors.firstName}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Sobrenome */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        <Ionicons name="person-outline" size={16} color="#6B7280" />
                                        {' '}Sobrenome
                                    </Text>
                                    <View style={[
                                        styles.inputContainer,
                                        touched.lastName && errors.lastName && styles.inputError
                                    ]}>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('lastName')}
                                            onBlur={handleBlur('lastName')}
                                            value={values.lastName}
                                            placeholder="Digite seu sobrenome"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    {touched.lastName && errors.lastName && (
                                        <View style={styles.errorContainer}>
                                            <Ionicons name="alert-circle" size={16} color="#EF4444" />
                                            <Text style={styles.errorText}>{errors.lastName}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Email */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        <Ionicons name="mail-outline" size={16} color="#6B7280" />
                                        {' '}Email
                                    </Text>
                                    <View style={[styles.inputContainer, styles.readonlyInput]}>
                                        <Text style={styles.readonlyText}>{user.primaryEmailAddress?.emailAddress}</Text>
                                        <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Botão fixo */}
                        <View style={styles.fixedButtonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    isSubmitting && styles.saveButtonDisabled
                                ]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.saveButtonText}>Salvando...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>

            {/* Snackbar */}
            <Snackbar
                wrapperStyle={{ top: 5 }}
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
                style={[
                    styles.snackbar,
                    { backgroundColor: snackbarError ? '#EF4444' : '#10B981' }
                ]}
            >
                <View style={styles.snackbarContent}>
                    <Ionicons
                        name={snackbarError ? "alert-circle" : "checkmark-circle"}
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.snackbarText}>{snackbarMessage}</Text>
                </View>
            </Snackbar>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#FFFFFF',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#E5E7EB',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#6366F1',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    formContainer: {
        padding: 12,
        backgroundColor: '#FFFFFF',
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
        alignItems: 'center',
    },
    inputContainer: {
        borderWidth: 0.5,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    input: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '400',
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    readonlyInput: {
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    readonlyText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444',
        marginLeft: 4,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0.1,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    snackbar: {
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    snackbarContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    snackbarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },

});