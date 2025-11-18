import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Compania, Proyecto } from '@/types/comprobante';

interface AppState {
  // Compañía seleccionada
  companiaActual: Compania | null;
  setCompaniaActual: (compania: Compania | null) => void;

  // Proyecto seleccionado
  proyectoActual: Proyecto | null;
  setProyectoActual: (proyecto: Proyecto | null) => void;

  // Usuario autenticado
  usuario: {
    nombre: string;
    email: string;
    rol: string;
  } | null;
  setUsuario: (usuario: AppState['usuario']) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading global
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado inicial
      companiaActual: null,
      proyectoActual: null,
      usuario: null,
      sidebarOpen: true,
      isLoading: false,

      // Actions
      setCompaniaActual: (compania) => set({ companiaActual: compania }),
      setProyectoActual: (proyecto) => set({ proyectoActual: proyecto }),
      setUsuario: (usuario) => set({ usuario }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setIsLoading: (loading) => set({ isLoading: loading }),
      reset: () =>
        set({
          companiaActual: null,
          proyectoActual: null,
          usuario: null,
          sidebarOpen: true,
          isLoading: false,
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        companiaActual: state.companiaActual,
        proyectoActual: state.proyectoActual,
        usuario: state.usuario,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
