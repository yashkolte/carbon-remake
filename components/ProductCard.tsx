// src/components/ProductCard.tsx

import Link from 'next/link';
import { FC } from 'react';
import { Tag } from '@carbon/react';
import { useTranslation } from 'react-i18next';

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

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation('common');

  return (
    <Link href={`/product/${product.id}`} passHref legacyBehavior>
      <div className="productCard" role="button" tabIndex={0}>
        <div className="imageContainer">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="thumbnail"
          />
        </div>
        <div className="content">
          <div className="categoryTag">
            <Tag type="gray" size="sm">{product.category}</Tag>
          </div>
          <h3 className="title">{product.title}</h3>
          <p className="description">{product.description}</p>
          <div className="priceContainer">
            <p className="price">
              {t('products.card.price', { amount: product.price.toFixed(2) })}
            </p>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="discount">
                {t('products.card.discount', { percentage: product.discountPercentage })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;