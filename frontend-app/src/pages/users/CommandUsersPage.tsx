import HeaderNav from "../../components/header/HeaderNav.tsx";
import CommandComponent from "../../components/command/CommandComponent.tsx";
import {ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Footer from "../../components/footer/Footer.tsx";


/***
 * @Description
 * CommandUsersPage is a component that displays the commands of the user
 * @constructor
 ***/
export default function CommandUsersPage()
{

    return(
        <>
            <HeaderNav showLogout={true}/>
            <div className="p-3">
                <h2>Mes commandes</h2>
                <ButtonGroup className="m-4" aria-label="Basic button group">
                    <Link to="/customer" className="btn btn-primary">commander</Link>
                </ButtonGroup>
                <CommandComponent/>
            </div>
            <Footer/>
        </>
    )
}