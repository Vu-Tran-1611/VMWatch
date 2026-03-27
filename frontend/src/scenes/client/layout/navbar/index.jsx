import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import axiosClient from "../../../../axios-client";
import useFetchBrands from "../../../../utils/hooks/brands/useFetchBrands";
const Navbar = ({ isMobile = false }) => {
    const { brands, loading, error } = useFetchBrands({});

    const navItems = [
        // { name: "Brand", childs: brands },
        { name: "Male", link: "/watches?type=male" },
        { name: "Female", link: "/watches?type=female" },
        { name: "Couple", link: "/watches?type=couple" },
        // { name: "Contact", link: "/" },
    ];

    return (
        <Box
            display="flex"
            flexDirection={!isMobile ? "row" : "column"}
            justifyContent="space-around"
            margin={!isMobile && "20px 200px"}
            position="relative"
        >
            {!isMobile
                ? navItems.map((e) => (
                      <Link
                          style={{
                              textDecoration: "none",
                              color: "gray",
                              fontSize: "1rem",
                              textTransform: "uppercase",
                          }}
                          to={e.link}
                          className="hover-underline hover-open-menu-child"
                      >
                          {e.name}
                          <List
                              sx={{
                                  display: "none",
                                  gridTemplateColumns: "repeat(5,1fr)",
                              }}
                              className="menu-child"
                          >
                              {e?.childs?.map((child) => (
                                  <>
                                      <ListItem
                                          disablePadding
                                          component={Link}
                                          to={`/brands/${child.slug}`}
                                      >
                                          <ListItemButton color="secondary">
                                              <ListItemText
                                                  primary={child.name}
                                              />
                                          </ListItemButton>
                                      </ListItem>
                                  </>
                              ))}
                          </List>
                      </Link>
                  ))
                : navItems.map((e, index) => (
                      <List>
                          <ListItem key={index} disablePadding>
                              <ListItemButton>
                                  <ListItemText primary={e.name} />
                              </ListItemButton>
                          </ListItem>
                      </List>
                  ))}
        </Box>
    );
};

export default Navbar;
