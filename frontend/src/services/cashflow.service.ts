import { apiClient, ApiResponse, handleApiError } from '@/lib/api'
import type { CashflowResponse } from '@/types/cashflow'

interface CashflowFilters {
  fechaInicio?: string
  fechaFin?: string
}

export const cashflowService = {
  async getCompanyCashflow(
    codCia: number,
    filters?: CashflowFilters
  ): Promise<CashflowResponse> {
    try {
      const response = await apiClient.get<ApiResponse<CashflowResponse>>(
        `/cashflow/compania/${codCia}`,
        {
          params: filters,
        }
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
