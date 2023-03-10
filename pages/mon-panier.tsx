import React, { useEffect } from "react";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { AisTrash } from "@akkurateio/ds";

const MonPanier = () => {
  const [user, setUser] = React.useState<any>(null);
  const [articles, setArticles] = React.useState<any>([]);
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
      fetch("http://localhost:3000/api/panier/" + user.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setArticles(data);
        });
    }
  }, [user]);

  const deleteArticle = (id: number) => {
    fetch("http://localhost:3000/api/panier/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        router.reload();
      });
  };

  // total price , for each article add the price to the total price
  const totalPrice = articles.reduce((acc: any, article: any) => {
    return acc + article.article.price;
  }, 0);

  //for each article  send status valide to the server
  const validate = (article_id: []) => {
    fetch("http://localhost:3000/api/panier/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: article_id.map((article) => article),
        statut: "validé",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push("/mes-commandes");
      });
  };

  const allId = articles.map((article: any) => article.id);
  return (
    <>
      <Header />
      {articles.map(
        (article: any, idx: number) =>
          article.valide === false && (
            <TableContainer mt={5} key={idx}>
              <Table variant={"striped"}>
                <Thead>
                  <Tr>
                    <Th>Nom du produit</Th>
                    <Th>Description</Th>
                    <Th>Prix</Th>
                    <Th>Image</Th>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <Th>Supprimer l'article</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={idx}>
                    <Td>{article.article.name}</Td>
                    <Td>{article.article.description}</Td>
                    <Td>{article.article.price} €</Td>
                    <Td>
                      <Image
                        src={"http://localhost:300/" + article.article.image}
                        alt={article.article.name}
                      />{" "}
                    </Td>
                    <Td>
                      <AisTrash
                        cursor={"pointer"}
                        onClick={() => deleteArticle(article.id)}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          )
      )}

      <Box w={"full"} textAlign={"center"}>
        <Text>Total de votre commande : {totalPrice} €</Text>
        <Button onClick={() => validate(allId)}>valider</Button>
      </Box>
    </>
  );
};

export default MonPanier;
