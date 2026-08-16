import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportProductsPDF(products) {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Products Report", 14, 18);

  doc.setFontSize(11);
doc.text(
  `Generated: ${new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`,
  14,
  28
);

  autoTable(doc, {
    startY: 38,

    head: [[
      "ID",
      "Title",
      "Category",
      "Price",
      "Stock",
      "Rating",
    ]],

    body: products.map((product) => [

      product.id,

      product.title,

      product.category,

      `$${product.price}`,

      product.stock,

      product.rating,

    ]),
  });

  doc.save("products-report.pdf");

}