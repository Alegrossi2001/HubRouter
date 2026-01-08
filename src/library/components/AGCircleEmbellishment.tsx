import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

// ============================================================================
// Types
// ============================================================================

interface AGCircleEmbellishmentProps {
    /** Array of colors for each circle (can be hex, rgb, or theme tokens like "primary.main") */
    colors: string[];
    /** Size of each circle in pixels */
    size?: number;
    /** How much circles overlap (0-1, where 1 = no overlap, 0.5 = 50% overlap) */
    overlap?: number;
    /** Border width for circles */
    borderWidth?: number;
    /** Border color (defaults to white) */
    borderColor?: string;
    /** Scale factor when hovered */
    hoverScale?: number;
    /** Direction of the stack */
    direction?: "horizontal" | "vertical";
    /** Additional className */
    className?: string;
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled(Box)<{ $direction: "horizontal" | "vertical" }>(
    ({ $direction }) => ({
        display: "flex",
        flexDirection: $direction === "horizontal" ? "row" : "column",
        alignItems: "center",
        position: "relative",
    })
);

const Circle = styled(Box, {
    shouldForwardProp: (prop) =>
        !["$size", "$color", "$borderWidth", "$borderColor", "$offset", "$isHovered", "$hoverScale", "$zIndex", "$direction"].includes(
            prop as string
        ),
})<{
    $size: number;
    $color: string;
    $borderWidth: number;
    $borderColor: string;
    $offset: number;
    $isHovered: boolean;
    $hoverScale: number;
    $zIndex: number;
    $direction: "horizontal" | "vertical";
}>(
    ({
        $size,
        $color,
        $borderWidth,
        $borderColor,
        $offset,
        $isHovered,
        $hoverScale,
        $zIndex,
        $direction,
    }) => ({
        width: $size,
        height: $size,
        borderRadius: "50%",
        background: $color,
        border: `${$borderWidth}px solid ${$borderColor}`,
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s",
        zIndex: $isHovered ? 100 : $zIndex,
        transform: $isHovered ? `scale(${$hoverScale})` : "scale(1)",
        boxShadow: $isHovered
            ? "0 8px 24px rgba(0, 0, 0, 0.25)"
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
        // Offset for overlapping effect
        marginLeft: $direction === "horizontal" && $offset > 0 ? -$offset : 0,
        marginTop: $direction === "vertical" && $offset > 0 ? -$offset : 0,
        "&:hover": {
            // Handled via state for proper z-index management
        },
    })
);

// ============================================================================
// Helper Functions
// ============================================================================

const resolveThemeColor = (
    color: string,
    theme: ReturnType<typeof useTheme>
): string => {
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

const AGCircleEmbellishment: React.FC<AGCircleEmbellishmentProps> = ({
    colors,
    size = 48,
    overlap = 0.3,
    borderWidth = 3,
    borderColor = "#FFFFFF",
    hoverScale = 1.2,
    direction = "horizontal",
    className,
}) => {
    const theme = useTheme();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Calculate offset based on overlap percentage
    const offset = size * overlap;

    return (
        <Container $direction={direction} className={className}>
            {colors.map((color, index) => {
                const resolvedColor = resolveThemeColor(color, theme);
                const resolvedBorderColor = resolveThemeColor(borderColor, theme);

                return (
                    <Circle
                        key={index}
                        $size={size}
                        $color={resolvedColor}
                        $borderWidth={borderWidth}
                        $borderColor={resolvedBorderColor}
                        $offset={index === 0 ? 0 : offset}
                        $isHovered={hoveredIndex === index}
                        $hoverScale={hoverScale}
                        $zIndex={colors.length - index} // Last circle on top by default
                        $direction={direction}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                );
            })}
        </Container>
    );
};

export default AGCircleEmbellishment;