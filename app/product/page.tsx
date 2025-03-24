// pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Loading, ContentSwitcher, Switch } from '@carbon/react';
import ProductCard from '@/components/ProductCard';
import styles from './products.module.scss';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand: string;
  category: string;
  discountPercentage: number;
  rating: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading description="Loading products..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <Head>
        <title>Products | Carbon Store</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Products</h1>
          <div className={styles.filterControls}>
            <ContentSwitcher 
              onChange={() => {}} 
              selectedIndex={0}
              size="md"
            >
              <Switch name="all" text="All" />
              <Switch name="featured" text="Featured" />
              <Switch name="sale" text="On Sale" />
            </ContentSwitcher>
          </div>
        </div>
        
        <div className={styles.productsGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}