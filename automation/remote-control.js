const WebSocket = require("ws");

(async () => {
  console.log("Open connection");

  const ws = new WebSocket(
    "ws://localhost:9222/devtools/browser/da35368a-77ca-44d6-9343-c8b975104c5a"
  );

  await new Promise((resolve) => ws.once("open", resolve));
  console.log("Opened connection");

  const targetsResponse = await request(
    {
      id: 1,
      method: "Target.getTargets",
    },
    ws
  );
  const pageTarget = targetsResponse.result.targetInfos.find(
    (info) => info.type === "page"
  );
  
  const sessionResponse = await request(
    {
      id: 2,
      method: "Target.attachToTarget",
      params: {
        targetId: pageTarget.targetId,
        flatten: true,
      },
    },
    ws
  );

  console.log("Attached to browser session target");
  const sessionId = sessionResponse.result.sessionId;

  await request(
    {
      sessionId,
      id: 3,
      method: "Page.navigate",
      params: {
        url: "https://google.com/",
      },
    },
    ws
  );
  console.log("Navigate to https://google.com/");

  await delay(5000);
  const documentResponse = await request(
    {
      sessionId,
      id: 4,
      method: "DOM.getDocument",
    },
    ws
  );
  console.log(documentResponse)

  const searchButtonResponse = await request(
    {
      sessionId,
      id: 5,
      method: "DOM.querySelector",
      params: {
        nodeId: documentResponse.result.root.nodeId,
        selector: "input.RNmpXc[aria-label='Mi sento fortunato']",
      },
    },
    ws
  );

  ws.close()
  console.log(searchButtonResponse)
})();

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

async function request(command, ws) {
  ws.send(JSON.stringify(command));

  return new Promise((resolve) => {
    ws.on("message", function (message) {
      const response = JSON.parse(message);
      if (response.id === command.id) {
        ws.removeListener("message", arguments.callee);
        resolve(response);
      }
    });
  });
}
