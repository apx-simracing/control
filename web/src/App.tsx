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

  const getItems = function () {
    setPolling(true);
    fetch("http://localhost:8080/status")
      .then(result => result.json() as unknown as Status)
      .then(result => {
        setPolling(false)
        const raw = result;
        raw.vehicles.sort((a, b) => a.position - b.position)

        setStatus(result)
      });
  }
  const teamName = (vehicle: Vehicle) => {
    return vehicle.fullTeamName.replace("#" + vehicle.carNumber, "")
  }
  const sectorNumber = (vehicle: Vehicle) => {
    return vehicle.sector.toLowerCase().replace("sector", "")
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (!polling) {
        getItems()
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [polling]);
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>

            {status?.name} {status?.track} {' '}
            <Chip
              className="build-chip"
              variant="outlined"
              size="small"
              label={status?.build}
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <main className="main-content">
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
                            <InputLabel className="penalty-selection-label">Select penalty</InputLabel>
                            <Select
                              labelId="penalty-selection-label"
                              className="penalty-selection"
                            >
                              <MenuItem>DT</MenuItem>
                              <MenuItem>DSQ</MenuItem>
                              <MenuItem>S&H5</MenuItem>
                              <MenuItem>S&H10</MenuItem>
                              <MenuItem>S&H15</MenuItem>
                              <MenuItem>S&H20</MenuItem>
                              <MenuItem>S&H25</MenuItem>
                              <MenuItem>S&H30</MenuItem>
                              <MenuItem>S&H35</MenuItem>
                              <MenuItem>S&H40</MenuItem>
                              <MenuItem>S&H45</MenuItem>
                              <MenuItem>S&H50</MenuItem>
                              <MenuItem>S&H55</MenuItem>
                              <MenuItem>S&H60</MenuItem>
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
