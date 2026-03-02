import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";

interface CustomConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    itemTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
    // Permite fechar clicando no fundo escuro
    onRequestClose: () => void;
}

export function CustomConfirmModal({
    visible,
    title,
    message,
    itemTitle,
    onConfirm,
    onCancel,
    onRequestClose,
}: CustomConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade" // Uma animação suave
            onRequestClose={onRequestClose}
        >
            {/* TouchableWithoutFeedback para fechar ao clicar no fundo */}
            <TouchableWithoutFeedback onPress={onRequestClose}>
                <View style={styles.overlay}>
                    {/* TouchableWithoutFeedback dentro para prevenir fechar ao clicar no conteúdo */}
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
                            {/* Título Principal */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Mensagem e Nome do Item (destacado em verde) */}
                            <View style={styles.messageContainer}>
                                <Text style={styles.message}>{message}</Text>
                                <Text style={styles.itemTitle}>
                                    {itemTitle}?
                                </Text>
                            </View>

                            {/* Botões de Ação */}
                            <View style={styles.buttonsContainer}>
                                {/* Botão NÃO (estilo secundário) */}
                                <TouchableOpacity
                                    onPress={onCancel}
                                    style={[styles.button, styles.cancelButton]}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        NÃO
                                    </Text>
                                </TouchableOpacity>

                                {/* Botão SIM (estilo primário verde esmeralda) */}
                                <TouchableOpacity
                                    onPress={onConfirm}
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                    ]}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        SIM
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

// Estilos personalizados que combinam com o seu aplicativo
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)", // Fundo escurecido semitransparente
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        width: "100%",
        maxWidth: 340, // Limita a largura em tablets
        backgroundColor: "#fff", // Fundo branco
        borderRadius: 20, // Bordas arredondadas (como o seu card de categorias)
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10, // Sombra no Android
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151", // Cinza escuro (como o nome do item)
        marginBottom: 16,
        textAlign: "center",
    },
    messageContainer: {
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        color: "#6b7280", // Cinza médio (como o texto do rodapé)
        textAlign: "center",
    },
    itemTitle: {
        fontSize: 16,
        color: "#059669", // Verde Esmeralda (sua cor de destaque)
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
    },
    buttonsContainer: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    // Botão Cancelar (Não) - Estilo outlined ou cinza
    cancelButton: {
        backgroundColor: "#f3f4f6", // Fundo cinza muito claro
    },
    cancelButtonText: {
        color: "#6b7280", // Texto cinza médio
        fontWeight: "600",
        fontSize: 14,
    },
    // Botão Confirmar (Sim) - Estilo preenchido verde esmeralda
    confirmButton: {
        backgroundColor: "#10b981", // Verde Esmeralda
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});
