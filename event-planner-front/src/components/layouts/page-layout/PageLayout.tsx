import { FC } from "react";
import { clsx } from "clsx";

interface IPageLayoutProps {
    title: string;
    header?: React.ReactNode;
    isCentered?: boolean;
    children: React.ReactNode;
};

export const PageLayout: FC<IPageLayoutProps> = ({title, header, isCentered, children}) => {
    return (
        <section className="my-16">
            <div className="container bg-white rounded-lg shadow-lg">
                <div className={clsx("flex items-center gap-2", isCentered ? "justify-center" : "mb-6")}>
                    <h2 className="heading--secondary text-justify">{title}</h2>
                    {header}
                </div>
                {children}
            </div>
        </section>
    );
}
