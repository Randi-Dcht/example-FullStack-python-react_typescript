import {Form} from "react-bootstrap";
import {Control, Controller, FieldValues} from "react-hook-form";



interface  InputFormProps {
    name: string;
    label: string;
    type: string;
    required: boolean;
    control: Control<FieldValues> | undefined;
}


export const InputForm = (props : InputFormProps) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({field, fieldState}) => {
                return <Form.Group>
                    <Form.Label>{props.label}</Form.Label>
                    <Form.Control type={props.type} value={field.value} onChange={field.onChange} required={props.required}/>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>
            }}
        />
    );
}