import { Box, Typography, Link, IconButton, useTheme, alpha, Grid } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

// ============================================================================
// Types
// ============================================================================

interface FooterLink {
    label: string;
    url: string;
}

interface FooterLinkColumn {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    icon: React.ReactNode;
    url: string;
    label: string;
}

interface DynamicFooterProps {
    /** Business/brand name */
    businessName: string;
    /** Short description or tagline */
    description?: string;
    /** Logo element (image or component) */
    logo?: React.ReactNode;
    /** Single list of links (simple mode) */
    links?: FooterLink[];
    /** Multiple columns of links (advanced mode) */
    linkColumns?: FooterLinkColumn[];
    /** Social media links with icons */
    socialLinks?: SocialLink[];
    /** Background color (supports theme tokens) */
    backgroundColor?: string;
    /** Text color (supports theme tokens) */
    textColor?: string;
    /** Accent color for links/hover (supports theme tokens) */
    accentColor?: string;
    /** Show copyright with current year */
    addCopyright?: boolean;
    /** Custom copyright text (defaults to "All rights reserved") */
    copyrightText?: string;
    /** Additional content in the bottom bar */
    bottomContent?: React.ReactNode;
    /** Padding top */
    paddingTop?: number;
    /** Padding bottom */
    paddingBottom?: number;
}

// ============================================================================
// Styled Components
// ============================================================================

const FooterContainer = styled(Box, {
    shouldForwardProp: (prop) =>
        !["$bgColor", "$textColor", "$paddingTop", "$paddingBottom"].includes(prop as string),
})<{
    $bgColor: string;
    $textColor: string;
    $paddingTop: number;
    $paddingBottom: number;
    component?: React.ElementType;
}>(({ $bgColor, $textColor, $paddingTop, $paddingBottom }) => ({
    backgroundColor: $bgColor,
    color: $textColor,
    paddingTop: $paddingTop,
    paddingBottom: $paddingBottom,
    paddingLeft: 48,
    paddingRight: 48,
}));

const FooterLink = styled(Link, {
    shouldForwardProp: (prop) => !["$accentColor"].includes(prop as string),
})<{ $accentColor: string }>(({ theme, $accentColor }) => ({
    color: "inherit",
    textDecoration: "none",
    opacity: 0.8,
    fontSize: "0.95rem",
    display: "block",
    padding: "6px 0",
    transition: theme.transitions.create(["opacity", "color", "transform"], {
        duration: 200,
    }),
    "&:hover": {
        opacity: 1,
        color: $accentColor,
        transform: "translateX(4px)",
    },
}));

const SocialButton = styled(IconButton, {
    shouldForwardProp: (prop) => !["$accentColor"].includes(prop as string),
})<{
    $accentColor: string;
    component?: React.ElementType;
    href?: string;
    target?: string;
    rel?: string;
}>(({ theme, $accentColor }) => ({
    color: "inherit",
    opacity: 0.8,
    transition: theme.transitions.create(["opacity", "background-color", "transform"], {
        duration: 200,
    }),
    "&:hover": {
        opacity: 1,
        backgroundColor: alpha($accentColor, 0.15),
        transform: "translateY(-3px)",
    },
}));

const ColumnTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: "1rem",
    marginBottom: theme.spacing(2),
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    opacity: 0.9,
}));

const Divider = styled(Box)(({ theme }) => ({
    height: 1,
    backgroundColor: "currentColor",
    opacity: 0.15,
    margin: theme.spacing(4, 0, 3, 0),
}));

const BottomBar = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
});

// ============================================================================
// Helper Functions
// ============================================================================

const resolveThemeColor = (
    color: string | undefined,
    theme: Theme,
    fallback: string
): string => {
    if (!color) return fallback;
    if (color.includes(".")) {
        const [palette, shade] = color.split(".");
        const paletteObj = (
            theme.palette as unknown as Record<string, Record<string, string> | undefined>
        )[palette];
        if (paletteObj && shade in paletteObj) {
            return paletteObj[shade];
        }
    }
    return color;
};

// ============================================================================
// Component
// ============================================================================

const DynamicFooter: React.FC<DynamicFooterProps> = ({
    businessName,
    description,
    logo,
    links,
    linkColumns,
    socialLinks,
    backgroundColor = "#1A1A2E",
    textColor = "#FFFFFF",
    accentColor = "primary.main",
    addCopyright = true,
    copyrightText = "All rights reserved.",
    bottomContent,
    paddingTop = 64,
    paddingBottom = 32,
}) => {
    const theme = useTheme();

    const resolvedBgColor = resolveThemeColor(backgroundColor, theme, "#1A1A2E");
    const resolvedTextColor = resolveThemeColor(textColor, theme, "#FFFFFF");
    const resolvedAccentColor = resolveThemeColor(accentColor, theme, theme.palette.primary.main);

    const currentYear = new Date().getFullYear();

    // Convert simple links to a single column if linkColumns not provided
    const columns: FooterLinkColumn[] = linkColumns || (links ? [{ title: "Links", links }] : []);

    return (
        <FooterContainer
            component="footer"
            $bgColor={resolvedBgColor}
            $textColor={resolvedTextColor}
            $paddingTop={paddingTop}
            $paddingBottom={paddingBottom}
        >
            <Grid container spacing={6}>
                {/* Brand Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ mb: 2 }}>
                        {logo || (
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, mb: 1 }}
                            >
                                {businessName}
                            </Typography>
                        )}
                    </Box>
                    {description && (
                        <Typography
                            sx={{
                                opacity: 0.75,
                                lineHeight: 1.7,
                                maxWidth: 320,
                                fontSize: "0.95rem",
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                    {/* Social Links */}
                    {socialLinks && socialLinks.length > 0 && (
                        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                            {socialLinks.map((social, index) => (
                                <SocialButton
                                    key={index}
                                    component="a"
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    $accentColor={resolvedAccentColor}
                                    size="small"
                                >
                                    {social.icon}
                                </SocialButton>
                            ))}
                        </Box>
                    )}
                </Grid>

                {/* Link Columns */}
                {columns.map((column, colIndex) => (
                    <Grid size={{ xs: 6, sm: 4, md: 2 }} key={colIndex}>
                        <ColumnTitle>{column.title}</ColumnTitle>
                        <Box component="nav">
                            {column.links.map((link, linkIndex) => (
                                <FooterLink
                                    key={linkIndex}
                                    href={link.url}
                                    $accentColor={resolvedAccentColor}
                                >
                                    {link.label}
                                </FooterLink>
                            ))}
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Bottom Bar */}
            <Divider />
            <BottomBar>
                <Typography sx={{ opacity: 0.6, fontSize: "0.875rem" }}>
                    {addCopyright && (
                        <>
                            © {currentYear} {businessName}. {copyrightText}
                        </>
                    )}
                </Typography>
                {bottomContent && <Box>{bottomContent}</Box>}
            </BottomBar>
        </FooterContainer>
    );
};

export default DynamicFooter;