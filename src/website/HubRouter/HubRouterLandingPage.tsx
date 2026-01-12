import { Divider, Grid, Switch } from "@mui/material";
import AGTitle from "../../library/components/AGTitle";
import AGButton from "../../library/components/AGButton";
import AGBox from "../../library/components/AGBox";
import AGRichText from "../../library/components/AGRichText";
import AGChip from "../../library/components/AGChip";
import { Bolt, Psychology, Rule, Start, Umbrella, Warning } from "@mui/icons-material";
import React from "react";
import InfoBlock from "../../library/blocks/InfoBlock";
import AGDivider from "../../library/components/AGDivider";
import InfoBlockHorizontal from "../../library/blocks/InfoBlockHorizontal";
import AGPictureFrame from "../../library/components/AGPictureFrame";
import AGIcon from "../../library/components/AGIcon";
import StepFlow from "../../library/sections/StepFlow";
import HubRouterForm from "./Form/HubRouter.Form";
import HubRouterPresentationImg from "../../../public/HubRouterPresentation.webp";
import AGCircleEmbellishment from "../../library/components/AGCircleEmbellishment";
import DynamicFooter from "../../library/sections/Footer";

const HubRouterLandingPage = () => {

    return (
        <React.Fragment>
            <AGBox paddingTop={10} paddingBottom={15} paddingLeft={30} paddingRight={30} backgroundPulse backgroundPulseOrigin="center" backgroundPulseIntensity={0.25} backgroundPulseColor="#27A36F" backgroundPulseDuration={4000}>
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={5}>
                        <AGChip icon={<Bolt />} label="The Workflow-Killer for HubSpot" iconColor="#FFD700" size="medium" onHoverShadow={true} color="#FFFF" textColor="#000000" />
                        <AGTitle variant="h2" weight={700} sx={{ mt: 4, mb: 2 }}>
                            HubSpot Sales Hub doesn't do
                        </AGTitle>
                        <AGTitle variant="h2" weight={700} sx={{ mb: 2 }} gradient={["#4B8DBA", "#27A36F"]}>
                            Skill-Based Routing.
                        </AGTitle>
                        <AGTitle variant="h2" weight={700} sx={{ mb: 2 }}>
                            HubRouter does.
                        </AGTitle>
                        <AGRichText sizeScale="lg">
                            Stop building 50-step "Workflow Spaghetti" just to assign a lead. Replace fragile logic with a simple, dynamic routing table.
                        </AGRichText>
                        <AGButton gradient={["#4B8DBA", "#27A36F"]} sx={{ mt: 4 }} expandOnHover={true} expandScale={1.05}>
                            Get Started
                        </AGButton>
                        <Divider sx={{ mt: 6, mb: 6 }} />
                        <Grid container spacing={2}>
                            <Grid size={3}>
                                <AGCircleEmbellishment
                                    colors={["primary.main", "secondary.main", "#FF6B6B"]}
                                    size={44}
                                    overlap={0.3}
                                    hoverScale={1.3}
                                />
                            </Grid>
                            <Grid size={9}>
                                <AGRichText variant="body2">
                                    <b>12</b> out of <b>20</b> spots filled. Apply now to secure your founding spot!
                                </AGRichText>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid size={7} alignContent={"right"}>
                        <AGPictureFrame
                            width={800}
                            height={600}
                            src={HubRouterPresentationImg}
                            alt="HubRouter Presentation"
                            borderColor={['#27A36F', '#4B8DBA']}
                            borderWidth={8}
                            rounded={16}
                            boxShadow="0 8px 24px rgba(0,0,0,0.2)"
                            bottomLeft={
                                <AGChip
                                    icon={<Bolt />}
                                    label="Workflow Complexity"
                                />
                            }
                            topRight={
                                <AGChip
                                    icon={<Bolt />}
                                    label="Workflow Complexity"
                                />
                            }

                        />
                    </Grid>
                </Grid>

            </AGBox>
            <AGDivider
                topColor={'transparent'}
                bottomColor={"#FFFFFF"}
                variant="wave"
                height={100}
                sx={{
                    marginTop: '-100px', // Pull up into the AGBox
                    position: 'relative',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            />
            <AGBox paddingTop={2} paddingBottom={2} textAlign="center">
                <AGChip icon={<Warning />} label="The breaking point" iconColor="#FFA500" size="medium" onHoverShadow={true} color="#FFF4E5" textColor="#000000" />
                <AGTitle variant="h2" weight={700} sx={{ mb: 2 }}>
                    Workflows are for automations.
                </AGTitle>
                <AGTitle variant="h2" weight={700} gradient={["#FFB626", "#E15F5D"]} sx={{ mb: 2 }}>
                    Not for people.
                </AGTitle>
                <AGRichText>
                    If your sales team is growing, your "Lead Assignment" workflow is likely a nightmare.
                </AGRichText>
                <AGBox padding={10}>
                    <Grid container spacing={4} padding={6}>
                        <Grid size={4} alignContent={"right"} paddingLeft={20}>
                            <InfoBlock
                                title="The Vacation Tax for HubSpot Sales Teams"
                                description="You have to manually delete a rep from 5 different branches just so they can go on holiday."
                                icon={<Bolt />}
                                borderColor="#EA6F58"
                                shadowOnHover={true}
                                expandOnHover={true}
                                maxWidth={500}
                            />
                        </Grid>
                        <Grid size={4} alignContent={"center"}>
                            <InfoBlock
                                title="Orphaned Leads Falling Through the Cracks"
                                description="When a lead is missing a property (like Zip Code or Industry), your workflow breaks, and the lead sits unassigned for days."
                                icon={<Umbrella />}
                                borderColor="#FFB626"
                                shadowOnHover={true}
                                expandOnHover={true}
                                maxWidth={500}

                            />
                        </Grid>
                        <Grid size={4} alignContent={"left"} paddingRight={20}>
                            <InfoBlock
                                title="Orphaned Leads Falling Through the Cracks"
                                description={`You're sending "Enterprise" leads to "Junior" reps because HubSpot's Round Robin is blind to expertise.`}
                                icon={<Umbrella />}
                                borderColor="#FFB626"
                                shadowOnHover={true}
                                expandOnHover={true}
                                maxWidth={500}
                            />
                        </Grid>
                    </Grid>
                    <AGBox paddingTop={5} backgroundMode="image" bgImage="https://wallpapers.com/images/hd/funny-random-pictures-736-x-1333-k8bjfbmgyj5bswzi.jpg" >
                        Your "Lead Assignment" Workflow today.
                    </AGBox>
                </AGBox>
            </AGBox>
            <AGDivider
                topColor={["#27A36F", "#4B8DBA"]}
                bottomColor={'#FFFFFF'}
                variant="wave"
                height={50}
                paddingBottom={5}
                paddingTop={5}
                gradientAngle={25}
                flip={true}
            />
            <AGBox backgroundMode="gradient" bgGradient={["#27A36F", "#4B8DBA"]} paddingTop={10} paddingBottom={20} paddingLeft={30} paddingRight={30}>
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={7} alignContent={"center"}>
                        <AGPictureFrame
                            width={800}
                            height={500}
                            src="https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
                            alt="Instant Routing"
                            borderColor={['#4B8DBA', '#27A36F']}
                            borderWidth={8}
                            rounded={16}
                            bottomLeft={
                                <AGChip
                                    icon={<Bolt />}
                                    label="Instant Routing"
                                    color="#C8E600"
                                    iconColor="#fff"
                                    textColor="#000"
                                />
                            }
                            topRight={
                                <AGIcon
                                    color="#9E9E9E"
                                    shape="rounded"
                                    size="lg"
                                >
                                    <Psychology sx={{ color: '#FFD700' }} />
                                </AGIcon>
                            }
                        />
                    </Grid>
                    <Grid size={5} textAlign="left" alignItems={"left"}>
                        <AGChip icon={<Rule />} label="The solution" iconColor="#FFD700" size="medium" onHoverShadow={true} color="#FFFF" textColor="#000000" />
                        <AGTitle variant="h2" weight={700} sx={{ mt: 4, mb: 2, color: '#FFFFFF' }}>
                            Meet HubRouter:
                        </AGTitle>
                        <AGTitle variant="h2" weight={700} sx={{ mb: 2 }} gradient={["#FFC713", "#FF6A6A"]}>
                            The Brain HubSpot is Missing.
                        </AGTitle>
                        <AGRichText color="#FFFFFF" sizeScale="lg" html={"<p>HubRouter sits between your forms and your reps, acting as an <b>intelligent triage station.</b></p>"} />
                        <InfoBlockHorizontal
                            title="Toggle Availability"
                            description="One click to take a rep out of the rotation. No workflow editing required."
                            icon={<Switch />}
                            borderColor="#48AF46"
                            shadowOnHover={true}
                            liftOnHover={true}

                        />
                        <InfoBlockHorizontal
                            title="Toggle Availability"
                            description="One click to take a rep out of the rotation. No workflow editing required."
                            icon={<Switch />}
                            borderColor="#48AF46"
                            shadowOnHover={true}
                            liftOnHover={true}
                        />
                        <InfoBlockHorizontal
                            title="Toggle Availability"
                            description="One click to take a rep out of the rotation. No workflow editing required."
                            icon={<Switch />}
                            borderColor="#48AF46"
                            shadowOnHover={true}
                            liftOnHover={true}
                        />
                    </Grid>
                </Grid>
            </AGBox>
            <AGDivider
                topColor={['#FFFFFF']}
                bottomColor={["#27A36F", "#4B8DBA"]}
                variant="curve"
                height={100}
                flip={true}
            />
            <AGBox paddingTop={10} paddingBottom={10} paddingLeft={30} paddingRight={30} textAlign="center">
                <AGChip icon={<Start />} label="About HubRouter" iconColor="#27A36F" size="medium" onHoverShadow={true} color="#E6FFFA" textColor="#000000" />
                <AGTitle variant="h2" weight={700} sx={{ mb: 2 }}>
                    How it works
                </AGTitle>
                <AGRichText variant={"subtitle2"}>
                    Get up and running in minutes, not hours. No complicated setup required.
                </AGRichText>
                <StepFlow
                    steps={[
                        { title: "Connect", description: "Authenticate your HubSpot portal in 60 seconds." },
                        { title: "Tag", description: "Assign skills to your reps in our simple table." },
                        { title: "Route", description: "Set your logic (e.g., If Industry = Medical, route to Healthcare)." },
                        { title: "Relax", description: "We update the HubSpot Owner ID via API instantly." },
                    ]}
                    lineColor="#4caf50"
                    activeBorderColor="#4caf50"
                />
                <AGBox padding={6}>
                    <AGButton gradient={["#4B8DBA", "#27A36F"]} sx={{ mt: 4 }} expandOnHover={true} expandScale={1.05}>
                        Watch how it works!
                    </AGButton>
                </AGBox>
            </AGBox>
            <AGBox padding={6} textAlign="center" backgroundMode="gradient" bgGradient={["#27A36F", "#4B8DBA"]} paddingTop={10} paddingBottom={10} paddingLeft={30} paddingRight={30}>
                <AGChip icon={<Bolt />} label="Ready to ditch the spaghetti?" iconColor="#FFFFFF" size="medium" onHoverShadow={true} color="#333333" textColor="#FFFFFF" />
                <AGTitle variant="h2" weight={700} sx={{ mb: 2, color: '#FFFFFF' }}>
                    Help us build the
                </AGTitle>
                <AGTitle variant="h2" weight={700} gradient={["#FFD700", "#EA6F58"]}>
                    WorkFlow Killer
                </AGTitle>
                <AGRichText color="#FFFFFF" sizeScale="lg">
                    We are looking for 20 HubSpot Power Users to join our Early Adopter program. We don't want your money yet—we want your feedback.
                </AGRichText>
                <Grid container justifyContent="center" sx={{ mt: 4 }} paddingBottom={20}>
                    <Grid size={4}>
                        <InfoBlock
                            title="Exclusive Access"
                            description="Get early access to new features and direct influence on our roadmap."
                            icon={<Bolt />}
                            borderColor="#FFFFFF"
                            shadowOnHover={true}
                            expandOnHover={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <InfoBlock
                            title="Exclusive Access"
                            description="Get early access to new features and direct influence on our roadmap."
                            icon={<Bolt />}
                            borderColor="#FFFFFF"
                            shadowOnHover={true}
                            expandOnHover={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <InfoBlock
                            title="Exclusive Access"
                            description="Get early access to new features and direct influence on our roadmap."
                            icon={<Bolt />}
                            borderColor="#FFFFFF"
                            shadowOnHover={true}
                            expandOnHover={true}
                        />
                    </Grid>
                </Grid>
                <HubRouterForm />
            </AGBox>
            <DynamicFooter
                businessName="HubRouter"
                description="The Workflow-Killer for HubSpot Sales Hub"
                backgroundColor="#1A1A2E"
                textColor="#FFFFFF"
                accentColor="#27A36F"
                addCopyright={true}
            />
        </React.Fragment >
    )
}

export default HubRouterLandingPage;
