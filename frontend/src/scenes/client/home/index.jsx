import React, { useEffect, useState } from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import Banner from "../../../components/Banner";
import BannerGallery from "../../../components/BannerGallery";
import Collection from "../../../components/Collection";
import SwiperBanner from "../../../components/SwiperBanner";
import WatchList from "../../../components/WatchList";
import { watches } from "../../../constants/index";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import BrandCard from "../../../components/BrandCard";
import PopularBrand from "../../../components/PopularBrand";
import axiosClient from "../../../axios-client";
import { Helmet } from "react-helmet-async";
import { useCart } from "../../../cart/cart";
import useFetchBanners from "../../../utils/hooks/banners/useFetchBanners";
import useFetchBrands from "../../../utils/hooks/brands/useFetchBrands";
import LoadingComponent from "../../../components/LoadingComponent";
import Error from "../../../components/Error";
import Watches from "../watches";

const Home = () => {
    const {
        banners,
        loading: loadingBanners,
        error: errorBanners,
    } = useFetchBanners();
    const {
        brands: famousBrands,
        loading: loadingFamousBrands,
        error: errorFamousBrands,
    } = useFetchBrands({ type: "famous" });
    const {
        brands: highEndSwissBrands,
        loading: loadingHighEndSwissBrands,
        error: errorHighEndSwissBrands,
    } = useFetchBrands({ type: "high-end-swiss" });
    return (
        <Box>
            <Helmet>
                <title>{process.env.VITE_APP_NAME}</title>
                <meta
                    name="description"
                    content={process.env.VITE_APP_DESCRIPTION}
                />
            </Helmet>

            {loadingBanners ? (
                <LoadingComponent />
            ) : errorBanners ? (
                <Error errorMessage={errorBanners} />
            ) : (
                <SwiperBanner banners={banners} />
            )}
            {/* Banner Gallery */}
            <BannerGallery />
            {/* Collection */}
            <Collection />
{/*
            {loadingFamousBrands ? (
                <LoadingComponent />
            ) : errorFamousBrands ? (
                <Error errorMessage={errorFamousBrands} />
            ) : (
                <PopularBrand brands={famousBrands} title="Famous Brands" />
            )}
            <Divider />
            {loadingHighEndSwissBrands ? (
                <LoadingComponent />
            ) : errorHighEndSwissBrands ? (
                <Error errorMessage={errorHighEndSwissBrands} />
            ) : (
                <PopularBrand
                    brands={highEndSwissBrands}
                    title="High-end Swiss Brand"
                />
            )} */}

            <Divider />
            <Watches
                watchType="male"
                title="High-end Male Watches"
                limit={8}
                isPagination={false}
            />
            <Divider />
            <Watches
                watchType="female"
                title="High-end Female Watches"
                limit={8}
                isPagination={false}
            />
            <Divider />
        </Box>
    );
};

export default Home;
