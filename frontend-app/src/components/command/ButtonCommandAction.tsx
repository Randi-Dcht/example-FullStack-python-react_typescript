import {Button} from "react-bootstrap";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {putStatusOfCommand} from "../../api.ts";

interface ButtonCommandActionProps {
    title: string;
    actionName: "finish" | "cancellation";
    productId: number;
}

/***
    * @Description
    * ButtonCommandAction is a component that displays a button to finish or cancel a command
    * @param data
    * @constructor
  ***/
export default function ButtonCommandAction(data: ButtonCommandActionProps)
{
    const client = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: () => putStatusOfCommand(data.productId, data.actionName),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['command']}).then(r => console.log(r))
        }
    });

    function launchAction(){
        mutate()
    }


    return(
        <>
            <Button variant="light" onClick={launchAction}>
                {data.title}
            </Button>
        </>
    )
}