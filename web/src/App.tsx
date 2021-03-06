import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { Grid, Chip, Typography, Badge, Avatar, AppBar, Toolbar, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import classes from '*.module.css';

interface Status {
  build: number;
  name: string;
  track: string;
  vehicles: Vehicle[];
  maxLaps: number;
  startEventTime: number;
  endEventTime: number;
  currentEventTime: number;
  session: string;
}

interface Vehicle {
  position: number;
  carId: string;
  driverName: string;
  carClass: string;
  carVelocity: VehicleVelocity;
  fullTeamName: string;
  carNumber: string;
  inGarageStall: boolean;
  flag: string;
  penalties: number;
  pitState: string;
  pitstops: number;
  finishStatus: string;
  sector: string;
  pitting: boolean;
  lapsCompleted: number;
  pitLapDistance: number;
}

interface VehicleVelocity {
  x: number;
  y: number;
  z: number;
  velocity: number;
}



function App() {
  const [status, setStatus] = useState<Status | null>(null);
  const [polling, setPolling] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const target = query.get('target')
  const secret = query.get('secret')
  console.log(target, secret)

  const getItems = function () {
    setPolling(true);
    fetch(target + "/status/" + secret)
      .then(result => result.json() as unknown as Status)
      .then(result => {
        setPolling(false)
        const raw = result;
        raw.vehicles.sort((a, b) => a.position - b.position)

        setStatus(result)
      });
  }
  const addPenalty = function (driver: string, penalty: number) {
    fetch(target + "/penalty/" + secret + "/" + driver + "/" + penalty)
  }
  const teamName = (vehicle: Vehicle) => {
    return vehicle.fullTeamName.replace("#" + vehicle.carNumber, "")
  }
  const sectorNumber = (vehicle: Vehicle) => {
    return vehicle.sector.toLowerCase().replace("sector", "")
  }
  const secondToMinute = (seconds: number) => {
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    var secs = ~~seconds % 60;

    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
  const getLengthText = (status: Status) => {
    const max = status.maxLaps == 2147483647 || status.session.indexOf("QUALIFY") != -1 ? secondToMinute(status.endEventTime) : status.maxLaps;

    const current = status.maxLaps == 2147483647 || status.session.indexOf("QUALIFY") != -1 ? secondToMinute(status.currentEventTime) : Math.max.apply(Math, status.vehicles.map((v) => v.lapsCompleted))

    return current + "/" + max;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (!polling) {
        getItems()
      }
    }, 500);
    return () => clearInterval(interval);
  }, [polling]);
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>

            {status?.name}@{status?.track} {' '}
            <Chip
              className="build-chip"
              variant="outlined"
              size="small"
              label={'Build ' + status?.build}
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <main className="main-content">
        {status && <Container className="length-conditions" maxWidth={'xs'}>
          <Paper>
            {status.session}: {getLengthText(status)}
          </Paper>
        </Container>}
        <Container component="main" maxWidth={false}>
          <CssBaseline />
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              {status && <TableBody>
                {status.vehicles.map((row: Vehicle, index: number) => (
                  <TableRow key={index} className="entry-row">
                    <TableCell>
                      <Grid container spacing={3}>
                        <Grid item xs={2}>
                          <Avatar>P{row.position}</Avatar>
                        </Grid>
                        <Grid item xs={4}>
                          <b>[{row.carClass}] {teamName(row)}</b>
                          <br></br>
                          {row.driverName}
                        </Grid>

                        <Grid item xs={2} className="action-button">
                          <FormControl>
                            <InputLabel className="penalty-selection-label">Add or remove penalty</InputLabel>
                            <Select
                              labelId="penalty-selection-label"
                              className="penalty-selection"
                              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                const penalty = event.target.value
                                addPenalty(row.driverName, penalty as number)
                              }}
                            >
                              <MenuItem value="1">DT</MenuItem>
                              <MenuItem value="2">DSQ</MenuItem>
                              <MenuItem value="3">S&H5</MenuItem>
                              <MenuItem value="4">S&H10</MenuItem>
                              <MenuItem value="5">S&H15</MenuItem>
                              <MenuItem value="6">S&H20</MenuItem>
                              <MenuItem value="7">S&H25</MenuItem>
                              <MenuItem value="8">S&H30</MenuItem>
                              <MenuItem value="9">S&H35</MenuItem>
                              <MenuItem value="10">S&H40</MenuItem>
                              <MenuItem value="11">S&H45</MenuItem>
                              <MenuItem value="12">S&H50</MenuItem>
                              <MenuItem value="13">S&H55</MenuItem>
                              <MenuItem value="14">S&H60</MenuItem>
                              <MenuItem value="15">One S&H remove</MenuItem>
                              <MenuItem value="16">One DT remove</MenuItem>
                              <MenuItem value="17">All penalties remove</MenuItem>
                              <MenuItem value="18">unDSQ</MenuItem>
                              <MenuItem value="19">Get back (DSQ + unDSQ)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={2} className="action-button">
                          <FormControl>
                            <InputLabel className="lap-selection-label">Add or remove lap</InputLabel>
                            <Select
                              labelId="lap-selection-label"
                              className="lap-selection"
                              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                const penalty = event.target.value
                                addPenalty(row.driverName, penalty as number)
                              }}
                            >
                              {Array.from(Array(10), (e, i) => {
                                return <MenuItem key={'+' + i + 1} value={i + 20}> +{i + 1}</MenuItem>
                              })}
                              {Array.from(Array(10), (e, i) => {
                                return <MenuItem key={'-' + i + 1} value={i + 30}>-{i + 1}</MenuItem>
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell align="right">{(row.carVelocity.velocity * 3.6).toFixed(2)} km/h</TableCell>
                    <TableCell align="center">
                      {row.inGarageStall && <Grid item xs={1}>
                        <Avatar variant="square">G</Avatar>
                      </Grid>}
                    </TableCell>
                    <TableCell align="center">
                      {row.pitting && <>
                        <Avatar variant="square">Pit</Avatar>
                      </>}
                    </TableCell>
                    <TableCell align="center">
                      {row.flag && !row.pitting && !row.inGarageStall && <Avatar variant="square" style={
                        {
                          "background": row.flag,
                          "color": "white"
                        }
                      }>{row.flag[0]}</Avatar>}
                    </TableCell>
                    <TableCell align="center">
                      {row.flag && <Avatar variant="square" style={
                        {
                          "background": "grey",
                          "color": "black"
                        }
                      }>S{sectorNumber(row)}</Avatar>}
                    </TableCell>
                    <TableCell align="center">
                      {row.penalties > 0 && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "red",
                              "color": "white"
                            }
                          }>{row.penalties}P</Avatar>
                        </Grid>
                      </>
                      }
                    </TableCell>
                    <TableCell align="center">

                      {row.pitState === "ENTERING" && row.carVelocity.velocity > 0.1 && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "blue",
                              "color": "white"
                            }
                          }>PE</Avatar>
                        </Grid>
                      </>}

                      {row.pitState === "EXITING" && !row.inGarageStall && row.carVelocity.velocity > 0.1 && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "purple",
                              "color": "white"
                            }
                          }>PE</Avatar>
                        </Grid>
                      </>}
                      {row.pitState === "REQUEST" && !row.inGarageStall && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "yellow",
                              "color": "green"
                            }
                          }>PR</Avatar>
                        </Grid>
                      </>}
                    </TableCell>
                    <TableCell align="center">
                      {row.lapsCompleted} laps
                    </TableCell>
                    <TableCell align="center">
                      {row.pitstops} stops
                    </TableCell>
                    <TableCell align="center">
                      {row.pitLapDistance}m
                </TableCell>
                    <TableCell align="center">
                      {row.finishStatus === "FSTAT_DQ" && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "black",
                              "color": "white"
                            }
                          }>DQ</Avatar>
                        </Grid>
                      </>}
                      {row.finishStatus === "FSTAT_DNF" && <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={1}>
                          <Avatar variant="square" style={
                            {
                              "background": "red",
                              "color": "black"
                            }
                          }>DNF</Avatar>
                        </Grid>
                      </>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>}
            </Table>
          </TableContainer >
        </Container >
      </main>
    </>
  );
}

export default App;
