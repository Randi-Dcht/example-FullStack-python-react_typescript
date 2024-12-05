export interface loginStructure
{
    name: string;
    password: string;
}


// register user
export interface registerStructure
{
    username: string;
    password: string;
    email: string;
    postal_code: number;
    city: string;
    street: string;
    country: string;
    phone: number;
}


// register admin
export interface registerAdminStructure
{
    username: string;
    password: string;
    email: string;
    role: "admin" | "worker";
}


// get worker / admin
export interface accountStructure
{
    email: string;
    username: string;
    created_at: string;
}


// get and put user
export interface userStructure
{
    id: number;
    username: string;
    email: string;
    postal_code: number;
    city: string;
    street: string;
    country: string;
    phone: number;
    created_at: string;
}


// get, put, post product
export interface productStructure
{
    id: number;
    name: string;
    price: number;
    tva: number;
    description: string;
    stock: number;
    picture: string | null;
}


export interface orderStructure
{
    productId: number;
    quantity: number;
    price: number;
}


export interface orderCommandStructure
{
    description: string;
    products: orderStructure[];
}


export interface orderStructure
{
    id: number;
    userId: number;
    date: string;
    status: "creation" | "waiting" | "preparation" | "cancellation" | "finish";
    description: string;
    articles: productStructure[];
}