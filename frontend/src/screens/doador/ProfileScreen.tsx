import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DoadorProfileStackParamList } from "../../navigation/types";

// Componentes
import {
    Typography,
    Header,
    Card,
    Button,
    Avatar,
    Divider,
    NotificationBanner,
    Badge,
} from "../../components/barrelComponents";
import theme from "../../theme";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import {LinearGradient} from "expo-linear-gradient";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import useItems from "../../hooks/useItems";
import {PrincipalHeader} from "../../components/common/PrincipalHeader";

// Interface para as estatísticas
interface UserStats {
    totalDonations: number;
    distributedItems: number;
    peopleHelped: number;
}

export const ProfileScreen: React.FC = () => {
    const navigation =
        useNavigation<StackNavigationProp<DoadorProfileStackParamList>>();
    const { user, logout } = useAuth();
    const { fetchItemsByDonor } = useItems();

    const [notification, setNotification] = useState({
        visible: false,
        message: "",
        type: "info" as "success" | "error" | "info" | "warning",
    });

    const [stats, setStats] = useState<UserStats>({
        totalDonations: 0,
        distributedItems: 0,
        peopleHelped: 0,
    });

    const [loadingStats, setLoadingStats] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);

    const handleCloseBanner = React.useCallback(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
    }, []);

    // Carregar estatísticas do usuário
    useEffect(() => {
        const loadUserStats = async () => {
            if (!user) return;

            try {
                setLoadingStats(true);
                setStatsError(null);

                // Buscar todos os itens doados pelo usuário
                const response = await fetchItemsByDonor(user.id, {
                    page: 1,
                    take: 50,
                });

                if (response && response.data) {
                    const items = response.data;

                    // Calcular estatísticas
                    const distributedItems = items.filter(
                        (item) => item.status === "distribuido"
                    ).length;

                    // Cada item distribuído ajudou uma pessoa
                    const peopleHelped = distributedItems;

                    setStats({
                        totalDonations: items.length,
                        distributedItems,
                        peopleHelped,
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
                setStatsError("Não foi possível carregar suas estatísticas.");
            } finally {
                setLoadingStats(false);
            }
        };

        loadUserStats();
    }, [user, fetchItemsByDonor]);

    // Tratar logout
    const handleLogout = async () => {
        Alert.alert(
            "Sair da conta",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        const success = await logout();
                        if (!success) {
                            setNotification({
                                visible: true,
                                message: "Erro ao sair da conta. Tente novamente.",
                                type: "error",
                            });
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    if (!user) return null;

    return (
        <View style={styles.container}>
            {/* Notificação */}
            <NotificationBanner
                visible={notification.visible}
                type={notification.type}
                message={notification.message}
                onClose={handleCloseBanner}
            />

            {/* Cabeçalho */}
            <PrincipalHeader title="Meu Perfil" />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Cartão do perfil */}
                <Card style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Avatar name={user.name} size="large" style={styles.avatar} />
                        <View style={styles.profileInfo}>
                            <Typography variant="h3">{user.name}</Typography>
                            <Typography variant="bodySecondary">{user.email}</Typography>
                            <Badge
                                label="Doador"
                                variant="success"
                                size="small"
                                style={styles.roleTag}
                            />
                        </View>
                    </View>

                    {user.phone && (
                        <View style={styles.contactInfo}>
                            <Typography
                                variant="bodySecondary"
                                color={theme.colors.neutral.darkGray}
                            >
                                Telefone:
                            </Typography>
                            <Typography variant="body">{user.phone}</Typography>
                        </View>
                    )}

                    {user.address && (
                        <View style={styles.contactInfo}>
                            <Typography
                                variant="bodySecondary"
                                color={theme.colors.neutral.darkGray}
                            >
                                Endereço:
                            </Typography>
                            <Typography variant="body">{user.address}</Typography>
                        </View>
                    )}
                </Card>

                {/* Menu de opções */}
                <Card style={styles.menuCard}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <View style={styles.leftContent}>
                            <FontAwesome6Icon
                                name="user"
                                size={14}
                                color="#6c7178"
                                solid
                            />
                            <Typography variant="body">Editar Perfil</Typography>
                        </View>

                        <FontAwesome6Icon
                            name="arrow-right"
                            size={12}
                            color="#6c7178"
                            solid
                        />
                    </TouchableOpacity>

                    <Divider />

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            const rootNavigation = navigation.getParent();
                            if (rootNavigation) {
                                rootNavigation.navigate("MyDonations", {
                                    screen: "DonationHistory",
                                });
                            }
                        }}
                    >
                        {/* Ícone + Texto alinhados lado a lado */}
                        <View style={styles.leftContent}>
                            <FontAwesome6Icon
                                name="clipboard-check"
                                size={14}
                                color="#6c7178"
                                solid
                            />
                            <Typography variant="body">Histórico de Doações</Typography>
                        </View>

                        {/* Ícone da direita alinhado ao final */}
                        <FontAwesome6Icon
                            name="arrow-right"
                            size={12}
                            color="#6c7178"
                            solid
                        />
                    </TouchableOpacity>

                    <Divider />

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("Impact")}
                    >
                        <View style={styles.leftContent}>
                            <FontAwesome6Icon
                                name="arrow-trend-up"
                                size={14}
                                color="#6c7178"
                                solid
                            />
                            <Typography variant="body">Meu Impacto Social</Typography>
                        </View>

                        <FontAwesome6Icon
                            name="arrow-right"
                            size={12}
                            color="#6c7178"
                            solid
                        />
                    </TouchableOpacity>
                </Card>

                {/* Estatísticas rápidas */}
                <Card title="Minhas Estatísticas" style={styles.statsCard}>
                    {loadingStats ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color={theme.colors.primary.secondary}
                            />
                            <Typography
                                variant="bodySecondary"
                                style={styles.loadingText}
                            >
                                Carregando estatísticas...
                            </Typography>
                        </View>
                    ) : statsError ? (
                        <View style={styles.errorContainer}>
                            <Typography
                                variant="bodySecondary"
                                color={theme.colors.status.error}
                            >
                                {statsError}
                            </Typography>
                        </View>
                    ) : (
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Typography variant="h3" color={theme.colors.primary.secondary}>
                                    {stats.totalDonations > 50 ? "50+" : stats.totalDonations}
                                </Typography>
                                <Typography variant="small" color={theme.colors.neutral.darkGray}>
                                    Doações Realizadas
                                </Typography>
                            </View>

                            <View style={styles.statItem}>
                                <Typography variant="h3" color={theme.colors.primary.secondary}>
                                    {stats.peopleHelped}
                                </Typography>
                                <Typography variant="small" color={theme.colors.neutral.darkGray}>
                                    Pessoas Ajudadas
                                </Typography>
                            </View>
                        </View>
                    )}
                </Card>

                {/* Botão de logout */}
                <Button
                    title="Sair da Conta"
                    variant="secondary"
                    style={styles.logoutButton}
                    onPress={handleLogout}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.lightGray,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.m,
    },
    profileCard: {
        marginBottom: theme.spacing.m,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.s,
    },
    avatar: {
        marginRight: theme.spacing.m,
    },
    profileInfo: {
        flex: 1,
    },
    roleTag: {
        marginTop: theme.spacing.xs,
    },
    contactInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: theme.spacing.xs,
    },
    menuCard: {
        marginBottom: theme.spacing.l,
    },
    menuItem: {
        paddingVertical: theme.spacing.m,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    statsCard: {
        marginBottom: theme.spacing.m,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: theme.spacing.s,
    },
    statItem: {
        alignItems: "center",
    },
    loadingContainer: {
        paddingVertical: theme.spacing.l,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: theme.spacing.s,
    },
    errorContainer: {
        paddingVertical: theme.spacing.m,
        alignItems: "center",
    },
    logoutButton: {
        backgroundColor: theme.colors.status.error,
    },
});