import axios from "axios";
import nodemailer from "nodemailer";

export const embeddedTemplate = () => {
  return axios.get("https://api.moesif.com/v1/portal/~/workspaces");
};

export const fetchAllTerrariums = () => {
  return axios.get("/api/terrariums/all");
};

export const fetchUserTerrarium = (userId) => {
  return axios.get(`/api/terrariums/user/${userId}`);
};

export const createTerrarium = (newTerrarium) => {
  return axios.post("/api/terrariums/", newTerrarium);
};

export const updateTerrarium = (terrarium) => {
  return axios.patch(`/api/terrariums/${terrarium._id}`, terrarium);
};

export const getMoesifTemplate = () => {
  const data = {
    template: {
      values: {
        action_name: "Landing-Banner-Viewed",
        company_id: "125:14",
      },
      // from: '2021-02-09T02:52:39Z',
      // to: '2021-02-16T02:52:39Z'
    },
  };
  return axios.post(
    "https://api-dev.moesif.com/v1/portal/~/workspaces/6400f3eedbd44e336639cac2/access_token?expiration=2023-03-03T19:07:27.500Z",
    data,
    {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiI0Nzg6MjAiLCJzdWIiOiJhdXRoMHw2MTViNmQ1ZTliY2MxZTAwNjg3OGU4NzgiLCJhdWQiOiJxd016Y3N6aVc1YW1PRVFUTkZyM1ZNVk9tRGlKMzRNSCIsInZlciI6IjEiLCJvcmciOiIxMjU6MTQiLCJwZXJtaXNzaW9ucyI6eyIxMjU6MTQiOnsic2NwIjoicmVhZDp3b3Jrc3BhY2VzIn19LCJpc3MiOiJodHRwczovL3dlYi1kZXYubW9lc2lmLmNvbS93cmFwL2FwcC8xMjU6MTQtNDc4OjIwIiwiaWF0IjoxNjc3NzE1MjAwLCJqdGkiOiI2ODQwZjA2Ni02OWVmLTQ2MjctYTVkMi1mZWFmZTQ3ZDE5MjIifQ.jOulGxQaS6ZtAsi0fdqsshsN7yVqjH4bF78yCiCkeDU",
        "Content-Type": "application/json",
      },
    }
  );
};

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 25,
  auth: { user: "c7e102a6423545", pass: "7fba351f690c67" },
});

export const sendTestEmail = () => {
  return transporter.sendMail(
    {
      from: "andy@moesif.com",
      to: "andy@moesif.com",
      subject: "arium test",
      text: "Test",
      html: "<div>Test</div>",
    },
    (error, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email success");
      }
    }
  );
};
