/**
 * BIYA FASHION - Backend API & Document Download Service
 * 
 * Supports:
 * - Express Backend (http://localhost:5000 / Render production URL)
 * - Firebase Firestore Orders sync
 * - PDF Tax Invoice Download
 * - PDF Shipping Label Download
 * - CSV Orders Export
 * - Seamless client-side printable fallback if backend is offline
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://biya-fashion.onrender.com' : 'http://localhost:5000');

/**
 * Synchronize order to Express & Firebase backend
 */
export const syncOrderToBackend = async (orderPayload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Service] Backend sync skipped:', err.message);
  }
  return null;
};

/**
 * Download Tax Invoice PDF
 */
export const downloadOrderInvoice = async (order) => {
  const orderId = typeof order === 'string' ? order : order.id;

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/invoice`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }
  } catch (err) {
    console.warn('[API Service] Backend invoice endpoint unreachable, using client printable fallback:', err.message);
  }

  // Fallback: Open printable invoice view
  if (typeof order === 'object') {
    printClientInvoice(order);
    return { success: true, mode: 'print' };
  }

  return { success: false };
};

/**
 * Download Courier Shipping Label PDF
 */
export const downloadOrderShippingLabel = async (order) => {
  const orderId = typeof order === 'string' ? order : order.id;

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/shipping-label`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Shipping_Label_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }
  } catch (err) {
    console.warn('[API Service] Backend shipping label unreachable, using client printable fallback:', err.message);
  }

  // Fallback: Open printable shipping label view
  if (typeof order === 'object') {
    printClientShippingLabel(order);
    return { success: true, mode: 'print' };
  }

  return { success: false };
};

/**
 * Download All Orders as CSV
 */
export const exportOrdersAsCSV = async (localOrders = []) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/export/csv`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Biya_Fashion_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }
  } catch (err) {
    console.warn('[API Service] Backend CSV export unreachable, generating from local store:', err.message);
  }

  // Fallback: Client CSV generator
  if (localOrders && localOrders.length > 0) {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'State',
      'Pincode',
      'Items Count',
      'Subtotal (INR)',
      'Delivery Fee',
      'Total Amount (INR)',
      'Payment Method',
      'Status'
    ];

    const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = localOrders.map((o) => [
      escape(o.id),
      escape(new Date(o.createdAt).toLocaleDateString('en-IN')),
      escape(o.customer?.name),
      escape(o.customer?.phone),
      escape(o.customer?.email),
      escape(o.customer?.address),
      escape(o.customer?.city),
      escape(o.customer?.state),
      escape(o.customer?.pincode),
      escape(o.items?.length || 0),
      escape(o.subtotal || 0),
      escape(o.deliveryFee === 0 ? 'FREE' : o.deliveryFee),
      escape(o.total || 0),
      escape(o.paymentMethod),
      escape(o.status)
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\n'));
    const a = document.createElement('a');
    a.href = csvContent;
    a.download = `Biya_Fashion_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return { success: true };
  }

  return { success: false };
};

/**
 * Client-side Printable Tax Invoice Fallback
 */
