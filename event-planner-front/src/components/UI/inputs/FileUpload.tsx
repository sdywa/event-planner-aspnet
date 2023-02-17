import React, { FC, useState, useRef, useEffect } from "react";
import { Button, ButtonStyles } from "../button/Button";
import { IFormInputStatus } from "../../../types";

export enum AcceptedTypes {
    IMAGES = "image/",
    ALL = ""
}

interface IFileUploadProps {
    name: string;
    title: string;
    acceptedType?: AcceptedTypes; 
    isFormSubmitted: boolean;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any;
};

export const FileUpload: FC<IFileUploadProps> = ({name, title, isFormSubmitted, acceptedType=AcceptedTypes.ALL, serverError, callBack, ...props}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState("");

    function update(value?: File) {
        callBack(name, {
            name: name,
            value: value,
            removeDirty: () => {},
            hasError: false, 
            isDirty: Boolean(value), 
            isActive: false
        });
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value.split("\\").pop();
        if (!name || !e.target.files || !e.target.files[0].type.startsWith(acceptedType))
            return;
        setFilename(name);
        update(e.target.files[0]);
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isFormSubmitted)
            update(fileInputRef.current?.files ? fileInputRef.current?.files[0] : undefined);
    }, [isFormSubmitted]);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        update(undefined);
    }, []);

    return (
        <div className="flex gap-4 items-center">
            <input ref={fileInputRef} onChange={onFileChange} className="hidden invisible absolute -left-96" type="file" id="file" name={name} tabIndex={-1} accept={`${acceptedType}*`} {...props} />
            {
                filename && <div>{filename}</div>
            }
            <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GREEN} onClick={() => fileInputRef.current?.click()}>
                {title}
            </Button>
        </div>
    );
}
