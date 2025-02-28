"use client"
import ProductListType from '@/app/_types/ProductListType'
import React from 'react'
import ProductCard from '../ProductCard/productcard'
import classes from '@/app/SelectedProduct/selectedproduct.module.css'

interface Props {
    shoppingCartId: number,
    products?: ProductListType[]
}

const ProductList = ({shoppingCartId, products }: Props) => {
    return (
        <section className={classes.productContainer}>
            {products?.map((product) => {
                return (
                    <ProductCard
                        key={product.product.productId}
                        product={product}
                        shoppingCartId={shoppingCartId}
                        className="max-lg:basis-[48%]"
                    />
                )
            })}
        </section>
    )
}

export default ProductList
