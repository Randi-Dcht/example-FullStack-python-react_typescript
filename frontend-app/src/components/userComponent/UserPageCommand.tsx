import CardComponent from "../card/CardComponent.tsx";
import {Row} from "react-bootstrap";
import {cardStructure, productStructure} from "../../structure.ts";
import ProductCustomer from "../productComponent/ProductCustomer.tsx";
import {useQuery} from "@tanstack/react-query";
import {getProduct} from "../../api.ts";

interface UserPageCommandProps {
    listProduct: cardStructure[];
    setListProduct(listProduct: cardStructure[]): void;
    setStatePage(state: number): void;
}

export default function UserPageCommand(dataPrpos: UserPageCommandProps)
{
    const {data, isSuccess} = useQuery({
        queryKey: ['product'],
        queryFn: getProduct
    });


    return(
        <>
            <h2 className="m-3">Je commande mes produits</h2>
            <div className="m-6 border-2 p-1.5">
                <div className="alert alert-dark" role="alert">
                    <CardComponent setConfirm={dataPrpos.setStatePage}
                                   listCmd={dataPrpos.listProduct}/>
                </div>
                <Row>
                    {
                        isSuccess && data.data.map((product: productStructure) => {
                            return (<ProductCustomer key={product.id} product={product}
                                                     listProduct={dataPrpos.listProduct}
                                                     setListProduct={dataPrpos.setListProduct}/>)
                        })
                    }
                </Row>
            </div>
        </>
    )
}