"use client";

import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";

export default function Home() {

  const handleSuccess = async (credentialResponse) => {

    console.log("SUCCESS");
    console.log(credentialResponse);

    try {

      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/google",
        {
          credential: credentialResponse.credential,
        }
      );

      console.log("BACKEND RESPONSE:");
      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

    } catch (error) {

      console.log("AXIOS ERROR:");
      console.log(error);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("FAILED");
        }}
      />
    </div>
  );
}