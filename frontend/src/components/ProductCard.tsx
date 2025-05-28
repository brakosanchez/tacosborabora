import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@/components/ui/Button';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
}

const StyledCard = styled(Card)({
  maxWidth: 345,
  borderRadius: 16,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  },
});

const StyledCardContent = styled(CardContent)({
  padding: '16px',
});

const StyledPrice = styled(Typography)({
  color: '#EF432E',
  fontWeight: 'bold',
  fontSize: '1.25rem',
  marginBottom: '8px',
});

const StyledButton = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px',
});

export default function ProductCard({
  name,
  description,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{
          objectFit: 'cover',
          borderRadius: '8px 8px 0 0',
        }}
      />
      <StyledCardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <StyledPrice variant="h6">
          ${price.toFixed(2)}
        </StyledPrice>
        {onAddToCart && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAddToCart}
            fullWidth
            sx={{
              marginTop: '16px',
              width: '100%'
            }}
          >
            Agregar al carrito
          </Button>
        )}
      </StyledCardContent>
    </StyledCard>
  );
}
