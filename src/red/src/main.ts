import * as VIAM from "@viamrobotics/sdk";
import Cookies from "js-cookie";

document.addEventListener("DOMContentLoaded", async () => {
  const robotNameDivId = "robot-name";

  const robotNameDiv: HTMLElement | null = document.getElementById(robotNameDivId);

  if (!robotNameDiv) {
    throw new Error(`Could not find HTML element with ID ${robotNameDivId}`);
  }

  robotNameDiv.addEventListener("click", () => {
    window.location.href = "hello.html";
  });

  try {
    let hostname = "";
    let machineId = "";
    let apiKeyId = "";
    let apiKeySecret = ""

    const machineInfo = window.location.pathname.split("/")[2];

    ({
      apiKey: { id: apiKeyId, key: apiKeySecret },
      machineId: machineId,
      hostname: hostname,
    } = JSON.parse(Cookies.get(machineInfo)!));
    
    const robot = await (await connect(apiKeyId, apiKeySecret)).appClient.getRobot(machineId);

    robotNameDiv.textContent = robot?.name && hostname ? `${robot.name}: ${hostname}` : "Undefined";
  } catch (error) {
    console.log(error);

    robotNameDiv.textContent = "Could not retrieve robot. See console for more details";
  }
});

async function connect(apiKeyId: string, apiKeySecret: string): Promise<VIAM.ViamClient> {
  const opts: VIAM.ViamClientOptions = {
    serviceHost: "https://app.viam.com",
    credentials: {
      type: "api-key",
      authEntity: apiKeyId,
      payload: apiKeySecret,
    },
  };

  return await VIAM.createViamClient(opts);
}
