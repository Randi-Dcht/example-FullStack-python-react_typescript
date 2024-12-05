import {orderStructureCmd, productStructure} from "../../structure.ts";
import {Button} from "react-bootstrap";
import {useState} from "react";

interface ProductPanelAdminProps
{
    product : productStructure;
    key: number;
    setListProduct(listProduct: orderStructureCmd[]): void;
    listProduct: orderStructureCmd[];
}

export default function ProductCustomer(data: ProductPanelAdminProps)
{

    const price_tva = data.product.price + (data.product.price * data.product.tva / 100)
    const [quantity, setQuantity] = useState(1)

    return (
        <div className="card m-4" key={data.key}>
            <img src="..." className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{data.product.name}</h5>
                <p className="card-text">
                    description :
                    {
                        data.product.description
                    }
                </p>
                <p className="card-text">
                    <strong>
                        prix :
                        {
                            price_tva
                        }
                        €
                    </strong>
                </p>
                <div className="flex justify-end">
                    <input className="form-control mr-2" style={{width: "150px"}} type="number" min="1" max={data.product.stock} defaultValue={1} onChange={e => {
                        setQuantity(parseInt(e.target.value)) }}/>
                    <Button variant="light" onClick={() => {
                        data.setListProduct([...data.listProduct,
                            {
                                productId: data.product.id,
                                quantity: quantity,
                                price: price_tva
                            }
                        ])
                    }}>Ajouter panier</Button>
                </div>
            </div>
        </div>
    )
}