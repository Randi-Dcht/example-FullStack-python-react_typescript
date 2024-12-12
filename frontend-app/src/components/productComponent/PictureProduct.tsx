import {Button} from "react-bootstrap";
import axios from "axios";
import {FieldValues, useForm} from "react-hook-form";
import {useState} from "react";

interface PictureProductProps {
    productId: number;
    picture: string;
}


/***
 * @Component PictureProduct
 * @Description
 * This component is used to display the picture of a product.
 * @ReturnTypeDescription This component returns the JSX of the picture of a product.
 * @param dataProps
 */
export default function PictureProduct(dataProps: PictureProductProps)
{
    const { register, handleSubmit } = useForm();
    const [picture, setPicture] = useState<string>("http://localhost:8085/api/download/" + dataProps.picture);

    const onSubmit = async (data:FieldValues) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);

        try {
            const response = await axios.post('http://localhost:8085/api/product/image/' + String(dataProps.productId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (response.status === 200)
            {
                setPicture("http://localhost:8085/api/download/" + response.data.filename);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex align-items-center" key={dataProps.productId + '-pict'}>
            <img src={picture} alt="picture product" width="190" />
            <form className="m-4 border-2 p-2" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="file">Image</label>
                <input type="file" {...register('file')} accept="image/jpeg,image/png" required name="file" id="file" className="inputfile"/>
                <Button variant="light" type="submit">changer l'image</Button>
            </form>
        </div>
    )
}