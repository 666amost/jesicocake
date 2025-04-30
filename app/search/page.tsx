"use client";
import { useState } from "react";
import ProductList from "@/components/ProductList";
import { useProducts } from "@/hooks/useDatabase";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const { data: products, loading, error } = useProducts();
  const [query, setQuery] = useState("");

  const filteredProducts = products?.filter((product) => {
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      (product.description || "").toLowerCase().includes(q) ||
      (product.category || "").toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cari Produk di Katalog</h1>
      <Input
        placeholder="Cari nama, deskripsi, atau kategori..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-8 max-w-lg"
      />
      <ProductList products={filteredProducts} loading={loading} error={error} />
    </div>
  );
} 