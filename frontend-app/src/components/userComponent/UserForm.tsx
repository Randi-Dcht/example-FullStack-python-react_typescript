import {Controller, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createInternalAccount} from "../../api.ts";
import {useCallback} from "react";
import {registerAdminStructure} from "../../structure.ts";



export default function UserForm()
{
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: {
            'username': "",
            'password': "",
            'email': "",
            'role': "worker"
        }
    })

    //const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: createInternalAccount,
        onSuccess: async () => {
            client.invalidateQueries({queryKey: ['user']}).then(r => console.log(r))
        }
    })

    const onSubmit= useCallback((values: registerAdminStructure) => {
        mutation.mutate({
            'username': values.username,
            'password': values.password,
            'email': values.email,
            'role': values.role
        });
    }, [mutation]);

    return (
        <Form id="formP" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="username"
                control={control}
                render={({field, fieldState}) => {
                    return <Form.Group>
                        <Form.Label>Travailleur nom</Form.Label>
                        <Form.Control type="text" value={field.value} onChange={field.onChange} required={true}/>
                        <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                    </Form.Group>
                }}
            />
            <Controller
                name="password"
                control={control}
                render={({field, fieldState}) => {
                    return <Form.Group>
                        <Form.Label>Mot de passe du travailleur</Form.Label>
                        <Form.Control type="text" value={field.value} onChange={field.onChange} required={true}/>
                        <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                    </Form.Group>
                }}
            />
            <Controller
                name="email"
                control={control}
                render={({field, fieldState}) => {
                    return <Form.Group>
                        <Form.Label>Email du travailleur</Form.Label>
                        <Form.Control type="email" value={field.value} onChange={field.onChange} required={false} />
                        <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                    </Form.Group>
                }}
            />
            <Controller
                name="role"
                control={control}
                render={({field}) => {
                    return <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={field.value} onChange={field.onChange}>
                            <option key="worker" value="worker">Travailleur</option>
                            <option key="admin" value="admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                }}
            />

            <Button className="mt-3" variant="warning" type="submit">
                Ajouter un travailleur
            </Button>

        </Form>
    )
}