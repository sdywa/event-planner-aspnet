import { FC } from "react";
import "./PageLayout.css";

interface IPageLayoutProps {
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
};

export const PageLayout: FC<IPageLayoutProps> = ({title, header, children}) => {
    return (
        <section className="page-section">
            <div className="page-inner container">
                <div className="page-header flex">
                    <h2 className="heading--secondary">{title}</h2>
                    {
                        header
                        ?
                        header
                        :
                        <></>
                    }
                </div>
                {children}
            </div>
        </section>
    );
}
