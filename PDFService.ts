import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Payment, Employee, Expense } from './types';

export const generateStateReport = (
    payments: Payment[],
    employees: Employee[],
    expenses: Expense[],
    month: number,
    year: number,
    monthName: string
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header - Tropical Theme (Teal/Sea colors)
    doc.setFillColor(0, 105, 148); // Tropical Sea color
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AlohaFunds - Reporte Mensual', 15, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Periodo: ${monthName} ${year}`, 15, 33);

    // Summary Logic
    const monthPayments = payments.filter(p => p.mes === month && p.anio === year && p.confirmado);
    const totalCollected = monthPayments.reduce((acc, p) => acc + p.monto_pagado, 0);
    const resortFund = monthPayments.reduce((acc, curr) => acc + Math.max(0, curr.monto_pagado - 3), 0);
    const birthdayFund = monthPayments.reduce((acc, curr) => acc + 3, 0);
    const totalExpenses = expenses.filter(e => e.mes === month && e.anio === year).reduce((acc, e) => acc + e.monto, 0);

    // Summary Table
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Resumen del Mes', 15, 55);

    const summaryData = [
        ['Total Recaudado', `$${totalCollected.toFixed(2)}`],
        ['Aporte Fondo Resort', `$${resortFund.toFixed(2)}`],
        ['Aporte Fondo Cumpleaños', `$${birthdayFund.toFixed(2)}`],
        ['Gastos Registrados', `$${totalExpenses.toFixed(2)}`],
        ['Saldo Neto del Mes', `$${(totalCollected - totalExpenses).toFixed(2)}`]
    ];

    autoTable(doc, {
        startY: 60,
        head: [['Concepto', 'Monto']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [0, 121, 107] }, // Tropical Teal
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
    });

    // Payments Detail Table
    // @ts-ignore
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Detalle de Pagos Recibidos', 15, finalY);

    const paymentsData = monthPayments.map(p => {
        const emp = employees.find(e => e.id === p.empleado_id);
        return [
            emp?.nombre || 'Desconocido',
            p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : 'N/A',
            `$${p.monto_pagado.toFixed(2)}`
        ];
    });

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Colaborador', 'Fecha de Pago', 'Monto']],
        body: paymentsData.length > 0 ? paymentsData : [['Sin pagos registrados', '', '']],
        headStyles: { fillColor: [244, 143, 177] }, // Rosa Cumpleaños
        columnStyles: { 2: { halign: 'right' } }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generado automáticamente el ${dateStr}`, 15, doc.internal.pageSize.height - 10);

    // Robust Save mechanism to avoid UUID naming issues
    const fileName = `AlohaFunds_Reporte_${monthName}_${year}.pdf`;
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
};
