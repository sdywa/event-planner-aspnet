import React, { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import { Context } from "../..";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Button, ButtonStyles } from "../../components/UI/buttons/Button";
import { SubmitButton } from "../../components/UI/buttons/SubmitButton";
import { FormInput } from "../../components/UI/forms/FormInput";
import { List } from "../../components/UI/list/List";
import { ListItem } from "../../components/UI/list/ListItem";
import { useForm } from "../../hooks/forms/useForm";
import {
    EMAIL_ADDRESS,
    IS_NOT_EMPTY,
    MAX_LENGTH,
    MIN_LENGTH,
} from "../../hooks/useValidation";
import {
    IFormInputData,
    IFormInputStatus,
    IServerError,
} from "../../types/index";

export const Settings: FC = observer(() => {
    const [isPasswordReseted, setPassword] = useState(false);
    const { user } = useContext(Context);
    const {
        serverErrors,
        isSubmitted,
        getInputStatus,
        updateInputStatuses,
        onChange,
        onSubmit,
        hasError,
    } = useForm(sendFormData);
    const data: { [key: string]: IFormInputData } = {
        name: {
            label: "Ваше имя",
            type: "text",
            autoComplete: "off",
            validation: [
                IS_NOT_EMPTY("Укажите имя"),
                MIN_LENGTH(2),
                MAX_LENGTH(30),
            ],
        },
        surname: {
            label: "Ваша фамилия",
            type: "text",
            autoComplete: "off",
            validation: [
                IS_NOT_EMPTY("Укажите фамилию"),
                MIN_LENGTH(2),
                MAX_LENGTH(45),
            ],
        },
        email: {
            label: "Email",
            type: "text",
            autoComplete: "username",
            validation: [
                IS_NOT_EMPTY("Укажите email"),
                MAX_LENGTH(50),
                EMAIL_ADDRESS(),
            ],
        },
        password: {
            label: "Пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [MAX_LENGTH(70)],
        },
        passwordConfirm: {
            label: "Подтвердите пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [MAX_LENGTH(70)],
        },
    };
    const passwordPlaceholder = "        ";

    async function sendFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("sent!");
        const password: string = data["password"].value;
        const passwordConfirm: string = data["passwordconfirm"].value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let errors: any = {};

        if (password.length > 0 && password.length < 8)
            errors.password = "Используйте не менее 8 символов";
        if (passwordConfirm.length > 0 && passwordConfirm.length < 8)
            errors.passwordConfirm = "Используйте не менее 8 символов";
        if (Object.keys(errors).length > 0) return errors;

        if (password !== passwordConfirm)
            return { passwordConfirm: "Пароль не совпадает" };

        const result = Object.entries(data).map(([key, d]) => [key, d.value]);

        await user.update(Object.fromEntries(result)).then((e) => {
            errors = e;
        });

        return errors;
    }

    function resetInput(e: React.MouseEvent<HTMLInputElement>) {
        if (
            e.target instanceof HTMLInputElement &&
            e.target.value === passwordPlaceholder
        )
            e.target.value = "";
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isPasswordReseted) return;
        const password = getInputStatus("password");
        const passwordConfirm = getInputStatus("passwordconfirm");

        if (!password || !passwordConfirm) return;

        setPassword(true);
        updateInputStatuses("password", {
            ...password,
            value: "",
            hasError: false,
        });
        updateInputStatuses("passwordconfirm", {
            ...passwordConfirm,
            value: "",
            hasError: false,
        });
    }, [getInputStatus("password")]);

    return (
        <PageLayout title="Настройка аккаунта">
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem className="text-green">
                        Настройка аккаунта
                    </ListItem>
                    <ListItem
                        link="/user/history"
                        className="text-darkgray hover:text-gray"
                    >
                        История
                    </ListItem>
                    <ListItem
                        link="/user/feedback"
                        className="text-darkgray hover:text-gray"
                    >
                        Обращения
                    </ListItem>
                </List>
                <form
                    className="flex flex-col justify-center items-start w-[26rem]"
                    onSubmit={onSubmit}
                    onChange={onChange}
                >
                    <div className="flex gap-8">
                        <div className="w-64">
                            <FormInput
                                name="name"
                                data={data["name"]}
                                initialValue={user.user.name}
                                serverError={serverErrors["name"]}
                                isSubmitted={isSubmitted}
                                callBack={updateInputStatuses}
                            />
                        </div>
                        <div className="w-64">
                            <FormInput
                                name="surname"
                                data={data["surname"]}
                                initialValue={user.user.surname}
                                serverError={serverErrors["surname"]}
                                isSubmitted={isSubmitted}
                                callBack={updateInputStatuses}
                            />
                        </div>
                    </div>
                    <div className="w-64">
                        <FormInput
                            name="email"
                            data={data["email"]}
                            initialValue={user.user.email}
                            serverError={serverErrors["email"]}
                            isSubmitted={isSubmitted}
                            callBack={updateInputStatuses}
                        />
                    </div>
                    <div className="flex gap-8">
                        <div className="w-64">
                            <FormInput
                                name="password"
                                data={data["password"]}
                                initialValue={passwordPlaceholder}
                                onClick={resetInput}
                                serverError={serverErrors["password"]}
                                isSubmitted={isSubmitted}
                                callBack={updateInputStatuses}
                            />
                        </div>
                        <div className="w-64">
                            <FormInput
                                name="passwordConfirm"
                                data={data["passwordConfirm"]}
                                initialValue={passwordPlaceholder}
                                onClick={resetInput}
                                serverError={serverErrors["passwordConfirm"]}
                                isSubmitted={isSubmitted}
                                callBack={updateInputStatuses}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <SubmitButton
                            disabled={hasError}
                            isPrimary={true}
                            buttonStyle={
                                hasError
                                    ? ButtonStyles.BUTTON_RED
                                    : ButtonStyles.BUTTON_GREEN
                            }
                        >
                            Сохранить
                        </SubmitButton>
                        {user.user.role === "Participant" && (
                            <Button onClick={async () => await user.promote()}>
                                <span className="text-gray">
                                    Стать организатором
                                </span>
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </PageLayout>
    );
});
