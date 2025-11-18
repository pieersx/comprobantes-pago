import { NextResponse } from 'next/server';

import { apiService } from '@/lib/api/client';

export async function GET() {
  const healthCheck: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Frontend - Sistema de Comprobantes',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  };

  try {
    // Verificar conectividad con el backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      try {
        const backendResponse = await apiService.get<Record<string, any>>('/health');
        healthCheck.backend = {
          status: 'OK',
          url: backendUrl,
          details: backendResponse,
        };
      } catch (backendError) {
        healthCheck.backend = {
          status: 'ERROR',
          url: backendUrl,
          error:
            backendError instanceof Error ? backendError.message : 'Unknown backend error',
        };
      }
    }

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ...healthCheck,
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