export const printClientInvoice = (order) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const itemsHtml = (order.items || []).map((item, idx) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: center;">${idx + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">
        <strong>${item.name}</strong><br/>
        <small style="color: #666;">Size: ${item.selectedSize || 'M'} | Color: ${item.selectedColor || 'Std'}</small>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tax Invoice - ${order.id} | BIYA FASHION</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; padding: 24px; }
        .header { background: #033B27; color: white; padding: 20px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .brand { font-size: 24px; font-weight: 900; letter-spacing: 1px; }
        .tagline { color: #F3D477; font-size: 11px; font-weight: 700; letter-spacing: 2px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; font-size: 13px; }
        .card { background: #f8f8f8; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
        th { background: #064C32; color: white; padding: 10px 8px; text-align: left; }
        .total-box { margin-top: 24px; float: right; width: 280px; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; }
        .grand-total { background: #033B27; color: white; font-weight: bold; font-size: 16px; padding: 10px; border-radius: 6px; margin-top: 8px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="/logo.jpg" style="height: 50px; width: 46px; object-fit: contain; background: white; border-radius: 8px; padding: 3px;" alt="Logo" />
          <div>
            <div class="brand">BIYA FASHION</div>
            <div class="tagline">WEAR YOUR STYLE • LUXURY APPAREL</div>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 18px;">TAX INVOICE</h2>
          <small>Invoice: INV-${order.id}</small>
        </div>
      </div>

      <div class="meta-grid">
        <div class="card">
          <strong>Sold By (Seller):</strong><br/>
          BIYA FASHION<br/>
          Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106<br/>
          Helpline: +91 96556 25186 | biyasfashion02@gmail.com
        </div>
        <div class="card">
          <strong>Bill To / Delivery Address:</strong><br/>
          <strong>${order.customer?.name}</strong><br/>
          ${order.customer?.address}, ${order.customer?.city}<br/>
          ${order.customer?.state} - ${order.customer?.pincode}<br/>
          Phone: ${order.customer?.phone}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>Item Details</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="total-box">
        <div class="total-row"><span>Subtotal:</span><span>₹${order.subtotal}</span></div>
        <div class="total-row"><span>Delivery:</span><span>${order.deliveryFee === 0 ? 'FREE' : '₹' + order.deliveryFee}</span></div>
        <div class="total-row"><span>Payment:</span><span>${order.paymentMethod}</span></div>
        <div class="total-row grand-total"><span>Total Amount:</span><span>₹${order.total}</span></div>
      </div>

      <div style="clear: both; margin-top: 60px; font-size: 11px; color: #666; border-top: 1px solid #e5e5e5; padding-top: 16px;">
        <p>1. 7-Day return & exchange valid from delivery date with original tags attached.</p>
        <p>2. Computer generated tax invoice. Wear Your Style - Authentic BIYA FASHION.</p>
      </div>

      <div class="no-print" style="margin-top: 24px; text-align: center;">
        <button onclick="window.print()" style="padding: 12px 24px; background: #064C32; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">Print / Save as PDF</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
};

/**
 * Client-side Printable Courier Shipping Label Fallback
 */
export const printClientShippingLabel = (order) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const isCOD = (order.paymentMethod || '').toLowerCase().includes('cash');
  const awbNumber = '14908' + String(Math.abs(order.id.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 5381))).slice(0, 11).padEnd(11, '4801');
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB');

  const productRows = (order.items || []).map((item) => `
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #111; font-family: monospace;">${(item.name || 'APPAREL').slice(0, 14)}</td>
      <td style="padding: 4px 6px; border: 1px solid #111; text-align: center;">${item.selectedSize || 'Free Size'}</td>
      <td style="padding: 4px 6px; border: 1px solid #111; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 4px 6px; border: 1px solid #111; text-align: center;">${(item.selectedColor || 'NA').slice(0, 8)}</td>
      <td style="padding: 4px 6px; border: 1px solid #111; font-family: monospace;">${order.id}_1</td>
    </tr>
  `).join('');

  const invoiceRows = (order.items || []).map((item) => {
    const gross = item.price * item.quantity;
    const taxable = (gross / 1.05).toFixed(2);
    const tax = (gross - parseFloat(taxable)).toFixed(2);
    return `
      <tr>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; max-width: 140px; font-size: 8px; line-height: 1.2;">
          ${item.name} (${item.selectedSize || 'Std'}, ${item.selectedColor || 'Std'})
        </td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: center; font-size: 8px;">610910</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: center; font-size: 8px;">${item.quantity}</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: right; font-size: 8px;">Rs.${gross.toFixed(2)}</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: right; font-size: 8px;">Rs.0.00</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: right; font-size: 8px;">Rs.${taxable}</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: right; font-size: 8px;">IGST @5% Rs.${tax}</td>
        <td style="padding: 3px 5px; border-bottom: 1px solid #ddd; text-align: right; font-size: 8px; font-weight: bold;">Rs.${gross.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Courier Label - ${order.id} | BIYA FASHION</title>
      <style>
        @page { size: 100mm 150mm; margin: 0; }
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #000; margin: 0; padding: 12px; display: flex; justify-content: center; background: #fafafa; font-size: 9px; }
        .sheet { width: 440px; background: white; border: 1.5px solid #000; padding: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .top-split { display: grid; grid-template-columns: 1.25fr 1fr; border-bottom: 1.5px solid #000; }
        .left-col { padding: 8px 10px; border-right: 1.5px solid #000; display: flex; flex-direction: column; justify-content: space-between; }
        .right-col { display: flex; flex-direction: column; }
        .sec-title { font-size: 9px; font-weight: 800; text-transform: capitalize; color: #333; margin-bottom: 3px; }
        .cust-name { font-size: 13px; font-weight: 800; margin-bottom: 2px; text-transform: uppercase; }
        .addr-text { font-size: 9.5px; line-height: 1.35; color: #222; }
        .ret-box { margin-top: 10px; padding-top: 8px; border-top: 1px dashed #666; font-size: 8.5px; line-height: 1.35; }
        .cod-strip { background: #333; color: white; text-align: center; font-weight: 800; font-size: 9.5px; padding: 5px 6px; letter-spacing: 0.5px; }
        .logistics-head { padding: 6px 8px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
        .courier-name { font-size: 13px; font-weight: 900; letter-spacing: 0.5px; }
        .badge { border: 1px solid #000; padding: 1px 4px; font-size: 8px; font-weight: bold; border-radius: 2px; }
        .dest-code { padding: 4px 8px; font-size: 8px; line-height: 1.3; color: #333; }
        .qr-section { text-align: center; padding: 4px 0; }
        .qr-matrix { width: 70px; height: 70px; margin: 0 auto; background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 10px 10px; border: 3px solid #000; }
        .barcode-section { padding: 4px 8px; text-align: center; }
        .barcode-bars { height: 38px; background: repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 7px, transparent 7px, transparent 9px, #000 9px, #000 12px, transparent 12px, transparent 14px); margin: 0 auto; width: 95%; }
        .awb-text { font-family: monospace; font-size: 11px; font-weight: bold; margin-top: 3px; letter-spacing: 1px; }
        .prod-details { padding: 6px 8px; border-bottom: 1.5px solid #000; }
        .prod-table { width: 100%; border-collapse: collapse; font-size: 8.5px; margin-top: 3px; }
        .prod-table th { background: #f0f0f0; border: 1px solid #111; padding: 3px 5px; font-weight: 800; }
        .inv-section { padding: 6px 8px; font-size: 8px; }
        .inv-title { text-align: center; font-size: 11px; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px; position: relative; }
        .orig-text { position: absolute; right: 0; top: 2px; font-size: 7.5px; font-weight: normal; color: #555; }
        .inv-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px; font-size: 8px; line-height: 1.3; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        .inv-table { width: 100%; border-collapse: collapse; font-size: 7.5px; margin-top: 4px; }
        .inv-table th { border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 3px 4px; font-weight: 800; }
        .disclaimer { font-size: 6.5px; color: #666; margin-top: 6px; line-height: 1.25; border-top: 0.8px solid #ddd; padding-top: 3px; text-align: justify; }
        @media print {
          body { background: white; padding: 0; }
          .sheet { border: 1px solid #000; box-shadow: none; width: 100%; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div>
        <div class="sheet">
          {/* Top Half: Courier Shipping Routing */}
          <div class="top-split">
            {/* Left Box: Customer Address & Return */}
            <div class="left-col">
              <div>
                <div class="sec-title">Customer Address</div>
                <div class="cust-name">${order.customer?.name || 'Customer'}</div>
                <div class="addr-text">
                  ${order.customer?.address || ''}<br/>
                  ${order.customer?.city || ''}, ${order.customer?.state || ''}, ${order.customer?.pincode || ''}<br/>
                  <strong>TEL:</strong> ${order.customer?.phone || 'N/A'}
                </div>
              </div>

              <div class="ret-box">
                <strong style="display:block; margin-bottom:2px;">If undelivered, return to:</strong>
                <strong>BIYA FASHION</strong><br/>
                Pandiyan Nagar, Karaiyapatti<br/>
                Virudhunagar, Tamil Nadu, 626106<br/>
                Tel: +91 96556 25186
              </div>
            </div>

            {/* Right Box: COD Banner, Carrier, QR, Barcode */}
            <div class="right-col">
              <div class="cod-strip">
                ${isCOD ? `COD: Check the payable amount on the app` : 'PREPAID ORDER: DO NOT COLLECT CASH'}
              </div>

              <div class="logistics-head">
                <div class="courier-name">Delhivery</div>
                <div class="badge">Pickup</div>
              </div>

              <div class="dest-code">
                <strong>Destination Code:</strong><br/>
                ${(order.customer?.city || 'HUB').toUpperCase()}_PP (${(order.customer?.state || 'TN')})<br/>
                <strong>Return Code:</strong> 626106,3593013
              </div>

              <div class="qr-section">
                <div class="qr-matrix"></div>
              </div>

              <div class="barcode-section">
                <div class="awb-text">${awbNumber}</div>
                <div class="barcode-bars"></div>
              </div>
            </div>
          </div>

          {/* Middle: Product Details */}
          <div class="prod-details">
            <div class="sec-title">Product Details</div>
            <table class="prod-table">
              <thead>
                <tr>
                  <th style="text-align: left;">SKU</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Color</th>
                  <th style="text-align: right;">Order No.</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
          </div>

          {/* Bottom Half: TAX INVOICE */}
          <div class="inv-section">
            <div class="inv-title">
              TAX INVOICE
              <span class="orig-text">Original For Recipient</span>
            </div>

            <div class="inv-meta-grid">
              <div>
                <strong>BILL TO / SHIP TO</strong><br/>
                ${order.customer?.name} - ${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state}, ${order.customer?.pincode}.<br/>
                Place of Supply: <strong>${order.customer?.state || 'Tamil Nadu'}</strong>
              </div>

              <div>
                <strong>Sold by:</strong> BIYA FASHION<br/>
                Pandiyan Nagar, Karaiyapatti, Virudhunagar, Tamil Nadu - 626106<br/>
                GSTIN - <strong>33AAACB1234F1Z5</strong><br/>
                Invoice No: INV-${order.id} &nbsp;|&nbsp; Date: ${orderDate}
              </div>
            </div>

            <table class="inv-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Description</th>
                  <th>HSN</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Gross</th>
                  <th style="text-align: right;">Disc</th>
                  <th style="text-align: right;">Taxable</th>
                  <th style="text-align: right;">Taxes</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceRows}
                <tr>
                  <td colspan="7" style="padding: 4px; text-align: right; font-weight: bold; border-top: 1px solid #000;">Grand Total Payable:</td>
                  <td style="padding: 4px; text-align: right; font-weight: 900; font-size: 9px; border-top: 1px solid #000;">Rs.${order.total}</td>
                </tr>
              </tbody>
            </table>

            <div class="disclaimer">
              Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature. Other charges are charges that are applicable to your order and include charges for logistics fee (where applicable). Includes discounts for your city and/or for online payments (as applicable).
            </div>
          </div>
        </div>

        <div class="no-print" style="margin-top: 16px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 24px; background: #064C32; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
            🖨️ Print Label / Save as PDF
          </button>
        </div>
      </div>
    </body>
    </html>
  `);
  win.document.close();
};
