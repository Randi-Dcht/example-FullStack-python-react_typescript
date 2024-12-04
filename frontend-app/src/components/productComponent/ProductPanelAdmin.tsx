import {productStructure} from "../../structure.ts";

interface ProductPanelAdminProps
{
    product : productStructure;
    key: number;
}

export default function ProductPanelAdmin(data: ProductPanelAdminProps)
{
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
                    prix :
                    {
                        data.product.price
                    }
                    euros
                </p>
                <p className="card-text">
                    tva :
                    {
                        data.product.tva
                    }
                    %
                </p>
                <p className="card-text">
                    stock :
                    {
                        data.product.stock
                    }
                    pièces
                </p>
                <a href="#" className="btn btn-primary">Modifier le produit</a>
                <a href="#" className="btn btn-danger ml-2">Supprimer le produit</a>
            </div>
        </div>
    )
}