import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, HStack, Icon, Image, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import { getCookie } from "cookies-next";
import { AisAdd } from "@akkurateio/ds";

const Article = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [nombreArticles, setNombreArticles] = React.useState<number>(1);
  const token = getCookie("tokencommerce");
  useEffect(() => {
    fetch(`http://localhost:3000/api/article/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
      });
  }, [id]);

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem("user")) {
      // @ts-ignore
      const user = JSON.parse(window.localStorage.getItem("user"));
      setUser(user);
    }
  }, []);
  const AddToCart = (articleId: number) => {
    if (user) {
      setNombreArticles(nombreArticles + 1);
      fetch("http://localhost:3000/api/panier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id_article: articleId,
          id_user: user.id,
          quantite: nombreArticles,
        }),
      })
        .then((res) => res.json())
        .then((data) => {});
    } else {
      alert("Vous devez être connecté pour ajouter un article au panier");
    }
  };

  return (
    <>
      <Header nombre={nombreArticles} />
      <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
        Article
      </Text>
      <Box mt={5} w={"full"} h={"full"}>
        <Box m={5} borderWidth={1}>
          <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
            {article?.name.toUpperCase()}
          </Text>
          <Text fontSize={"md"} fontWeight={"semibold"} textAlign={"center"}>
            description:
          </Text>
          <Text fontSize={"md"} fontWeight={"normal"} textAlign={"center"}>
            {article?.description}
          </Text>
        </Box>
        <Image
          w={"250px"}
          h={"250px"}
          src={"http://localhost:3000/" + article?.image}
          alt={article?.name}
          m={"auto"}
        />
        <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
          Prix:
        </Text>
        <Text textAlign={"center"}>{article?.price} €</Text>
        <Box textAlign={"center"} w={"full"}>
          <HStack ml={"40%"} w={"full"}>
            <Text>Ajouter au panier</Text>
            <Icon
              cursor={"pointer"}
              as={AisAdd}
              w={8}
              h={8}
              color={"#000"}
              ml={"50%"}
              onClick={() => AddToCart(article?.id)}
            />
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default Article;
