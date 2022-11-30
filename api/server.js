import express from "express";
import tadoRoutes from "./routes/tado.js";
import Tado from "node-tado-client";

const tado = new Tado();
const {
  PORT: port = 3000,
  TADO_USERNAME: tadoUser,
  TADO_PASSWORD: tadoPassword,
} = process.env;

const app = express();

app.get("/", (req, res) => {
  return res.json({ msg: "ping" });
});

app.use("/tado", tadoRoutes);

try {
  await tado.login(tadoUser, tadoPassword);
  const profile = await tado.getMe();
  console.log(profile);
  const users = await tado.getUsers(profile.homes[0].id);
  //   for (const user of users) {
  //     const { mobileDevices: devices, ...userProfile } = user;
  //     console.log(userProfile);
  //     for (const device of devices) {
  //       console.log(device);
  //     }
  //   }
  const zones = await tado.getZones(profile.homes[0].id);
  const devices = await tado.getDevices(profile.homes[0].id);
  const temperatureOffsets = await Promise.all(
    devices.map((device) => {
      return tado.getDeviceTemperatureOffset(device.serialNo);
    })
  );
  const mobileDevices = await tado.getMobileDevices(profile.homes[0].id);
  console.log(mobileDevices);
  console.log(temperatureOffsets);

  //   console.log(zones);
  //   console.log(devices);
  app.listen(port, () => {
    console.log("up and running");
  });
} catch (error) {
  console.log(error);
}
