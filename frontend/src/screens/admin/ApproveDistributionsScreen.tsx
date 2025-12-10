import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AdminItemsStackParamList } from "../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Componentes
import {
  Typography,
  Header,
  Button,
  NotificationBanner,
  SearchBar,
  Loading,
  ErrorState,
  EmptyState,
} from "../../components/barrelComponents";
import { Pagination } from "../../components/common/Pagination";
import theme from "../../theme";
import { ItemStatus, Item } from '../../types/items.types'

// Hooks
import { useAuth } from '../../hooks/useAuth'
import useItems from '../../hooks/useItems'

const ApproveDistributionsScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<AdminItemsStackParamList>>();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  const [notification, setNotification] = useState({
    visible: false,
    type: "success" as "success" | "error",
    message: "",
    description: "",
  });

  const { user } = useAuth();

  const {
    items,
    isLoading,
    error,
    fetchItemsByStatus,
    pagination,
    clearError,
  } = useItems();

  const loadReservedItems = useCallback(
    async (page = 1) => {
      await fetchItemsByStatus(ItemStatus.RESERVADO, { page, take: 10 });
      console.log('Pagination após load:', pagination);
    },
    [fetchItemsByStatus]
  );

  useFocusEffect(
    useCallback(() => {
      loadReservedItems(1);
    }, [loadReservedItems])
  );

  // Função para pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReservedItems(1);
    setRefreshing(false);
  };

  // Função para mudar de página
  const handlePageChange = async (page: number) => {
    console.log('handlePageChange chamado com página:', page);
    await loadReservedItems(page);
  };

  // Filtrar itens pela busca
  const filteredItems = (items || []).filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.description.toLowerCase().includes(query) ||
      item.conservationState?.toLowerCase().includes(query) ||
      item.size?.toLowerCase().includes(query)
    );
  });

  // Função para obter a primeira foto ou null
  const getItemPhoto = (item: Item) => {
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      return item.photos[0];
    }
    return null;
  };

