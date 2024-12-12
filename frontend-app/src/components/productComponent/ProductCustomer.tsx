import {cardStructure, productStructure} from "../../structure.ts";
import {Button, Card, Col} from "react-bootstrap";
import {useState} from "react";

interface ProductPanelAdminProps
{
    product : productStructure;
    key: number;
    setListProduct(listProduct: cardStructure[]): void;
    listProduct: cardStructure[];
}


/***
 * @Component ProductCustomer
 * @Description
 * This component is used to display the product for the customer.
 * @ReturnTypeDescription This component returns the JSX of the product for the customer.
 * @param data
 */
export default function ProductCustomer(data: ProductPanelAdminProps)
{

    const price_tva = data.product.price + (data.product.price * data.product.tva / 100)
    const [quantity, setQuantity] = useState(1)

    return (
        <Col md={4} key={data.product.id} className="mb-4">
            <Card className="mt-3" style={{width: '18rem'}}>
                <Card.Img variant="top"  height="150" src={`${import.meta.env.VITE_API_URL}/api/download/` + data.product.picture}/>
                <Card.Body>
                    <Card.Title>{data.product.name}</Card.Title>
                    <Card.Text>
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
                    </Card.Text>
                    <div className="flex justify-end">
                        <input className="form-control mr-2" style={{width: "150px"}} type="number" min="1"
                               max={data.product.stock} defaultValue={1} onChange={e => {
                            setQuantity(parseInt(e.target.value))
                        }}/>
                        <Button variant="light" onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            data.listProduct.find((product) => {
                                return product.product.id === data.product.id
                            }) ? data.setListProduct(data.listProduct.map((product) => {
                                if (product.product.id === data.product.id) {
                                    product.quantity += quantity
                                }
                                return product
                            })) : data.setListProduct([...data.listProduct,
                                {
                                    product: data.product,
                                    quantity: quantity,
                                    price: price_tva
                                }
                            ])
                        }}>Ajouter panier</Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>

    )
}