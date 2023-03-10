import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { AcsInputEmail, AcsInputPassword } from "@akkurateio/ds";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

const Authentification = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const Auth = () => {
    fetch("http://localhost:3000/api/user/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setCookie("tokencommerce", data.token);
          router.push("/my-account");
        }
      });
  };

  return (
    <Box>
      <AcsInputEmail label={"Email"} handleChange={setEmail} value={email} />
      <AcsInputPassword
        label={"Password"}
        handleChange={setPassword}
        value={password}
      />
      <Button mt={5} colorScheme={"green"} w={"full"} onClick={Auth}>
        connexion
      </Button>
    </Box>
  );
};

export default Authentification;