const handleApproveDistribution = async (item: Item) => {
  Alert.alert(
    "Confirmar Distribuição",
    "Tem certeza que deseja distribuir esse item?",
    [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim, distribuir",
        style: "default",
        onPress: async () => {
          try {
            // Aprovar a distribuição
            // await approveDistribution(item.id);
            
            setNotification({
              visible: true,
              type: "success",
              message: "Distribuição aprovada!",
              description: `O item "${item.description}" foi aprovado para distribuição.`,
            });
            
            // Recarregar os dados após 1.5s
            setTimeout(async () => {
              await loadReservedItems(pagination?.page || 1);
            }, 1500);
            
          } catch (err) {
            setNotification({
              visible: true,
              type: "error",
              message: "Erro ao aprovar distribuição.",
              description: "Não foi possível aprovar a distribuição. Tente novamente.",
            });
          }
        },
      },
    ]
  );
};

  const handleRejectDistribution = async (item: Item) => {
    Alert.alert(
      "Confirmar Rejeição",
      "Tem certeza que deseja rejeitar esta distribuição?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim, rejeitar",
          style: "destructive",
          onPress: async () => {
            try {
              // Lógica para rejeitar distribuição
              // await rejectDistribution(item.id);

              setNotification({
                visible: true,
                type: "success",
                message: "Distribuição rejeitada!",
                description: `O item "${item.description}" foi rejeitado e voltará ao status disponível.`,
              });

              // Recarregar a lista
              setTimeout(async () => {
                await loadReservedItems(pagination?.page || 1);
              }, 1500);
            } catch (err) {
              setNotification({
                visible: true,
                type: "error",
                message: "Erro ao rejeitar distribuição.",
                description: "Não foi possível rejeitar a distribuição. Tente novamente.",
              });
            }
          },
        },
      ]
    );
  };

  // Componente de Card de Distribuição
  const DistributionCard = ({ item }: { item: Item }) => {
    const photo = getItemPhoto(item);

    return (
      <View style={styles.distributionCard}>
        {/* Container da Imagem e Informações Principais */}
        <View style={styles.cardHeader}>
          {/* Imagem do Item */}
          <View style={styles.imageContainer}>
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={['#F3F4F6', '#E5E7EB']}
                style={styles.noImageContainer}
              >
                <MaterialIcons
                  name="image"
                  size={40}
                  color="#9CA3AF"
                />
              </LinearGradient>
            )}

            {/* Badge de Status */}
            <LinearGradient
              colors={["#807d00", "#807d00"]}
              style={styles.statusBadge}
            >
              <Typography
                variant="small"
                color="#FFFFFF"
                style={styles.statusText}
              >
                RESERVADO
              </Typography>
            </LinearGradient>
          </View>

          {/* Informações do Item */}
          <View style={styles.itemInfo}>
            <Typography
              variant="small"
              color={theme.colors.neutral.darkGray}
              numberOfLines={2}
              style={styles.itemDescription}
            >
              {item.description}
            </Typography>

            {/* Detalhes do Item */}
            <View style={styles.detailsContainer}>
              {item.size && (
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="straighten"
                    size={16}
                    color={theme.colors.primary.secondary}
                  />
                  <Typography
                    variant="small"
                    color={theme.colors.neutral.black}
                    style={styles.detailText}
                  >
                    Tamanho: {item.size}
                  </Typography>
                </View>
              )}

              {item.conservationState && (
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="check-circle-outline"
                    size={16}
                    color={theme.colors.status.success}
                  />
                  <Typography
                    variant="small"
                    color={theme.colors.neutral.black}
                    style={styles.detailText}
                  >
                    {item.conservationState}
                  </Typography>
                </View>
              )}

              {item.category?.name && (
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="category"
                    size={16}
                    color={theme.colors.primary.main}
                  />
                  <Typography
                    variant="small"
                    color={theme.colors.neutral.black}
                    style={styles.detailText}
                  >
                    {item.category.name}
                  </Typography>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Informações do Beneficiário */}
        <View style={styles.beneficiaryInfo}>
          <View style={styles.beneficiaryRow}>
            <MaterialIcons
              name="person"
              size={20}
              color={theme.colors.primary.secondary}
            />
            <View style={styles.beneficiaryTextContainer}>
              <Typography
                variant="small"
                color={theme.colors.neutral.black}
                style={styles.beneficiaryLabel}
              >
                Reservado para:
              </Typography>
              <Typography
                variant="body"
                color={theme.colors.neutral.darkGray}
                style={styles.beneficiaryName}
              >
                {/* Aqui você adicionaria o nome do beneficiário quando tiver */}
                Beneficiário não especificado
              </Typography>
            </View>
          </View>

          <View style={styles.beneficiaryRow}>
            <MaterialIcons
              name="access-time"
              size={20}
              color={theme.colors.primary.secondary}
            />
            <View style={styles.beneficiaryTextContainer}>
              <Typography
                variant="small"
                color={theme.colors.neutral.darkGray}
                style={styles.beneficiaryLabel}
              >
                Data da reserva:
              </Typography>
              <Typography
                variant="body"
                color={theme.colors.neutral.darkGray}
              >
                {/* Aqui você adicionaria a data da reserva quando tiver */}
                {new Date().toLocaleDateString('pt-BR')}
              </Typography>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleRejectDistribution(item)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="close"
              size={20}
              color="#FFFFFF"
            />
            <Typography
              variant="bodySecondary"
              color="#FFFFFF"
              style={styles.buttonText}
            >
              Rejeitar
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveDistribution(item)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#006E58", "#00A67E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.approveGradient}
            >
              <MaterialIcons
                name="check"
                size={20}
                color="#FFFFFF"
              />
              <Typography
                variant="bodySecondary"
                color="#FFFFFF"
                style={styles.buttonText}
              >
                Aprovar
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading && !refreshing && (!items || items.length === 0)) {
    return (
      <Loading
        visible={true}
        message="Carregando distribuições..."
        overlay
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar distribuições"
        description={error}
        actionLabel="Tentar novamente"
        onAction={() => {
          clearError();
          loadReservedItems(1);
        }}
      />
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.container}>
        <Header
          title="Aprovar Distribuições"
          onBackPress={() => navigation.goBack()}
          backgroundColor={theme.colors.primary.main}
        />

        <NotificationBanner
          visible={notification.visible}
          type={notification.type}
          message={notification.message}
          description={notification.description}
          onClose={() => setNotification({ ...notification, visible: false })}
        />

        <View style={styles.content}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar distribuições..."
            containerStyle={styles.searchBar}
          />

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DistributionCard item={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary.secondary]}
                tintColor={theme.colors.primary.secondary}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <EmptyState
                  title="Nenhuma distribuição pendente"
                  description={
                    searchQuery
                      ? "Tente ajustar sua busca"
                      : "Não há distribuições aguardando aprovação no momento"
                  }
                  actionLabel="Atualizar"
                  onAction={handleRefresh}
                />
              </View>
            }
            ListFooterComponent={() => {
              console.log('🔍 ListFooterComponent renderizando');
              console.log('📊 Pagination:', pagination);
              
              if (!pagination) {
                console.log('❌ Pagination é null/undefined');
                return null;
              }
              
              console.log('✅ Renderizando Pagination com:', {
                currentPage: pagination.page,
                totalPages: pagination.totalPages,
              });
              
              return (
                <Pagination
                  currentPage={pagination.page || 1}
                  totalPages={pagination.totalPages || 1}
                  onPageChange={handlePageChange}
                  loading={isLoading}
                  variant="default"
                  alwaysShow={pagination.totalPages > 1}
                />
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing.s,
  },
  searchBar: {
    marginVertical: theme.spacing.s,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.s,
  },
  distributionCard: {
    backgroundColor: theme.colors.neutral.lightGray,
    borderRadius: 20,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
    ...theme.shadows.medium,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: theme.spacing.m,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.m,
    justifyContent: 'space-between',
  },
  itemDescription: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#d4d4d4ff',
    marginHorizontal: theme.spacing.m,
  },
  beneficiaryInfo: {
    padding: theme.spacing.m,
    gap: theme.spacing.s,
  },
  beneficiaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  beneficiaryTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  beneficiaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  beneficiaryName: {
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: "row",
    padding: theme.spacing.l,
    paddingTop: 0,
    gap: theme.spacing.s,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: theme.spacing.s,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  approveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.s,
    gap: 6,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApproveDistributionsScreen;
