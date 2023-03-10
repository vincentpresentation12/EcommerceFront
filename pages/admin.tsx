import React, { useEffect, useState } from "react";
import {
  HStack,
  Image,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { AisAdd, AisArrowRight, AisCheckmark, AisTrash } from "@akkurateio/ds";
import Header from "@/components/Header";
import Link from "next/link";
import DrawerAdminForCommandes from "@/components/DrawerAdminForCommande";
const Administration = () => {
  const [commandes, setCommandes] = useState<any>([]);
  const [deleteCommande, setDeleteCommande] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const token = getCookie("tokencommerce");
  useEffect(() => {
    fetch("http://localhost:3000/api/commande", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCommandes(data);
      })
      .catch((err) => console.log(err));
  }, [deleteCommande, open]);

  const handleArticleClick = (articleId: any) => {
    setSelectedArticleId(articleId);
  };
  const getNbArticles = (id: number) => {
    let nbArticles = 0;
    commandes.map((article: any) => {
      if (article.id === id) {
        const id_Articles = JSON.parse(article.id_Article);
        nbArticles += id_Articles.length;
      }
    });
    return nbArticles;
  };

  const getTotalPriceById = (id: number) => {
    const targetArticle = commandes.find((article: any) => article.id === id);

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
  const handleDelete = (id: number) => {
    fetch("http://localhost:3000/api/commande/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      if (res.status === 200) {
        Toast({
          title: "Commande supprimée",
        });
        setDeleteCommande(!deleteCommande);
      }
    });
  };
  const handlechange = (e: any) => {
    setValue(e.target.value);
  };
  const handleValidate = (id: number) => {
    fetch("http://localhost:3000/api/commande/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        status_Admin: value,
      }),
    }).then((res) => {
      if (res.status === 200) {
        Toast({
          title: "Commande modifiée",
        });
        setOpen(!open);
      }
    });
  };
  return (
    <>
      <Header />
      <HStack justifyContent={"space-between"}>
        <h1>Administration dashboard</h1>
        <Link href={"/addArticles"}>
          <AisAdd />
          Cree un article
        </Link>
        <Link href={"/articles"}>
          Voir les articles
          <AisArrowRight />
        </Link>
      </HStack>
      {commandes.length > 0 ? (
        <>
          <TableContainer mt={5}>
            <Table variant={"striped"}>
              <TableCaption
                placement={"top"}
                fontSize={"lg"}
                fontWeight={"bold"}
              >
                Historique de mes commandes
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Commande n°</Th>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <Th>Nombre d'article</Th>
                  <Th>Prix total</Th>
                  <Th>Status User</Th>
                  <Th>Status Admin</Th>
                  <Th>Edit</Th>
                  <Th>Supprimer</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {commandes.map((article: any, idx: number) => (
                  <Tr key={idx}>
                    <Td>{article.id}</Td>
                    <Td>{getNbArticles(article.id)}</Td>
                    <Td>{getTotalPriceById(article.id)} €</Td>
                    <Td>{article.status_User}</Td>
                    <Td>
                      {open ? (
                        <Select
                          placeholder={"Selectionner un status"}
                          onChange={handlechange}
                        >
                          <option value={"validée"}>Validée</option>
                          <option value={"payé"}>Payé</option>
                          <option value={"livré"}>Livré</option>
                          <option value={"annulée"}>Annulée</option>
                        </Select>
                      ) : (
                        <Text>{article.status_Admin}</Text>
                      )}
                    </Td>
                    <Td>
                      {!open ? (
                        <Image
                          w={10}
                          cursor={"pointer"}
                          src={"editer.png"}
                          alt={"editer"}
                          onClick={() => setOpen(!open)}
                        />
                      ) : (
                        <AisCheckmark
                          cursor={"pointer"}
                          boxSize={"40px"}
                          onClick={() => handleValidate(article.id)}
                        />
                      )}
                    </Td>
                    <Td>
                      <AisTrash
                        onClick={() => handleDelete(article.id)}
                        cursor={"pointer"}
                        boxSize={"40px"}
                      />
                    </Td>
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
          </TableContainer>
          <DrawerAdminForCommandes
            isOpen={!!selectedArticleId}
            onClose={() => setSelectedArticleId(null)}
            articleId={selectedArticleId}
            articles={commandes.filter(
              (article: any) => article.id === selectedArticleId
            )}
          />
        </>
      ) : (
        <h1>Aucune commande</h1>
      )}
    </>
  );
};

export default Administration;
