import ProductForm from "../../components/productComponent/ProductForm.tsx";
import ProductPanelAdmin from "../../components/productComponent/ProductPanelAdmin.tsx";

export default function ProductAdminList()
{
    return(
        <>
            <div className="m-6 border-2 p-1.5">
                <h2 className="mb-5">Ajouter un produit</h2>
                <ProductForm/>
            </div>
            <div className="m-6 border-2 p-1.5">
                <h2>Liste de produit</h2>
                <ProductPanelAdmin key={0} product={{
                    id:0,
                    description: "test",
                    name: "test",
                    price: 20,
                    tva: 21,
                    picture: null,
                    stock: 1
                }}/>
            </div>
        </>
    )
}