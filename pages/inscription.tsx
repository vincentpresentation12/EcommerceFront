import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Toast } from "@chakra-ui/react";
import { AcsInputEmail, AcsInputPassword, AcsInputText } from "@akkurateio/ds";

const Inscription = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirtsname] = useState("");
  const [lastname, setLastname] = useState("");
  const [adresse, setAdresse] = useState("");
  const [code_postal, setCode_postal] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();
  const Auth = () => {
    fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        adresse: adresse,
        code_postal: code_postal,
        city: city,
      }),
    })
      .then((res) => {
        if (res.status === 400) {
          throw new Error("Invalid input data.");
        }
        return res.json();
      })
      .then((data) => {
        router.push("/connection");
      })
      .catch((err) => {
        Toast({
          title: "Erreur",
          description: "une de vos champs n'est pas bon",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };
  // pattern fro email

  return (
    <>
      <Box ml={10} w={"80%"}>
        <AcsInputEmail label={"Email"} handleChange={setEmail} value={email} />
        <AcsInputText
          label={"firstname"}
          handleChange={setFirtsname}
          value={firstname}
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        />
        <AcsInputText
          label={"lastname"}
          handleChange={setLastname}
          value={lastname}
        />
        <AcsInputText
          label={"adresse"}
          handleChange={setAdresse}
          value={adresse}
        />
        <AcsInputText
          label={"code_postal"}
          handleChange={setCode_postal}
          value={code_postal}
        />
        <AcsInputText label={"city"} handleChange={setCity} value={city} />
        <AcsInputPassword
          label={"password"}
          handleChange={setPassword}
          value={password}
        />
      </Box>
      <Button
        textAlign={"center"}
        mt={5}
        colorScheme={"blue"}
        width={"full"}
        onClick={Auth}
      >
        S'inscrire
      </Button>
    </>
  );
};

export default Inscription;
