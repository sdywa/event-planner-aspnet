import { FC } from "react";
import { clsx } from "clsx";

interface IPageLayoutProps {
    title: string;
    header?: React.ReactNode;
    isCentered?: boolean;
    children: React.ReactNode;
};

export const PageLayout: FC<IPageLayoutProps> = ({title, header, isCentered, children}) => {
    function getTitleSize(title: string) {
        if (!title)
            return;

        if (title.length > 55)
            return 'text-3xl';
    }

    return (
        <section className="my-16">
            <div className="container bg-white rounded-lg shadow-lg">
                <div className={clsx("flex items-center gap-2", isCentered ? "justify-center" : "mb-6")}>
                    <h2 className={clsx("heading--secondary text-justify break-all min-w-fit", getTitleSize(title))}>{title}</h2>
                    {header}
                </div>
                {children}
            </div>
        </section>
    );
}
