import {useQuery} from "@tanstack/react-query";
import {getProduct} from "../../api.ts";
import {orderStructureCmd, productStructure} from "../../structure.ts";
import ProductCustomer from "../../components/productComponent/ProductCustomer.tsx";
import HeaderNav from "../../components/header/HeaderNav.tsx";
import {useState} from "react";
import CardComponent from "../../components/userComponent/CardComponent.tsx";
import {Row} from "react-bootstrap";


export default function UserPage()
{
    const {data, isSuccess} = useQuery({
        queryKey: ['product'],
        queryFn: getProduct
    });

    const [listProduct, setListProduct] = useState<orderStructureCmd[]>([]);

    return(
        <>
            <HeaderNav showLogout={true}/>
            <h2 className="m-3">Je commande mes produits</h2>
            <div className="m-6 border-2 p-1.5">
                <div className="alert alert-dark" role="alert">
                    <CardComponent listCmd={listProduct}/>
                </div>
                <Row>
                    {
                        isSuccess && data.data.map((product: productStructure) => {
                            return (<ProductCustomer key={product.id} product={product} listProduct={listProduct}
                                                     setListProduct={setListProduct}/>)
                        })
                    }
                </Row>
                <div>

                </div>
            </div>
        </>
    )
}