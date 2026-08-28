import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/produits" className="text-sm text-blue-deep hover:underline">
        ← Retour aux produits
      </Link>
      <h1 className="mb-6 mt-2 font-serif text-3xl font-semibold text-ink">
        Nouveau produit
      </h1>
      <ProductForm />
    </div>
  );
}
