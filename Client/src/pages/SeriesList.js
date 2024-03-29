import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";
import { AuthContext } from "../firebase/Auth";

const SeriesList = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [seriesData, setseriesData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        const { data } = await axios.get(process.env.REACT_APP_EC2_HOST + "/matches/seriesList", {
          headers: { authtoken: authtoken },
        });
        console.log(data);
        setseriesData(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [currentUser]);

  const buildCard = (series) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={series && series.id}>
        <Card key={series.id} sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {series && series.name ? series.name : "Not Specified"}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="textSecondary">
              {series && series.startDate && series.endDate
                ? `${series.startDate} - ${series.endDate}`
                : "Not specified"}
            </Typography>
            <Typography variant="body2">
              ODI: {series && series.odi ? series.odi : "Not Specified"} | T20:{" "}
              {series && series.t20 ? series.t20 : "Not Specified"} | Test:{" "}
              {series && series.test ? series.test : "Not Specified"} | Squads:{" "}
              {series && series.squads ? series.squads : "Not Specified"} | Matches: {series.matches}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  card =
    seriesData &&
    seriesData.map((series) => {
      return buildCard(series);
    });

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div>
        <Typography variant="h1" style={{ fontSize: "30px", paddingBottom: "15px" }} textalign="center">
          {"Series List"}
        </Typography>
        <br />
        <div>{card}</div>
        <br />
      </div>
    );
  }
};

export default SeriesList;
