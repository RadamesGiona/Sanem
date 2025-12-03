import {Platform, StatusBar, StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import theme from "../../theme";
import Typography from "./Typography";

export const PrincipalHeader = (props: { title: string, subtitle?: string }) => (
    <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
        />
        <LinearGradient
            colors={["#b0e6f2", "#e3f7ff", "#ffffff"]}
            locations={[0, 0.3, 0.6]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Typography
                        variant="h1"
                        style={styles.welcomeText}
                        color={theme.colors.primary.main}
                    >
                        {props.title}
                    </Typography>
                    {props.subtitle && (
                        <Typography
                            variant="bodySecondary"
                            color={theme.colors.neutral.darkGray}
                        >
                            {props.subtitle}
                        </Typography>
                    )}
                </View>
            </View>
        </LinearGradient>
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.lightGray,
    },
    headerGradient: {
        paddingTop:
            Platform.OS === "ios" ? 60 : 40 + (StatusBar.currentHeight ?? 0),
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        ...theme.shadows.medium,
    },
    header: {
        paddingHorizontal: theme.spacing.m,
    },
    welcomeContainer: {
        marginBottom: theme.spacing.s,
    },
    welcomeText: {
        fontWeight: "bold",
        fontSize: 28,
        marginBottom: 5,
    },
});