/**
 * Serviço de itens - comunicação com as rotas de itens/doações do backend
 */
import api from "./api";
import {
  Item,
  CreateItemDto,
  UpdateItemDto,
  ItemsPage,
  ItemsApiResponse,
} from "../types/items.types";
import { PageOptionsDto } from "../types/common.types";
import {HttpResponse} from "./types/http.response";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Namespace para agrupar as funções do serviço
const ItemsService = {
  /**
   * Obter todos os itens com paginação
   * @param pageOptions Opções de paginação
   * @returns Lista paginada de itens
   */
  getAll: async (pageOptions?: PageOptionsDto): Promise<ItemsPage> => {
    const response = await api.get<ItemsPage>("/items", {
      params: pageOptions,
    });
    return response.data;
  },

  /**
   * Obter item por ID
   * @param id ID do item
   * @returns Item encontrado
   */
  getById: async (id: string): Promise<Item> => {
    const response = await api.get<HttpResponse<Item>>(`/items/${id}`);
    return response.data.data;
  },

  /**
   * Criar novo item
   * @param itemData Dados do novo item
   * @returns Item criado
   */
  create: async (itemData: CreateItemDto): Promise<Item> => {
      console.log('[ItemsService] ==> INÍCIO <==');

      const formData = new FormData();

      // Adicionar campos do item
      formData.append('type', itemData.type);
      formData.append('description', itemData.description);
      formData.append('donorId', itemData.donorId);

      if (itemData.conservationState) {
          formData.append('conservationState', itemData.conservationState);
      }

      if (itemData.size) {
          formData.append('size', itemData.size);
      }

      if (itemData.categoryId) {
          formData.append('categoryId', itemData.categoryId);
      }

      // Adicionar as imagens
      if (itemData.photos && itemData.photos.length > 0) {
          console.log('[ItemsService] Processando', itemData.photos.length, 'fotos');

          itemData.photos.forEach((photoUri, index) => {
              const fileName = photoUri.split('/').pop() || `image_${index}.jpg`;

              let mimeType = 'image/jpeg';
              const lowerFileName = fileName.toLowerCase();
              if (lowerFileName.endsWith('.png')) {
                  mimeType = 'image/png';
              } else if (lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.jpeg')) {
                  mimeType = 'image/jpeg';
              }

              const file: any = {
                  uri: photoUri,
                  type: mimeType,
                  name: fileName,
              };

              console.log(`[ItemsService] Foto ${index}:`, file);
              formData.append('images', file);
          });
      }

      console.log('[ItemsService] Enviando com FETCH nativo...');

      try {
          // Obter token
          const token = await AsyncStorage.getItem("@auth_token");

          // Usar fetch nativo
          const response = await fetch(`http://192.168.0.100:3000/items`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  // NÃO definir Content-Type - deixar o fetch definir automaticamente
              },
              body: formData,
          });

          console.log('[ItemsService] Response status:', response.status);

          if (!response.ok) {
              const errorData = await response.json().catch(() => null);
              console.error('[ItemsService] Erro da API:', errorData);
              throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
          }

          const data = await response.json();
          console.log('[ItemsService] ✅ Sucesso!');
          return data;

      } catch (error: any) {
          console.error('[ItemsService] ❌ Erro:', {
              message: error.message,
              stack: error.stack,
          });
          throw error;
      }
  },

  /**
   * Atualizar item existente
   * @param id ID do item
   * @param itemData Dados atualizados
   * @returns Item atualizado
   */
  update: async (id: string, itemData: UpdateItemDto): Promise<Item> => {
    const response = await api.patch<Item>(`/items/${id}`, itemData);
    return response.data;
  },

  /**
   * Remover item
   * @param id ID do item a ser removido
   * @returns void
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  /**
   * Obter itens por doador
   * @param donorId ID do doador
   * @param pageOptions Opções de paginação
   * @returns Lista paginada de itens
   */
  getByDonor: async (
    donorId: string,
    pageOptions?: PageOptionsDto
  ): Promise<ItemsApiResponse> => {
    try {
      const response = await api.get<any>(`/items/donor/${donorId}`, {
        params: pageOptions,
      });

      // Retornar os dados brutos para serem processados pelo hook
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar itens por doador:", error);
      throw error;
    }
  },

  /**
   * Obter itens por categoria
   * @param categoryId ID da categoria
   * @param pageOptions Opções de paginação
   * @returns Lista paginada de itens
   */
  getByCategory: async (
    categoryId: string,
    pageOptions?: PageOptionsDto
  ): Promise<ItemsPage> => {
    const response = await api.get<ItemsPage>(`/items/category/${categoryId}`, {
      params: pageOptions,
    });
    return response.data;
  },

  /**
   * Obter itens por status
   * @param status Status dos itens (disponível, reservado, distribuído)
   * @param pageOptions Opções de paginação
   * @returns Lista paginada de itens
   */
  getByStatus: async (
    status: string | null,
    pageOptions?: PageOptionsDto
  ): Promise<ItemsPage> => {

    const uri: string = status ? `/items?status=${status}` : "/items";
    const response= await api.get<HttpResponse<ItemsPage>>(`${uri}`, {
      params: pageOptions,
    });

    return response.data.data;
  },

  /**
   * Upload de fotos para um item
   * @param id ID do item
   * @param files Arquivos de imagem
   * @returns Item atualizado com URLs das fotos
   */
  uploadPhotos: async (id: string, files: FormData): Promise<Item> => {
    const response = await api.post<Item>(`/items/${id}/photos`, files, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Remover foto de um item
   * @param id ID do item
   * @param photoUrl URL da foto a ser removida
   * @returns Item atualizado sem a foto removida
   */
  removePhoto: async (id: string, photoUrl: string): Promise<Item> => {
    const response = await api.delete<Item>(`/items/${id}/photos`, {
      data: { photoUrl },
    });
    return response.data;
  },

  requestItem: async (id: string, userId: string): Promise<Item> => {
      const response = await api.post<HttpResponse<Item>>(`/items/request-item/${id}/${userId}`, {});
      return response.data.data;
  }
};

export default ItemsService;
