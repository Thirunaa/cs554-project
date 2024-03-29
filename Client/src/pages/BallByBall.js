import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useStyles } from "../styles/ballbyballStyles";
import { Typography, Divider, Box, CircularProgress } from "@mui/material";
import { AuthContext } from "../firebase/Auth";

const BallByBall = () => {
  // eslint-disable-next-line
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [bbbData, setbbbData] = useState(undefined);
  const classes = useStyles();
  let score = 0;

  let { id } = useParams();

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      let authtoken = await currentUser.getIdToken();
      try {
        const { data } = await axios.get(process.env.REACT_APP_EC2_HOST + "/matches/match_bbb/" + id, {
          headers: { authtoken: authtoken },
        });
        if (data) {
          setbbbData(data);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [id, currentUser]);

  let firstInnings = [];
  let secondInnings = [];

  if (bbbData) {
    bbbData.data.bbb.forEach((x) => {
      if (x.inning === 0) {
        firstInnings.push(x);
      } else {
        secondInnings.push(x);
      }
    });
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div style={{ width: "60%", backgroundColor: "#f1faee", marginLeft: "20%", marginRight: "20%" }}>
        <br />
        <Typography variant="h1" style={{ fontSize: "30px", paddingBottom: "15px" }} textalign="center">
          {"Ball by Ball details"}
        </Typography>
        <Typography variant="h2" style={{ fontSize: "30px", paddingBottom: "15px" }} textalign="center">
          {""}
        </Typography>
        <Typography variant="h3" style={{ fontSize: "30px", paddingBottom: "15px" }} textalign="center">
          {""}
        </Typography>
        <card>
          <Typography sx={{ flex: "1 1 100%" }} variant="h3" id="tableTitle" component="div">
            {bbbData && bbbData.data && bbbData.data.name}
          </Typography>
          <br></br>
          <Typography sx={{ flex: "1 1 100%" }} variant="h4" id="tableTitle" component="div">
            Toss-winner:{bbbData && bbbData.data && bbbData.data.tossWinner}
          </Typography>
          <br></br>
          <Typography sx={{ flex: "1 1 100%" }} variant="h4" id="tableTitle" component="div">
            Toss-choice:{bbbData && bbbData.data && bbbData.data.tossChoice}
          </Typography>
        </card>
        <br></br>
        <card>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" id="tableTitle" component="div">
            INNINGS : {bbbData && bbbData.data && bbbData.data.score[0].inning}
          </Typography>
        </card>
        <br></br>

        {bbbData &&
          firstInnings.map((x, index) =>
            x.penalty === "no ball" || x.penalty === "wide" ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over}.{x.ball}{" "}
                  </Typography>

                  <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},this was a {x.penalty} bowl ,score
                    is {(score = score + x.runs)}
                  </Typography>
                </card>
                <br></br>
              </React.Fragment>
            ) : x.ball === 6 && x.penalty === undefined ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over}.{x.ball}{" "}
                  </Typography>
                  <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},score is{" "}
                    {(score = score + x.runs)}
                  </Typography>
                </card>
                <br></br>
                <Box boxShadow={3}>
                  <card className={classes.card} variant="outlined" sx={{ flex: "1 1 100%", width: "100%" }}>
                    <div className={classes.section}>
                      <Typography variant="h2">{x.over + 1}</Typography>
                    </div>
                    <Divider
                      className={classes.divider}
                      orientation="vertical"
                      sx={{
                        height: "100%",
                        margin: "0 8px",
                      }}
                    />
                    <div className={classes.section}>
                      <Typography variant="h3">
                        Score after {x.over + 1} over is {score}
                      </Typography>
                    </div>
                    <Divider
                      className={classes.divider}
                      orientation="vertical"
                      sx={{
                        height: "100%",
                        margin: "0 8px",
                      }}
                    />
                    <div className={classes.section}>
                      <Typography variant="h4" style={{ fontSize: "20px" }}>
                        With {x.batsman.name} being on the batting side and {x.bowler.name} bowling the over.
                      </Typography>
                    </div>
                  </card>
                </Box>
                <br></br>
              </React.Fragment>
            ) : (
              <card className={classes.card1} sx={{ flex: "1 1 10%" }}>
                <Typography variant="h4">
                  {x.over}.{x.ball}{" "}
                </Typography>
                <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                  {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs} ,score is {(score = score + x.runs)}
                </Typography>
              </card>
            )
          )}
        <p style={{ color: "#5f7955" }}>{(score = 0)}</p>
        <Typography sx={{ flex: "1 1 100%" }} variant="h4" id="tableTitle" component="div">
          INNINGS : {bbbData && bbbData.data && bbbData.data.score[1].inning}
        </Typography>
        <br></br>

        {bbbData &&
          secondInnings.map((x, index) =>
            x.penalty === "no ball" || x.penalty === "wide" ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over}.{x.ball}{" "}
                  </Typography>
                  <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},this was a {x.penalty} bowl ,score
                    is {(score = score + x.runs)}
                  </Typography>
                </card>
                <br></br>
              </React.Fragment>
            ) : x.ball === 6 && x.penalty === undefined ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over}.{x.ball}{" "}
                  </Typography>
                  <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},score is{" "}
                    {(score = score + x.runs)}
                  </Typography>
                </card>
                <br></br>
                <Box boxShadow={3}>
                  <card className={classes.card} variant="outlined" sx={{ flex: "1 1 100%", width: "100%" }}>
                    <div className={classes.section}>
                      <Typography variant="h2">{x.over + 1}</Typography>
                    </div>
                    <Divider
                      className={classes.divider}
                      orientation="vertical"
                      sx={{
                        height: "100%",
                        margin: "0 8px",
                      }}
                    />
                    <div className={classes.section}>
                      <Typography variant="h3">
                        Score after {x.over + 1} over is {score}
                      </Typography>
                    </div>
                    <Divider
                      className={classes.divider}
                      orientation="vertical"
                      sx={{
                        height: "100%",
                        margin: "0 8px",
                      }}
                    />
                    <div className={classes.section}>
                      <Typography variant="h4" style={{ fontSize: "20px" }}>
                        With {x.batsman.name} being on the batting side and {x.bowler.name} bowling the over.
                      </Typography>
                    </div>
                  </card>
                </Box>
                <br></br>
              </React.Fragment>
            ) : (
              <card className={classes.card1} sx={{ flex: "1 1 10%" }}>
                <Typography variant="h4">
                  {x.over}.{x.ball}{" "}
                </Typography>
                <Typography variant="h5" sx={{ flex: "1 1 10%" }}>
                  {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs} ,score is {(score = score + x.runs)}
                </Typography>
              </card>
            )
          )}
      </div>
    );
  }
};

export default BallByBall;
