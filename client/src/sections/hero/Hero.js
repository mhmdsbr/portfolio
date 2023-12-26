import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DataProvider from "../../store/dataProvider";
import classes from "./Hero.module.scss";

import Button from "../../components/UI/button/Button";
import IntroText from "./IntroText";
import SectionContainer from "../../components/UI/section/SectionContainer";
import Section from "../../components/UI/section/Section";
import HeroScrollButton from "./HeroScrollButton";

const Hero = () => {
    const heroData = useSelector((state) => state.data.items);
    const loading = useSelector((state) => state.data.loading);
    const [dataFetched, setDataFetched] = useState(false);
    useEffect(() => {
        if (!dataFetched) {
            setDataFetched(true);
            console.log('Data fetching logic here');
        }
    }, [dataFetched]);

    if (loading || !heroData) {
        return <p>Loading...</p>;
    }

    const heroIntroText = [
        {
            titles: heroData.titles,
            location: heroData.location,
        }
    ];

    const heroBgImage = heroData.background_image ? heroData.background_image : '';
    const heroButton = heroData.button ? heroData.button : '';

    return (
        <>
            {dataFetched ? null : <DataProvider endpoint="hero-portfolio" />}
            <Section id="home" className={`p-0`}>
                <div className={classes['hero__wrap']}>
                    <div className={`${classes['hero__mask']} opacity-75 bg-dark`}/>
                    <div
                        className={`${classes['hero__bg']} parallax`}
                        style={{ backgroundImage: `url(${heroBgImage.url})` }}
                    ></div>
                    <div className={`${classes['hero__content']} d-flex min-vh-100`}>
                        <SectionContainer className="my-auto" >
                            <div className="row">
                                <div className="col-12 text-center">
                                    <IntroText
                                        data={heroIntroText}
                                    />
                                    <Button
                                        url={heroButton.url}
                                        content={heroButton.title}
                                        role="anchor"
                                    />
                                </div>
                            </div>
                        </SectionContainer>
                        <HeroScrollButton />
                    </div>
                </div>
            </Section>
        </>
    );
};

export default Hero;