
import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import AGGlassBox from "../components/AGGlassBox";
import AGIcon from "../components/AGIcon";

interface Step {
    title: string;
    description: string;
    /** Custom icon - if not provided, step number is shown */
    icon?: React.ReactNode;
    /** Color for the step icon (supports theme tokens like "primary.main" or gradients) */
    color?: string;
}

interface StepFlowProps {
    steps: Step[];
    /** Color of the connecting line (supports theme tokens) */
    lineColor?: string;
    /** Index of the currently active/highlighted step (0-based) */
    activeStep?: number;
    /** Border color for the active step card */
    activeBorderColor?: string;
    /** Gap between step cards */
    gap?: number;
    /** Whether to show glass effect on cards */
    glass?: boolean;
}

// Default gradient colors for step icons
const defaultStepColors = [
    "linear-gradient(135deg, #2d7a7a 0%, #3d9a8a 100%)", // Teal
    "linear-gradient(135deg, #2a8a8a 0%, #3ab0a0 100%)", // Cyan-teal
    "linear-gradient(135deg, #f5a623 0%, #f7b731 100%)", // Orange
    "linear-gradient(135deg, #7cb342 0%, #aed581 100%)", // Green
    "linear-gradient(135deg, #5c6bc0 0%, #7986cb 100%)", // Indigo
    "linear-gradient(135deg, #ec407a 0%, #f48fb1 100%)", // Pink
];

const StepFlowContainer = styled(Box)({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    position: "relative",
    width: "100%",
});

const StepCardWrapper = styled(Box)<{ $isActive: boolean; $activeBorderColor?: string }>(
    ({ $isActive, $activeBorderColor }) => ({
        flex: "1 1 0",
        maxWidth: 300,
        minWidth: 200,
        position: "relative",
        zIndex: 1,
        "& > *": {
            height: "100%",
            border: $isActive ? `2px solid ${$activeBorderColor || "#4caf50"}` : undefined,
            borderRadius: 16,
        },
    })
);

const ConnectorLine = styled(Box)<{ $lineColor: string; $cardCount: number }>(
    ({ $lineColor, $cardCount }) => ({
        position: "absolute",
        top: 120, // Align with the middle of the icon
        left: `calc(50% / ${$cardCount} + 24px)`, // Start from center of first icon
        right: `calc(50% / ${$cardCount} + 24px)`, // End at center of last icon
        height: 3,
        background: $lineColor,
        zIndex: 0,
    })
);

const StepNumber = styled(Typography)({
    fontWeight: 700,
    fontSize: "1.5rem",
    color: "#fff",
    lineHeight: 1,
});

const StepFlow: React.FC<StepFlowProps> = ({
    steps,
    lineColor = "#e0e0e0",
    activeStep,
    activeBorderColor = "#4caf50",
    gap = 16,
    glass = true,
}) => {
    const theme = useTheme();

    // Resolve theme color tokens
    const resolveColor = (color: string): string => {
        if (color.includes(".")) {
            const [palette, shade] = color.split(".");
            const paletteObj = (theme.palette as unknown as Record<string, Record<string, string> | undefined>)[palette];
            if (paletteObj && shade in paletteObj) {
                return paletteObj[shade];
            }
        }
        return color;
    };

    const resolvedLineColor = resolveColor(lineColor);

    return (
        <StepFlowContainer sx={{ gap: `${gap}px` }}>
            {/* Connector line behind cards */}
            <ConnectorLine $lineColor={resolvedLineColor} $cardCount={steps.length} />

            {steps.map((step, index) => {
                const isActive = activeStep === index;
                const stepColor = step.color || defaultStepColors[index % defaultStepColors.length];

                return (
                    <StepCardWrapper
                        key={index}
                        $isActive={isActive}
                        $activeBorderColor={activeBorderColor}
                    >
                        <AGGlassBox
                            glass={glass}
                            glassBlur={50}
                            glassOpacity={glass ? 70 : 100}
                            padding={24}
                            rounded={16}
                            shadow="0 4px 20px rgba(0,0,0,0.08)"
                            alignContent="center"
                            liftOnHover
                            liftAmount={4}
                            shadowOnHover
                        >
                            <Box sx={{ mb: 2 }}>
                                <AGIcon
                                    color={stepColor}
                                    size="lg"
                                    shape="rounded"
                                    expandOnHover
                                >
                                    {step.icon || <StepNumber>{index + 1}</StepNumber>}
                                </AGIcon>
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    textAlign: "center",
                                }}
                            >
                                {step.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    textAlign: "center",
                                    lineHeight: 1.6,
                                }}
                            >
                                {step.description}
                            </Typography>
                        </AGGlassBox>
                    </StepCardWrapper>
                );
            })}
        </StepFlowContainer>
    );
};

export default StepFlow;