"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Building2,
 User,
 Bell,
 Shield,
 Database,
 Palette,
 Globe,
 Save,
} from "lucide-react";

export default function ConfiguracionPage() {
 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-foreground">
 Configuración
 </h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Administra la configuración del sistema
 </p>
 </div>
 <Button>
 <Save className="h-4 w-4" />
 Guardar Cambios
 </Button>
 </div>

 <div className="grid gap-6 lg:grid-cols-2">
 {/* Información de la Empresa */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <Building2 className="h-5 w-5 text-blue-600" />
 <CardTitle>Información de la Empresa</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700">
 Razón Social
 </label>
 <Input
 placeholder="Nombre de la empresa"
 defaultValue="Constructora XYZ SAC"
 className="mt-1"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 RUC
 </label>
 <Input
 placeholder="20123456789"
 defaultValue="20123456789"
 className="mt-1"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Dirección
 </label>
 <Input
 placeholder="Dirección fiscal"
 defaultValue="Av. Principal 123, Lima"
 className="mt-1"
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-gray-700">
  Teléfono
 </label>
 <Input
  placeholder="+51 987 654 321"
  defaultValue="+51 987 654 321"
  className="mt-1"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
  Email
 </label>
 <Input
  type="email"
  placeholder="contacto@empresa.com"
  defaultValue="contacto@empresa.com"
  className="mt-1"
 />
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Perfil de Usuario */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <User className="h-5 w-5 text-purple-600" />
 <CardTitle>Perfil de Usuario</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700">
 Nombre Completo
 </label>
 <Input
 placeholder="Juan Pérez"
 defaultValue="Admin User"
 className="mt-1"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Email
 </label>
 <Input
 type="email"
 placeholder="admin@empresa.com"
 defaultValue="admin@empresa.com"
 className="mt-1"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Contraseña Actual
 </label>
 <Input type="password" placeholder="••••••••" className="mt-1" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Nueva Contraseña
 </label>
 <Input type="password" placeholder="••••••••" className="mt-1" />
 </div>
 </CardContent>
 </Card>

 {/* Notificaciones */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <Bell className="h-5 w-5 text-yellow-600" />
 <CardTitle>Notificaciones</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Comprobantes Vencidos
 </p>
 <p className="text-sm text-muted-foreground">
  Recibir alertas de comprobantes vencidos
 </p>
 </div>
 <input
 type="checkbox"
 defaultChecked
 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
 />
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Nuevos Proyectos
 </p>
 <p className="text-sm text-muted-foreground">
  Notificar cuando se crea un nuevo proyecto
 </p>
 </div>
 <input
 type="checkbox"
 defaultChecked
 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
 />
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Pagos Pendientes
 </p>
 <p className="text-sm text-muted-foreground">
  Alertas de pagos pendientes por aprobar
 </p>
 </div>
 <input
 type="checkbox"
 defaultChecked
 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
 />
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Resumen Diario
 </p>
 <p className="text-sm text-muted-foreground">
  Recibir resumen diario por email
 </p>
 </div>
 <input
 type="checkbox"
 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
 />
 </div>
 </CardContent>
 </Card>

 {/* Seguridad */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <Shield className="h-5 w-5 text-green-600" />
 <CardTitle>Seguridad</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Autenticación de Dos Factores
 </p>
 <p className="text-sm text-muted-foreground">
  Añade una capa extra de seguridad
 </p>
 </div>
 <input
 type="checkbox"
 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
 />
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Sesiones Activas
 </p>
 <p className="text-sm text-muted-foreground">
  2 dispositivos conectados
 </p>
 </div>
 <Button variant="outline" size="sm">
 Ver Sesiones
 </Button>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium text-foreground">
  Registro de Actividad
 </p>
 <p className="text-sm text-muted-foreground">
  Historial de acciones del usuario
 </p>
 </div>
 <Button variant="outline" size="sm">
 Ver Registro
 </Button>
 </div>
 </CardContent>
 </Card>

 {/* Base de Datos */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <Database className="h-5 w-5 text-orange-600" />
 <CardTitle>Base de Datos</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="rounded-lg bg-blue-50 p-4">
 <p className="text-sm font-medium text-blue-900">
 Estado de Conexión
 </p>
 <p className="mt-1 text-xs text-blue-700">
 Conectado a Oracle Database
 </p>
 </div>
 <div className="space-y-2">
 <Button variant="outline" className="w-full">
 Respaldar Base de Datos
 </Button>
 <Button variant="outline" className="w-full">
 Restaurar Respaldo
 </Button>
 <Button variant="outline" className="w-full text-red-600">
 Limpiar Caché
 </Button>
 </div>
 </CardContent>
 </Card>

 {/* Apariencia */}
 <Card>
 <CardHeader>
 <div className="flex items-center gap-2">
 <Palette className="h-5 w-5 text-pink-600" />
 <CardTitle>Apariencia</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700">
 Tema
 </label>
 <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
 <option>Sistema</option>
 <option>Claro</option>
 <option>Oscuro</option>
 </select>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Idioma
 </label>
 <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
 <option>Español</option>
 <option>English</option>
 </select>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700">
 Zona Horaria
 </label>
 <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
 <option>América/Lima (GMT-5)</option>
 <option>América/Bogotá (GMT-5)</option>
 <option>América/México (GMT-6)</option>
 </select>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 );
}
