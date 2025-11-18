'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Partida } from '@/types/database';
import { useQuery } from '@tanstack/react-query';
import { ListTree, Loader2, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PartidasPage() {
	const [searchTerm, setSearchTerm] = useState('');

	const { data: partidas = [], isLoading, error, refetch } = useQuery({
		queryKey: ['partidas'],
		queryFn: async (): Promise<Partida[]> => {
			const response = await fetch('http://localhost:8080/api/v1/partidas?codCia=1');
			if (!response.ok) throw new Error('Error al cargar partidas');
			const data = await response.json();
			return Array.isArray(data) ? data : [];
		},
		refetchOnWindowFocus: false,
	});

	const filteredPartidas = partidas.filter(
		(partida) =>
			partida.desPartida?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			partida.codPartidas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(partida.codPartida).includes(searchTerm)
	);

	const stats = {
		total: partidas.length,
		ingresos: partidas.filter((p) => p.ingEgr === 'I').length,
		egresos: partidas.filter((p) => p.ingEgr === 'E').length,
		activas: partidas.filter((p) => p.vigente === 'S').length,
	};

	if (isLoading) {
		return (
			<div className="flex h-[450px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<Card className="p-8">
				<div className="text-center">
					<p className="text-red-600 mb-4">Error al cargar partidas. Verifica que el backend esté corriendo.</p>
					<Button onClick={() => refetch()}>Reintentar</Button>
				</div>
			</Card>
		);
	}

	const getTipoColor = (ingEgr: string) => {
		return ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
	};

	const getTipoIcon = (ingEgr: string) => {
		return ingEgr === 'I' ? TrendingUp : TrendingDown;
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Partidas Presupuestales</h1>
					<p className="text-muted-foreground">
						Gestión de partidas contables - Ingresos y Egresos
					</p>
				</div>
				<Button asChild>
					<Link href="/partidas/nuevo">
						<Plus className="h-4 w-4 mr-2" />
						Nueva Partida
					</Link>
				</Button>
			</div>

			{/* Estadísticas */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Partidas</CardTitle>
						<ListTree className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Ingresos</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{stats.ingresos}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Egresos</CardTitle>
						<TrendingDown className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{stats.egresos}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Activas</CardTitle>
						<div className="h-2 w-2 rounded-full bg-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.activas}</div>
					</CardContent>
				</Card>
			</div>

			{/* Búsqueda */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Buscar por código o descripción..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Tabla de Partidas */}
			<Card>
				<CardContent className="p-0">
					{partidas.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<ListTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p className="text-lg font-medium">No hay partidas registradas</p>
							<p className="text-sm">Las partidas aparecerán aquí cuando se registren en el sistema</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tipo</TableHead>
									<TableHead>Código</TableHead>
									<TableHead>Código Partida</TableHead>
									<TableHead>Descripción</TableHead>
									<TableHead>Unidad Medida</TableHead>
									<TableHead>Nivel</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
								<TableBody>
									{filteredPartidas.map((partida) => {
									const TipoIcon = getTipoIcon(partida.ingEgr);
									return (
										<TableRow key={`${partida.codCia}-${partida.ingEgr}-${partida.codPartida}`}>
											<TableCell>
												<Badge className={getTipoColor(partida.ingEgr)}>
													<TipoIcon className="h-3 w-3 mr-1" />
													{partida.ingEgr === 'I' ? 'Ingreso' : 'Egreso'}
												</Badge>
											</TableCell>
											<TableCell className="font-mono font-medium">
												{partida.codPartida}
											</TableCell>
											<TableCell className="font-mono text-sm">
												{partida.codPartidas}
											</TableCell>
											<TableCell className="font-medium">
												{partida.desPartida}
											</TableCell>
												<TableCell>
													<Badge variant="outline">
														{partida.euniMed || partida.tuniMed}
													</Badge>
												</TableCell>
											<TableCell>{partida.nivel}</TableCell>
											<TableCell>
												<Badge variant={partida.vigente === 'S' ? 'default' : 'secondary'}>
													{partida.vigente === 'S' ? 'Activa' : 'Inactiva'}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link href={`/partidas/${partida.codCia}-${partida.ingEgr}-${partida.codPartida}`}>
														Ver Detalle
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{filteredPartidas.length === 0 && partidas.length > 0 && (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						No se encontraron partidas que coincidan con la búsqueda
					</CardContent>
				</Card>
			)}
		</div>
	);
}
