import { Box, Button, HStack, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getCookie } from "cookies-next";
import Header from "@/components/Header";
import { useRouter } from "next/router";
export default function Home() {
  const [user, setUser] = React.useState<any>(null);
  const [articles, setArticles] = React.useState<any>(null);
  const [nombreArticles, setNombreArticles] = React.useState<number>(1);
  const router = useRouter();
  const token = getCookie("tokencommerce");
  useEffect(() => {
    fetch("http://localhost:3000/api/article/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
      });
  }, []);

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
      <SimpleGrid columns={5} spacing={1} p={10}>
        {articles &&
          articles.map((article: any) => (
            <Box
              w={"fit-content"}
              h={"fit-content"}
              key={article.id}
              borderWidth="1px"
              borderRadius="lg"
            >
              <Box p="6" pb={0}>
                <Box alignItems="baseline">
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="2"
                  >
                    {article.name}
                  </Box>
                </Box>
                {article.image && (
                  <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                  >
                    <Image src={"http://localhost:3000/" + article.image} />
                  </Box>
                )}

                <Box>{article.description}</Box>
                <HStack justifyContent={"space-between"}>
                  <Box>{article.price} €</Box>
                  <Image
                    src={"panier.png"}
                    w={5}
                    cursor={"pointer"}
                    onClick={() => AddToCart(article.id)}
                  />
                </HStack>
                <Button
                  variant={"unstyled"}
                  fontWeight={"semibold"}
                  width={"full"}
                  fontStyle={"italic"}
                  textDecoration={"underline"}
                  onClick={() => {
                    router.push("/article/" + article.id);
                  }}
                >
                  Voir l'article
                </Button>
              </Box>
            </Box>
          ))}
      </SimpleGrid>
    </>
  );
}
