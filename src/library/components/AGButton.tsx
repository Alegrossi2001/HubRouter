import * as React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export interface AGButtonProps extends ButtonProps {
    gradient?: string | string[];
    gradientDirection?: number;
    expandOnHover?: boolean;
    expandScale?: number;
}

type StyledExtras = {
    agGradientImage?: string;
    agExpandScale?: number;
    agExpandEnabled?: boolean;
};

const StyledButton = styled(Button, {
    name: 'AGButton',
    slot: 'Root',
    shouldForwardProp: (prop) => prop !== 'agGradientImage' && prop !== 'agExpandScale' && prop !== 'agExpandEnabled',
})<StyledExtras>(({ agGradientImage, agExpandScale, agExpandEnabled }) => ({
    ...(agGradientImage
        ? {
            backgroundImage: agGradientImage,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box',
            color: '#fff',
            border: 'none',
        }
        : {}),
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    ...(agExpandEnabled
        ? {
            '&:hover': {
                transform: `scale(${agExpandScale ?? 1.03})`,
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            },
        }
        : {}),
}));

function resolveThemeColor(theme: Theme, token?: string): string | undefined {
    if (!token) return undefined;
    if (typeof token !== 'string') return String(token);

    const paletteFromVars = (theme as unknown as { vars?: { palette?: unknown } }).vars?.palette;
    const palette: unknown = paletteFromVars ?? (theme.palette as unknown);
    if (!palette) return token;

    if (typeof palette === 'object' && palette !== null) {
        const palRec = palette as Record<string, unknown>;

        const direct = palRec[token];
        if (direct && typeof direct === 'object') {
            const mainVal = (direct as Record<string, unknown>)['main'];
            if (typeof mainVal === 'string') return mainVal;
        }

        if (token.includes('.')) {
            const parts = token.split('.');
            let cur: unknown = palRec;
            for (const p of parts) {
                if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
                    cur = (cur as Record<string, unknown>)[p];
                } else {
                    cur = undefined;
                    break;
                }
            }
            if (typeof cur === 'string') return cur;
        }
    }

    return token;
}

function buildGradient(theme: Theme, gradient?: string | string[], deg: number = 90): string | undefined {
    if (!gradient) return undefined;
    if (Array.isArray(gradient)) {
        const stops = gradient.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${deg}deg, ${stops})`;
    }

    if (gradient.includes('gradient(')) return gradient;

    if (gradient.includes(',')) {
        const parts = gradient.split(',').map((s) => s.trim());
        const stops = parts.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${deg}deg, ${stops})`;
    }

    const color = resolveThemeColor(theme, gradient) ?? gradient;
    return `linear-gradient(${deg}deg, ${color}, ${color})`;
}

const AGButton = React.forwardRef<HTMLButtonElement, AGButtonProps>(function AGButton(props, ref) {
    const theme = useTheme();
    const {
        gradient,
        gradientDirection = 90,
        expandOnHover = true,
        expandScale = 1.03,
        sx,
        ...rest
    } = props;

    const gradientImage = buildGradient(theme, gradient, gradientDirection);

    return (
        <StyledButton
            ref={ref}
            agGradientImage={gradientImage}
            agExpandEnabled={expandOnHover}
            agExpandScale={expandScale}
            sx={sx}
            {...rest}
        />
    );
});

AGButton.displayName = 'AGButton';

export default AGButton;

