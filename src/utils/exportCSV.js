export function exportProductsCSV(products) {

  const headers = [
    "ID",
    "Title",
    "Category",
    "Price",
    "Stock",
    "Rating",
  ];

  const rows = products.map((product) => [
    product.id,
    product.title,
    product.category,
    product.price,
    product.stock,
    product.rating,
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "products.csv";

  link.click();

  URL.revokeObjectURL(url);
}