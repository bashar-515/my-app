import * as VIAM from "@viamrobotics/sdk";
import Cookies from "js-cookie";

let apiKeyId = "";
let apiKeySecret = "";
let host = "";
let machineId = "";

async function main() {
  const robotNameDivId = "robot-name";
  const robotNameDiv: HTMLElement | null = document.getElementById(robotNameDivId);

  if (!robotNameDiv) {
    throw new Error(`Could not find HTML element with ID ${robotNameDivId}`);
  }

  robotNameDiv.addEventListener("click", () => {
    window.location.href = "hello.html";
  });

  const opts: VIAM.ViamClientOptions = {
    serviceHost: import.meta.env.VITE_SERVICE_HOST,
    credentials: {
      type: "api-key",
      payload: apiKeySecret,
      authEntity: apiKeyId,
    },
  };

  const client = await VIAM.createViamClient(opts);
  const machine = await client.appClient.getRobot(machineId);


  robotNameDiv.textContent = machine?.name && host ? `${machine.name}: ${host}` : "Undefined";
}

document.addEventListener("DOMContentLoaded", async () => {
  // Extract the machine identifier from the URL
  let machineCookieKey = window.location.pathname.split("/")[2];
  ({
    apiKey: { id: apiKeyId, key: apiKeySecret },
    machineId: machineId,
    hostname: host,
  } = JSON.parse(Cookies.get(machineCookieKey)!));

  main().catch((error) => {
    console.error("encountered an error:", error);
  });
});
