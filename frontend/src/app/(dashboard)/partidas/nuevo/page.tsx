'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { partidasService } from '@/services/entities.service';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NuevaPartidaPage() {
	const router = useRouter();
	const companiaActual = useAppStore((state) => state.companiaActual);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		codCia: companiaActual?.codCia || 1,
		ingEgr: 'E',
		codPartida: 0,
		codPartidas: '',
		desPartida: '',
		nivel: 1,
		tUniMed: '001',
		eUniMed: 'UND',
		flgCC: 'N',
		vigente: 'S',
	});

	useEffect(() => {
		if (companiaActual?.codCia) {
			setFormData(prev => ({
				...prev,
				codCia: companiaActual.codCia,
			}));
		}
	}, [companiaActual]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validaciones
			if (!formData.desPartida.trim()) {
				toast.error('La descripción de la partida es obligatoria');
				return;
			}

			if (!formData.codPartidas.trim()) {
				toast.error('El código de partida es obligatorio');
				return;
			}

			// Preparar datos para enviar
			const partidaData = {
				codCia: formData.codCia,
				ingEgr: formData.ingEgr,
				codPartida: formData.codPartida || Date.now(), // Generar código si no se proporciona
				codPartidas: formData.codPartidas,
				desPartida: formData.desPartida,
				nivel: formData.nivel,
				tUniMed: formData.tUniMed,
				eUniMed: formData.eUniMed,
				flgCC: formData.flgCC,
				vigente: formData.vigente,
				semilla: 1,
			};

			await partidasService.create(partidaData);

			toast.success('Partida creada exitosamente');
			router.push('/partidas');
		} catch (error: any) {
			console.error('Error al crear partida:', error);
			toast.error(error.message || 'Error al crear la partida');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Nueva Partida</h1>
					<p className="text-muted-foreground">
						Registra una nueva partida presupuestal en el sistema
					</p>
				</div>
				<Link href="/partidas">
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
			</div>

			{/* Formulario */}
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					{/* Información Básica */}
					<Card>
						<CardHeader>
							<CardTitle>Información Básica</CardTitle>
							<CardDescription>
								Datos principales de la partida presupuestal
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								{/* Tipo */}
								<div className="space-y-2">
									<Label htmlFor="ingEgr">
										Tipo <span className="text-destructive">*</span>
									</Label>
									<select
										id="ingEgr"
										name="ingEgr"
										className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										value={formData.ingEgr}
										onChange={handleChange}
										required
									>
										<option value="E">Egreso</option>
										<option value="I">Ingreso</option>
									</select>
								</div>

								{/* Código de Partida */}
								<div className="space-y-2">
									<Label htmlFor="codPartidas">
										Código de Partida <span className="text-destructive">*</span>
									</Label>
									<Input
										id="codPartidas"
										name="codPartidas"
										type="text"
										placeholder="Ej: 01.01.001"
										value={formData.codPartidas}
										onChange={handleChange}
										required
										maxLength={50}
									/>
								</div>

								{/* Descripción */}
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="desPartida">
										Descripción <span className="text-destructive">*</span>
									</Label>
									<Textarea
										id="desPartida"
										name="desPartida"
										placeholder="Descripción completa de la partida"
										value={formData.desPartida}
										onChange={handleChange}
										required
										rows={3}
									/>
								</div>

								{/* Nivel */}
								<div className="space-y-2">
									<Label htmlFor="nivel">
										Nivel Jerárquico <span className="text-destructive">*</span>
									</Label>
									<Input
										id="nivel"
										name="nivel"
										type="number"
										placeholder="1"
										value={formData.nivel}
										onChange={handleChange}
										required
										min="1"
										max="10"
									/>
									<p className="text-xs text-muted-foreground">
										Nivel en la jerarquía de partidas (1-10)
									</p>
								</div>

								{/* Unidad de Medida */}
								<div className="space-y-2">
									<Label htmlFor="eUniMed">
										Unidad de Medida <span className="text-destructive">*</span>
									</Label>
									<select
										id="eUniMed"
										name="eUniMed"
										className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										value={formData.eUniMed}
										onChange={handleChange}
										required
									>
										<option value="UND">Unidad</option>
										<option value="M2">Metro Cuadrado</option>
										<option value="M3">Metro Cúbico</option>
										<option value="ML">Metro Lineal</option>
										<option value="KG">Kilogramo</option>
										<option value="GLB">Global</option>
										<option value="HR">Hora</option>
										<option value="DIA">Día</option>
										<option value="MES">Mes</option>
									</select>
								</div>

								{/* Centro de Costo */}
								<div className="space-y-2">
									<Label htmlFor="flgCC">Centro de Costo</Label>
									<select
										id="flgCC"
										name="flgCC"
										className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										value={formData.flgCC}
										onChange={handleChange}
									>
										<option value="N">No</option>
										<option value="S">Sí</option>
									</select>
								</div>

								{/* Estado */}
								<div className="space-y-2">
									<Label htmlFor="vigente">Estado</Label>
									<select
										id="vigente"
										name="vigente"
										className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										value={formData.vigente}
										onChange={handleChange}
									>
										<option value="S">Activo</option>
										<option value="N">Inactivo</option>
									</select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Botones */}
					<div className="flex justify-end gap-4">
						<Link href="/partidas">
							<Button type="button" variant="outline">
								Cancelar
							</Button>
						</Link>
						<Button type="submit" disabled={loading}>
							<Save className="mr-2 h-4 w-4" />
							{loading ? 'Guardando...' : 'Guardar Partida'}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
