'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { proveedoresService } from '@/services/entities.service';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NuevoProveedorPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		codCia: 1,
		codProveedor: 0,
		nroRuc: '',
		desPersona: '',
		desCorta: '',
		vigente: 'S',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validaciones
			if (!formData.nroRuc || formData.nroRuc.length !== 11) {
				toast.error('El RUC debe tener 11 dígitos');
				return;
			}

			if (!formData.desPersona.trim()) {
				toast.error('La razón social es obligatoria');
				return;
			}

			if (!formData.desCorta.trim()) {
				toast.error('El nombre corto es obligatorio');
				return;
			}

			// Preparar datos para enviar
			const proveedorData = {
				codCia: formData.codCia,
				codProveedor: formData.codProveedor || Date.now(), // Generar código si no se proporciona
				desPersona: formData.desPersona,
				desCorta: formData.desCorta,
				nroRuc: formData.nroRuc,
				vigente: formData.vigente,
			};

			await proveedoresService.create(proveedorData);

			toast.success('Proveedor creado exitosamente');
			router.push('/proveedores');
		} catch (error: any) {
			console.error('Error al crear proveedor:', error);
			toast.error(error.message || 'Error al crear el proveedor');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Nuevo Proveedor</h1>
					<p className="text-muted-foreground">
						Registra un nuevo proveedor en el sistema
					</p>
				</div>
				<Link href="/proveedores">
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Datos del Proveedor</CardTitle>
					<CardDescription>
						Completa la información del proveedor
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="nroRuc">RUC *</Label>
								<Input
									id="nroRuc"
									placeholder="20123456789"
									value={formData.nroRuc}
									onChange={(e) =>
										setFormData({ ...formData, nroRuc: e.target.value })
									}
									maxLength={11}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="vigente">Estado *</Label>
								<Select
									value={formData.vigente}
									onValueChange={(value) =>
										setFormData({ ...formData, vigente: value })
									}
								>
									<SelectTrigger id="vigente">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="S">Activo</SelectItem>
										<SelectItem value="N">Inactivo</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="desPersona">Razón Social *</Label>
								<Input
									id="desPersona"
									placeholder="Nombre completo del proveedor"
									value={formData.desPersona}
									onChange={(e) =>
										setFormData({ ...formData, desPersona: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="desCorta">Nombre Corto</Label>
								<Input
									id="desCorta"
									placeholder="Nombre abreviado"
									value={formData.desCorta}
									onChange={(e) =>
										setFormData({ ...formData, desCorta: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="flex gap-2 justify-end pt-4">
							<Link href="/proveedores">
								<Button type="button" variant="outline">
									Cancelar
								</Button>
							</Link>
							<Button type="submit" disabled={loading}>
								<Save className="h-4 w-4 mr-2" />
								{loading ? 'Guardando...' : 'Guardar Proveedor'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
