import HeaderNav from "../../components/header/HeaderNav.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginStructure} from "../../structure.ts";
import {useMutation} from "@tanstack/react-query";
import {login} from "../../api.ts";
import {Alert, Button} from "react-bootstrap";

export default function LoginPage()
{
    const [error, setError] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const navigate = useNavigate()
    const formData : loginStructure = {
        name: "",
        password: ""
    }

    const {mutate} = useMutation({
        mutationFn: () => login(formData),
        onSuccess: async data  => {
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('type_user', data.data.type);
            navigate("/" + data.data.type)
        },
        onError: () => {
            setError("Une erreur s'est produite : vérifié votre mail et votre mot de passe")
        }
    });

    const handleSubmit = () => {
        formData.name = email;
        formData.password = password;
        mutate();
    };



    return (
        <>

            <HeaderNav showLogout={false}/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                {
                    error != undefined && (<Alert>
                        {error}
                    </Alert>)
                }
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Connecte toi à ton compte
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Ton adresse mail</label>
                            <div className="mt-2">
                                <input type="email" name="email" id="email" autoComplete="email" required
                                       onChange={(event) => setEmail(event.target.value)}
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm/6 font-medium text-gray-900">Mot de passe</label>
                            </div>
                            <div className="mt-2">
                                <input type="password" name="password" id="password" autoComplete="current-password"
                                       required
                                       onChange={(event) => setPassword(event.target.value)}
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                            </div>
                        </div>

                        <div>
                            <Button onClick={handleSubmit}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Se connecter
                            </Button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Pas encore membre?
                        <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500"> crée ton compte gratuitement </a>
                    </p>
                </div>
            </div>
        </>
    )
}