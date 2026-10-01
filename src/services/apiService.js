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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
        <div>
          <div class="brand">BIYA FASHION</div>
          <div class="tagline">WEAR YOUR STYLE • LUXURY APPAREL</div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 18px;">TAX INVOICE</h2>
          <small>Invoice: INV-${order.id}</small>
        </div>
      </div>

      <div class="meta-grid">
        <div class="card">
          <strong>Sold By (Seller):</strong><br/>
          BIYA FASHION Atelier Ltd.<br/>
          Plot 42, Royal Textile Ring Road, Surat, Gujarat - 395002<br/>
          GSTIN: 24AAACB1234F1Z5 | care@biyafashion.com
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

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shipping Label - ${order.id} | BIYA FASHION</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .label { width: 380px; border: 2px solid #111; border-radius: 10px; overflow: hidden; background: white; }
        .header { background: #033B27; color: white; text-align: center; padding: 12px; }
        .header h3 { margin: 0; font-size: 16px; letter-spacing: 1px; }
        .sub { color: #F3D477; font-size: 9px; font-weight: bold; letter-spacing: 1.5px; }
        .barcode { text-align: center; padding: 16px 8px; border-bottom: 2px solid #111; background: #fafafa; }
        .barcode-bars { height: 42px; background: repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 7px, transparent 7px, transparent 9px); margin: 0 auto; width: 85%; }
        .ship-to { padding: 14px; border-bottom: 2px solid #111; }
        .pin-badge { background: #033B27; color: white; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: bold; display: inline-block; margin-top: 6px; }
        .cod-banner { padding: 10px; text-align: center; font-weight: 800; font-size: 13px; background: ${isCOD ? '#fff3cd' : '#d4edda'}; color: ${isCOD ? '#856404' : '#155724'}; border-bottom: 1px solid #ccc; }
        .footer { padding: 10px 14px; font-size: 9px; color: #444; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <h3>BIYA FASHION LOGISTICS</h3>
          <div class="sub">STANDARD COURIER PRIORITY SURFACE</div>
        </div>

        <div class="barcode">
          <div class="barcode-bars"></div>
          <div style="font-weight: bold; font-size: 11px; margin-top: 4px; font-family: monospace;">* ${order.id} *</div>
        </div>

        <div class="ship-to">
          <div style="font-size: 10px; font-weight: 800; color: #064C32; margin-bottom: 4px;">SHIP TO (DELIVERY ADDRESS):</div>
          <div style="font-size: 15px; font-weight: 800;">${order.customer?.name}</div>
          <div style="font-size: 12px; margin-top: 3px; line-height: 1.4;">${order.customer?.address}</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 3px;">${order.customer?.city}, ${order.customer?.state}</div>
          <div class="pin-badge">PIN: ${order.customer?.pincode}</div>
          <div style="font-size: 12px; font-weight: 700; margin-top: 6px;">TEL: ${order.customer?.phone}</div>
        </div>

        <div class="cod-banner">
          ${isCOD ? `COLLECT CASH ON DELIVERY: ₹${order.total}` : 'PREPAID ORDER - DO NOT COLLECT CASH'}
        </div>

        <div class="footer">
          <strong>RETURN / SENDER:</strong> BIYA FASHION Logistics Center, Plot 42, Ring Road, Surat, Gujarat - 395002<br/>
          Order ID: ${order.id} | Items: ${order.items?.length || 1} pcs | Weight: 0.45 kg
        </div>
      </div>

      <div class="no-print" style="margin-left: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #064C32; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Print Label</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
};
