import {cardStructure} from "../../structure.ts";
import {Button} from "react-bootstrap";


interface CardComponentProps
{
    listCmd: cardStructure[];
    setConfirm: (confirm: number) => void;
}


/***
    * @Description
    * CardComponent is a component that displays the number of items in the cart and the total price of the cart
    * @param data
    * @constructor
  ***/
export default function CardComponent(data: CardComponentProps)
{

    function launchAction(){
        data.setConfirm(1);
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
                <Button onClick={launchAction} disabled={data.listCmd.length == 0} variant="light">
                    Voir panier
                </Button>
            </div>
        </div>
    )
}