document.addEventListener("DOMContentLoaded", () => {
  // invoice calculative data
  const invoiceItemsTbody = document.getElementById("invoiceItems");
  const addItemBtn = document.getElementById("addItem");
  const discountInput = document.getElementById("discount");
  const subtotalEl = document.getElementById("subtotal");
  const totalTaxEl = document.getElementById("totalTax");
  const totalEl = document.getElementById("total");
  const printInvoiceBtn = document.getElementById("printInvoice");
  const savePDFBtn = document.getElementById("savePDF");
  const resetInvoiceBtn = document.getElementById("resetInvoice");

  // Invoice info details
  const invoiceNumberInput = document.getElementById("invoiceNumber");
  const invoiceDateInput = document.getElementById("invoiceDate");
  const dueDateInput = document.getElementById("dueDate");
  const clientNameInput = document.getElementById("clientName");
  const clientAddressInput = document.getElementById("clientAddress");

  // Load invoice data from localStorage
  const loadInvoice = () => {
    const savedInvoice = JSON.parse(localStorage.getItem("invoiceData")) || {};

    // Load invoice details
    invoiceNumberInput.value = savedInvoice.invoiceNumber || "";
    invoiceDateInput.value = savedInvoice.invoiceDate || "";
    dueDateInput.value = savedInvoice.dueDate || "";
    clientNameInput.value = savedInvoice.clientName || "";
    clientAddressInput.value = savedInvoice.clientAddress || "";

    // Load invoice items
    invoiceItemsTbody.innerHTML = "";
    if (savedInvoice.items) {
      savedInvoice.items.forEach((item) => addInvoiceRow(item));
    }

    // Load discount
    discountInput.value = savedInvoice.discount || 0;

    updateTotals();
  };

  // Save invoice data to localStorage
  const saveInvoice = () => {
    const items = [];
    document.querySelectorAll("#invoiceItems tr").forEach((row) => {
      items.push({
        description: row.querySelector(".item-description textarea").value,
        quantity: row.querySelector(".quantity input").value,
        price: row.querySelector(".price input").value,
        tax: row.querySelector(".tax input").value,
      });
    });

    const invoiceData = {
      invoiceNumber: invoiceNumberInput.value,
      invoiceDate: invoiceDateInput.value,
      dueDate: dueDateInput.value,
      clientName: clientNameInput.value,
      clientAddress: clientAddressInput.value,
      items,
      discount: discountInput.value,
    };

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
  };

  // Function to update subtotal, tax, and total
  const updateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    document.querySelectorAll("#invoiceItems tr").forEach((row) => {
      const qty = parseFloat(row.querySelector(".quantity input").value) || 0;
      const price = parseFloat(row.querySelector(".price input").value) || 0;
      const taxRate = parseFloat(row.querySelector(".tax input").value) || 0;

      const itemSubtotal = qty * price;
      const itemTax = (itemSubtotal * taxRate) / 100;

      subtotal += itemSubtotal;
      totalTax += itemTax;

      row.querySelector(".total").textContent = (
        itemSubtotal + itemTax
      ).toFixed(2);
    });

    const discount = parseFloat(discountInput.value) || 0;
    const total = subtotal + totalTax - discount;

    subtotalEl.textContent = subtotal.toFixed(2);
    totalTaxEl.textContent = totalTax.toFixed(2);
    totalEl.textContent = total.toFixed(2);

    saveInvoice(); // Save after update
  };

  // Function to add a new item row
  const addInvoiceRow = (data = {}) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td class="item-description"><textarea placeholder="Item description">${
        data.description || ""
      }</textarea></td>
      <td class="quantity"><input type="number" min="0" value="${
        data.quantity || 1
      }"></td>
      <td class="price"><input type="number" min="0" step="0.01" value="${
        data.price || 1
      }"></td>
      <td class="tax"><input type="number" min="0" step="0.01" value="${
        data.tax || 0
      }"></td>
      <td class="total">0.00</td>
      <td class="action"><button class="btn delete-btn" style="background-color: var(--danger-color)">Delete</button></td>
    `;

    invoiceItemsTbody.appendChild(newRow);

    // Attach event listeners to new row
    newRow.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", updateTotals);
    });

    // Delete function
    newRow.querySelector(".delete-btn").addEventListener("click", () => {
      newRow.remove();
      updateTotals();
    });

    updateTotals();
  };

  // Add item event
  addItemBtn.addEventListener("click", () => {
    addInvoiceRow();
  });

  // Ensure discount input updates the total and saves to local storage
  discountInput.addEventListener("input", updateTotals);

  // Save invoice details when user inputs data
  [
    invoiceNumberInput,
    invoiceDateInput,
    dueDateInput,
    clientNameInput,
    clientAddressInput,
  ].forEach((input) => {
    input.addEventListener("input", saveInvoice);
  });

  // Reset invoice function with confirmation alert
  resetInvoiceBtn.addEventListener("click", () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the invoice?"
    );

    if (confirmReset) {
      // Remove all rows
      invoiceItemsTbody.innerHTML = "";

      // Reset all fields
      invoiceNumberInput.value = "";
      invoiceDateInput.value = "";
      dueDateInput.value = "";
      clientNameInput.value = "";
      clientAddressInput.value = "";
      discountInput.value = "0";

      // Reset totals
      subtotalEl.textContent = "0.00";
      totalTaxEl.textContent = "0.00";
      totalEl.textContent = "0.00";

      localStorage.removeItem("invoiceData");
      updateTotals();
    }
  });

  // Print invoice
  printInvoiceBtn.addEventListener("click", () => window.print());

  // Save as PDF using html2canvas and jsPDF
  savePDFBtn.addEventListener("click", () => {
    const actionsEl = document.querySelector(".invoice-actions");
    actionsEl.style.display = "none"; // Hide buttons for cleaner PDF
    html2canvas(document.getElementById("invoice")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
      actionsEl.style.display = "block"; // Show buttons again
    });
  });

  // Load data on page load
  loadInvoice();
});
