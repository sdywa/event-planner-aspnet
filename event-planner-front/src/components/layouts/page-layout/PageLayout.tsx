import { FC } from "react";

interface IPageLayoutProps {
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
};

export const PageLayout: FC<IPageLayoutProps> = ({title, header, children}) => {
    return (
        <section className="my-16">
            <div className="container bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-8 mb-6">
                    <h2 className="heading--secondary">{title}</h2>
                    {header}
                </div>
                {children}
            </div>
        </section>
    );
}
