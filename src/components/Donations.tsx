import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import { Heart, Copy, CreditCard } from "../icons"; // seus ícones já configurados
import { AlignCenter } from "lucide-react-native";

interface DonationsProps {
    pixKey: string; // ← sua chave PIX
    pixQrCodeUrl: string; // ← link da imagem do QR Code
}

export function Donations({ pixKey, pixQrCodeUrl }: DonationsProps) {
    const copyPixKey = () => {
        navigator.clipboard.writeText(pixKey);
        alert("✅ Chave PIX copiada!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Heart color="#ef4444" size={28} />
                <Text style={styles.title}>Me ajude a manter o site no ar</Text>
                <Heart color="#ef4444" size={28} />
            </View>

            <Text style={styles.text}>
                O app é 100% grátis e feito com muito carinho. Qualquer ajuda
                (R$ 1, R$ 5, R$ 10...) mantém o servidor ligado e me motiva a
                adicionar novas funções!
            </Text>

            {/* PIX */}
            <View style={styles.pixBox}>
                <Text style={styles.pixTitle}>PIX (qualquer valor)</Text>

                {pixQrCodeUrl && (
                    <img
                        src={pixQrCodeUrl}
                        alt="QR Code PIX"
                        style={{ width: 180, height: 180, marginBottom: 12 }}
                    />
                )}

                <TouchableOpacity style={styles.copyBtn} onPress={copyPixKey}>
                    <Copy color="#fff" size={18} />
                    <Text style={styles.copyText}>Copiar chave PIX</Text>
                </TouchableOpacity>
            </View>

            {/* Cartão de crédito/débito */}
            <TouchableOpacity
                style={styles.cardBtn}
                onPress={() =>
                    window.open(
                        "https://link.mercadopago.com.br/minhascomprashrv",
                        "_blank",
                    )
                }
            >
                <CreditCard color="#fff" size={22} />
                <Text style={styles.cardText}>
                    Pagar com cartão (qualquer valor)
                </Text>
            </TouchableOpacity>

            <Text style={styles.thanks}>
                Obrigado de coração! Você é incrível ❤️
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#f8fafc",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#e2e8f0",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1e2937",
        textAlign: "center",
    },
    text: {
        fontSize: 15,
        color: "#475569",
        textAlign: "center",
        marginBottom: 24,
    },
    pixBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#22c55e",
        marginBottom: 20,
        width: "100%",
        maxWidth: 340,
    },
    pixTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#166534",
        marginBottom: 12,
    },
    copyBtn: {
        backgroundColor: "#22c55e",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 12,
    },
    copyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    pixKeyText: { fontSize: 14, color: "#64748b", textAlign: "center" },
    cardBtn: {
        backgroundColor: "#3b82f6",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: "100%",
        maxWidth: 340,
    },
    cardText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    thanks: {
        marginTop: 20,
        fontSize: 14,
        color: "#64748b",
        fontStyle: "italic",
    },
});
