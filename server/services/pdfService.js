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
  const doc = new PDFDocument({ margin: 15, size: [288, 432] });
  doc.pipe(stream);

  const brandGreen = '#064C32';
  const brandDarkGreen = '#033B27';
  const darkText = '#111111';

  // 1. Label Outer Border
  doc.rect(10, 10, 268, 412).lineWidth(1.5).strokeColor('#111111').stroke();

  // 2. Shipping Header
  doc.rect(10, 10, 268, 42).fill(brandDarkGreen);
  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold')
    .text('BIYA FASHION LOGISTICS', 15, 18, { width: 258, align: 'center' });
  doc.fillColor('#F3D477').fontSize(8).font('Helvetica-Bold')
    .text('STANDARD EXPEDITED SURFACE DELIVERY', 15, 36, { width: 258, align: 'center' });

  // 3. Routing & Tracking Info Bar
  let y = 57;
  doc.rect(10, y, 268, 24).fill('#F0F0F0');
  doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold');
  doc.text(`HUB: SURAT-W / 395`, 18, y + 6);
  doc.text(`ROUTING: ${order.customer?.pincode ? order.customer.pincode.substring(0, 3) : '400'}-EXP`, 175, y + 6);

  // 4. Main Shipping Barcode
  y = 86;
  drawBarcode(doc, 20, y, 248, 40, order.id);

  // Line Divider
  y = 150;
  doc.moveTo(10, y).lineTo(278, y).lineWidth(1.2).strokeColor('#111111').stroke();

  // 5. SHIP TO (DELIVERY ADDRESS) - BIG & PROMINENT
  y = 156;
  doc.rect(15, y, 258, 120).fill('#FAFAFA').strokeColor('#CCCCCC').lineWidth(0.8).stroke();

  doc.fillColor(brandGreen).fontSize(9).font('Helvetica-Bold').text('SHIP TO (DELIVERY ADDRESS):', 22, y + 6);
  doc.fillColor(darkText).fontSize(12).font('Helvetica-Bold')
    .text(order.customer?.name || 'Customer', 22, y + 20, { width: 240 });

  doc.fontSize(9).font('Helvetica').fillColor('#222222')
    .text(order.customer?.address || '', 22, y + 36, { width: 240, height: 35 });

  doc.fontSize(10).font('Helvetica-Bold').fillColor(darkText)
    .text(`${order.customer?.city || ''}, ${order.customer?.state || ''}`, 22, y + 74);

  // Pincode Highlight
  doc.rect(180, y + 70, 85, 20).fill(brandDarkGreen);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold')
    .text(`PIN: ${order.customer?.pincode || '395002'}`, 180, y + 74, { width: 85, align: 'center' });

  doc.fontSize(9).font('Helvetica-Bold').fillColor(darkText)
    .text(`TEL: ${order.customer?.phone || 'N/A'}`, 22, y + 96);

  // 6. COD / Payment Banner
  y = 283;
  const isCOD = (order.paymentMethod || '').toLowerCase().includes('cash');
  doc.rect(10, y, 268, 32).fill(isCOD ? '#fff3cd' : '#d4edda');
  doc.rect(10, y, 268, 32).strokeColor(isCOD ? '#ffeeba' : '#c3e6cb').lineWidth(1).stroke();

  doc.fillColor(isCOD ? '#856404' : '#155724').fontSize(11).font('Helvetica-Bold');
  if (isCOD) {
    doc.text(`COLLECT CASH ON DELIVERY: INR ${order.total}`, 15, y + 10, { width: 258, align: 'center' });
  } else {
    doc.text(`PREPAID ORDER - DO NOT COLLECT CASH`, 15, y + 10, { width: 258, align: 'center' });
  }

  // 7. Package Details & Return Address
  y = 322;
  doc.fillColor(darkText).fontSize(8).font('Helvetica-Bold').text('RETURN / SENDER ADDRESS:', 18, y);
  doc.fontSize(7.5).font('Helvetica').fillColor('#444444');
  doc.text('BIYA FASHION, Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106', 18, y + 12, { width: 250 });
  doc.text('Email: biyasfashion02@gmail.com | Helpline: +91 96556 25186', 18, y + 23);

  // Bottom Meta Summary
  y = 365;
  doc.moveTo(10, y).lineTo(278, y).lineWidth(1).strokeColor('#111111').stroke();
  doc.fontSize(7.5).font('Helvetica').fillColor('#333333');
  doc.text(`Order ID: ${order.id}`, 18, y + 6);
  doc.text(`Weight: 0.45 KG (Apparel)`, 18, y + 18);
  doc.text(`Pieces: ${order.items?.length || 1} item(s)`, 18, y + 30);

  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 170, y + 6);
  doc.text(`Courier: Priority Cargo`, 170, y + 18);
  doc.font('Helvetica-Bold').text(`AUTHENTIC LABEL`, 170, y + 30);

  doc.end();
};
