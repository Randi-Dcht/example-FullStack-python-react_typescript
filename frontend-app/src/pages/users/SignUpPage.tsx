import {Button, Form} from "react-bootstrap";
import {useCallback} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InputForm} from "../../components/form/InputForm.tsx";
import {signup} from "../../api.ts";



export default function SignUpPage()
{
/*
    const schema = yup.object().shape(
        {
            username: yup.string()
                .required("votre nom/prénom est obligatoire")
                .min(5, "très court"),
            email: yup.string()
                .email("Email invalide")
                .required("Email est obligatoire"),
            phone: yup.string()
                .required("Téléphone est obligatoire")
                .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                    {
                        message: "Numéro invalide",
                        excludeEmptyString: false,
                    }
                ),
            city: yup.string()
                .required("Champ obligatoire"),
            street: yup.string()
                .required("Champ obligatoire"),
            country: yup.string()
                .required("Champ obligatoire"),
            postal_code: yup.number()
                .min(1000, "Code postal invalide")
                .required("Champ obligatoire"),
            password: yup.string()
                .required("Password is mandatory")
                .matches(/([0-9])/, "At least one integer")
                .min(8, "Password must be larger than 8 characters")
                .max(50, "Password must be smaller than 50 characters"),
        });
*/
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        //resolver: yupResolver(schema),
    })

    //const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: async () => {
            client.invalidateQueries({queryKey: ['register']}).then(r => console.log(r))
        }
    })

    const onSubmit= useCallback((values: FieldValues) => {
        mutation.mutate({
            'username': values.username,
            'password': values.password,
            'email': values.email,
            'postal_code': values.postal_code,
            'city': values.city,
            'street': values.street,
            'country': values.country,
            'phone': values.phone
        });
    }, [mutation]);
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputForm  required={true} type="text" name="username" label="Votre nom/prénom*" control={control}/>
                <InputForm  required={true} type="text" name="email" label="Email*" control={control}/>
                <InputForm  required={true} type="text" name="phone" label="Téléphone*" control={control}/>
                <InputForm  required={true} type="text" name="city" label="Ville*" control={control}/>
                <InputForm  required={true} type="text" name="street" label="Rue + numéro*" control={control}/>
                <InputForm  required={true} type="number" name="postal_code" label="Code postal*" control={control}/>
                <InputForm  required={true} type="text" name="country" label="Pays*" control={control}/>
                <InputForm  required={true} type="password" name="password" label="Password*" control={control}/>
                <Button variant="danger" type="submit">Créer mon compte</Button>
            </Form>
        </div>

    );
}