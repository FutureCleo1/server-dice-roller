const http = require("node:http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    // Allow requests from other websites
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle browser CORS preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Wake-up API
    if (req.method === "GET" && req.url === "/api/wake") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "awake",
            message: "Dice Roller server is awake!"
        }));

        return;
    }

    // Roll one six-sided die
    if (req.method === "GET" && req.url === "/api/roll") {

        const roll = Math.floor(Math.random() * 6) + 1;

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            roll: roll
        }));

        return;
    }

    // Roll five six-sided dice
    if (req.method === "GET" && req.url === "/api/roll-five") {

        const dice = [];

        for (let i = 0; i < 5; i++) {
            dice.push(Math.floor(Math.random() * 6) + 1);
        }

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            dice: dice
        }));

        return;
    }

    // API test page
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Dice Roller API Test</title>
            </head>

            <body>
                <h1>Dice Roller REST API</h1>

                <p>This page tests the REST APIs.</p>

                <button onclick="wakeServer()">
                    Wake Server
                </button>

                <button onclick="rollOne()">
                    Roll One Die
                </button>

                <button onclick="rollFive()">
                    Roll Five Dice
                </button>

                <pre id="result"></pre>

                <script>

                    async function wakeServer() {

                        const response =
                            await fetch("/api/wake");

                        const data =
                            await response.json();

                        document.getElementById("result")
                            .textContent =
                            JSON.stringify(data, null, 2);
                    }


                    async function rollOne() {

                        const response =
                            await fetch("/api/roll");

                        const data =
                            await response.json();

                        document.getElementById("result")
                            .textContent =
                            JSON.stringify(data, null, 2);
                    }


                    async function rollFive() {

                        const response =
                            await fetch("/api/roll-five");

                        const data =
                            await response.json();

                        document.getElementById("result")
                            .textContent =
                            JSON.stringify(data, null, 2);
                    }

                </script>

            </body>
            </html>
        `);

        return;
    }

    // Anything else
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "API endpoint not found"
    }));
});

server.listen(PORT, () => {
    console.log(`Dice Roller server running on port ${PORT}`);
});