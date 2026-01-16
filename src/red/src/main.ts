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
    try {
      // Extract the machine identifier from the URL
      let machineCookieKey = window.location.pathname.split("/")[2];
      console.log("Machine cookie key:", machineCookieKey);

      const rawCookieValue = Cookies.get(machineCookieKey);
      console.log("Raw cookie value:", rawCookieValue);
      console.log("Cookie value type:", typeof rawCookieValue);
      console.log("Cookie value length:", rawCookieValue?.length);

      if (!rawCookieValue) {
        console.error("Cookie not found!");
        return;
      }

      // Log first 100 characters to see what we're dealing with
      console.log("First 100 chars:", rawCookieValue.substring(0, 100));

      // Try parsing as-is
      console.log("Attempting to parse as plain JSON...");
      let parsedData;
      try {
        parsedData = JSON.parse(rawCookieValue);
        console.log("✓ Parsed as plain JSON successfully!");
      } catch (e) {
        console.log("✗ Failed to parse as plain JSON:", e);
        console.log("Attempting to parse as base64-encoded JSON...");
        try {
          const decoded = atob(rawCookieValue);
          console.log("Decoded base64:", decoded);
          parsedData = JSON.parse(decoded);
          console.log("✓ Parsed as base64-encoded JSON successfully!");
        } catch (e2) {
          console.error("✗ Failed to parse as base64 too:", e2);
          throw e2;
        }
      }

      console.log("Parsed data:", parsedData);

      ({
        apiKey: { id: apiKeyId, key: apiKeySecret },
        machineId: machineId,
        hostname: host,
      } = parsedData);

      console.log("Extracted values:", { apiKeyId, machineId, host });

      main().catch((error) => {
        console.error("encountered an error:", error);
      });
    } catch (error) {
      console.error("Error in DOMContentLoaded:", error);
    }
  });
