import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { AisArrowRight, AisChevronDown, AisChevronRight } from "@akkurateio/ds";
import DetailDrawerForHistory from "@/components/Drawer_Detail_Historique";

const MyCommandesHistory = () => {
  const [user, setUser] = React.useState<any>(null);
  const [articles, setArticles] = React.useState<any>([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const router = useRouter();
  const token = getCookie("tokencommerce");
  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem("user")) {
      // @ts-ignore
      const user = JSON.parse(window.localStorage.getItem("user"));
      setUser(user);
    }
  }, []);

  const handleArticleClick = (articleId: any) => {
    setSelectedArticleId(articleId);
  };
  useEffect(() => {
    if (user) {
      fetch("http://localhost:3000/api/commande/" + user.id, {
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

  // function return the number of articles in the order split by [ ] et ,
  const getNbArticles = (id: number) => {
    let nbArticles = 0;
    articles.map((article: any) => {
      if (article.id === id) {
        const id_Articles = JSON.parse(article.id_Article);
        nbArticles += id_Articles.length;
      }
    });
    return nbArticles;
  };

  const getTotalPriceById = (id: number) => {
    const targetArticle = articles.find((article: any) => article.id === id);

    if (!targetArticle) {
      return 0;
    }

    const articleIds = JSON.parse(targetArticle.id_Article);

    if (articleIds.length === 0) {
      return 0;
    }

    const articlePrices = articleIds.reduce((prices: number[], id: number) => {
      const matchingArticle = targetArticle.articles.find(
        (a: any) => a.id === id
      );
      if (matchingArticle && matchingArticle.price) {
        prices.push(matchingArticle.price);
      }
      return prices;
    }, []);

    if (articlePrices.length === 0) {
      return 0;
    }

    const articleTotalPrice = articlePrices.reduce(
      (a: number, b: number) => a + b,
      0
    );

    return articleTotalPrice;
  };

  return (
    <>
      <Header />
      <TableContainer mt={5}>
        <Table variant={"striped"}>
          <TableCaption placement={"top"} fontSize={"lg"} fontWeight={"bold"}>
            Historique de mes commandes
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Commande n°</Th>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Th>Nombre d'article</Th>
              <Th>Prix total</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {articles.map((article: any, idx: number) => (
              <Tr key={idx}>
                <Td>{article.id}</Td>
                <Td>{getNbArticles(article.id)}</Td>
                <Td>{getTotalPriceById(article.id)} €</Td>
                <Td>
                  {getTotalPriceById(article.id) !== 0 ? (
                    <Text
                      onClick={() => handleArticleClick(article.id)}
                      cursor={"pointer"}
                    >
                      Voir le detail <AisArrowRight />
                    </Text>
                  ) : (
                    <Text>Commande vide</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/*<Image src={"http://localhost:300/" + articles.image} />{" "}*/}
      </TableContainer>
      <DetailDrawerForHistory
        isOpen={!!selectedArticleId}
        onClose={() => setSelectedArticleId(null)}
        articleId={selectedArticleId}
        articles={articles.filter(
          (article: any) => article.id === selectedArticleId
        )}
      />
    </>
  );
};

export default MyCommandesHistory;
