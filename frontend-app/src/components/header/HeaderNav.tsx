interface HeaderNavProps {
    showLogout: boolean;
}

export default function HeaderNav(props: HeaderNavProps)
{
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
                            <a href="/login" className="text-sm/6 font-semibold text-gray-900">Commander <span
                                aria-hidden="true">&rarr;</span></a>
                        </div>
                    )
                }
            </nav>
        </>
    )
}