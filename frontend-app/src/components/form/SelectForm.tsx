import {Form} from "react-bootstrap";
import {Control, Controller,  FieldValues} from "react-hook-form";


interface  SelectFormProps {
    name: string;
    label: string;
    control: Control<FieldValues>;
    options: ArrayLike<[string, string]>;
}


export const SelectForm = (props : SelectFormProps) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({field, fieldState}) => {
                return <Form.Group>
                    <Form.Label>{props.label}</Form.Label>
                    <Form.Select value={field.value} onChange={field.onChange}>
                        {
                            Object.entries(props.options).map(([key, value]) => {
                                return <option key={key} value={value}>{value}</option>
                            })
                        }
                    </Form.Select>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>
            }}
        />
    );
}