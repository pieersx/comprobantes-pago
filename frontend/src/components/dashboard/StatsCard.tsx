import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
 title: string;
 value: string | number;
 icon: LucideIcon;
 description?: string;
 trend?: {
 value: number;
 isPositive: boolean;
 };
 className?: string;
 alertas?: {
 count: number;
 link: string;
 };
}

export function StatsCard({
 title,
 value,
 icon: Icon,
 description,
 trend,
 className,
 alertas,
}: StatsCardProps) {
 const cardContent = (
 <>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">{title}</CardTitle>
 <div className="flex items-center gap-2">
 {alertas && alertas.count > 0 && (
 <Badge variant="destructive" className="h-5 px-1.5 text-xs">
 {alertas.count}
 </Badge>
 )}
 <Icon className="h-4 w-4 text-muted-foreground" />
 </div>
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{value}</div>
 {description && (
 <p className="text-xs text-muted-foreground mt-1">{description}</p>
 )}
 {trend && (
 <p
 className={`text-xs mt-1 ${
 trend.isPositive ? 'text-green-600' : 'text-red-600'
 }`}
 >
 {trend.isPositive ? '+' : ''}
 {trend.value}% vs mes anterior
 </p>
 )}
 {alertas && alertas.count > 0 && (
 <p className="text-xs text-orange-600 mt-1 font-medium">
 {alertas.count} {alertas.count === 1 ? 'partida' : 'partidas'} con alerta
 </p>
 )}
 </CardContent>
 </>
 );

 if (alertas && alertas.count > 0) {
 return (
 <Link href={alertas.link} className="block">
 <Card className={`${className} hover:shadow-lg transition-shadow cursor-pointer`}>
 {cardContent}
 </Card>
 </Link>
 );
 }

 return (
 <Card className={className}>
 {cardContent}
 </Card>
 );
}
