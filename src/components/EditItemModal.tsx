import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Pencil, X, ChevronDown, ChevronUp, Save } from "lucide-react-native";
import { Item } from "../types";

interface EditItemModalProps {
    visible: boolean;
    item: Item | null;
    categories: string[];
    onClose: () => void;
    onSave: (
        id: number,
        name: string,
        category: string,
        quantity: number,
        price?: number,
    ) => void;
}

export function EditItemModal({
    visible,
    item,
    categories,
    onClose,
    onSave,
}: EditItemModalProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState("");

    // 1. CORREÇÃO DA VÍRGULA AO ABRIR O MODAL:
    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategory(item.category);
            setQuantity(item.quantity || 1);

            if (item.price) {
                const priceString = item.price.toString().replace(".", ",");
                setPrice(priceString);
            } else {
                setPrice("");
            }
        }
    }, [item]);

    // 2. NOVA FUNÇÃO: MÁSCARA DE PREÇO
    const handlePriceChange = (text: string) => {
        // a. Troca pontos por vírgulas (caso o usuário aperte ponto no teclado)
        let formatted = text.replace(".", ",");

        // b. Remove qualquer caractere que não seja número ou vírgula
        formatted = formatted.replace(/[^0-9,]/g, "");

        // c. Garante que só existe UMA vírgula no texto
        const parts = formatted.split(",");
        if (parts.length > 2) {
            formatted = parts[0] + "," + parts.slice(1).join("");
        }

        // d. Limita a no máximo 2 casas decimais após a vírgula
        const finalParts = formatted.split(",");
        if (finalParts.length === 2 && finalParts[1].length > 2) {
            formatted = finalParts[0] + "," + finalParts[1].substring(0, 2);
        }

        setPrice(formatted);
    };

    const handleSave = () => {
        if (!name.trim() || !item) return;

        // Converte a vírgula de volta para ponto só na hora de salvar no sistema
        const numericPrice = parseFloat(price.replace(",", "."));
        const finalPrice = isNaN(numericPrice) ? undefined : numericPrice;

        onSave(item.id, name, category, quantity, finalPrice);
    };

    if (!item) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={styles.keyboardContainer}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View style={styles.modalTitleContainer}>
                                    <Pencil color="#fff" size={20} />
                                    <Text style={styles.modalTitle}>
                                        Editar Item
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeBtn}
                                    hitSlop={{
                                        top: 10,
                                        bottom: 10,
                                        left: 10,
                                        right: 10,
                                    }}
                                >
                                    <X color="#fff" size={24} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.label}>
                                    NOME / DESCRIÇÃO
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={name}
                                    onChangeText={setName}
                                />

                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        <Text style={styles.label}>
                                            VALOR (R$)
                                        </Text>
                                        <TextInput
                                            style={styles.modalInput}
                                            value={price}
                                            // 3. APLICAMOS A NOSSA MÁSCARA AQUI
                                            onChangeText={handlePriceChange}
                                            keyboardType="numeric"
                                            placeholder="0,00"
                                        />
                                    </View>

                                    <View style={styles.halfWidth}>
                                        <Text style={styles.label}>
                                            QUANTIDADE
                                        </Text>
                                        <View style={styles.qtyContainer}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() =>
                                                    setQuantity((prev) =>
                                                        Math.max(1, prev - 1),
                                                    )
                                                }
                                            >
                                                <ChevronDown
                                                    color="#4b5563"
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>
                                                {quantity}
                                            </Text>
                                            <TouchableOpacity
                                                style={[
                                                    styles.qtyBtn,
                                                    styles.qtyBtnPlus,
                                                ]}
                                                onPress={() =>
                                                    setQuantity(
                                                        (prev) => prev + 1,
                                                    )
                                                }
                                            >
                                                <ChevronUp
                                                    color="#059669"
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.label}>CATEGORIA</Text>
                                <View style={styles.categoryWrapper}>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            style={[
                                                styles.catBadge,
                                                category === cat &&
                                                    styles.catBadgeActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.catBadgeText,
                                                    category === cat &&
                                                        styles.catBadgeTextActive,
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.saveBtn}
                                    onPress={handleSave}
                                >
                                    <Save color="#fff" size={20} />
                                    <Text style={styles.saveBtnText}>
                                        Salvar Alterações
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

// Estilos mantidos iguais
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    keyboardContainer: { width: "100%", alignItems: "center" },
    modalContent: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
    },
    modalHeader: {
        backgroundColor: "#10b981",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    modalTitleContainer: { flexDirection: "row", alignItems: "center" },
    modalTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    closeBtn: { padding: 2, borderRadius: 12 },
    modalBody: { padding: 20 },
    label: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6b7280",
        marginBottom: 6,
        marginTop: 12,
    },
    modalInput: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: "#374151",
    },
    row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    halfWidth: { flex: 1 },
    qtyContainer: { flexDirection: "row", alignItems: "center", height: 52 },
    qtyBtn: {
        width: 40,
        height: "100%",
        backgroundColor: "#f3f4f6",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    qtyBtnPlus: { backgroundColor: "#d1fae5" },
    qtyText: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    categoryWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    catBadge: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    catBadgeActive: { backgroundColor: "#10b981" },
    catBadgeText: { fontSize: 14, fontWeight: "500", color: "#4b5563" },
    catBadgeTextActive: { color: "#fff" },
    saveBtn: {
        backgroundColor: "#10b981",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    saveBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
