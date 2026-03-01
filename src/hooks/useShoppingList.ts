import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "../types";

const STORAGE_KEY = "@shoppingListApp_v1";

export function useShoppingList(initialList: Item[]) {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) {
                    setItems(JSON.parse(saved));
                } else {
                    setItems(initialList);
                }
            } catch (e) {
                console.error("Erro ao carregar dados", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    // Salva os dados localmente sempre que a lista for atualizada
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(
                (e) => console.error("Erro ao salvar dados", e),
            );
        }
    }, [items, isLoaded]);

    const toggleItem = (id: number) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item,
            ),
        );
    };

    const deleteItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const addItem = (newItemText: string) => {
        if (!newItemText.trim()) return;

        // 1. Divide o texto usando a vírgula como separador
        // 2. Limpa os espaços em branco no início e fim de cada palavra (trim)
        // 3. Filtra para remover itens vazios (caso o usuário digite "Arroz, , Feijão")
        const newNames = newItemText
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (newNames.length === 0) return;

        // Cria um array de novos objetos Item
        const newItems: Item[] = newNames.map((name, index) => ({
            // Usamos o index somado ao Date.now() para garantir que, se processados no
            // mesmo milissegundo, cada item ainda tenha um ID único
            id: Date.now() + index,
            name: name,
            category: "Extras", // Por padrão, vão para a categoria Extras
            checked: false,
            quantity: 1,
        }));

        // Adiciona os novos itens no topo da lista existente
        setItems([...newItems, ...items]);
    };

    const resetList = () =>
        setItems(items.map((item) => ({ ...item, checked: false })));

    return {
        items,
        isLoaded,
        toggleItem,
        deleteItem,
        addItem,
        resetList,
        setItems,
    };
}
