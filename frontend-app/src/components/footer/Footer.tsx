
/***
    * @Component Footer
    * @Description
    * This component is used to display the footer of the website.
    * It contains the company name, address and the year of creation.
    * @ReturnTypeDescription This component returns the JSX of the footer.
    */
export default function Footer()
{
    return(
        <footer className="footer w-100 flex justify-center" style={{
            backgroundColor: "#f8f9fa",
            width: "100%",
            height: "100px",
            marginTop: "30vh"
        }}>
            <div className="container flex justify-around items-center">
                <span className="text-muted">© {new Date().getFullYear()} - E-commerce</span>
                <span className="text-muted">La promsoc hambuger</span>
                <span className="text-muted">1 Rue Paul Pastur, 7100 La Louvière</span>
            </div>
        </footer>
    )
}