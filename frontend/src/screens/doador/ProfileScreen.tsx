import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert, StatusBar, Platform,
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
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

export const ProfileScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<DoadorProfileStackParamList>>();
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
  });

    const handleCloseBanner = React.useCallback(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
    }, []);

    // Componente de cabeçalho comum
    const Header = () => (
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
                            Meu Perfil
                        </Typography>
                    </View>
                </View>
            </LinearGradient>
        </>
    );

    // Tratar logout
    const handleLogout = async () => {
        Alert.alert(
            "Sair da conta",
            "Tem certeza que deseja sair?",
            [ { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive",
                  onPress: async () => {
                    const success = await logout();
                    if (!success) {
                        setNotification({ visible: true,
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
      <Header />

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
              <FontAwesome6Icon name="user"
                                size={14}
                                color="#6c7178"
                                solid
              />
            <Typography variant="body">Editar Perfil</Typography>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // Navegar para a tab DonationHistory através do parent
              const rootNavigation = navigation.getParent();
              if (rootNavigation) {
                rootNavigation.navigate("MyDonations", {
                  screen: "DonationHistory",
                });
              }
            }}
          >
            <FontAwesome6Icon name="clipboard-check"
                              size={14}
                              color="#6c7178"
                              solid
            />
            <Typography variant="body">Histórico de Doações</Typography>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Impact")}
          >
              <FontAwesome6Icon name="arrow-trend-up"
                                size={14}
                                color="#6c7178"
                                solid
              />
            <Typography variant="body">Meu Impacto Social</Typography>
          </TouchableOpacity>
        </Card>

        {/* Estatísticas rápidas */}
        <Card title="Minhas Estatísticas" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Typography variant="h3" color={theme.colors.primary.secondary}>
                0
              </Typography>
              <Typography variant="small" color={theme.colors.neutral.darkGray}>
                Doações Realizadas
              </Typography>
            </View>

            <View style={styles.statItem}>
              <Typography variant="h3" color={theme.colors.primary.secondary}>
                0
              </Typography>
              <Typography variant="small" color={theme.colors.neutral.darkGray}>
                Pessoas Ajudadas
              </Typography>
            </View>
          </View>
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
    marginBottom: theme.spacing.m,
  },
  menuItem: {
    paddingVertical: theme.spacing.m,
    flexDirection: "row",
      alignItems: "center",
      gap: 10
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
  logoutButton: {
    backgroundColor: theme.colors.status.error,
  },
});


