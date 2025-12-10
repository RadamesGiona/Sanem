// src/components/common/Pagination.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import Typography from './Typography'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  variant?: 'default' | 'compact';
  alwaysShow?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  variant = 'default',
  alwaysShow = false,
}) => {
  if (!alwaysShow && totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = variant === 'compact' ? 3 : 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - halfRange);
      let endPage = Math.min(totalPages - 1, currentPage + halfRange);

      if (currentPage <= halfRange + 1) {
        endPage = maxPagesToShow - 1;
      }

      if (currentPage >= totalPages - halfRange) {
        startPage = totalPages - maxPagesToShow + 2;
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
      {/* Container horizontal principal */}
      <View style={styles.paginationRow}>
        {/* Botão Anterior */}
        <TouchableOpacity
          onPress={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage || loading}
          activeOpacity={0.7}
          style={styles.arrowButton}
        >
          {isFirstPage || loading ? (
            <View style={styles.arrowButtonDisabled}>
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={theme.colors.neutral.lightGray}
              />
            </View>
          ) : (
            <LinearGradient
              colors={["#173F5F", "#006E58"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.arrowButtonActive}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color="#FFFFFF"
              />
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Números das Páginas */}
        <View style={styles.pagesContainer}>
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <View key={`ellipsis-${index}`} style={styles.ellipsis}>
                  <Typography
                    variant="small"
                    color={theme.colors.neutral.mediumGray}
                  >
                    ...
                  </Typography>
                </View>
              );
            }

            const isCurrentPage = page === currentPage;
            const pageNumber = page as number;

            return (
              <TouchableOpacity
                key={pageNumber}
                onPress={() => onPageChange(pageNumber)}
                disabled={isCurrentPage || loading}
                activeOpacity={0.7}
                style={styles.pageButton}
              >
                {isCurrentPage ? (
                  <LinearGradient
                    colors={["#173F5F", "#006E58"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.pageButtonActive}
                  >
                    <Typography
                      variant="small"
                      color="#FFFFFF"
                      style={styles.pageText}
                    >
                      {pageNumber}
                    </Typography>
                  </LinearGradient>
                ) : (
                  <View style={styles.pageButtonInactive}>
                    <Typography
                      variant="small"
                      color={theme.colors.neutral.darkGray}
                      style={styles.pageText}
                    >
                      {pageNumber}
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão Próximo */}
        <TouchableOpacity
          onPress={() => onPageChange(currentPage + 1)}
          disabled={isLastPage || loading}
          activeOpacity={0.7}
          style={styles.arrowButton}
        >
          {isLastPage || loading ? (
            <View style={styles.arrowButtonDisabled}>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={theme.colors.neutral.lightGray}
              />
            </View>
          ) : (
            <LinearGradient
              colors={["#173F5F", "#006E58"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.arrowButtonActive}
            >
              <MaterialIcons
                name="chevron-right"
                size={20}
                color="#FFFFFF"
              />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      {/* Info da página (abaixo dos botões) */}
      {variant === 'default' && (
        <View style={styles.pageInfo}>
          <Typography
            variant="small"
            color={theme.colors.neutral.mediumGray}
            style={styles.pageInfoText}
          >
            Página {currentPage} de {totalPages}
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButton: {
    marginHorizontal: 4,
  },
  arrowButtonActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  arrowButtonDisabled: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3ff',
  },
  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  pageButton: {
    marginHorizontal: 3,
  },
  pageButtonActive: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    ...theme.shadows.small,
  },
  pageButtonInactive: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a1a1a1ff',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 6,
  },
  pageText: {
    fontWeight: '700',
    fontSize: 13,
  },
  ellipsis: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  pageInfoText: {
    color: theme.colors.neutral.darkGray,
    fontWeight: '500',
    fontSize: 12,
  },
});
