import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Header from "@/components/Header";
import {
  AcsInputEmail,
  AcsInputPassword,
  AcsInputText,
  AisArrowRight,
} from "@akkurateio/ds";

const MyAccount = () => {
  const token = getCookie("tokencommerce");
  const [ok, setOk] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setFirtsname] = useState("");
  const [lastname, setLastname] = useState("");
  const [adresse, setAdresse] = useState("");
  const [code_postal, setCode_postal] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState<{
    firstname: string;
    email: string;
    lastname: string;
    city: string;
    code_postal: string;
    level: number;
  }>({
    firstname: "",
    email: "",
    lastname: "",
    city: "",
    code_postal: "",
    level: 0,
  });
  useEffect(() => {
    fetch("http://localhost:3000/api/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      });
  }, [ok, token]);

  const Update = () => {
    fetch("http://localhost:3000/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: email,
        firstname: firstname,
        lastname: lastname,
        adresse: adresse,
        code_postal: code_postal,
        city: city,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOk(!ok);
      });
  };

  const UpdatePassword = () => {
    fetch("http://localhost:3000/api/user/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        password: password,
        newPassword: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOk(!ok);
      });
  };

  return (
    <>
      <Header />
      <Text>
        Bienvenue sur votre compte {user.firstname} {user.lastname}
      </Text>
      {user.level > 0 && (
        <Box textAlign={"center"}>
          <Link href={"/admin"}>
            <Text fontSize={"lg"} fontStyle={"italic"}>
              Console administrateur
              <AisArrowRight />
            </Text>
          </Link>
        </Box>
      )}
      <Box>
        <Box ml={10} w={"80%"}>
          <AcsInputEmail
            label={"Email"}
            handleChange={setEmail}
            value={email}
          />
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
        </Box>
        <Box textAlign={"center"}>
          <Button
            textAlign={"center"}
            mt={5}
            colorScheme={"blue"}
            width={"70%"}
            onClick={Update}
          >
            Modifier son profil
          </Button>

          <AcsInputPassword
            label={"Password"}
            handleChange={setPassword}
            value={password}
          />
          <AcsInputPassword
            label={"Password"}
            handleChange={setNewPassword}
            value={newPassword}
          />
          <Button
            textAlign={"center"}
            mt={5}
            colorScheme={"blue"}
            width={"70%"}
            onClick={UpdatePassword}
          >
            Modifier son mot de passe
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MyAccount;
