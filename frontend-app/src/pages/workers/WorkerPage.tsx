import HeaderNav from "../../components/header/HeaderNav.tsx";
import CommandComponent from "../../components/command/CommandComponent.tsx";




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