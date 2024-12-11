import {accountStructure} from "../../structure.ts";
import {useQuery} from "@tanstack/react-query";
import {getListAccount} from "../../api.ts";


function ListingUser(users: accountStructure)
{
    return(
        <tr>
            <td>{users.username}</td>
            <td>{users.email}</td>
            <td>{users.created_at}</td>
        </tr>
    )
}


export default function UserComponent()
{

    const {data, isSuccess} = useQuery({
        queryKey: ['user'],
        queryFn: getListAccount
    });

    return(
        <>
            <table className="table mt-5">
                <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                    <th scope="col">Créé à</th>
                </tr>
                </thead>
                <tbody>
                {
                    isSuccess && data.data.map((us: accountStructure) => {
                        return ListingUser(us)
                    })
                }
                </tbody>
            </table>
        </>
    )
}