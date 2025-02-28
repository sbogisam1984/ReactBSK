import Link from 'next/link'
import classes from './productmenu.module.css'
import { Button } from '@mui/material'

export default function ProductMenuNotFound() {
    return (
        <>
            <div className={classes.notfoundContainer}>
                <h3 className={classes.notfoundHeader}>Sorry, there are no products available in your area</h3>
                <h4>
                    <Link className={classes.notfoundLink} href="/" passHref>
                        <Button>Back to home</Button>
                    </Link>
                </h4>
            </div>
        </>
    )
}
