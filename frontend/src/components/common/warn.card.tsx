// src/components/WarnCard.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "./Typography";
import theme from "../../theme";

interface WarnCardProps {
    message: string;
    style?: ViewStyle;
}

const WarnCard: React.FC<WarnCardProps> = ({ message, style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* Ícone de aviso à esquerda */}
            <View style={styles.iconContainer}>
                <Ionicons
                    name="warning"
                    size={24}
                    color="#F59E0B"
                />
            </View>

            {/* Texto à direita */}
            <View style={styles.textContainer}>
                <Typography
                    variant="body"
                style={styles.text}
                color="#92400E"
                    >
                    {message}
                    </Typography>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7", // Amarelo claro
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.s,
        borderLeftWidth: 4,
        borderLeftColor: "#F59E0B", // Amarelo/laranja forte
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        marginRight: theme.spacing.s,
        paddingRight: theme.spacing.xs,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        lineHeight: 20,
    },
});

export default WarnCard;