import axios from "axios";

const GITHUB_API_URL =
  "https://api.github.com/repos/prasangeet/profile-pictures/contents/";

export const uploadFileToGithub = async (fileBuffer, fileName, message) => {
  const url = `${GITHUB_API_URL}${fileName}`;

  const encodedFile = fileBuffer.toString("base64");

  const data = {
    message,
    content: encodedFile,
    branch: "main",
  };
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    return response.data.content.html_url;
  } catch (error) {
    throw new Error("Failed to upload file to GitHub: " + error.message);
  }
};
