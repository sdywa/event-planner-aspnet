import { FC, useEffect, useState } from "react";
import { IFormInputData, IFormInputStatus } from "../../../types";
import useFormInput from "../../../hooks/forms/useFormInput";
import { Input } from "./input/Input";
import clsx from "clsx";
import { IAddress } from "../../../types/Api";
import useDebounce from "../../../hooks/useDebounce";
import DadataService from "../../../api/services/DadataService";
import { IAddressResponse } from "../../../types/Dadata";

interface IAddressInputProps {
    initialValue?: IAddress;
    className?: string | string[];
    name: string;
    data: IFormInputData;
    isSubmitted: boolean;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any;
};

export const AddressInput: FC<IAddressInputProps> = ({ initialValue, name, data, serverError, isSubmitted, className, callBack, ...props }) => {
    const debouncedSuggest = useDebounce(suggest, 300);
    const [suggests, setSuggests] = useState<IAddressResponse[]>([]);
    const [selecting, setSelecting] = useState(false);
    const [isActive, setActive] = useState(false);
    const [address, setAddress] = useState<IAddress | undefined>(initialValue);
    const [addressError, setError] = useState("");

    const { value, setValue, errorText, getClassName, ...inputData } = useFormInput<HTMLInputElement>(
        initialValue?.full ?? "",
        name,
        data.validation,
        isSubmitted,
        serverError || addressError,
        {
            default: data.label ? "pt-6" : "",
            active: "input--active",
            dirty: "input--dirty",
            error: "input--error"
        },
        updateAddress);

    async function suggest(query: string) {
        const response = await DadataService.suggest(query);
        console.log(response.data.suggestions);
        setSuggests(response.data.suggestions);
    }

    async function updateAddress(name: string, value: IFormInputStatus) {
        setActive(value.isActive);

        if (!value.value) {
            setSuggests([]);
            return;
        }

        const query = value.value;
        value.value = address;
        callBack(name, value);
        console.log(value);

        if (value.isActive) {
            debouncedSuggest(query);
            return;
        }

        if (!selecting && suggests.length) {
            setSuggestedAddress(suggests[0]);
            setSuggests([]);
        }

        if (!value.value.house) {
            setError("Выберите полный адрес");
            value.removeDirty();
        } else {
            setError("");
        }
    }

    function setSuggestedAddress(address: IAddressResponse) {
        setAddress({
            latitude: Number(address.data.geo_lat),
            longitude: Number(address.data.geo_lon),
            full: address.value,
            region: address.data.region,
            city: address.data.city,
            street: address.data.street,
            house: address.data.house,
            block: address.data.block
        });
        setSuggests([]);
        console.log("set", address);
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (address) {
            console.log(address.full);
            setValue(address.full);
        }
    }, [address]);

    useEffect(() => {
        if (!isActive && suggests.length > 0)
            setSuggests([]);
    }, [suggests]);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setAddress(initialValue);
    }, [initialValue]);

    return (
        <div className="w-full relative">
            <Input type={data.type} name={name} autoComplete={data.autoComplete} {...props} value={value} {...inputData} className={clsx(getClassName(), className)}>
                {
                    data.label &&
                    <span className="label-content absolute bottom-0 left-1.5 pb-1 transition-all duration-300 ease-in">
                        {data.label}
                    </span>
                }
            </Input>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
            {
                suggests.length > 0 && <ul className="absolute bottom-6 translate-y-full w-11/12 p-1 bg-white border-2 border-t-0 border-lightgray rounded-b-lg shadow-lg peer-[.input--active]">
                    {
                        suggests?.map((s) => <li key={s.value} className="cursor-pointer hover:bg-slate-200 px-4 py-1 rounded select-none" onClick={() => setSuggestedAddress(s)} onMouseDown={() => setSelecting(true)} onMouseUp={() => setSelecting(false)}>{ s.value }</li>)
                    }
                </ul>
            }
        </div>
    );
}
