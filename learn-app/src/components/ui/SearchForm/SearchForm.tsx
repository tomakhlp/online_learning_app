import {ChangeEvent, FormEvent} from "react";
import Button from "../Button/Button.tsx";
import Input from "../Input/Input.tsx";
import {useTranslate} from "../../../hooks/useTranslate.ts";

interface Field {
    label: string;
    placeholder: string;
    name: string;
    type?: 'text';
    value?: string;
    error?: string;
    onChange?: (name: string, value: string) => void;
}

interface SearchFormProps {
    fields: Field[];
    buttonText: string;
    onSubmit: (e: Record<string, string>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function SearchForm ({ fields, buttonText, onSubmit, onChange }: SearchFormProps) {
    const { translate } = useTranslate('input');
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const values: Record<string, string> = {};

        fields.forEach(({ name }) => {
            values[name] = formData.get(name) as string;
        });

        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className={'flex flex-col md:flex-row gap-3 md:gap-6'}>
                {fields.map(({ label, name, placeholder, type = "text", value }, index) => (
                    <div key={index} className={'flex-1 min-w-0'}>
                        <Input label={translate(label)}
                               id={name}
                               placeholder={translate(placeholder)}
                               name={name}
                               type={type}
                               value={value}
                               showValidation={false}
                               onChange={onChange}
                        />
                    </div>
                ))}
            </div>

            <Button
                type="submit"
                variant={'btnPrimary'}
                className={'w-fit'}
            >
                {buttonText}
            </Button>
        </form>
    );
}

export default SearchForm;
