<script>
    const icons = require("feather-icons").icons;
    const mscIcons = require.context("./static/msc/");

    export default {
        name: "onboarding",
        data() {

            let welcomeFeature = {
                icon: null,
                title: `Welcome to ${BRANDING.appName}`,
                desc: "A room based file transfer tool. Invite people to your room and experience the fastest and most secure transfers possible."
            };

            let sliderFeatures = [
                {
                    icon: mscIcons("./network.svg"),
                    title: "Fast",
                    desc: "Using an advanced peer-to-peer protocol, the more people in your room, the faster downloads are for everyone. It also means transfers over your local network are extremely fast!"
                },
                {
                    icon: mscIcons("./anonymous.svg"),
                    title: "Completely Private",
                    desc: "File transfers are serverless, which means your files never touch our servers. It's kinda like you hand delivering a package, instead of using the mail system."
                },
                {
                    icon: mscIcons("./shield.svg"),
                    title: "Secure",
                    desc: "Your files are always encrypted when transferring. No one can see your file contents except you and the recipients."
                }
            ];

            if(this.isMobile()) {
                sliderFeatures.unshift(welcomeFeature);
            }

            return {
                currentIndex: 0,
                welcomeFeature,
                sliderFeatures,
                leftArrowIcon: icons["arrow-left"].toSvg(),
                rightArrowIcon: icons["arrow-right"].toSvg(),
                appName: BRANDING.appName
            }
        },
        methods: {
            left() {
                if(this.currentIndex !== 0) {
                    this.currentIndex--;
                }
            },
            right() {
                if(this.currentIndex + 1 !== this.sliderFeatures.length) {
                    this.currentIndex++;
                }
            },
            close() {
                window.AppState.shouldShowOnboarding = false;
            },
            isMobile: window.isMobile
        },
        components: {
            "confirmation-window": require("./confirmation-window.vue").default
        }
    }
</script>

<template>
    <confirmation-window>
        <div class="onboarding">
            <div class="logo">{{ appName }}</div>

            <div v-if="!isMobile()" class="feature feature-welcome">
                <div class="feature-icon" v-if="welcomeFeature.icon">{{ welcomeFeature.icon }}</div>
                <div class="feature-title">{{ welcomeFeature.title }}</div>
                <div class="feature-desc">{{ welcomeFeature.desc }}</div>
            </div>

            <div class="slider">
                <div class="features">
                    <div v-for="(f, index) in sliderFeatures" :class="{ feature: true, hide: isMobile() && currentIndex !== index }">
                        <div class="feature-icon"><img :src="f.icon"></div>
                        <div class="feature-title">{{ f.title }}</div>
                        <div class="feature-desc">{{ f.desc }}</div>
                    </div>
                </div>
                <div v-if="isMobile()" class="controls">
                    <div class="slide slide-left" @click="left" v-html="leftArrowIcon"></div>

                    <div class="dots">
                        <div v-for="(f, index) in sliderFeatures" :class="{ dot: true, selected: currentIndex === index }"></div>
                    </div>

                    <div class="slide slide-right" @click="right" v-html="rightArrowIcon"></div>

                </div>

            </div>

            <div class="call-to-action">
                <div class="whisper">No signup or downloads</div>
                <button class="button button-primary" @click="close">Try it</button>
            </div>
        </div>
    </confirmation-window>

</template>

<style scoped>

    .logo {

        top: 0;
        left: 0;
        width: 100%;
        font-weight: bold;
        padding: 20px 25px;
        box-sizing: border-box;
        font-size: 1.15em;
        color: #353535b0;
    }

    .controls {
        display: flex;
        width: 100%;
        justify-content: space-around;
        align-items: center;
        padding: 30px 0;
    }

    .onboarding {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        background-color: #2196F3;
        color: white;
    }

    .slider {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80%;
    }

    .slide {
        height: 24px;
        cursor: pointer;
        color: white;
    }

    .features {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
    }

    .feature {
        text-align: center;
    }

    .feature-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 22px;
    }

    .feature-icon img {
        width: 25%;
    }

    .feature-title {
        font-size: 1.5em;
        margin-bottom: 15px;
        font-weight: bold;
    }

    .feature-desc {

    }

    .dots {
        display: flex;
    }

    .dot {
        width: 8px;
        height: 8px;
        margin: 0 5px;
        border-radius: 30px;
        background-color: rgba(0, 0, 0, 0.35);
    }

    .dot.selected {
        background-color: white;
    }

    .call-to-action {
        height: 35%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: white;
    }

    .call-to-action .button {
        width: 25%;
        margin-top: 10px;
        font-size: 1.25em;
    }

    .whisper {
        color: #757575;
        font-size: 0.75em;
    }

    .feature-welcome {
        max-width: 500px;
        margin-bottom: 30px;
    }

    .feature-welcome .feature-title {
        font-size: 2em;
    }

    @media(min-width: 769px) {
        .feature:not(.feature-welcome) {
            width: 33%;
            padding: 0 25px;
        }
    }

    @media(max-width: 768px) {

        .feature {
            padding: 10%;
        }

        .feature-title {
            font-size: 2em;
        }

        .call-to-action {
            height: 20%;
        }

        .call-to-action .button {
            width: 75%;
        }


        .feature-icon img {
            width: 50%;
        }
    }

</style>