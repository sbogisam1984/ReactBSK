import Link from "next/link";
import { ProductFeatureType, ProductType } from "../../_types/ProductType";
import { Button } from "@mui/material";
import styles from '../ProductCard/styles.module.css'
import classes from '@/app/SelectedProduct/selectedproduct.module.css'

export default async function SelectedProduct({ selectedProduct }: { selectedProduct: ProductType }) {

    return (
        <>
            <div className="pt-4">
                <h3 className={classes.headerText}>Your selected product is</h3>
                <section className={classes.productContainer}>
                    <section className={`${styles.productCard} max-lg:basis-[48%]`}>
                        <h4 className={styles.title}>{selectedProduct.productName}</h4>
                        <div className={styles.itemBody}>
                            <ul className={styles.listItems}>
                                {selectedProduct.features?.map((cardItem: ProductFeatureType) => (
                                    <li className={styles.listItem} key={cardItem.id}>
                                        {cardItem.feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                    <section className={`${styles.productCard} max-lg:basis-[48%]`}>
                        <h4 className={styles.title}>Next Step</h4>
                        <Link href='/SelectVerification' passHref><Button variant="contained">Start Application</Button></Link>
                    </section>
                </section>
            </div>
        </>
    )
}
