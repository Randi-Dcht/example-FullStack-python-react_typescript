import {cardStructure} from "../../structure.ts";
import {Button, ButtonGroup} from "react-bootstrap";
import {useMutation} from "@tanstack/react-query";
import {postNewCommand} from "../../api.ts";


interface CardListingComponentProps {
    listCmd: cardStructure[];
    setListProduct(listProduct: cardStructure[]): void;
    setStatePage(state: number): void;
}

function ListingOrder(order: cardStructure, setListProduct: (listProduct: cardStructure[]) => void, listProduct: cardStructure[])
{

    return(
        <tr>
            <td>
                <img src={"http://localhost:8085/api/download/" + order.product.picture} alt="image" width="80"
                     height="80"/>
            </td>
            <td>{order.product.name}</td>
            <td>{order.product.price}</td>
            <td>{order.quantity}</td>
            <td>
                {
                order.price + (order.price * order.product.tva / 100) * order.quantity
            } €
            </td>
            <td>
                <Button variant="danger" onClick={()=>{
                    setListProduct(listProduct.filter((cmd: cardStructure) => {
                        return cmd.product.id !== order.product.id
                    }))
                }}>
                    Supprimer
                </Button>

            </td>
        </tr>
    )
}

export default function CardListingComponent(dataProps: CardListingComponentProps)
{
    const {mutate} = useMutation({
        mutationFn: () => postNewCommand(
            {
                description: "commande",
                products: dataProps.listCmd.map((cmd) => {
                    return {
                        productId: cmd.product.id,
                        quantity: cmd.quantity,
                        price: cmd.price
                    }
                })
            }
        ),
        onError: () => {
            console.log("error")
        },
        onSuccess: () => {
            dataProps.setListProduct([])
            dataProps.setStatePage(2)
        }
    });

    function launchAction(){
        mutate()
    }

    return (
        <>
            <h2 className="m-3">Mon panier</h2>
            <ButtonGroup className="m-4" aria-label="Basic button group">
                <Button variant="info" onClick={() => {dataProps.setStatePage(0)}}>
                    Retour à la commande
                </Button>
                <Button disabled={dataProps.listCmd.length == 0} onClick={launchAction}>
                    valider & acheter
                </Button>
            </ButtonGroup>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Nom</th>
                    <th scope="col">prix/unitaire</th>
                    <th scope="col">quantitée</th>
                    <th scope="col">total</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    dataProps.listCmd.map((order: cardStructure) => {
                        return ListingOrder(order, dataProps.setListProduct, dataProps.listCmd)
                    })
                }
                </tbody>
            </table>
        </>
    )
}