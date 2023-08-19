import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = (fn: () => void) => {
  const app = polka();

  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`
      <head>
  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #EBF0F5;
    }
    h1 {
      color: red;
      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: orange;
      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: red;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #C8D0D8;
      display: flex;
      flex-direction:column;
      margin: 0 auto;
    }
    .circle {
      border-radius: 200px;
      height: 200px;
      width: 200px;
      display:flex;
      align-items: center;
      justify-content:center;
      background: #F8FAF5;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="circle">
    <i class="fa fa-times" aria-hidden="true" style="font-size:200px"></i>
    </div>
    <h1>Failure</h1>
    <p>Something went wrong!!<br/>Please try again after some time</p>
  </div>
</body>
</html>
`);
      return;
    }

    await TokenManager.setToken(token);
    fn();

    res.end(`
    <head>
  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #EBF0F5;
    }
    h1 {
      color: #88B04B;
      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404F5E;
      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: #9ABC66;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #C8D0D8;
      display: inline-block;
      margin: 0 auto;
    }
    .circle {
      border-radius: 200px;
      height: 200px;
      width: 200px;
      display:flex;
      align-items: center;
      justify-content:center;
      background: #F8FAF5;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="circle">
    <i class="fa fa-check-circle" aria-hidden="true" style="font-size:200px"></i>
    </div>
    <h1>Success</h1>
    <p>Your authorization with GitHub was successful<br/>You can close this window now!</p>
  </div>
</body>
</html>
    `);

    (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};