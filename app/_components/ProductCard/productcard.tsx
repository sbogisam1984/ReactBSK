import React from 'react'
import styles from './styles.module.css'
import Button from '@mui/material/Button'
import Link from 'next/link'
import ProductListType from '@/app/_types/ProductListType'
import { ProductFeatureType } from '@/app/_types/ProductType'
import { ShoppingCartDetailType } from '../../_types/ShoppingCartType'
import { AddShoppingCartItem } from '../../_utils/shoppingCartUtils'

interface Props {
    shoppingCartId: number,
    product: ProductListType,
    className?: string
}

const ProductCard = ({shoppingCartId, product, className}: Props) => {
    const linkClick = async () => {
        if (product.action?.addToCart) {
            // I don't think this is used anymore
        }
    }

    async function cartClick() {
        const shoppingCartItem: ShoppingCartDetailType = {
            product: {
                productId: product.product.productId,
                productName: product.product.productName,
                productType: product.product.productType
            },
            quantity: 1,
        }

        await AddShoppingCartItem(shoppingCartId, shoppingCartItem)
    }

    return (
        <section className={`${styles.productCard} ${className}`}>
            <h4 className={styles.title}>{product.product.productName}</h4>
            <div className={styles.itemBody}>
                <ul className={styles.listItems}>
                    {product.product.features?.map((cardItem: ProductFeatureType) => (
                        <li className={styles.listItem} key={cardItem.id}>
                            {cardItem.feature}
                        </li>
                    ))}
                </ul>
                {product.action && (
                    <Button
                        variant="contained"
                        size="large"
                        className="!mt-auto !ml-auto !mr-auto !mb-[1em]"
                        {...(product.action.link
                            ? {
                                LinkComponent: Link,
                                href: product.action.link,
                                onClick: () => linkClick(),
                            }
                            : {
                                onClick: async () => await cartClick(),
                            })}
                        sx={{ minWidth: '30px' }}
                    >
                        {product.action.title}
                    </Button>
                )}
            </div>
        </section>
    )
}

export default ProductCard
