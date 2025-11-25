import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ComprobanteData {
  nroCp: string;
  fecCp: string;
  desCp: string;
  codEstado: string;
  codProveedor?: number;
  codCliente?: number;
  desProveedor?: string;
  desCliente?: string;
  codProyecto?: number;
  desProyecto?: string;
  codMoneda?: string;
  partidas?: Array<{
    numSec: number;
    codPartida: string;
    desPartida: string;
    impNetMn: number;
    impIgvMn: number;
    impTotMn: number;
  }>;
  impSubTotMn?: number;
  impIgvMn?: number;
  monTotal: number;
  tipo?: 'ingreso' | 'egreso';
}

/**
 * Genera un PDF profesional del comprobante
 */
export const generarComprobantePDF = (comprobante: ComprobanteData) => {
  // Crear documento PDF en formato A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Colores corporativos
  const primaryColor: [number, number, number] = [37, 99, 235]; // Azul
  const textColor: [number, number, number] = [51, 51, 51]; // Gris oscuro
  const lightGray: [number, number, number] = [240, 240, 240];

  // === ENCABEZADO ===
  // Rectángulo superior con color corporativo
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Logo/Nombre de la empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSANDINA', margin, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión de Comprobantes', margin, 28);
  doc.text('RUC: 20123456789', margin, 34);

  // Tipo de documento en el encabezado
  const tipoDoc = comprobante.tipo === 'ingreso' ? 'COMPROBANTE DE INGRESO' : 'COMPROBANTE DE EGRESO';
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const tipoWidth = doc.getTextWidth(tipoDoc);
  doc.text(tipoDoc, pageWidth - margin - tipoWidth, 25);

  // === BADGE DE ESTADO ===
  let estadoText = 'REGISTRADO';
  let estadoColor: [number, number, number] = [156, 163, 175]; // Gris

  if (comprobante.codEstado === 'PAG') {
    estadoText = 'PAGADO';
    estadoColor = [34, 197, 94]; // Verde
  } else if (comprobante.codEstado === 'ANU') {
    estadoText = 'ANULADO';
    estadoColor = [239, 68, 68]; // Rojo
  }

  const badgeWidth = 35;
  const badgeHeight = 8;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = 30;

  doc.setFillColor(estadoColor[0], estadoColor[1], estadoColor[2]);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const estadoTextWidth = doc.getTextWidth(estadoText);
  doc.text(estadoText, badgeX + (badgeWidth - estadoTextWidth) / 2, badgeY + 5.5);

  // === INFORMACIÓN GENERAL ===
  let yPos = 50;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN GENERAL', margin, yPos);

  yPos += 8;
  const infoBoxHeight = 50;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, infoBoxHeight, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Columna izquierda
  doc.text('Número:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(comprobante.nroCp, margin + 30, yPos);

  // Columna derecha
  doc.setFont('helvetica', 'bold');
  doc.text('Moneda:', pageWidth / 2 + 10, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(comprobante.codMoneda || 'MN', pageWidth / 2 + 35, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  const fecha = new Date(comprobante.fecCp).toLocaleDateString('es-PE');
  doc.text(fecha, margin + 30, yPos);

  // Proyecto en columna derecha
  if (comprobante.desProyecto || comprobante.codProyecto) {
    doc.setFont('helvetica', 'bold');
    doc.text('Proyecto:', pageWidth / 2 + 10, yPos);
    doc.setFont('helvetica', 'normal');
    const proyectoText = comprobante.desProyecto || `Proyecto ${comprobante.codProyecto}`;
    doc.text(proyectoText, pageWidth / 2 + 35, yPos);
  }

  yPos += 7;
  // Proveedor o Cliente
  if (comprobante.tipo === 'egreso' && (comprobante.desProveedor || comprobante.codProveedor)) {
    doc.setFont('helvetica', 'bold');
    doc.text('Proveedor:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    const proveedorText = comprobante.desProveedor
      ? `${comprobante.desProveedor} (${comprobante.codProveedor})`
      : `Proveedor ${comprobante.codProveedor}`;
    doc.text(proveedorText, margin + 30, yPos);
  } else if (comprobante.tipo === 'ingreso' && (comprobante.desCliente || comprobante.codCliente)) {
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    const clienteText = comprobante.desCliente
      ? `${comprobante.desCliente} (${comprobante.codCliente})`
      : `Cliente ${comprobante.codCliente}`;
    doc.text(clienteText, margin + 30, yPos);
  }

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  const descripcionLines = doc.splitTextToSize(comprobante.desCp || '-', pageWidth - 2 * margin - 35);
  doc.text(descripcionLines, margin + 30, yPos);
  yPos += Math.max((descripcionLines.length - 1) * 5, 0);

  // === TABLA DE PARTIDAS ===
  yPos += 15;

  if (comprobante.partidas && comprobante.partidas.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE PARTIDAS', margin, yPos);
    yPos += 5;

    // Preparar datos de la tabla con todas las columnas
    const tableData = comprobante.partidas.map((partida, index) => {
      const partidaDesc = partida.desPartida
        ? `Partida ${partida.codPartida || ''}`
        : `Partida ${partida.codPartida || index + 1}`;

      return [
        (partida.numSec || index + 1).toString(),
        partidaDesc,
        `S/ ${(partida.impNetMn || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `S/ ${(partida.impIgvMn || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `S/ ${(partida.impTotMn || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Sec', 'Partida', 'Importe Neto', 'IGV', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textColor,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 70 },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
      margin: { left: margin, right: margin },
    });

    // @ts-ignore - autoTable modifica lastAutoTable
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // === TOTALES DETALLADOS ===
  const totalesBoxWidth = 70;
  const totalesBoxX = pageWidth - margin - totalesBoxWidth;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('TOTALES', totalesBoxX, yPos);

  yPos += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(totalesBoxX, yPos, pageWidth - margin, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Subtotal
  doc.text('Subtotal:', totalesBoxX, yPos);
  const subtotal = `S/ ${(comprobante.impSubTotMn || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const subtotalWidth = doc.getTextWidth(subtotal);
  doc.text(subtotal, pageWidth - margin - subtotalWidth, yPos);

  yPos += 7;
  // IGV
  doc.text('IGV:', totalesBoxX, yPos);
  const igv = `S/ ${(comprobante.impIgvMn || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const igvWidth = doc.getTextWidth(igv);
  doc.text(igv, pageWidth - margin - igvWidth, yPos);

  yPos += 2;
  doc.line(totalesBoxX, yPos, pageWidth - margin, yPos);

  yPos += 7;
  // Total General
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  const totalBoxHeight = 10;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(totalesBoxX, yPos - 5, totalesBoxWidth, totalBoxHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL:', totalesBoxX + 2, yPos);

  const totalFormatted = `S/ ${(comprobante.monTotal || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const totalWidth = doc.getTextWidth(totalFormatted);
  doc.text(totalFormatted, pageWidth - margin - totalWidth - 2, yPos);

  // === PIE DE PÁGINA ===
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.setFont('helvetica', 'normal');

  const footerY = pageHeight - 15;
  doc.text('Documento generado electrónicamente', margin, footerY);
  doc.text(`Fecha de generación: ${new Date().toLocaleString('es-PE')}`, margin, footerY + 4);

  // Número de página
  doc.text(`Página 1 de 1`, pageWidth - margin - 20, footerY);

  // Línea decorativa
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  // === GUARDAR PDF ===
  const nombreArchivo = `Comprobante-${comprobante.nroCp}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nombreArchivo);
};

/**
 * Servicio de generación de PDFs
 */
export const pdfGeneratorService = {
  generarComprobantePDF,
};
