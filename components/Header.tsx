import { Box, Button, HStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

interface Iprops {
  nombre?: number;
}
const Header = ({ nombre }: Iprops) => {
  const [user, setUser] = React.useState(null);
  const [NbArticles, setNbArticles] = React.useState(0);
  const router = useRouter();
  const token = getCookie("tokencommerce");

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem("user")) {
      // @ts-ignore
      const user = JSON.parse(window.localStorage.getItem("user"));
      setUser(user);
    }
  }, []);
  useEffect(() => {
    if (user) {
      fetch("http://localhost:3000/api/panier", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNbArticles(data.length);
        });
    }
  }, [nombre, user]);

  const logout = () => {
    fetch("http://localhost:3000/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        deleteCookie("tokencommerce");
        window.localStorage.removeItem("user");
        router.push("/");
      });
  };
  return (
    <>
      <HStack
        p={4}
        h={50}
        backgroundColor={"blue.200"}
        justifyContent={"space-between"}
      >
        <Box fontWeight={"bold"}>Ecommerce Shop</Box>
        <HStack spacing={3}>
          <Link href={"/"}>Accueil</Link>
          {!user && <Link href={"/inscription"}>Inscription</Link>}
          {!user && <Link href={"/connection"}>Connexion</Link>}
          {user && token && (
            <Link href={"/mon-panier"}>Mon panier ({NbArticles} )</Link>
          )}
          {user && token && <Link href={"/mes-commandes"}>Mes commandes</Link>}
          {user && token && <Link href={"/my-account"}>Mon compte</Link>}
          {user && token && (
            <Button onClick={logout} variant={"unstyled"}>
              Se deconnecter
            </Button>
          )}
        </HStack>
      </HStack>
    </>
  );
};
export default Header;
