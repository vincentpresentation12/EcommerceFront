import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  HStack,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  AcsInputNumber,
  AcsInputText,
  AcsInputTextArea,
  AisAdd,
  AisArrowRight,
  AisCheckmark,
  AisTrash,
} from "@akkurateio/ds";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
const Articles = () => {
  const [articles, setArticles] = React.useState<any>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteArticle, setDeleteArticle] = useState(false);
  const token = getCookie("tokencommerce");
  const [user, setUser] = useState<any>([]);
  const router = useRouter();
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    fetch("http://localhost:3000/api/article/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setDeleteArticle(false);
      });
  }, [open, deleteArticle]);
  const handleDelete = (id: number) => {
    fetch("http://localhost:3000/api/article/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOpen(false);
        setDeleteArticle(!deleteArticle);
      })
      .catch((err) => console.log(err));
  };
  const handleValidate = (id: number) => {
    fetch("http://localhost:3000/api/article/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpen(false);
        setName("");
        setDescription("");
        setPrice(0);
      })
      .catch((err) => console.log(err));
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
      <TableContainer mt={5}>
        <Table variant={"striped"}>
          <TableCaption placement={"top"} fontSize={"lg"} fontWeight={"bold"}>
            Tout les articles
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Article Id</Th>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Th>Nom</Th>
              <Th>Description</Th>
              <Th>Prix</Th>
              <Th>Image</Th>
              <Th>Edit</Th>
              <Th>Supprimer</Th>
            </Tr>
          </Thead>
          <Tbody>
            {articles.map((article: any, idx: number) => (
              <Tr key={idx}>
                <Td>{article.id}</Td>
                {open ? (
                  <Td>
                    <AcsInputText
                      handleChange={(name) => setName(name)}
                      placeholder={"Modifier le status"}
                    />
                  </Td>
                ) : (
                  <Td>{article.name}</Td>
                )}
                {open ? (
                  <Td>
                    <AcsInputTextArea
                      handleChange={(description) =>
                        setDescription(description)
                      }
                      placeholder={"Modifier le status"}
                    />
                  </Td>
                ) : (
                  <Td>{article.description}</Td>
                )}
                {open ? (
                  <Td>
                    <AcsInputNumber handleChange={setPrice} />
                  </Td>
                ) : (
                  <Td>{article.price} €</Td>
                )}
                <Td>
                  <Image
                    w={20}
                    alt={"image article"}
                    src={"http://localhost:3000/" + article.image}
                  />
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Articles;
