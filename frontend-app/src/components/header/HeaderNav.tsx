import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

interface HeaderNavProps {
    showLogout: boolean;
}

export default function HeaderNav(props: HeaderNavProps)
{

    const navigate = useNavigate()

    return(
        <>
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Le promsoc Hambuger</span>
                        <img className="h-8 w-auto"
                             src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="logo"/>
                    </a>
                    <h4>Le promsoc Hambuger</h4>
                </div>

                {
                props.showLogout && (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Button variant="danger" className="p-2" onClick={() =>{
                                localStorage.clear()
                                navigate('/')
                            }}>
                                déconnexion
                            </Button>
                        </div>
                    )
                }
            </nav>
        </>
    )
}