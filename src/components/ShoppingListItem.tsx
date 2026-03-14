import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";

// Importando ícones centralizados
import { Check, Pencil, Trash2 } from "../icons";
import { Item } from "../types";

interface ShoppingListItemProps {
    item: Item;
    onToggle: (id: number) => void;
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void;
    isLastItem?: boolean;
}

export function ShoppingListItem({
    item,
    onToggle,
    onEdit,
    onDelete,
    isLastItem = false,
}: ShoppingListItemProps) {
    return (
        <TouchableOpacity
            style={[
                styles.itemRow,
                !isLastItem && styles.itemBorder,
                item.checked && styles.itemCheckedBg,
            ]}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
        >
            {/* Lado esquerdo: Checkbox e Detalhes do Item */}
            <View style={styles.itemLeft}>
                <View
                    style={[
                        styles.checkbox,
                        item.checked && styles.checkboxChecked,
                    ]}
                >
                    {item.checked && (
                        <Check color="#fff" size={14} strokeWidth={3} />
                    )}
                </View>

                <View style={styles.itemTextContainer}>
                    <Text
                        style={[
                            styles.itemName,
                            item.checked && styles.itemNameChecked,
                        ]}
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>
                    {item.quantity > 1 && (
                        <Text
                            style={[
                                styles.itemQty,
                                item.checked && styles.itemQtyChecked,
                            ]}
                        >
                            Qtd: {item.quantity}
                        </Text>
                    )}
                </View>
            </View>

            {/* Lado direito: Botões de Ação (Editar e Excluir) */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    onPress={() => onEdit(item)}
                    style={styles.actionBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Pencil color="#9ca3af" size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={styles.actionBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderColor: "#f9fafb",
    },
    itemCheckedBg: {
        backgroundColor: "#f9fafb",
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingRight: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#d1d5db",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: "#10b981",
        borderColor: "#10b981",
    },
    itemTextContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#374151",
    },
    itemNameChecked: {
        color: "#9ca3af",
        textDecorationLine: "line-through",
    },
    itemQty: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#059669",
        marginTop: 2,
    },
    itemQtyChecked: {
        color: "#d1d5db",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionBtn: {
        padding: 8,
        marginLeft: 4,
    },
});
