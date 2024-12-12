import {Button, Form} from "react-bootstrap";
import {useCallback, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postNewProduct, putProduct} from "../../api.ts";
import {productStructure} from "../../structure.ts";
import axios from "axios";

interface ProductFormProps
{
    product? : productStructure;
    updateForm: boolean;
}

export default function ProductForm(dataProps: ProductFormProps)
{
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: dataProps.product || {
            'id': 0,
            'name': "",
            'price': 0,
            'tva': 0,
            'description': "",
            'stock': 0,
            'picture': null
        }
    })

    //const navigate = useNavigate()
    const client = useQueryClient();
    const [pictureData, setPictureData] = useState<FileList | null>(null);

    const mutation = useMutation({
        mutationFn: dataProps.updateForm ? putProduct : postNewProduct,
        onSuccess: async (data) => {
            client.invalidateQueries({queryKey: ['product']}).then(r => console.log(r))
            console.log(pictureData)

            if (!dataProps.updateForm && pictureData !== null)
            {
                const formData = new FormData();
                formData.append('file', pictureData[0]);

                try {
                    axios.post('http://localhost:8085/api/product/image/' + String(data.data.id), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                    }).then(r => console.log(r));
                }
                catch (error)
                {
                    console.error('Error uploading file:', error);
                }
            }
        }
    })

    const onSubmit= useCallback((values: productStructure) => {
        mutation.mutate({
            'id': values.id,
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
            {
                !dataProps.updateForm && (<div className="flex items-center m-2">
                    <p className="pt-2">Ajouter une image :</p>
                    <input type="file" name="file" id="file" onChange={(event) => {
                        setPictureData(event.target.files)
                    }}/>
                </div>)
            }
            <Form id="formP" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="id"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                        <Form.Label>Produit ID</Form.Label>
                            <Form.Control type="number" value={field.value} onChange={field.onChange} required={false}
                                          readOnly={true}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Controller
                    name="name"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                            <Form.Label>Produit Nom</Form.Label>
                            <Form.Control type="text" value={field.value} onChange={field.onChange} required={true}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                            <Form.Label>Produit description</Form.Label>
                            <Form.Control type="text" value={field.value} onChange={field.onChange} required={true}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Controller
                    name="price"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                            <Form.Label>Produit prix/htva</Form.Label>
                            <Form.Control type="number" value={field.value} onChange={field.onChange} required={false}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Controller
                    name="tva"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                            <Form.Label>Produit TVA</Form.Label>
                            <Form.Control type="number" value={field.value} onChange={field.onChange} required={false}
                                          min={1} max={100}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Controller
                    name="stock"
                    control={control}
                    render={({field, fieldState}) => {
                        return <Form.Group>
                            <Form.Label>Produit stock</Form.Label>
                            <Form.Control type="number" value={field.value} onChange={field.onChange} required={false}
                                          min={0}/>
                            <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                        </Form.Group>
                    }}
                />
                <Button variant="warning" type="submit">
                    {
                        dataProps.updateForm ? "Modifier le produit" : "Ajouter le produit"
                    }
                </Button>
                {
                    dataProps.updateForm ?
                        <Button disabled={dataProps.product?.stock == 0} className="ml-2" variant="danger"
                                type="submit">Supprimer le produit</Button> : null
                }
            </Form>
        </div>

    );
}