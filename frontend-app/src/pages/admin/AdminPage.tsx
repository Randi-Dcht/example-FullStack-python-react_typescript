import ProductForm from "../../components/productComponent/ProductForm.tsx";
import ProductPanelAdmin from "../../components/productComponent/ProductPanelAdmin.tsx";
import HeaderNav from "../../components/header/HeaderNav.tsx";
import {useQuery} from "@tanstack/react-query";
import {getProduct} from "../../api.ts";
import {productStructure} from "../../structure.ts";
import {useState} from "react";
import CommandComponent from "../../components/command/CommandComponent.tsx";
import {Button} from "react-bootstrap";
import UserForm from "../../components/userComponent/UserForm.tsx";

export default function AdminPage()
{
    const {data, isSuccess} = useQuery({
        queryKey: ['product'],
        queryFn: getProduct
    });

    const [tab, setTab] = useState<string>('product');
    const [addProduct, setAddProduct] = useState<boolean>(false);


    return(
        <>
            <HeaderNav showLogout={true}/>
            <h1 className="m-3">Administration de la plateforme</h1>
            <nav className="m-3">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className={tab === "product" ? "nav-link active" : "nav-link"} id="poduct-tab" data-bs-toggle="tab"
                            data-bs-target="#product" type="button" role="tab" aria-controls="nav-product" onClick={() => setTab('product')}
                            aria-selected="true">Produits
                    </button>
                    <button className={tab === "user" ? "nav-link active" : "nav-link"}  id="user-tab" data-bs-toggle="tab" data-bs-target="#user"
                            onClick={() => setTab('user')}
                            type="button" role="tab" aria-controls="nav-user" aria-selected="false">Utilisateurs
                    </button>
                    <button className={tab === "cmd" ? "nav-link active" : "nav-link"}  id="cmd-tab" data-bs-toggle="tab" data-bs-target="#nav-cmd"
                            onClick={() => setTab('cmd')}
                            type="button" role="tab" aria-controls="nav-cmd" aria-selected="false">Commandes
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className={tab === "product" ? "tab-pane fade show active" : "tab-pane fade"} id="nav-product"
                     role="tabpanel" aria-labelledby="nav-product" tabIndex={0}>
                    <div className="m-6 border-2 p-1.5">
                        <h2 className="mb-5">Ajouter un produit</h2>
                        {
                            addProduct ? <ProductForm updateForm={false}/> : <Button variant="info" onClick={() => setAddProduct(true)}>Ajouter un nouveau produit</Button>
                        }
                    </div>
                    <div className="m-6 border-t-4 p-1.5">
                        <h2>Liste de produit</h2>
                        {
                            isSuccess && data.data.map((product: productStructure) => {
                                return (<ProductPanelAdmin key={product.id} product={product}/>)
                            })
                        }
                    </div>
                </div>
                <div className={tab === "user" ? "tab-pane fade show active" : "tab-pane fade"} id="nav-user"
                     role="tabpanel" aria-labelledby="nav-user" tabIndex={0}>
                    <div className="m-6 border-2 p-1.5">
                        <h2 className="mb-5">Ajouter un travailleur</h2>
                        <UserForm/>
                    </div>
                </div>
                <div className={tab === "cmd" ? "tab-pane fade show active" : "tab-pane fade"} id="nav-cmd"
                     role="tabpanel" aria-labelledby="nav-cmd" tabIndex={0}>
                    <CommandComponent/>
                </div>
            </div>
        </>
    )
}