import Input from "../Input/Input.tsx";
import Button from "../Button/Button.tsx";
import {ChangeEvent, useState} from "react";
import {AiOutlineMail} from "react-icons/ai";
import {useTranslation} from "react-i18next";

interface SubscribeProps {
    onSubmit: (email: string) => void;
    buttonText: string;
}

function Subscribe({ onSubmit, buttonText }: SubscribeProps) {
    const { t } = useTranslation(['input']);
    const [email, setEmail] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        if (email) {
            onSubmit(email);
            setEmail("");
        }
    };

    return (
        <div className="flex">
            <Input
                value={email}
                onChange={handleChange}
                placeholder={t('input:PLACEHOLDERS.EMAIL')}
                icon={<AiOutlineMail />}
                className={'overflow-hidden'}
                inputFieldClassName={'rounded-r-none border-r-0'}
                showValidation={false}
            />
            <Button onClick={handleSubmit} className="rounded-l-none" variant="btnPrimary">
                {buttonText}
            </Button>
        </div>
    );
}

export default Subscribe;
