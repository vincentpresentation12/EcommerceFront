import React, { useState } from "react";
import { Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { AcsInputNumber, AcsInputText, AcsInputTextArea } from "@akkurateio/ds";
import { getCookie } from "cookies-next";
import FormData from "form-data";
import Header from "@/components/Header";
import { useRouter } from "next/router";

const AddArticle = () => {
  const token = getCookie("tokencommerce");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const handleSubmit = () => {
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", price.toString());
    data.append("image", file);
    if (name && description && price && file) {
      fetch("http://localhost:3000/api/article/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        // @ts-ignore
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          router.push("/articles");
        });
    }
  };

  return (
    <>
      <Header />
      <Box w={"80%"} ml={15}>
        <FormLabel>Nom</FormLabel>
        <AcsInputText handleChange={setName} />
        <FormLabel>Description</FormLabel>
        <AcsInputTextArea autoResize handleChange={setDescription} />
        <FormLabel>Prix</FormLabel>
        <AcsInputNumber handleChange={setPrice} />
        <FormLabel>Image</FormLabel>
        <Input
          type="file"
          accept={"image/*"}
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : undefined)
          }
        />
      </Box>
      <Button type="submit" onClick={handleSubmit}>
        Ajouter
      </Button>
    </>
  );
};

export default AddArticle;
