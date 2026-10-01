import PDFDocument from 'pdfkit';

/**
 * BIYA FASHION - PDF Generation Service
 * Generates:
 * 1. Official Branded Tax Invoice
 * 2. Standard Courier Shipping Label with Barcode & Routing
 */

// Helper to draw clean vector barcode
const drawBarcode = (doc, x, y, width, height, text) => {
  doc.save();
  const seed = (text || 'BFA-2026').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let currentX = x;
  const barWidth = 2.5;
  const numBars = Math.floor(width / (barWidth * 1.6));

  for (let i = 0; i < numBars; i++) {
    // Generate pseudo-random bar widths based on char code
    const isThick = ((seed * (i + 13)) % 7) > 3;
    const w = isThick ? barWidth * 1.8 : barWidth * 0.9;
    
    if (i % 2 === 0) {
      doc.rect(currentX, y, w, height).fill('#111111');
    }
    currentX += w + 1.2;
    if (currentX > x + width - 10) break;
  }

  doc.restore();
  // Barcode text underneath
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#111111')
    .text(`* ${text} *`, x, y + height + 4, { width, align: 'center' });
};

/**
 * Generate Professional Tax Invoice PDF
 */
export const generateInvoicePDF = (order, stream) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(stream);

  const brandGreen = '#064C32';
  const brandDarkGreen = '#033B27';
  const brandGold = '#D9A514';
  const darkText = '#111111';
  const mutedText = '#555555';

  // 1. Header Banner
  doc.rect(0, 0, 595.28, 90).fill(brandDarkGreen);

  // Crown & Brand Typography
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold')
    .text('BIYA FASHION', 40, 25);
  doc.fillColor(brandGold).fontSize(9).font('Helvetica-Bold')
    .text('WEAR YOUR STYLE  |  PREMIUM TEXTILE APPAREL', 40, 52);

  doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold')
    .text('TAX INVOICE', 380, 25, { align: 'right', width: 175 });
  doc.fillColor('#E5E5E5').fontSize(9).font('Helvetica')
    .text(`ORIGINAL FOR RECIPIENT`, 380, 48, { align: 'right', width: 175 });

  // Gold separator line
  doc.rect(0, 90, 595.28, 4).fill(brandGold);

  // 2. Invoice Meta & Seller Info
  let y = 110;
  doc.fillColor(darkText).fontSize(10).font('Helvetica-Bold').text('SOLD BY (SELLER):', 40, y);
  doc.fontSize(9).font('Helvetica').fillColor(mutedText);
  doc.text('BIYA FASHION', 40, y + 16);
  doc.text('Pandiyan Nagar, Karaiyapatti', 40, y + 29);
  doc.text('Virudhunagar, Tamil Nadu - 626106', 40, y + 42);
  doc.text('Helpline: +91 96556 25186  |  biyasfashion02@gmail.com', 40, y + 55);

  // Invoice specifics (Right side)
  doc.fillColor(darkText).fontSize(10).font('Helvetica-Bold').text('INVOICE DETAILS:', 360, y);
  doc.fontSize(9).font('Helvetica').fillColor(mutedText);
  doc.text(`Invoice No: INV-${order.id}`, 360, y + 16);
  doc.text(`Order ID: ${order.id}`, 360, y + 29);
  doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 360, y + 42);
  doc.text(`Payment Mode: ${order.paymentMethod || 'Cash on Delivery'}`, 360, y + 55);

  // Divider
  doc.moveTo(40, y + 78).lineTo(555, y + 78).strokeColor('#E5E5E5').lineWidth(1).stroke();

  // 3. Customer Billing & Shipping
  y = 205;
  doc.fillColor(darkText).fontSize(10).font('Helvetica-Bold').text('BILL TO / SHIP TO (CUSTOMER):', 40, y);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(darkText).text(order.customer?.name || 'Valued Customer', 40, y + 15);
  doc.fontSize(9).font('Helvetica').fillColor(mutedText);
  doc.text(order.customer?.address || 'Delivery Address', 40, y + 28, { width: 300 });
  doc.text(`${order.customer?.city || ''}, ${order.customer?.state || ''} - ${order.customer?.pincode || ''}`, 40, y + 42);
  doc.text(`Mobile: ${order.customer?.phone || 'N/A'}  |  Email: ${order.customer?.email || 'N/A'}`, 40, y + 55);

  // Order Status Badge
  doc.rect(430, y + 10, 125, 24).fill(order.status === 'Delivered' ? '#e6f4ea' : '#e8f0fe');
  doc.fillColor(brandGreen).fontSize(10).font('Helvetica-Bold')
    .text(`STATUS: ${(order.status || 'CONFIRMED').toUpperCase()}`, 430, y + 17, { width: 125, align: 'center' });

  // 4. Itemized Table Header
  y = 285;
  doc.rect(40, y, 515, 24).fill(brandGreen);
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
  doc.text('#', 50, y + 7);
  doc.text('ITEM DESCRIPTION', 75, y + 7);
  doc.text('SIZE / COLOR', 280, y + 7);
  doc.text('UNIT PRICE', 380, y + 7, { width: 60, align: 'right' });
  doc.text('QTY', 450, y + 7, { width: 30, align: 'center' });
  doc.text('TOTAL', 490, y + 7, { width: 55, align: 'right' });

  // Items rows
  y += 24;
  doc.font('Helvetica').fontSize(9);

  (order.items || []).forEach((item, index) => {
    const isAlt = index % 2 === 1;
    if (isAlt) {
      doc.rect(40, y, 515, 22).fill('#F8F8F8');
    }

    doc.fillColor(darkText);
    doc.text(String(index + 1), 50, y + 6);
    doc.text(item.name, 75, y + 6, { width: 195, lineBreak: false });
    doc.text(`${item.selectedSize || 'M'} / ${item.selectedColor || 'Standard'}`, 280, y + 6);
    doc.text(`INR ${item.price}`, 380, y + 6, { width: 60, align: 'right' });
    doc.text(String(item.quantity), 450, y + 6, { width: 30, align: 'center' });
    doc.text(`INR ${item.price * item.quantity}`, 490, y + 6, { width: 55, align: 'right' });

    y += 22;
  });

  // Table bottom border
  doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor('#E5E5E5').lineWidth(1).stroke();

  // 5. Financial Summary
  y += 15;
  const summaryX = 350;
  doc.fontSize(9).font('Helvetica').fillColor(mutedText);

  doc.text('Subtotal (MRP):', summaryX, y);
  doc.text(`INR ${order.subtotal?.toLocaleString('en-IN') || 0}`, 465, y, { width: 80, align: 'right' });

  y += 15;
  doc.text('Shipping & Delivery Fee:', summaryX, y);
  doc.text(order.deliveryFee === 0 ? 'FREE' : `INR ${order.deliveryFee}`, 465, y, { width: 80, align: 'right' });

  y += 15;
  doc.text('Estimated GST / Tax (Included):', summaryX, y);
  doc.text(`INR ${Math.round((order.total || 0) * 0.05)}`, 465, y, { width: 80, align: 'right' });

  y += 20;
  // Total Highlight Box
  doc.rect(summaryX - 10, y - 5, 215, 28).fill(brandDarkGreen);
  doc.fillColor(brandGold).fontSize(11).font('Helvetica-Bold').text('TOTAL AMOUNT:', summaryX, y + 3);
  doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold')
    .text(`INR ${order.total?.toLocaleString('en-IN')}`, 465, y + 3, { width: 80, align: 'right' });

  // 6. Footer Terms & Stamp
  y = 660;
  doc.rect(40, y, 515, 80).strokeColor('#E5E5E5').lineWidth(1).stroke();

  doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text('TERMS & CONDITIONS:', 50, y + 10);
  doc.fontSize(8).font('Helvetica').fillColor(mutedText);
  doc.text('1. 7-Day return and exchange valid from delivery date with original tags attached.', 50, y + 25);
  doc.text('2. Computer-generated tax invoice. No physical signature required.', 50, y + 38);
  doc.text('3. Wear Your Style - Authentic BIYA FASHION Certified Textile Guarantee.', 50, y + 51);

  // Authorized Signature Box
  doc.fontSize(9).font('Helvetica-Bold').fillColor(darkText).text('For BIYA FASHION', 420, y + 15, { width: 120, align: 'center' });
  doc.fontSize(8).font('Helvetica').fillColor(brandGreen).text('[ AUTHORIZED ATELIER STAMP ]', 420, y + 45, { width: 120, align: 'center' });

  // Barcode at bottom
  drawBarcode(doc, 40, 755, 200, 25, order.id);

  doc.end();
};

