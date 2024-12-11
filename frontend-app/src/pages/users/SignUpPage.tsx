import {Button, Form} from "react-bootstrap";
import {useCallback} from "react";
import {Controller, FieldValues, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signup} from "../../api.ts";
import HeaderNav from "../../components/header/HeaderNav.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";



export default function SignUpPage()
{

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

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            'username': "",
            'email': "",
            'phone': "",
            'city': "",
            'street': "",
            'country': "",
            'postal_code': 0,
            'password': ""
        }
    })

    const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: async () => {
            client.invalidateQueries({queryKey: ['register']}).then(r => console.log(r))
            navigate("/login")
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
        <>
            <HeaderNav showLogout={false}/>
            <div className="m-7 p-7">
                <h3 className="mb-5">Création d'un nouveau compte</h3>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="username"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Votre nom et prénom*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Email*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="phone"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Téléphone*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="city"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Ville*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="street"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Rue + numéro*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="postal_code"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Code postal*</Form.Label>
                                <Form.Control type="number" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="country"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Pays*</Form.Label>
                                <Form.Control type="text" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({field, fieldState}) => {
                            return <Form.Group>
                                <Form.Label>Mot de passe*</Form.Label>
                                <Form.Control type="password" value={field.value} onChange={field.onChange} required={false} />
                                <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                            </Form.Group>
                        }}
                    />
                    <Button variant="info" type="submit">Créer mon compte</Button>
                </Form>
            </div>
            <Footer/>
        </>

    );
}