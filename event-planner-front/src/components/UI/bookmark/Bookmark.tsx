import { FC } from "react";
import { clsx } from "clsx";

interface IBookmarkProps {
    isFavorite: boolean;
    className?: string | string[];
    favoriteCallback: (value: boolean) => void;
};

export const Bookmark: FC<IBookmarkProps> = ({isFavorite, className, favoriteCallback}) => {
    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        favoriteCallback(!isFavorite);
    }

    return (
        <div onClick={onClick} 
            className={clsx(["cursor-pointer text-stroke-1 text-stroke-white", isFavorite ? "text-yellow" : "text-gray", className])}>
            <i className="fa-solid fa-bookmark"></i>
        </div>
    );
}
