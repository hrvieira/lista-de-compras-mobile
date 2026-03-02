import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart, RefreshCcw, Plus, Check } from "lucide-react-native";
import { Item } from "../types";
import { useShoppingList } from "../hooks/useShoppingList";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { EditItemModal } from "../components/EditItemModal";

const CATEGORIES = [
    "Mercearia",
    "Laticínios",
    "Carnes & Congelados",
    "Hortifruti",
    "Higiene",
    "Limpeza",
    "Extras",
    "Outros",
];

export function HomeScreen() {
    // 1. Lógica de negócio e dados encapsulados no nosso Custom Hook
    const {
        items,
        isLoaded,
        toggleItem,
        deleteItem,
        addItem,
        resetList,
        setItems,
        isTrackingValue,
    } = useShoppingList([]);

    // 2. Estados visuais (exclusivos deste ecrã)
    const [newItemText, setNewItemText] = useState("");
    const [activeTab, setActiveTab] = useState<"todos" | "pendentes" | "pegos">(
        "todos",
    );
    const [showResetModal, setShowResetModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    const [checkItemAfterEdit, setCheckItemAfterEdit] = useState<number | null>(
        null,
    );

    // Função para adicionar rapidamente o item pela barra de input
    const handleAddItem = () => {
        addItem(newItemText);
        setNewItemText("");
    };

    // Intercepta o clique no item para perguntar do valor
    const handleToggleItem = (item: Item) => {
        if (
            !item.checked &&
            isTrackingValue &&
            (!item.price || item.price === 0)
        ) {
            Alert.alert(
                "Adicionar valor?",
                `Gostaria de adicionar um valor para ${item.name}?`,
                [
                    {
                        text: "Não",
                        style: "cancel",
                        onPress: () => toggleItem(item.id),
                    },
                    {
                        text: "Sim",
                        onPress: () => {
                            setCheckItemAfterEdit(item.id);
                            setEditingItem(item);
                        },
                    },
                ],
            );
        } else {
            toggleItem(item.id);
        }
    };

    // Função para salvar as alterações vindas do Modal de Edição
    const handleSaveEdit = (
        id: number,
        name: string,
        category: string,
        quantity: number,
        price?: number,
    ) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    // Se este item foi enviado para edição via pop-up de marcação, nós o marcamos como concluído agora
                    const shouldBeChecked =
                        checkItemAfterEdit === id ? true : item.checked;
                    return {
                        ...item,
                        name,
                        category,
                        quantity,
                        price,
                        checked: shouldBeChecked,
                    };
                }
                return item;
            }),
        );
        setEditingItem(null);
        setCheckItemAfterEdit(null);
    };

    const executeReset = (track: boolean) => {
        resetList(track);
        setShowResetModal(false);
    };

    // 3. Cálculos de estatísticas
    const totalItems = items.length;
    const checkedItems = items.filter((i) => i.checked).length;
    const progress = totalItems === 0 ? 0 : (checkedItems / totalItems) * 100;

    const totalPrice = items
        .filter((i) => i.checked && i.price)
        .reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

    // 4. Filtragem e Agrupamento
    const itemsToShow = items.filter((i) => {
        if (activeTab === "pendentes") return !i.checked;
        if (activeTab === "pegos") return i.checked;
        return true;
    });

    const groupedItems = CATEGORIES.reduce(
        (acc, cat) => {
            const catItems = itemsToShow.filter((i) => i.category === cat);
            if (catItems.length > 0) acc[cat] = catItems;
            return acc;
        },
        {} as Record<string, Item[]>,
    );

    // Agrupa qualquer categoria desconhecida em "Outros"
    const otherItems = itemsToShow.filter(
        (i) => !CATEGORIES.includes(i.category),
    );
    if (otherItems.length > 0) groupedItems["Outros"] = otherItems;

    // Previne renderização antes do AsyncStorage carregar
    if (!isLoaded) return null;

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.titleContainer}>
                        <ShoppingCart color="#059669" size={24} />
                        <Text style={styles.title}>Minha Lista</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.resetBtn}
                        onPress={() => setShowResetModal(true)}
                    >
                        <RefreshCcw color="#4b5563" size={14} />
                        <Text style={styles.resetBtnText}>Nova Compra</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                    <View
                        style={[styles.progressBar, { width: `${progress}%` }]}
                    />
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{checkedItems} pegos</Text>
                    <Text style={styles.statsText}>
                        {totalItems - checkedItems} em falta
                    </Text>
                </View>
            </View>

            {/* ABAS DE NAVEGAÇÃO */}
            <View style={styles.tabsContainer}>
                {(["todos", "pendentes", "pegos"] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab === "pendentes"
                                ? "Faltam"
                                : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* LISTAGEM DE ITENS */}
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
            >
                {/* INPUT NOVO ITEM */}
                <View style={styles.inputContainer}>
                    <Plus color="#9ca3af" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Adicionar item rápido..."
                        value={newItemText}
                        onChangeText={setNewItemText}
                        onSubmitEditing={handleAddItem}
                        returnKeyType="done"
                    />
                </View>

                {/* RENDERIZAÇÃO DAS CATEGORIAS E ITENS */}
                {Object.keys(groupedItems).length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Check color="#d1d5db" size={48} />
                        <Text style={styles.emptyText}>
                            A sua lista está vazia por aqui.
                        </Text>
                    </View>
                ) : (
                    Object.entries(groupedItems).map(([category, catItems]) => (
                        <View key={category} style={styles.categoryBlock}>
                            <Text style={styles.categoryTitle}>{category}</Text>
                            <View style={styles.card}>
                                {catItems.map((item, index) => (
                                    <ShoppingListItem
                                        key={item.id}
                                        item={item}
                                        onToggle={() => handleToggleItem(item)}
                                        onDelete={deleteItem}
                                        onEdit={setEditingItem}
                                        isLastItem={
                                            index === catItems.length - 1
                                        }
                                    />
                                ))}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* RODAPÉ DE VALOR TOTAL */}
            {isTrackingValue && (
                <View style={styles.footer}>
                    <SafeAreaView edges={["bottom"]} style={styles.footerInner}>
                        <Text style={styles.footerLabel}>Valor Total:</Text>
                        <Text style={styles.footerValue}>
                            R$ {totalPrice.toFixed(2).replace(".", ",")}
                        </Text>
                    </SafeAreaView>
                </View>
            )}

            {/* MODAL DE EDIÇÃO ISOLADO */}
            <EditItemModal
                visible={!!editingItem}
                item={editingItem}
                categories={CATEGORIES}
                onClose={() => {
                    setEditingItem(null);
                    setCheckItemAfterEdit(null);
                }}
                onSave={handleSaveEdit}
            />

            {/* MODAL DE REINICIAR (Pode ser isolado posteriormente também) */}
            <Modal visible={showResetModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalResetContent}>
                        <Text style={styles.resetTitle}>Nova Compra?</Text>
                        <Text style={styles.resetDesc}>
                            Gostaria de adicionar valor aos itens nesta compra?
                        </Text>

                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={() => executeReset(true)}
                        >
                            <Text style={styles.btnPrimaryText}>
                                Sim, adicionar valores
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnSecondary}
                            onPress={() => executeReset(false)}
                        >
                            <Text style={styles.btnSecondaryText}>
                                Não, apenas reiniciar lista
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCancel}
                            onPress={() => setShowResetModal(false)}
                        >
                            <Text style={styles.btnCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Estilos mantidos apenas para estruturação do layout geral do ecrã
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#f3f4f6",
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    titleContainer: { flexDirection: "row", alignItems: "center" },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#047857",
        marginLeft: 8,
    },
    resetBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    resetBtnText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#4b5563",
        marginLeft: 4,
    },
    progressContainer: {
        height: 8,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 4,
    },
    progressBar: { height: "100%", backgroundColor: "#10b981" },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    statsText: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#f3f4f6",
    },
    tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#10b981",
        backgroundColor: "#ecfdf5",
    },
    tabText: { fontSize: 14, fontWeight: "bold", color: "#6b7280" },
    activeTabText: { color: "#059669" },
    listContainer: { flex: 1 },
    listContent: { padding: 16, paddingBottom: 40 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, height: 50, fontSize: 16, color: "#1f2937" },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: "#9ca3af",
        fontWeight: "500",
    },
    categoryBlock: { marginBottom: 24 },
    categoryTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#9ca3af",
        textTransform: "uppercase",
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        overflow: "hidden",
    },

    // Estilos do Footer de Valores
    footer: {
        backgroundColor: "#10b981",
        borderTopWidth: 1,
        borderColor: "#059669",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    footerInner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    footerLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
    footerValue: { color: "#fff", fontSize: 24, fontWeight: "bold" },

    // Estilos do Modal de Reset
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalResetContent: {
        width: "100%",
        maxWidth: 320,
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
    },
    resetTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 8,
    },
    resetDesc: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
    },
    btnPrimary: {
        backgroundColor: "#10b981",
        width: "100%",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    btnPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    btnSecondary: {
        backgroundColor: "#ecfdf5",
        borderWidth: 1,
        borderColor: "#10b981",
        width: "100%",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    btnSecondaryText: { color: "#059669", fontSize: 16, fontWeight: "bold" },
    btnCancel: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    btnCancelText: { color: "#9ca3af", fontSize: 14, fontWeight: "bold" },
});
