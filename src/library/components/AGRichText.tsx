import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme, TypographyVariant } from '@mui/material/styles';
import type { CSSProperties } from 'react';

// Extend with common variants for convenience
type AGTypographyVariant = TypographyVariant | 'inherit';

export interface AGRichTextProps extends React.HTMLAttributes<HTMLDivElement> {
    html?: string; // optional raw HTML to render
    variant?: AGTypographyVariant; // MUI typography variant (h1, h2, body1, etc.)
    align?: CSSProperties['textAlign'];
    color?: string; // palette token or raw color
    sizeScale?: 'sm' | 'md' | 'lg'; // scales heading/body sizes subtly
    paragraphSpacing?: number; // px gap between paragraphs
    listSpacing?: number; // px gap between list items
    linkColor?: string; // palette token or raw color
    linkUnderline?: 'always' | 'hover' | 'never';
    codeBg?: string; // palette token or color for inline code bg
    clampLines?: number; // line clamp for long text
}

type StyledExtras = {
    agVariant?: AGTypographyVariant;
    agAlign?: CSSProperties['textAlign'];
    agColor?: string;
    agScale?: 'sm' | 'md' | 'lg';
    agParaGap?: number;
    agListGap?: number;
    agLinkColor?: string;
    agLinkUnderline?: 'always' | 'hover' | 'never';
    agCodeBg?: string;
    agClamp?: number;
};

const StyledRich = styled('div', {
    name: 'AGRichText',
    slot: 'Root',
    shouldForwardProp: (prop) => ![
        'agVariant',
        'agAlign',
        'agColor',
        'agScale',
        'agParaGap',
        'agListGap',
        'agLinkColor',
        'agLinkUnderline',
        'agCodeBg',
        'agClamp',
    ].includes(String(prop)),
})<StyledExtras>(({ theme, agVariant, agAlign, agColor, agScale = 'md', agParaGap = 12, agListGap = 8, agLinkColor, agLinkUnderline = 'hover', agCodeBg, agClamp }) => {
    const scaleFactor = agScale === 'sm' ? 0.95 : agScale === 'lg' ? 1.05 : 1.0;

    const underlineHover = agLinkUnderline === 'hover';
    const underlineAlways = agLinkUnderline === 'always';

    // Get base typography from variant if provided
    const variantStyles = agVariant && agVariant !== 'inherit'
        ? (theme.typography as unknown as Record<string, React.CSSProperties>)[agVariant] ?? {}
        : {};

    return {
        // Apply variant typography as base styles
        ...variantStyles,
        color: agColor || (theme.vars ? theme.vars.palette.text.primary : theme.palette.text.primary),
        textAlign: agAlign,
        // Optional clamp for long text blocks
        ...(agClamp ? { display: '-webkit-box', WebkitLineClamp: agClamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),

        // Typography scale for common tags
        '& h1': { ...theme.typography.h4, fontSize: `calc(${theme.typography.h4.fontSize} * ${scaleFactor})`, margin: '0 0 16px' },
        '& h2': { ...theme.typography.h5, fontSize: `calc(${theme.typography.h5.fontSize} * ${scaleFactor})`, margin: '0 0 14px' },
        '& h3': { ...theme.typography.h6, fontSize: `calc(${theme.typography.h6.fontSize} * ${scaleFactor})`, margin: '0 0 12px' },
        '& h4, & h5, & h6': { ...theme.typography.subtitle1, margin: '0 0 10px' },

        '& p': { ...theme.typography.body1, margin: `0 0 ${agParaGap}px` },
        '& li': { marginBottom: `${agListGap}px` },
        '& ul, & ol': { paddingLeft: '1.25rem', margin: `0 0 ${agParaGap}px` },

        '& strong': { fontWeight: 700 },
        '& em': { fontStyle: 'italic' },

        '& a': {
            color: agLinkColor || (theme.vars ? theme.vars.palette.primary.main : theme.palette.primary.main),
            textDecoration: underlineAlways ? 'underline' : 'none',
            ...(underlineHover ? { '&:hover': { textDecoration: 'underline' } } : {}),
        },

        '& code': {
            fontFamily: theme.typography.fontFamily?.includes('monospace') ? theme.typography.fontFamily : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            backgroundColor: agCodeBg || (theme.vars ? theme.vars.palette.action.hover : theme.palette.action.hover),
            padding: '0.125rem 0.375rem',
            borderRadius: 4,
            fontSize: '0.9em',
        },

        '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: theme.shape.borderRadius,
            display: 'block',
        },
    };
});

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

const AGRichText = React.forwardRef<HTMLDivElement, AGRichTextProps>(function AGRichText(props, ref) {
    const theme = useTheme();
    const { html, variant, align, color, sizeScale = 'md', paragraphSpacing = 12, listSpacing = 8, linkColor, linkUnderline = 'hover', codeBg, clampLines, className, children, ...rest } = props;

    const resolvedColor = resolveThemeColor(theme, color) ?? color;
    const resolvedLinkColor = resolveThemeColor(theme, linkColor) ?? linkColor;
    const resolvedCodeBg = resolveThemeColor(theme, codeBg) ?? codeBg;

    return (
        <StyledRich
            ref={ref}
            agVariant={variant}
            agAlign={align}
            agColor={resolvedColor}
            agScale={sizeScale}
            agParaGap={paragraphSpacing}
            agListGap={listSpacing}
            agLinkColor={resolvedLinkColor}
            agLinkUnderline={linkUnderline}
            agCodeBg={resolvedCodeBg}
            agClamp={clampLines}
            className={className}
            {...rest}
        >
            {html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : children}
        </StyledRich>
    );
});

AGRichText.displayName = 'AGRichText';

export default AGRichText;
