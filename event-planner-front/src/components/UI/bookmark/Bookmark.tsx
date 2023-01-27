import { FC } from "react";
import { clsx } from "clsx";

interface IBookmarkProps {
    isFavorite: boolean;
    className?: string[];
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
            className={clsx(["bookmark text-2xl cursor-pointer", isFavorite && "bookmark--active", className])}>
            <i className="fa-solid fa-bookmark"></i>
        </div>
    );
}
