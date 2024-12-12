import {productStructure} from "../../structure.ts";
import ProductForm from "./ProductForm.tsx";
import PictureProduct from "./PictureProduct.tsx";

interface ProductPanelAdminProps
{
    product : productStructure;
    key: number;
}


/***
 * @Component ProductPanelAdmin
 * @Description
 * This component is used to display the product for the admin.
 * @ReturnTypeDescription This component returns the JSX of the product for the admin.
 * @param data
 */
export default function ProductPanelAdmin(data: ProductPanelAdminProps)
{

    console.log(data.product)
    return (
        <div className="card m-4" key={data.key}>
            <PictureProduct productId={data.product.id} picture={data.product.picture == null ? "none.png" : data.product.picture}/>
            <div className="card-body">
                <ProductForm updateForm={true} product={data.product}/>
            </div>
        </div>
    )
}