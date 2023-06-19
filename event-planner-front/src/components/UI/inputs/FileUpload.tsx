import React, { FC, useEffect, useRef, useState } from "react";

import { IFormInputStatus } from "../../../types";
import { Button, ButtonStyles } from "../buttons/Button";

export enum AcceptedTypes {
    IMAGES = "image/",
    ALL = "",
}

interface IFileUploadProps {
    name: string;
    title: string;
    acceptedType?: AcceptedTypes;
    isFormSubmitted: boolean;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: unknown;
}

export const FileUpload: FC<IFileUploadProps> = ({
    name,
    title,
    isFormSubmitted,
    acceptedType = AcceptedTypes.ALL,
    serverError,
    callBack,
    ...props
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState("");
    const [errorText, setErrorText] = useState("");

    function update(value?: File) {
        callBack(name, {
            name: name,
            value: value,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            removeDirty: () => {},
            hasError: false,
            isDirty: Boolean(value),
            isActive: false,
        });
    }

    function getError() {
        if (serverError) return serverError;
        return "";
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value.split("\\").pop();
        if (
            !name ||
            !e.target.files ||
            !e.target.files[0].type.startsWith(acceptedType)
        )
            return;
        setFilename(name);
        update(e.target.files[0]);
        setErrorText("");
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isFormSubmitted) {
            update(
                fileInputRef.current?.files
                    ? fileInputRef.current?.files[0]
                    : undefined
            );
            setErrorText(getError());
        }
    }, [isFormSubmitted]);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        update(undefined);
    }, []);

    return (
        <div>
            <div className="flex gap-4 items-center">
                <input
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden invisible absolute -left-96"
                    type="file"
                    id="file"
                    name={name}
                    tabIndex={-1}
                    accept={`${acceptedType}*`}
                    {...props}
                />
                {filename && <div>{filename}</div>}
                <Button
                    isPrimary={true}
                    buttonStyle={
                        errorText
                            ? ButtonStyles.BUTTON_RED
                            : ButtonStyles.BUTTON_GREEN
                    }
                    onClick={() => fileInputRef.current?.click()}
                >
                    {title}
                </Button>
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">
                {errorText}
            </div>
        </div>
    );
};
