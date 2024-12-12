
import {cardStructure} from "../../structure.ts";
import HeaderNav from "../../components/header/HeaderNav.tsx";
import {useState} from "react";
import UserPageCommand from "../../components/userComponent/UserPageCommand.tsx";
import CardListingComponent from "../../components/card/CardListingComponent.tsx";
import {Link} from "react-router-dom";
import Footer from "../../components/footer/Footer.tsx";


/***
 * @Component UserPage
 * @Description
 * This component is used to display the user page.
 * @ReturnTypeDescription This component returns the JSX of the user page.
 */
export default function UserPage()
{

    const [listProduct, setListProduct] = useState<cardStructure[]>([]);
    const [statePage, setStatePage] = useState<number>(0);

    return(
        <>
            <HeaderNav showLogout={true}/>
            {
                statePage === 0 && <UserPageCommand listProduct={listProduct} setListProduct={setListProduct} setStatePage={setStatePage}/>
            }
            {
                statePage === 1 && <CardListingComponent listCmd={listProduct} setStatePage={setStatePage} setListProduct={setListProduct}/>
            }
            {
                statePage === 2 &&
                (
                    <>
                        <h3>Merci pour votre commande</h3>
                        <Link to="/customer/command" className="btn btn-primary">voir mon profile</Link>
                    </>
                )
            }
            <Footer/>
        </>
    )
}