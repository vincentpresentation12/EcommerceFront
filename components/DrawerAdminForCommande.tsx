import React, { useEffect } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: any;
  articles: any;
}

const DrawerAdminForCommandes = ({
  isOpen,
  onClose,
  articleId,
  articles,
}: IProps) => {
  const [article, setArticle] = React.useState<any>(null);
  const [newArticles, setNewArticles] = React.useState<any>([]);
  useEffect(() => {
    if (articleId) {
      articles.map((article: any) => {
        if (article.id === articleId) {
          setArticle(article);
        }
      });
    }
  }, [isOpen]);
  // Supposons que vous avez reçu l'objet dans la variable `data
  useEffect(() => {
    if (article) {
      const idArticles = JSON.parse(article.id_Article); // Convertir la chaîne en tableau
      const filteredArticles = article.articles.filter((article: any) =>
        idArticles.includes(article.id)
      );
      setNewArticles(filteredArticles);
    }
  }, [article]);

  useEffect(() => {
    if (article) {
      const idArticles = JSON.parse(article.id_Article);
      const filteredArticles = article.articles.filter((article: any) =>
        idArticles.includes(article.id)
      );
      const quantityMap = idArticles.reduce((acc: any, id: number) => {
        if (!acc[id]) {
          acc[id] = 1;
        } else {
          acc[id] += 1;
        }
        return acc;
      }, {});
      const newArticles = filteredArticles.map((article: any) => {
        return {
          ...article,
          quantity: quantityMap[article.id],
        };
      });
      setNewArticles(newArticles);
    }
  }, [article]);

  return (
    <Drawer size={"full"} isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Détail de la commande n°{articleId} </DrawerHeader>

        <DrawerBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Image</Th>
                <Th>Nom du produit</Th>
                <Th isNumeric>Prix</Th>
                <Th isNumeric>Quantité</Th>
              </Tr>
            </Thead>
            <Tbody>
              {newArticles.map((article: any) => (
                <Tr key={article.id}>
                  <Td>
                    <Image
                      src={"http://localhost:3000/" + article.image}
                      alt={article.name}
                      width="100px"
                      height="100px"
                    />
                  </Td>
                  <Td>
                    <Text>{article.name}</Text>
                  </Td>
                  <Td isNumeric>
                    <Text>{article.price} €</Text>
                  </Td>
                  <Td isNumeric>
                    <Text>{article.quantity}</Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </DrawerBody>

        <DrawerFooter justifyContent={"space-between"}>
          <Button w={"full"} colorScheme="blue" mr={3} onClick={onClose}>
            Retour
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerAdminForCommandes;
