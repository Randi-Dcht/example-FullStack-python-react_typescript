import HeaderNav from "../../components/header/HeaderNav.tsx";
import CommandComponent from "../../components/command/CommandComponent.tsx";

export default function CommandUsersPage()
{
    return(
        <>
            <HeaderNav showLogout={true}/>
            <div className="p-3">
                <h2>Mes commandes</h2>
                <CommandComponent/>
            </div>
        </>
    )
}