import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "../types";

const STORAGE_KEY = "@shoppingListApp_v1";
const TRACKING_KEY = "@shoppingListApp_tracking";

export function useShoppingList(initialList: Item[]) {
    const [items, setItems] = useState<Item[]>([]);
    const [isTrackingValue, setIsTrackingValue] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carrega os dados e o estado do modo de valores
    useEffect(() => {
        const loadData = async () => {
            try {
                const savedItems = await AsyncStorage.getItem(STORAGE_KEY);
                const savedTracking = await AsyncStorage.getItem(TRACKING_KEY);

                if (savedItems !== null) setItems(JSON.parse(savedItems));
                else setItems(initialList);

                if (savedTracking !== null)
                    setIsTrackingValue(JSON.parse(savedTracking));
            } catch (e) {
                console.error("Erro ao carregar dados", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    // Salva os dados localmente
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(
                (e) => console.error(e),
            );
            AsyncStorage.setItem(
                TRACKING_KEY,
                JSON.stringify(isTrackingValue),
            ).catch((e) => console.error(e));
        }
    }, [items, isTrackingValue, isLoaded]);

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

        const newNames = newItemText
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (newNames.length === 0) return;

        const newItems: Item[] = newNames.map((name, index) => ({
            id: Date.now() + index,
            name: name,
            category: "Extras",
            checked: false,
            quantity: 1,
        }));

        setItems([...newItems, ...items]);
    };

    // Atualiza a função de reinício para definir o modo
    const resetList = (trackValue: boolean) => {
        setItems(items.map((item) => ({ ...item, checked: false })));
        setIsTrackingValue(trackValue);
    };

    return {
        items,
        isLoaded,
        toggleItem,
        deleteItem,
        addItem,
        resetList,
        setItems,
        isTrackingValue,
    };
}
