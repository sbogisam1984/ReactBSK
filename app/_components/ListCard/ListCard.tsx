import React from "react";
import styles from "./styles.module.css";
import Button from "@mui/material/Button";

interface Props {
  title: string;
  items: string[];
  action?: {
    title: string | undefined;
    click: () => void | undefined;
  };
  className?: string
}

const ListCard = (props: Props) => {
  const { title, items, action, className } = props;
  return (
    <section className={`${styles.needsCard} ${className}`}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.listItems}>
        {items?.map((cardItem: string) => (
          <li className={styles.listItem} key={cardItem}>
            {cardItem}
          </li>
        ))}
      </ul>
      {action && (
        <Button
          variant="contained"
          size="large"
          className="!mt-auto"
          onClick={() => action?.click()}
          sx={{minWidth: "30px"}}
        >
          {action.title}
        </Button>
      )}
    </section>
  );
};

export default ListCard;
