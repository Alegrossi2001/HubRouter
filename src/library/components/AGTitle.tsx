import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export interface AGTitleSegment {
    content: React.ReactNode;
    color?: string;
}

export interface AGTitleProps extends TypographyProps {
    weight?: React.CSSProperties['fontWeight'];
    gradient?: string | string[];
    gradientDirection?: number;
    multicolor?: AGTitleSegment[];
    clipText?: boolean;
}

type StyledExtras = {
    agWeight?: React.CSSProperties['fontWeight'];
    agClipText?: boolean;
    agBackgroundImage?: string;
};

const StyledTypography = styled(Typography, {
    name: 'AGTitle',
    slot: 'Root',
    shouldForwardProp: (prop) => prop !== 'agWeight' && prop !== 'agClipText' && prop !== 'agBackgroundImage',
})<StyledExtras>(({ agWeight, agClipText, agBackgroundImage }) => ({
    fontWeight: agWeight,
    ...(agClipText && agBackgroundImage
        ? {
            backgroundImage: agBackgroundImage,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
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

const AGTitle = React.forwardRef<HTMLSpanElement, AGTitleProps>(function AGTitle(props, ref) {
    const theme = useTheme();
    const {
        weight,
        gradient,
        gradientDirection = 90,
        multicolor,
        clipText = true,
        children,
        sx,
        ...rest
    } = props;

    const hasMulti = Array.isArray(multicolor) && multicolor.length > 0;
    const bgImage = !hasMulti ? buildGradient(theme, gradient, gradientDirection) : undefined;

    return (
        <StyledTypography
            ref={ref}
            agWeight={weight}
            agClipText={clipText && Boolean(bgImage)}
            agBackgroundImage={bgImage}
            sx={sx}
            {...rest}
        >
            {hasMulti
                ? multicolor!.map((seg, i) => {
                    const c = resolveThemeColor(theme, seg.color);
                    return (
                        <span key={i} style={c ? { color: c } : undefined}>
                            {seg.content}
                        </span>
                    );
                })
                : children}
        </StyledTypography>
    );
});

AGTitle.displayName = 'AGTitle';

export default AGTitle;
