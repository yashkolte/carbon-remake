// pages/product/[id].tsx

"use client";

import ProductDetails from '@/components/ProductDetails';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const id = params.id;

  if (!id) return <div>Loading...</div>;

  return <ProductDetails productId={Number(id)} />;
}