export interface SellerAuthInterface{
    name:string,
    email:string,
    password:string,
    repeatPassword:string,
}
export interface logIn{
    email:string,
    password:string
}
export interface product{
    name:string,
    price:number,
    category:string,
    color:string,
    imageUrl:string,
    description:string,
    id:number
}

