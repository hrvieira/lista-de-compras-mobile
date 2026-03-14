import { Platform } from "react-native";

// Importando todas as versões (native + web)
import * as NativeIcons from "lucide-react-native";
import * as WebIcons from "lucide-react";

// Exportando ícones com seleção automática (mobile ou web)
export const Check = Platform.OS === "web" ? WebIcons.Check : NativeIcons.Check;
export const Pencil =
    Platform.OS === "web" ? WebIcons.Pencil : NativeIcons.Pencil;
export const Trash2 =
    Platform.OS === "web" ? WebIcons.Trash2 : NativeIcons.Trash2;
export const X = Platform.OS === "web" ? WebIcons.X : NativeIcons.X;
export const ChevronDown =
    Platform.OS === "web" ? WebIcons.ChevronDown : NativeIcons.ChevronDown;
export const ChevronUp =
    Platform.OS === "web" ? WebIcons.ChevronUp : NativeIcons.ChevronUp;
export const Save = Platform.OS === "web" ? WebIcons.Save : NativeIcons.Save;
