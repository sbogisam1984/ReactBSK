import { ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

export default function InvalidItemsList({ items }: { items: ShoppingCartDetailType[] }) {
  return (
    <Paper sx={{ mt: 2, mb: 2, p: 2 }}>
      <List>
        {items.map(item => (
          <ListItem key={item.shoppingCartItemId}>
            <ListItemText primary={item.product?.productName} secondary={`Quantity: ${item.quantity}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
