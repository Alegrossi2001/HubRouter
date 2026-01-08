
import * as React from 'react';
import { Chip } from "@mui/material";

interface AGChipProps {
    icon: React.JSX.Element;
    label: string;
    size?: 'small' | 'medium' | 'large';
    onHoverShadow?: boolean;
    iconColor?: string;
    textColor?: string;
    color?: string; // background color for the chip
}

const AGChip: React.FC<AGChipProps> = ({ icon, label, size, onHoverShadow = false, iconColor, color, textColor }) => {
    const renderedIcon = iconColor
        ? (
            <span style={{ color: iconColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </span>
        )
        : icon;
    const renderedText = textColor
        ? (
            <span style={{ color: textColor }}>
                {label}
            </span>
        )
        : label;
    return (
        <Chip
            icon={renderedIcon}
            label={renderedText}
            sx={{
                borderRadius: 200,
                padding: 3,
                backgroundColor: color,
                color: '#fff',
                height: size === 'small' ? 24 : size === 'large' ? 32 : 28,
                fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
                transition: 'box-shadow 160ms ease, transform 160ms ease',
                ...(onHoverShadow ? {
                    '&:hover': {
                        boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                        transform: 'translateY(-1px)'
                    }
                } : {})
            }}
        />
    )
}

export default AGChip;