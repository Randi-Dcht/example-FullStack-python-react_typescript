import {Button, Form} from "react-bootstrap";
import {useCallback} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InputForm} from "../form/InputForm.tsx";
import {postNewProduct} from "../../api.ts";



export default function ProductForm()
{
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
    })

    //const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postNewProduct,
        onSuccess: async () => {
            client.invalidateQueries({queryKey: ['product']}).then(r => console.log(r))
        }
    })

    const onSubmit= useCallback((values: FieldValues) => {
        mutation.mutate({
            'id': 0,
            'name': values.name,
            'price': values.price,
            'tva': values.tva,
            'description': values.description,
            'stock': values.stock,
            'picture': null
        });
    }, [mutation]);
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputForm  required={true} type="text" name="name" label="Nom du produit*" control={control}/>
                <InputForm  required={true} type="number" name="price" label="Prix/htva*" control={control}/>
                <InputForm  required={true} type="number" name="tva" label="tva*" control={control}/>
                <InputForm  required={true} type="text" name="description" label="Description*" control={control}/>
                <InputForm  required={true} type="number" name="stock" label="Stock du produit" control={control}/>

                <Button variant="danger" type="submit">ajouter le produit</Button>
            </Form>
        </div>

    );
}