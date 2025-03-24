// src/components/ProductCard.tsx

import Link from 'next/link';
import { FC } from 'react';
import { Tag } from '@carbon/react';
import styles from './ProductCard.module.scss';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand: string;
  category: string;
  discountPercentage?: number;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} passHref legacyBehavior>
      <div className={styles.productCard} role="button" tabIndex={0}>
        <div className={styles.imageContainer}>
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className={styles.thumbnail}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.categoryTag}>
            <Tag type="gray" size="sm">{product.category}</Tag>
          </div>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.priceContainer}>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className={styles.discount}>{product.discountPercentage}% off</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;