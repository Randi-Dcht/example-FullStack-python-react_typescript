import {orderStructureCmd} from "../../structure.ts";
import {Button} from "react-bootstrap";
import {useMutation} from "@tanstack/react-query";
import {postNewCommand} from "../../api.ts";

interface CardComponentProps
{
    listCmd: orderStructureCmd[];
    setConfirm: (confirm: boolean) => void;
}

export default function CardComponent(data: CardComponentProps)
{

    const {mutate} = useMutation({
        mutationFn: () => postNewCommand(
            {
                description: "commande",
                products: data.listCmd
            }
        ),
        onError: () => {
            console.log("error")
        },
        onSuccess: () => {
            data.setConfirm(true)
            data.listCmd = []
        }
    });

    function launchAction(){
        mutate()
    }

    return(
        <div className="flex justify-between center">
            <h5>
                {data.listCmd.reduce((acc, cmd) => {
                    return acc +  cmd.quantity
                }, 0)} articles dans le panier
            </h5>
            <div className="flex items-center text-center justify-center">
                <p className="mt-3 mr-4 font-bold">
                    Total :
                    {
                        data.listCmd.reduce((acc, cmd) => {
                            return acc + cmd.price * cmd.quantity
                        }, 0)
                    }
                    €
                </p>
                <Button onClick={launchAction} disabled={data.listCmd.length == 0} variant="light">Valider la commande</Button>
            </div>
        </div>
    )
}