import HeaderNav from "../../components/header/HeaderNav.tsx";
import CommandComponent from "../../components/command/CommandComponent.tsx";


/***
 * @Description
 * WorkerPage is a component that displays the worker page
 * @constructor
 ***/
export default function WorkerPage()
{

    return(
        <>
            <HeaderNav showLogout={true}/>
            <div className="p-3">
                <h2>Commande en cours</h2>
                <CommandComponent/>
            </div>
        </>
    )
}