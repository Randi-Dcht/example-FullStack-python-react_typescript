import {orderStructure} from "../../structure.ts";
import ButtonCommandAction from "./ButtonCommandAction.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCommand} from "../../api.ts";


function ListingOrder(order: orderStructure)
{
    return(
        <tr>
            <td>{order.id}</td>
            <td>{order.date}</td>
            <td>{order.status}</td>
            <td>{order.description}</td>
            <td>
                <ul>
                    {
                        order.articles.map((article) => {
                            return(
                                <li key={article.product.name}>
                                    {article.product.name} : {article.quantity}
                                </li>
                            )
                        })
                    }
                </ul>
            </td>
            <td>
                {
                    localStorage.getItem("type_user") === "worker" && (<ButtonCommandAction title="Terminer" actionName="finish" productId={order.id}/>)
                }
                {
                    localStorage.getItem("type_user") === "admin" && order.status == "waiting" && (<ButtonCommandAction title="Annuler" actionName="cancellation" productId={order.id}/>)
                }
            </td>
        </tr>
    )
}


export default function CommandComponent()
{

    const {data, isSuccess} = useQuery({
        queryKey: ['command'],
        queryFn: getCommand
    });

    return(
        <>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Commande ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">description</th>
                    <th scope="col">Articles</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    isSuccess && data.data.map((order: orderStructure) => {
                        return ListingOrder(order)
                    })
                }
                </tbody>
            </table>
        </>
    )
}