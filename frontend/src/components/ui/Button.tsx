'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: 700,
  borderRadius: 8,
  padding: '12px 24px',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(252, 178, 53, 0.3)', // Efecto de fuego
  },
}));

export default StyledButton;