/**
 * Generate Official Courier Shipping Label PDF (Standard 4x6" format: 288 x 432 pt)
 */
export const generateShippingLabelPDF = (order, stream) => {
  // 4x6 inches at 72 points/inch = 288 x 432 points
  const doc = new PDFDocument({ margin: 8, size: [288, 432] });
  doc.pipe(stream);

  const darkText = '#111111';
  const isCOD = (order.paymentMethod || '').toLowerCase().includes('cash');
  const awbNumber = '14908' + String(Math.abs(order.id.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 5381))).slice(0, 11).padEnd(11, '4801');
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB');

  // Outer Box
  doc.rect(8, 8, 272, 416).lineWidth(1.2).strokeColor('#111111').stroke();

  // Top Section (y = 8 to 170)
  // Vertical line at x = 148
  doc.moveTo(148, 8).lineTo(148, 170).lineWidth(1).strokeColor('#111111').stroke();

  // LEFT COLUMN: Customer Address & Return
  doc.fillColor(darkText).fontSize(7.5).font('Helvetica-Bold').text('Customer Address', 12, 12);
  doc.fontSize(10).font('Helvetica-Bold').text(order.customer?.name || 'Customer', 12, 22, { width: 132 });
  doc.fontSize(7.5).font('Helvetica').text(order.customer?.address || '', 12, 34, { width: 132, height: 26 });
  doc.text(`${order.customer?.city || ''}, ${order.customer?.state || ''}, ${order.customer?.pincode || ''}`, 12, 62, { width: 132 });
  doc.text(`TEL: ${order.customer?.phone || 'N/A'}`, 12, 72);

  // Return Divider
  doc.moveTo(12, 84).lineTo(144, 84).lineWidth(0.8).strokeColor('#888888').stroke();

  doc.fillColor(darkText).fontSize(7).font('Helvetica-Bold').text('If undelivered, return to:', 12, 88);
  doc.fontSize(8.5).font('Helvetica-Bold').text('BIYA FASHION', 12, 98);
  doc.fontSize(7).font('Helvetica').text('Pandiyan Nagar, Karaiyapatti', 12, 109);
  doc.text('Virudhunagar, Tamil Nadu, 626106', 12, 119);
  doc.text('Tel: +91 96556 25186', 12, 129);

  // RIGHT COLUMN: COD Banner, Carrier, Routing, Barcode
  doc.rect(148, 8, 132, 16).fill('#222222');
  doc.fillColor('#FFFFFF').fontSize(7).font('Helvetica-Bold')
    .text(isCOD ? 'COD: Check payable amount on app' : 'PREPAID ORDER: DO NOT COLLECT CASH', 149, 12, { width: 130, align: 'center' });

  doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('Delhivery', 154, 28);
  doc.rect(240, 27, 34, 11).strokeColor('#111111').lineWidth(0.8).stroke();
  doc.fillColor(darkText).fontSize(6.5).font('Helvetica-Bold').text('Pickup', 240, 29, { width: 34, align: 'center' });

  doc.fontSize(6.5).font('Helvetica').fillColor('#333333');
  doc.text(`Destination Code: ${(order.customer?.city || 'HUB').toUpperCase()}_PP (${order.customer?.state || 'TN'})`, 154, 43, { width: 122 });
  doc.text('Return Code: 626106,3593013', 154, 53);

  // Barcode & AWB
  drawBarcode(doc, 154, 66, 120, 24, awbNumber);

  // Horizontal line separating Top and Middle
  doc.moveTo(8, 142).lineTo(280, 142).lineWidth(1).strokeColor('#111111').stroke();

  // MIDDLE SECTION: Product Details Table (y = 145 to 195)
  doc.fillColor(darkText).fontSize(7.5).font('Helvetica-Bold').text('Product Details', 12, 145);

  let py = 156;
  doc.rect(12, py, 264, 13).fill('#F0F0F0');
  doc.rect(12, py, 264, 13).strokeColor('#111111').lineWidth(0.8).stroke();
  doc.fillColor(darkText).fontSize(6.5).font('Helvetica-Bold');
  doc.text('SKU', 15, py + 3);
  doc.text('Size', 110, py + 3, { width: 35, align: 'center' });
  doc.text('Qty', 148, py + 3, { width: 20, align: 'center' });
  doc.text('Color', 170, py + 3, { width: 35, align: 'center' });
  doc.text('Order No.', 210, py + 3, { width: 62, align: 'right' });

  py += 13;
  (order.items || []).slice(0, 2).forEach((item) => {
    doc.rect(12, py, 264, 12).strokeColor('#DDDDDD').lineWidth(0.5).stroke();
    doc.fillColor(darkText).fontSize(6.5).font('Helvetica');
    doc.text((item.name || 'APPAREL').slice(0, 18), 15, py + 2, { width: 90 });
    doc.text(item.selectedSize || 'Free', 110, py + 2, { width: 35, align: 'center' });
    doc.text(String(item.quantity || 1), 148, py + 2, { width: 20, align: 'center' });
    doc.text((item.selectedColor || 'NA').slice(0, 8), 170, py + 2, { width: 35, align: 'center' });
    doc.text(`${order.id}_1`, 210, py + 2, { width: 62, align: 'right' });
    py += 12;
  });

  // Horizontal line separating Middle and Bottom Invoice
  doc.moveTo(8, py + 4).lineTo(280, py + 4).lineWidth(1).strokeColor('#111111').stroke();

  // BOTTOM SECTION: TAX INVOICE
  let iy = py + 8;
  doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text('TAX INVOICE', 8, iy, { width: 272, align: 'center' });
  doc.fontSize(6).font('Helvetica').fillColor('#555555').text('Original For Recipient', 200, iy, { width: 72, align: 'right' });

  iy += 12;
  // Bill to & Sold by grid
  doc.fillColor(darkText).fontSize(6.5).font('Helvetica-Bold').text('BILL TO / SHIP TO', 12, iy);
  doc.fontSize(6).font('Helvetica').text(`${order.customer?.name} - ${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}. Place of Supply: ${order.customer?.state || 'Tamil Nadu'}`, 12, iy + 9, { width: 130 });

  doc.fontSize(6.5).font('Helvetica-Bold').text('Sold by: BIYA FASHION', 148, iy);
  doc.fontSize(6).font('Helvetica').text(`Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106\nGSTIN: 33AAACB1234F1Z5\nInv No: INV-${order.id} | Date: ${orderDate}`, 148, iy + 9, { width: 124 });

  iy += 32;
  // Invoice table header
  doc.rect(12, iy, 264, 11).fill('#F0F0F0');
  doc.rect(12, iy, 264, 11).strokeColor('#111111').lineWidth(0.8).stroke();
  doc.fillColor(darkText).fontSize(6).font('Helvetica-Bold');
  doc.text('Description', 14, iy + 2);
  doc.text('HSN', 95, iy + 2, { width: 22, align: 'center' });
  doc.text('Qty', 120, iy + 2, { width: 15, align: 'center' });
  doc.text('Gross', 138, iy + 2, { width: 28, align: 'right' });
  doc.text('Disc', 168, iy + 2, { width: 20, align: 'right' });
  doc.text('Taxable', 190, iy + 2, { width: 28, align: 'right' });
  doc.text('Taxes', 220, iy + 2, { width: 28, align: 'right' });
  doc.text('Total', 250, iy + 2, { width: 24, align: 'right' });

  iy += 11;
  (order.items || []).slice(0, 2).forEach((item) => {
    const gross = item.price * item.quantity;
    const taxable = (gross / 1.05).toFixed(2);
    const tax = (gross - parseFloat(taxable)).toFixed(2);

    doc.fillColor(darkText).fontSize(5.5).font('Helvetica');
    doc.text((item.name || 'Apparel').slice(0, 18), 14, iy + 2, { width: 80 });
    doc.text('610910', 95, iy + 2, { width: 22, align: 'center' });
    doc.text(String(item.quantity || 1), 120, iy + 2, { width: 15, align: 'center' });
    doc.text(`Rs.${gross.toFixed(0)}`, 138, iy + 2, { width: 28, align: 'right' });
    doc.text('Rs.0', 168, iy + 2, { width: 20, align: 'right' });
    doc.text(`Rs.${taxable}`, 190, iy + 2, { width: 28, align: 'right' });
    doc.text(`Rs.${tax}`, 220, iy + 2, { width: 28, align: 'right' });
    doc.font('Helvetica-Bold').text(`Rs.${gross.toFixed(0)}`, 250, iy + 2, { width: 24, align: 'right' });
    iy += 10;
  });

  // Grand Total Line
  doc.moveTo(12, iy + 2).lineTo(276, iy + 2).lineWidth(0.8).strokeColor('#111111').stroke();
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(darkText).text(`Total Amount Payable: Rs.${order.total}`, 14, iy + 5, { width: 260, align: 'right' });

  // Disclaimer footer
  iy += 16;
  doc.fontSize(4.8).font('Helvetica').fillColor('#666666')
    .text('Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature. Other charges are charges that are applicable to your order and include charges for logistics fee (where applicable). Includes discounts for your city and/or for online payments (as applicable).', 12, iy, { width: 264, align: 'justify' });

  doc.end();
};
