// src/screens/beneficiario/AvailableItemsScreen.tsx
import React, {useCallback, useState} from "react";
import {FlatList, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {BeneficiarioStackParamList} from "../../navigation/types";
import {LinearGradient} from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Componentes
import {EmptyState, ErrorState, Loading, SearchBar, Typography,} from "../../components/barrelComponents";
import theme from "../../theme";

// Hooks
import {useAuth} from "../../hooks/useAuth";
import {useItems} from "../../hooks/useItems";

// Tipos e rotas
import {ItemStatus, Item} from "../../types/items.types";
import {BENEFICIARIO_ROUTES} from "../../navigation/routes";
import {PrincipalHeader} from "../../components/common/PrincipalHeader";

// Filtros de status
const STATUS_FILTERS = [
    { label: "Todos", value: "all" },
    { label: "Disponíveis", value: ItemStatus.DISPONIVEL },
    { label: "Reservados", value: ItemStatus.RESERVADO },
    { label: "Distribuídos", value: ItemStatus.DISTRIBUIDO },
];

const AvailableItemsScreen: React.FC = () => {
    const navigation =
        useNavigation<StackNavigationProp<BeneficiarioStackParamList>>();
    const { user } = useAuth();

    const {
        items,
        isLoading,
        error,
        fetchItemsByStatus,
        pagination,
        clearError,
    } = useItems();

    // Estados locais
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    // Carregar itens disponíveis
    const loadAvailableItems = useCallback(
        async (page = 1, statusFilter?: ItemStatus) => {
            if (statusFilter) {
                await fetchItemsByStatus(statusFilter, { page, take: 20 });
            } else {
                await fetchItemsByStatus(null, { page, take: 20 });
            }
        },
        [fetchItemsByStatus]
    );

    // Carregar ao focar na tela
    useFocusEffect(
        useCallback(() => {
            const status = activeFilter === "all" ? undefined : (activeFilter as ItemStatus);
            loadAvailableItems(1, status);
        }, [loadAvailableItems, activeFilter])
    );

    // Função para mudar o filtro
    const handleFilterChange = (filterValue: string) => {
        setActiveFilter(filterValue);
        const status = filterValue === "all" ? undefined : (filterValue as ItemStatus);
        loadAvailableItems(1, status);
    };

    // Função para pull-to-refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        const status = activeFilter === "all" ? undefined : (activeFilter as ItemStatus);
        await loadAvailableItems(1, status);
        setRefreshing(false);
    };

    // Função para carregar mais itens
    const handleLoadMore = () => {
        if (pagination && pagination.page < pagination.totalPages) {
            const status = activeFilter === "all" ? undefined : (activeFilter as ItemStatus);
            loadAvailableItems(pagination.page + 1, status);
        }
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

            console.log(item.photos);
            return item.photos[0];
        }

        return null;
    };

    // Função para obter label do status
    const getStatusLabel = (status: ItemStatus) => {
        switch(status) {
            case ItemStatus.DISPONIVEL:
                return 'Disponível';
            case ItemStatus.RESERVADO:
                return 'Reservado';
            case ItemStatus.DISTRIBUIDO:
                return 'Distribuído';
            default:
                return status;
        }
    };

    const getStatusColor = (status: ItemStatus): readonly [string, string] => {
        switch (status) {
            case ItemStatus.DISPONIVEL:
                return ["#007811", "#007811"] as const;
            case ItemStatus.RESERVADO:
                return ["#807d00", "#807d00"] as const;
            case ItemStatus.DISTRIBUIDO:
                return ["#9d0000", "#9d0000"] as const;
            default:
                return ["#747474", "#747474"] as const;
        }
    };

    // Componente de Card do Item em Grid - VERSÃO BONITA 🔥
    const ItemGridCard = ({ item }: { item: Item }) => {
        const photo = getItemPhoto(item);

        return (
            <TouchableOpacity
                style={styles.gridCard}
                onPress={() =>
                    navigation.navigate(BENEFICIARIO_ROUTES.ITEM_DETAIL, {
                        id: item.id,
                    })
                }
                activeOpacity={0.85}
            >
                {/* Imagem do Item com Overlay */}
                <View style={styles.imageContainer}>
                    {photo ? (
                        <>
                            <Image
                                source={{ uri: photo }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                        </>
                    ) : (
                        <LinearGradient
                            colors={['#F3F4F6', '#E5E7EB']}
                            style={styles.noImageContainer}
                        >
                            <MaterialIcons
                                name="image"
                                size={48}
                                color="#9CA3AF"
                            />
                            <Typography
                                variant="small"
                                color="#9CA3AF"
                                style={styles.noImageText}
                            >
                                Sem foto
                            </Typography>
                        </LinearGradient>
                    )}

                    {/* Badge de Status no canto superior */}
                    <LinearGradient
                        colors={getStatusColor(item.status)}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.statusBadge}
                    >
                        <Typography
                            variant="small"
                            color="#FFFFFF"
                            style={styles.statusText}
                        >
                            {getStatusLabel(item.status)}
                        </Typography>
                    </LinearGradient>
                </View>

                {/* Informações do Item */}
                <View style={styles.cardContent}>
                    {/* Descrição */}
                    <Typography
                        variant="body"
                        color={theme.colors.neutral.darkGray}
                        numberOfLines={2}
                        style={styles.itemDescription}
                    >
                        {item.description}
                    </Typography>

                    {/* Informações em linha */}
                    <View style={styles.infoContainer}>
                        {item.size && (
                            <View style={styles.infoPill}>
                                <MaterialIcons
                                    name="straighten"
                                    size={12}
                                    color={theme.colors.primary.secondary}
                                />
                                <Typography
                                    variant="small"
                                    color={theme.colors.neutral.mediumGray}
                                    style={styles.infoPillText}
                                >
                                    {item.size}
                                </Typography>
                            </View>
                        )}

                        {item.conservationState && (
                            <View style={styles.infoPill}>
                                <MaterialIcons
                                    name="check-circle-outline"
                                    size={12}
                                    color={theme.colors.status.success}
                                />
                                <Typography
                                    variant="small"
                                    color={theme.colors.neutral.mediumGray}
                                    style={styles.infoPillText}
                                    numberOfLines={1}
                                >
                                    {item.conservationState}
                                </Typography>
                            </View>
                        )}
                    </View>

                    {/* Categoria se existir */}
                    {item.category?.name && (
                        <View style={styles.categoryTag}>
                            <Typography
                                variant="small"
                                color={theme.colors.primary.secondary}
                                style={styles.categoryText}
                            >
                                #{item.category.name}
                            </Typography>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    // Se estiver carregando inicialmente, mostrar loading
    if (isLoading && !refreshing && (!items || items.length === 0)) {
        return (
            <Loading
                visible={true}
                message="Carregando itens disponíveis..."
                overlay
            />
        );
    }

    // Se houver erro, mostrar tela de erro
    if (error) {
        return (
            <ErrorState
                title="Erro ao carregar itens"
                description={error}
                actionLabel="Tentar novamente"
                onAction={() => {
                    clearError();
                    const status = activeFilter === "all" ? undefined : (activeFilter as ItemStatus);
                    loadAvailableItems(1, status);
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <PrincipalHeader
                title="Itens Disponíveis"
                subtitle="Veja os itens disponíveis na unidade!"
            />

            {/* Conteúdo */}
            <View style={styles.content}>
                {/* Barra de pesquisa */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Buscar itens..."
                    containerStyle={styles.searchBar}
                />

                {/* Filtros */}
                <View style={styles.filtersContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersScrollContent}
                    >
                        {STATUS_FILTERS.map((filter) => (
                            <TouchableOpacity
                                key={filter.value}
                                onPress={() => handleFilterChange(filter.value)}
                                activeOpacity={0.7}
                            >
                                {activeFilter === filter.value ? (
                                    <LinearGradient
                                        colors={["#173F5F", "#006E58"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.activeFilterItem}
                                    >
                                        <Typography
                                            variant="bodySecondary"
                                            color={theme.colors.neutral.white}
                                        >
                                            {filter.label}
                                        </Typography>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.filterItem}>
                                        <Typography
                                            variant="bodySecondary"
                                            color={theme.colors.neutral.darkGray}
                                        >
                                            {filter.label}
                                        </Typography>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Grid de itens disponíveis */}
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.gridRow}
                    renderItem={({ item }) => <ItemGridCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary.secondary]}
                            tintColor={theme.colors.primary.secondary}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <EmptyState
                                title="Nenhum item disponível"
                                description={
                                    searchQuery
                                        ? "Tente ajustar sua busca"
                                        : "Não há itens disponíveis no momento"
                                }
                                actionLabel="Atualizar"
                                onAction={handleRefresh}
                            />
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.s,
    },
    searchBar: {
        marginVertical: theme.spacing.s,
    },
    filtersContainer: {
        marginBottom: theme.spacing.s,
    },
    filtersScrollContent: {
        paddingVertical: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.xxs,
    },
    filterItem: {
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
        marginRight: theme.spacing.xs,
        borderRadius: 20,
        backgroundColor: "#F5F8FF",
        borderWidth: 1,
        borderColor: "#E0E7FF",
    },
    activeFilterItem: {
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
        marginRight: theme.spacing.xs,
        borderRadius: 20,
        ...theme.shadows.small,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: theme.spacing.xl,
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing.s,
    },
    gridCard: {
        width: '48%',
        backgroundColor: theme.colors.neutral.white,
        borderRadius: 10,
        overflow: 'hidden',
        ...theme.shadows.medium,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 160,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        ...theme.shadows.small,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardContent: {
        padding: theme.spacing.s,
        flex: 1,
        justifyContent: 'space-between',
    },
    itemDescription: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 18,
        marginBottom: theme.spacing.xs,
        minHeight: 36,
    },
    infoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: theme.spacing.xs,
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoPillText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '500',
        color: '#747474',
    },
    categoryTag: {
        alignSelf: 'flex-start',
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AvailableItemsScreen;