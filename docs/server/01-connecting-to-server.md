# Connecting to the server

Kristian Hannula, 03.04.2024

---

For now, the only way to communicate with the server is via SSH. In order to to connect to the server and to use the functionalities of the application, the following connection method is recommended:

`censored`

**_Disclaimer! The command above works on Linux & Mac. On Windows, it looks like [PuTTY can be configured to forward ports](https://phoenixnap.com/kb/ssh-port-forwarding). Or just use [WSL/WSL2](https://learn.microsoft.com/en-us/windows/wsl/install), which allows you to use Linux shell/subsystem on Windows._**

Let's break down what the command does:

1. `ssh`: This aims to establish an ssh connection to the given address
2. `-L 7474:localhost:7474` This forwards traffic from local port 7474 to remote port 7474, allowing you to use the Neo4J browser console with your web-browser using the address `http://localhost:7474`
3. `-L 7687:localhost:7687` Like above, this forwards traffic from your port 7687 to remote port 7687. This is needed for Neo4J's BOLT database communication.
4. `-L 3000:localhost:3000` And this connects your port 3000 to remote port 3000, allowing you to use the web API of the application. For example, you can check the app's health from `http://localhost:3000/health` and send queries to `http://localhost:3000/kg` or `http://localhost:3000/route`. You should login first using `http://localhost:3000/login`. Refer to the application manual for more information.
5. `censored` Replace `<your-username>` with your username on the server. This tells SSH who wants to connect and to where.

This should allow you to connect to the server with the required ports tunneled with SSH. When you terminate the connection to the server, your ports will be closed.

Next part: [Part 2 - Directories](/docs/server/02-directories.md)
