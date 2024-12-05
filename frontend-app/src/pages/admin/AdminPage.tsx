import ProductForm from "../../components/productComponent/ProductForm.tsx";
import ProductPanelAdmin from "../../components/productComponent/ProductPanelAdmin.tsx";
import HeaderNav from "../../components/header/HeaderNav.tsx";
import {useQuery} from "@tanstack/react-query";
import {getProduct} from "../../api.ts";
import {productStructure} from "../../structure.ts";

export default function AdminPage()
{
    const {data, isSuccess} = useQuery({
        queryKey: ['product'],
        queryFn: getProduct
    });


    return(
        <>
            <HeaderNav showLogout={true}/>
            <h1 className="m-3">Administration de la plateforme</h1>
            <div className="m-6 border-2 p-1.5">
                <h2 className="mb-5">Ajouter un produit</h2>
                <ProductForm/>
            </div>
            <div className="m-6 border-2 p-1.5">
                <h2>Liste de produit</h2>
                {
                    isSuccess && data.data.map((product: productStructure) => {
                        return (<ProductPanelAdmin key={product.id} product={product}/>)
                    })
                }
            </div>
        </>
    )
}