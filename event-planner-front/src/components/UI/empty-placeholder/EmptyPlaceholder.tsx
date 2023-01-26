import { FC } from "react";

interface IEmptyPlaceholderProps {
    text: string
};

export const EmptyPlaceholder: FC<IEmptyPlaceholderProps> = ({text}) => {
    return (
        <div className="w-full h-24 flex justify-center items-center font-roboto font-medium text-2xl text-gray border-2 border-lightgray border-dashed">
            {text}
        </div>
    );
}
