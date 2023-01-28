import { FC } from "react";
import { clsx } from "clsx";

interface IBookmarkProps {
    isFavorite: boolean;
    className?: string[];
    size?: string;
    favoriteCallback: (value: boolean) => void;
};

export const Bookmark: FC<IBookmarkProps> = ({isFavorite, className, size="text-2xl", favoriteCallback}) => {
    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        favoriteCallback(!isFavorite);
    }

    return (
        <div onClick={onClick} 
            className={clsx(["bookmark cursor-pointer", isFavorite && "bookmark--active", size, className])}>
            <i className="fa-solid fa-bookmark"></i>
        </div>
    );
}
